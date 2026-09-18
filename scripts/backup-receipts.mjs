import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const BUCKET = "receipts";
const PAGE_SIZE = 1000;
const MAX_RETRIES = 3;

const supabaseUrl = process.env.KIRA_SUPABASE_URL;
const serviceRoleKey = process.env.KIRA_SUPABASE_SERVICE_ROLE_KEY;
const targetRootInput = process.env.KIRA_RECEIPT_BACKUP_DIR;

if (!supabaseUrl) throw new Error("KIRA_SUPABASE_URL is missing.");
if (!serviceRoleKey) throw new Error("KIRA_SUPABASE_SERVICE_ROLE_KEY is missing.");
if (!targetRootInput) throw new Error("KIRA_RECEIPT_BACKUP_DIR is missing.");

const targetRoot = path.resolve(targetRootInput);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

function joinStoragePath(prefix, name) {
  return prefix ? `${prefix}/${name}` : name;
}

function safeLocalPath(storagePath) {
  const parts = storagePath.split("/").filter(Boolean);

  if (parts.some((part) => part === "." || part === "..")) {
    throw new Error(`Unsafe storage path: ${storagePath}`);
  }

  const localPath = path.resolve(targetRoot, ...parts);
  const relative = path.relative(targetRoot, localPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Storage path escapes backup directory: ${storagePath}`);
  }

  return localPath;
}

async function listFolder(prefix = "") {
  const entries = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw new Error(
        `Failed to list bucket '${BUCKET}'${prefix ? ` at '${prefix}'` : ""}: ${error.message}`,
      );
    }

    const page = data ?? [];
    entries.push(...page);

    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return entries;
}

async function listAllFiles(prefix = "") {
  const entries = await listFolder(prefix);
  const files = [];

  for (const entry of entries) {
    const objectPath = joinStoragePath(prefix, entry.name);

    if (entry.id == null) {
      files.push(...(await listAllFiles(objectPath)));
      continue;
    }

    files.push({
      path: objectPath,
      id: entry.id,
      metadata: entry.metadata ?? {},
      created_at: entry.created_at ?? null,
      updated_at: entry.updated_at ?? null,
    });
  }

  return files;
}

async function downloadWithRetry(storagePath) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const { data, error } = await supabase.storage.from(BUCKET).download(storagePath);

    if (!error && data) return data;

    lastError = error ?? new Error("Storage API returned no file data.");

    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }

  throw new Error(
    `Failed to download '${storagePath}' after ${MAX_RETRIES} attempts: ${lastError?.message ?? lastError}`,
  );
}

async function main() {
  await fs.mkdir(targetRoot, { recursive: true });

  console.log(`Listing private '${BUCKET}' bucket...`);
  const files = await listAllFiles();
  console.log(`Found ${files.length} receipt file(s).`);

  const manifest = {
    backup_version: 1,
    bucket: BUCKET,
    created_at_utc: new Date().toISOString(),
    file_count: files.length,
    files: [],
  };

  let totalBytes = 0;

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    process.stdout.write(`[${index + 1}/${files.length}] ${file.path} ... `);

    const blob = await downloadWithRetry(file.path);
    const buffer = Buffer.from(await blob.arrayBuffer());
    const localPath = safeLocalPath(file.path);

    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, buffer);

    const expectedSize = Number(file.metadata?.size);
    if (Number.isFinite(expectedSize) && expectedSize >= 0 && expectedSize !== buffer.length) {
      throw new Error(
        `Size verification failed for '${file.path}'. Expected ${expectedSize} bytes, wrote ${buffer.length}.`,
      );
    }

    totalBytes += buffer.length;

    manifest.files.push({
      path: file.path,
      bytes: buffer.length,
      mimetype: file.metadata?.mimetype ?? null,
      created_at: file.created_at,
      updated_at: file.updated_at,
    });

    console.log(`${buffer.length} bytes`);
  }

  manifest.total_bytes = totalBytes;

  await fs.writeFile(
    path.join(targetRoot, "backup-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  console.log("");
  console.log("Receipt backup complete.");
  console.log(`Files: ${files.length}`);
  console.log(`Bytes: ${totalBytes}`);
  console.log(`Target: ${targetRoot}`);
}

main().catch((error) => {
  console.error("");
  console.error("Receipt backup failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
