[CmdletBinding()]
param(
    [string]$BackupRoot = ""
)

$ErrorActionPreference = "Stop"

$SupabaseUrl = "https://zuueyhjzlcmegpklpdcb.supabase.co"
$DbHost = "aws-0-ap-northeast-1.pooler.supabase.com"
$DbPort = "5432"
$DbName = "postgres"
$DbUser = "postgres.zuueyhjzlcmegpklpdcb"

$PostgresBin = "C:\Program Files\PostgreSQL\17\bin"
$PgDump = Join-Path $PostgresBin "pg_dump.exe"
$PgDumpAll = Join-Path $PostgresBin "pg_dumpall.exe"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ReceiptHelper = Join-Path $ScriptDir "backup-receipts.mjs"

if ([string]::IsNullOrWhiteSpace($BackupRoot)) {
    $Documents = [Environment]::GetFolderPath("MyDocuments")
    $BackupRoot = Join-Path $Documents "Kira-Backups"
}

function Convert-SecureStringToPlainText {
    param([Parameter(Mandatory = $true)][SecureString]$SecureValue)

    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

function Assert-CommandSucceeded {
    param([Parameter(Mandatory = $true)][string]$StepName)

    if ($LASTEXITCODE -ne 0) {
        throw "$StepName failed with exit code $LASTEXITCODE."
    }
}

Write-Host ""
Write-Host "Kira Backup" -ForegroundColor Cyan
Write-Host "Database + private receipts bucket"
Write-Host ""

if (-not (Test-Path $PgDump)) {
    throw "pg_dump.exe was not found at: $PgDump"
}

if (-not (Test-Path $PgDumpAll)) {
    throw "pg_dumpall.exe was not found at: $PgDumpAll"
}

if (-not (Test-Path $ReceiptHelper)) {
    throw "Receipt helper was not found at: $ReceiptHelper"
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    throw "Node.js was not found in PATH."
}

Push-Location $ScriptDir
try {
    & node -e "import('@supabase/supabase-js').then(()=>process.exit(0)).catch(()=>process.exit(1))"
    if ($LASTEXITCODE -ne 0) {
        throw "@supabase/supabase-js is not available from '$ScriptDir'. Run npm install first."
    }
}
finally {
    Pop-Location
}

$DbPasswordSecure = Read-Host "Supabase database password" -AsSecureString
$ServiceRoleSecure = Read-Host "Supabase service-role key" -AsSecureString

$DbPassword = Convert-SecureStringToPlainText $DbPasswordSecure
$ServiceRoleKey = Convert-SecureStringToPlainText $ServiceRoleSecure

if ([string]::IsNullOrWhiteSpace($DbPassword)) {
    throw "Database password cannot be empty."
}

if ([string]::IsNullOrWhiteSpace($ServiceRoleKey)) {
    throw "Service-role key cannot be empty."
}

$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$BackupDir = Join-Path $BackupRoot $Timestamp
$DatabaseDir = Join-Path $BackupDir "database"
$ReceiptsDir = Join-Path $BackupDir "receipts"

New-Item -ItemType Directory -Force -Path $DatabaseDir | Out-Null
New-Item -ItemType Directory -Force -Path $ReceiptsDir | Out-Null

$RolesFile = Join-Path $DatabaseDir "roles.sql"
$SchemaFile = Join-Path $DatabaseDir "schema.sql"
$DataFile = Join-Path $DatabaseDir "data.sql"
$SummaryFile = Join-Path $BackupDir "backup-summary.json"

$OldPgHost = $env:PGHOST
$OldPgPort = $env:PGPORT
$OldPgDatabase = $env:PGDATABASE
$OldPgUser = $env:PGUSER
$OldPgPassword = $env:PGPASSWORD
$OldPgSslMode = $env:PGSSLMODE

$OldSupabaseUrl = $env:KIRA_SUPABASE_URL
$OldServiceRole = $env:KIRA_SUPABASE_SERVICE_ROLE_KEY
$OldReceiptTarget = $env:KIRA_RECEIPT_BACKUP_DIR

$StartedAt = (Get-Date).ToUniversalTime()

try {
    $env:PGHOST = $DbHost
    $env:PGPORT = $DbPort
    $env:PGDATABASE = $DbName
    $env:PGUSER = $DbUser
    $env:PGPASSWORD = $DbPassword
    $env:PGSSLMODE = "require"

    Write-Host ""
    Write-Host "[1/4] Backing up database roles..." -ForegroundColor Yellow
    & $PgDumpAll `
        --roles-only `
        --no-role-passwords `
        --file="$RolesFile"
    Assert-CommandSucceeded "Role backup"

    Write-Host "[2/4] Backing up database schema..." -ForegroundColor Yellow
    & $PgDump `
        --schema-only `
        --no-owner `
        --file="$SchemaFile"
    Assert-CommandSucceeded "Schema backup"

    Write-Host "[3/4] Backing up database data..." -ForegroundColor Yellow
    & $PgDump `
        --data-only `
        --file="$DataFile" `
        --exclude-table-data="storage.buckets_vectors" `
        --exclude-table-data="storage.vector_indexes"
    Assert-CommandSucceeded "Data backup"

    $env:KIRA_SUPABASE_URL = $SupabaseUrl
    $env:KIRA_SUPABASE_SERVICE_ROLE_KEY = $ServiceRoleKey
    $env:KIRA_RECEIPT_BACKUP_DIR = $ReceiptsDir

    Write-Host "[4/4] Backing up private receipt files..." -ForegroundColor Yellow
    Push-Location $ScriptDir
    try {
        & node $ReceiptHelper
        Assert-CommandSucceeded "Receipt backup"
    }
    finally {
        Pop-Location
    }

    $CompletedAt = (Get-Date).ToUniversalTime()

    $DatabaseFiles = @(
        Get-Item $RolesFile
        Get-Item $SchemaFile
        Get-Item $DataFile
    )

    $ReceiptFiles = @(
        Get-ChildItem -Path $ReceiptsDir -File -Recurse |
        Where-Object { $_.Name -ne "backup-manifest.json" }
    )

    $Summary = [ordered]@{
        backup_version = 1
        project = "Kira"
        supabase_project_ref = "zuueyhjzlcmegpklpdcb"
        started_at_utc = $StartedAt.ToString("o")
        completed_at_utc = $CompletedAt.ToString("o")
        database = [ordered]@{
            files = @(
                foreach ($File in $DatabaseFiles) {
                    [ordered]@{
                        name = $File.Name
                        bytes = $File.Length
                    }
                }
            )
        }
        receipts = [ordered]@{
            file_count = $ReceiptFiles.Count
            total_bytes = ($ReceiptFiles | Measure-Object -Property Length -Sum).Sum
        }
    }

    $Summary | ConvertTo-Json -Depth 6 |
        Set-Content -Path $SummaryFile -Encoding UTF8

    Write-Host ""
    Write-Host "BACKUP COMPLETE" -ForegroundColor Green
    Write-Host "Location: $BackupDir"
    Write-Host "Database files: roles.sql, schema.sql, data.sql"
    Write-Host "Receipt files: $($ReceiptFiles.Count)"
    Write-Host ""
    Write-Host "No old backups were deleted." -ForegroundColor DarkGray
}
catch {
    Write-Host ""
    Write-Host "BACKUP FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($BackupDir) {
        Write-Host "Partial output, if any, is located at: $BackupDir"
    }
    exit 1
}
finally {
    $DbPassword = $null
    $ServiceRoleKey = $null
    $DbPasswordSecure = $null
    $ServiceRoleSecure = $null

    $env:PGHOST = $OldPgHost
    $env:PGPORT = $OldPgPort
    $env:PGDATABASE = $OldPgDatabase
    $env:PGUSER = $OldPgUser
    $env:PGPASSWORD = $OldPgPassword
    $env:PGSSLMODE = $OldPgSslMode

    $env:KIRA_SUPABASE_URL = $OldSupabaseUrl
    $env:KIRA_SUPABASE_SERVICE_ROLE_KEY = $OldServiceRole
    $env:KIRA_RECEIPT_BACKUP_DIR = $OldReceiptTarget
}
