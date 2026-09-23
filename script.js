import { isNativeApp } from "./native-platform.js";
import { supabase } from "./supabase.js";
import {
    cleanupDeletedAccountTransfers,
    fetchAccountTransfers,
    finalizeDeletedAccountTransfer,
    getTransferAccountDelta,
    restoreAccountTransfer,
    saveAccountTransfer,
    softDeleteAccountTransfer
} from "./transfers.js";
import {
    ensureDefaultPaymentMethods,
    fetchPaymentMethods
} from "./payment-methods.js";
import {
    createCreditCardProfile,
    estimateMinimumPayment,
    fetchCreditCardReconciliations,
    fetchCreditCardStatements,
    fetchCreditCards,
    getAvailableCredit,
    getCreditCardOutstanding,
    getCreditUtilisation,
    getLatestCreditCardReconciliation,
    getLatestCreditCardStatement,
    getRemainingStatementDue,
    getStatementPayments,
    projectCreditCard,
    saveCreditCardReconciliation,
    saveCreditCardStatement,
    setCreditCardActive,
    updateCreditCardProfile
} from "./credit-cards.js";
import { createWorker } from "tesseract.js";


// ======================================================
// DOM
// ======================================================

// AUTH

const authSection = document.getElementById("auth-section");
const financeApp = document.getElementById("finance-app");
const authForm = document.getElementById("auth-form");

const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const mobileLogoutButton = document.getElementById("mobile-logout-button");

const sidebarUserAvatar =
    document.getElementById("sidebar-user-avatar");

const settingsDisplayName =
    document.getElementById("settings-display-name");

const settingsProfilePreviewName =
    document.getElementById("settings-profile-preview-name");

const settingsProfileEmail =
    document.getElementById("settings-profile-email");

const settingsAvatarPreview =
    document.getElementById("settings-avatar-preview");

const settingsAvatarOptions =
    document.querySelectorAll('input[name="settings-avatar"]');

const settingsAvatarInitials =
    document.querySelector(".settings-avatar-initials");

const saveProfileSettingsButton =
    document.getElementById("save-profile-settings-button");

const settingsProfileMessage =
    document.getElementById("settings-profile-message");

const settingsThemeOptions =
    document.querySelectorAll('input[name="settings-theme"]');

const settingsThemeMessage =
    document.getElementById("settings-theme-message");

const forgotPasswordButton =
    document.getElementById("forgot-password-button");

const settingsSecurityEmail =
    document.getElementById("settings-security-email");

const settingsMemberSince =
    document.getElementById("settings-member-since");

const settingsLastSignIn =
    document.getElementById("settings-last-sign-in");

const settingsNewEmail =
    document.getElementById("settings-new-email");

const updateEmailButton =
    document.getElementById("update-email-button");

const settingsEmailMessage =
    document.getElementById("settings-email-message");

const settingsNewPassword =
    document.getElementById("settings-new-password");

const settingsConfirmPassword =
    document.getElementById("settings-confirm-password");

const updatePasswordButton =
    document.getElementById("update-password-button");

const sendResetEmailButton =
    document.getElementById("send-reset-email-button");

const settingsPasswordMessage =
    document.getElementById("settings-password-message");

const passwordRecoveryBanner =
    document.getElementById("password-recovery-banner");

const signOutOtherSessionsButton =
    document.getElementById("sign-out-other-sessions-button");

const settingsSessionMessage =
    document.getElementById("settings-session-message");

const exportMyDataButton =
    document.getElementById("export-my-data-button");

const settingsExportMessage =
    document.getElementById("settings-export-message");

const deleteAccountConfirmation =
    document.getElementById("delete-account-confirmation");

const deleteAccountButton =
    document.getElementById("delete-account-button");

const settingsDeleteMessage =
    document.getElementById("settings-delete-message");

let passwordRecoveryMode =
    false;

let passwordResetCooldownTimer =
    null;

let passwordResetCooldownSeconds =
    0;

const authMessage = document.getElementById("auth-message");
const userEmail = document.getElementById("user-email");


// DASHBOARD

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

const setupChecklist =
    document.getElementById("setup-checklist");

const setupChecklistSummary =
    document.getElementById("setup-checklist-summary");

const setupChecklistProgressLabel =
    document.getElementById("setup-checklist-progress-label");

const setupChecklistProgressBar =
    document.getElementById("setup-checklist-progress-bar");

const setupChecklistItems =
    document.getElementById("setup-checklist-items");

const dashboardGoalsSummary =
    document.getElementById("dashboard-goals-summary");

const dashboardInsightsPreview =
    document.getElementById("dashboard-insights-preview");

const insightSavingsRate =
    document.getElementById("insight-savings-rate");

const insightSpendingTrend =
    document.getElementById("insight-spending-trend");

const insightRecurringShare =
    document.getElementById("insight-recurring-share");

const insightEmergencyReadiness =
    document.getElementById("insight-emergency-readiness");

const priorityInsightsList =
    document.getElementById("priority-insights-list");

const insightSpendingSnapshot =
    document.getElementById("insight-spending-snapshot");

const insightBudgetRiskList =
    document.getElementById("insight-budget-risk-list");

const insightUnusualSpendingList =
    document.getElementById("insight-unusual-spending-list");

const insightMonthlySummary =
    document.getElementById("insight-monthly-summary");


// GOALS & PLANNING

const goalsList =
    document.getElementById("goals-list");

const goalForm =
    document.getElementById("goal-form");

const goalFormTitle =
    document.getElementById("goal-form-title");

const goalNameInput =
    document.getElementById("goal-name");

const goalTargetAmountInput =
    document.getElementById("goal-target-amount");

const goalCurrentAmountInput =
    document.getElementById("goal-current-amount");

const goalTargetDateInput =
    document.getElementById("goal-target-date");

const goalAccountSelect =
    document.getElementById("goal-account");

const goalNotesInput =
    document.getElementById("goal-notes");

const saveGoalButton =
    document.getElementById("save-goal-button");

const cancelGoalEditButton =
    document.getElementById("cancel-goal-edit-button");

const goalMessage =
    document.getElementById("goal-message");

const goalsActiveCount =
    document.getElementById("goals-active-count");

const goalsTotalSaved =
    document.getElementById("goals-total-saved");

const goalsTotalTarget =
    document.getElementById("goals-total-target");

const goalsOverallProgress =
    document.getElementById("goals-overall-progress");

const emergencyMonthlyExpenses =
    document.getElementById("emergency-monthly-expenses");

const emergencyMonths =
    document.getElementById("emergency-months");

const emergencyFundResult =
    document.getElementById("emergency-fund-result");

const projectionMonths =
    document.getElementById("projection-months");

const projectionCurrentBalance =
    document.getElementById("projection-current-balance");

const projectionMonthlyNet =
    document.getElementById("projection-monthly-net");

const projectionResult =
    document.getElementById("projection-result");

const loanPrincipal =
    document.getElementById("loan-principal");

const loanRate =
    document.getElementById("loan-rate");

const loanTermMonths =
    document.getElementById("loan-term-months");

const loanMonthlyPayment =
    document.getElementById("loan-monthly-payment");

const loanTotalInterest =
    document.getElementById("loan-total-interest");

const loanTotalRepayment =
    document.getElementById("loan-total-repayment");


// REPORTS

const reportMonthInput =
    document.getElementById("report-month");

const reportCurrentMonthButton =
    document.getElementById("report-current-month-button");

const reportExportCsvButton =
    document.getElementById("report-export-csv-button");

const reportPrintButton =
    document.getElementById("report-print-button");

const reportTotalIncome =
    document.getElementById("report-total-income");

const reportTotalExpenses =
    document.getElementById("report-total-expenses");

const reportNetCashflow =
    document.getElementById("report-net-cashflow");

const reportTransactionCount =
    document.getElementById("report-transaction-count");

const reportIncomeChange =
    document.getElementById("report-income-change");

const reportExpenseChange =
    document.getElementById("report-expense-change");

const reportCategoryBreakdown =
    document.getElementById("report-category-breakdown");

const reportIncomeBreakdown =
    document.getElementById("report-income-breakdown");

const reportAccountBreakdown =
    document.getElementById("report-account-breakdown");

const reportBudgetPerformance =
    document.getElementById("report-budget-performance");

const reportTrendTable =
    document.getElementById("report-trend-table");

const reportTransactionList =
    document.getElementById("report-transaction-list");

const reportTransactionSubtitle =
    document.getElementById("report-transaction-subtitle");


// SCHEDULED EMAIL REPORTS

const scheduledReportForm =
    document.getElementById("scheduled-report-form");

const scheduledReportEnabled =
    document.getElementById("scheduled-report-enabled");

const scheduledReportStatusBadge =
    document.getElementById("scheduled-report-status-badge");

const scheduledReportEmail =
    document.getElementById("scheduled-report-email");

const scheduledReportFrequency =
    document.getElementById("scheduled-report-frequency");

const scheduledReportMonthlyDayGroup =
    document.getElementById("scheduled-report-monthly-day-group");

const scheduledReportWeeklyDayGroup =
    document.getElementById("scheduled-report-weekly-day-group");

const scheduledReportDayOfMonth =
    document.getElementById("scheduled-report-day-of-month");

const scheduledReportDayOfWeek =
    document.getElementById("scheduled-report-day-of-week");

const scheduledReportTime =
    document.getElementById("scheduled-report-time");

const scheduledReportTimezone =
    document.getElementById("scheduled-report-timezone");

const scheduledReportIncludeCsv =
    document.getElementById("scheduled-report-include-csv");

const scheduledReportSaveButton =
    document.getElementById("scheduled-report-save-button");

const scheduledReportTestButton =
    document.getElementById("scheduled-report-test-button");

const scheduledReportLastSent =
    document.getElementById("scheduled-report-last-sent");

const scheduledReportLastError =
    document.getElementById("scheduled-report-last-error");

const scheduledReportMessage =
    document.getElementById("scheduled-report-message");


// SPENDING ANALYTICS

const spendingPeriodLabel =
    document.getElementById(
        "spending-period-label"
    );

const currentSpendingLabel =
    document.getElementById(
        "current-spending-label"
    );

const previousSpendingLabel =
    document.getElementById(
        "previous-spending-label"
    );

const currentMonthSpendingElement =
    document.getElementById(
        "current-month-spending"
    );

const previousMonthSpendingElement =
    document.getElementById(
        "previous-month-spending"
    );

const spendingChangeCard =
    document.getElementById(
        "spending-change-card"
    );

const spendingChangeAmount =
    document.getElementById(
        "spending-change-amount"
    );

const spendingChangePercent =
    document.getElementById(
        "spending-change-percent"
    );

const dashboardInsights =
    document.getElementById(
        "dashboard-insights"
    );


// BUDGET

const budgetMonthInput = document.getElementById("budget-month");
const budgetMonthLabel = document.getElementById("budget-month-label");
const budgetInsight = document.getElementById("budget-insight");
const budgetList = document.getElementById("budget-list");

const budgetForm = document.getElementById("budget-form");
const budgetFormTitle = document.getElementById("budget-form-title");

const budgetCategorySelect = document.getElementById("budget-category");
const budgetAmountInput = document.getElementById("budget-amount");

const saveBudgetButton = document.getElementById("save-budget-button");

const cancelBudgetEditButton =
    document.getElementById("cancel-budget-edit-button");

const budgetMessage =
    document.getElementById("budget-message");


// ACCOUNTS

const accountForm = document.getElementById("account-form");
const accountList = document.getElementById("account-list");

const accountFormTitle =
    document.getElementById("account-form-title");

const saveAccountButton =
    document.getElementById("save-account-button");

const cancelAccountEditButton =
    document.getElementById("cancel-account-edit-button");

const accountMessage =
    document.getElementById("account-message");


// CREDIT CARDS

const dashboardCreditCardSummary =
    document.getElementById("dashboard-credit-card-summary");

const dashboardCreditCardTotals =
    document.getElementById("dashboard-credit-card-totals");

const dashboardCreditCardList =
    document.getElementById("dashboard-credit-card-list");

const dashboardCreditCardViewAll =
    document.getElementById("dashboard-credit-card-view-all");

const creditCardList =
    document.getElementById("credit-card-list");

const creditCardDetail =
    document.getElementById("credit-card-detail");

const creditCardForm =
    document.getElementById("credit-card-form");

const creditCardFormTitle =
    document.getElementById("credit-card-form-title");

const creditCardOpeningOutstandingField =
    document.getElementById("credit-card-opening-outstanding-field");

const cancelCreditCardEditButton =
    document.getElementById("cancel-credit-card-edit-button");

const creditCardMessage =
    document.getElementById("credit-card-message");

const creditCardStatementForm =
    document.getElementById("credit-card-statement-form");

const creditCardStatementMessage =
    document.getElementById("credit-card-statement-message");

const creditCardPaymentForm =
    document.getElementById("credit-card-payment-form");

const creditCardPaymentMessage =
    document.getElementById("credit-card-payment-message");

const creditCardReconcileForm =
    document.getElementById("credit-card-reconcile-form");

const creditCardReconcileMessage =
    document.getElementById("credit-card-reconcile-message");


// CATEGORIES

const categoryForm = document.getElementById("category-form");
const categoryList = document.getElementById("category-list");

const categoryFormTitle =
    document.getElementById("category-form-title");

const saveCategoryButton =
    document.getElementById("save-category-button");

const cancelCategoryEditButton =
    document.getElementById("cancel-category-edit-button");

const categoryMessage =
    document.getElementById("category-message");


// INCOME SOURCES

const incomeSourceForm =
    document.getElementById("income-source-form");

const incomeSourceList =
    document.getElementById("income-source-list");

const incomeSourceFormTitle =
    document.getElementById("income-source-form-title");

const saveIncomeSourceButton =
    document.getElementById("save-income-source-button");

const cancelIncomeSourceEditButton =
    document.getElementById("cancel-income-source-edit-button");

const incomeSourceMessage =
    document.getElementById("income-source-message");


// TRANSACTIONS

const transactionForm =
    document.getElementById("transaction-form");

const transactionDescriptionInput =
    document.getElementById("description");

const descriptionSuggestions =
    document.getElementById("description-suggestions");

const transactionList =
    document.getElementById("transaction-list");

const deletedTransactionList =
    document.getElementById("deleted-transaction-list");

const transactionSuccessSnackbar =
    document.getElementById("transaction-success-snackbar");

const transactionSuccessTitle =
    document.getElementById("transaction-success-title");

const transactionSuccessMessage =
    document.getElementById("transaction-success-message");

const transactionUndoSnackbar =
    document.getElementById("transaction-undo-snackbar");

const transactionUndoButton =
    document.getElementById("transaction-undo-button");

const transactionUndoTitle =
    document.getElementById("transaction-undo-title");

const transactionUndoMessage =
    document.getElementById("transaction-undo-message");

const transactionUndoProgress =
    document.getElementById("transaction-undo-progress");

const transactionAccountSelect =
    document.getElementById("transaction-account");

const transactionAccountLabel =
    document.querySelector('label[for="transaction-account"]');

const transactionPaymentMethodGroup =
    document.getElementById("transaction-payment-method-group");

const transactionPaymentMethodSelect =
    document.getElementById("transaction-payment-method");

const transferAccountGroup =
    document.getElementById("transfer-account-group");

const transferFromAccountSelect =
    document.getElementById("transfer-from-account");

const transferToAccountSelect =
    document.getElementById("transfer-to-account");

const transferAccountMessage =
    document.getElementById("transfer-account-message");

const transactionCategoryLabel =
    document.querySelector('label[for="transaction-category"]');

const transactionTagsField =
    document.querySelector(".transaction-tags-field");

const receiptUploadSection =
    transactionForm?.querySelector(".receipt-upload-section");

const descriptionSuggestionHelp =
    document.querySelector(".description-suggestion-help");

const transactionTypeSelect =
    document.getElementById("type");

const transactionCategorySelect =
    document.getElementById("transaction-category");

const customCategoryGroup =
    document.getElementById("custom-category-group");

const customCategoryInput =
    document.getElementById("custom-category-name");

const incomeSourceGroup =
    document.getElementById("income-source-group");

const transactionIncomeSourceSelect =
    document.getElementById("transaction-income-source");

const customIncomeSourceGroup =
    document.getElementById("custom-income-source-group");

const customIncomeSourceInput =
    document.getElementById("custom-income-source-name");

const transactionTagsInput =
    document.getElementById("transaction-tags");

const cancelEditButton =
    document.getElementById("cancel-edit-button");

const submitButton =
    document.getElementById("submit-button");

const formTitle =
    document.getElementById("form-title");

const dateInput =
    document.getElementById("date");

const receiptFileInput =
    document.getElementById("receipt-file");

const receiptPreview =
    document.getElementById("receipt-preview");

const receiptPreviewImage =
    document.getElementById("receipt-preview-image");

const receiptPreviewPdf =
    document.getElementById("receipt-preview-pdf");

const receiptFileName =
    document.getElementById("receipt-file-name");

const receiptFileMeta =
    document.getElementById("receipt-file-meta");

const removeSelectedReceiptButton =
    document.getElementById("remove-selected-receipt");

const savedReceiptPanel =
    document.getElementById("saved-receipt-panel");

const viewSavedReceiptButton =
    document.getElementById("view-saved-receipt");

const removeSavedReceiptButton =
    document.getElementById("remove-saved-receipt");

const receiptMessage =
    document.getElementById("receipt-message");

const scanReceiptButton =
    document.getElementById("scan-receipt-button");

const receiptOcrProgress =
    document.getElementById("receipt-ocr-progress");

const receiptOcrProgressFill =
    document.getElementById("receipt-ocr-progress-fill");

const receiptOcrStatus =
    document.getElementById("receipt-ocr-status");

const receiptOcrResult =
    document.getElementById("receipt-ocr-result");

const receiptOcrConfidence =
    document.getElementById("receipt-ocr-confidence");

const receiptOcrMerchant =
    document.getElementById("receipt-ocr-merchant");

const receiptOcrAmount =
    document.getElementById("receipt-ocr-amount");

const receiptOcrDate =
    document.getElementById("receipt-ocr-date");

const receiptOcrRawText =
    document.getElementById("receipt-ocr-raw-text");

const applyReceiptOcrButton =
    document.getElementById("apply-receipt-ocr");

const dismissReceiptOcrButton =
    document.getElementById("dismiss-receipt-ocr");

const receiptAiFallback =
    document.getElementById("receipt-ai-fallback");

const receiptAiReason =
    document.getElementById("receipt-ai-reason");

const improveReceiptAiButton =
    document.getElementById("improve-receipt-ai");

const receiptAiStatus =
    document.getElementById("receipt-ai-status");

const transactionSearchInput =
    document.getElementById("transaction-search");

const transactionFilterType =
    document.getElementById("transaction-filter-type");

const transactionFilterAccount =
    document.getElementById("transaction-filter-account");

const transactionFilterCategory =
    document.getElementById("transaction-filter-category");

const transactionFilterTag =
    document.getElementById("transaction-filter-tag");

const transactionFilterPaymentMethod =
    document.getElementById("transaction-filter-payment-method");

const transactionFilterMonth =
    document.getElementById("transaction-filter-month");

const transactionFilterFromDate =
    document.getElementById("transaction-filter-from-date");

const transactionFilterToDate =
    document.getElementById("transaction-filter-to-date");

const transactionSortSelect =
    document.getElementById("transaction-sort");

const resetTransactionFiltersButton =
    document.getElementById("reset-transaction-filters");

const transactionFilterSummary =
    document.getElementById("transaction-filter-summary");

const transactionViewAllButton =
    document.getElementById("transaction-view-all-button");

const dashboardViewAllTransactions =
    document.getElementById("dashboard-view-all-transactions");

// ======================================================
// APP NAVIGATION
// ======================================================

const appPages =
    document.querySelectorAll(
        ".app-page"
    );

const desktopNavItems =
    document.querySelectorAll(
        ".nav-item[data-page]"
    );

const appTopbar =
    document.querySelector(
        ".app-topbar"
    );

const mobileNavItems =
    document.querySelectorAll(
        ".mobile-nav-item[data-page]"
    );

const allPageNavItems =
    document.querySelectorAll(
        ".nav-item[data-page], .mobile-nav-item[data-page]"
    );

const moreHubPageLinks =
    document.querySelectorAll(
        ".more-hub-link[data-page]"
    );

const moreHubManageLinks =
    document.querySelectorAll(
        ".more-hub-link[data-manage-target]"
    );

const recurringList =
    document.getElementById("recurring-list");

const recurringForm =
    document.getElementById("recurring-form");

const recurringFormTitle =
    document.getElementById("recurring-form-title");

const recurringNameInput =
    document.getElementById("recurring-name");

const recurringKindSelect =
    document.getElementById("recurring-kind");

const recurringTypeSelect =
    document.getElementById("recurring-type");

const recurringAccountSelect =
    document.getElementById("recurring-account");

const recurringPaymentMethodSelect =
    document.getElementById("recurring-payment-method");

const recurringCategorySelect =
    document.getElementById("recurring-category");

const recurringCustomCategoryGroup =
    document.getElementById("recurring-custom-category-group");

const recurringCustomCategoryInput =
    document.getElementById("recurring-custom-category-name");

const recurringIncomeSourceGroup =
    document.getElementById("recurring-income-source-group");

const recurringIncomeSourceSelect =
    document.getElementById("recurring-income-source");

const recurringAmountInput =
    document.getElementById("recurring-amount");

const recurringFrequencySelect =
    document.getElementById("recurring-frequency");

const recurringNextDueDateInput =
    document.getElementById("recurring-next-due-date");

const recurringNotesInput =
    document.getElementById("recurring-notes");

const saveRecurringButton =
    document.getElementById("save-recurring-button");

const cancelRecurringEditButton =
    document.getElementById("cancel-recurring-edit-button");

const recurringMessage =
    document.getElementById("recurring-message");

const recurringActiveCount =
    document.getElementById("recurring-active-count");

const recurringDueSoonCount =
    document.getElementById("recurring-due-soon-count");

const recurringMonthlyEstimate =
    document.getElementById("recurring-monthly-estimate");

const recurringReminderCount =
    document.getElementById("recurring-reminder-count");

const recurringAnalyticsIncome =
    document.getElementById("recurring-analytics-income");

const recurringAnalyticsExpenses =
    document.getElementById("recurring-analytics-expenses");

const recurringAnalyticsNet =
    document.getElementById("recurring-analytics-net");

const recurringAnalyticsAnnualExpenses =
    document.getElementById("recurring-analytics-annual-expenses");

const recurringAnalyticsCategoryList =
    document.getElementById("recurring-analytics-category-list");

const recurringAnalyticsTopList =
    document.getElementById("recurring-analytics-top-list");

const recurringReminderList =
    document.getElementById("recurring-reminder-list");

const recurringActivityList =
    document.getElementById("recurring-activity-list");

const recurringReminderEnabled =
    document.getElementById("recurring-reminder-enabled");

const recurringReminderDays =
    document.getElementById("recurring-reminder-days");

const recurringReminderDaysGroup =
    document.getElementById("recurring-reminder-days-group");

const recurringCalendarMonth =
    document.getElementById("recurring-calendar-month");

const recurringCalendarSummary =
    document.getElementById("recurring-calendar-summary");

const recurringCalendarList =
    document.getElementById("recurring-calendar-list");

const dashboardUpcomingCommitments =
    document.getElementById("dashboard-upcoming-commitments");

const appPageTitle =
    document.getElementById(
        "app-page-title"
    );

const dashboardRecentTransactions =
    document.getElementById(
        "dashboard-recent-transactions"
    );

const dashboardBudgetSummary =
    document.getElementById(
        "dashboard-budget-summary"
    );

const quickAddTransactionLinks =
    document.querySelectorAll(
        'a[href="#transaction-form"]'
    );



// ======================================================
// STATE
// ======================================================

let currentUser = null;

let accounts = [];
let categories = [];
let incomeSources = [];
let paymentMethods = [];
let creditCards = [];
let creditCardStatements = [];
let creditCardReconciliations = [];
let tags = [];
let transactionTagLinks = [];

let transactions = [];
let deletedTransactions = [];
let transfers = [];

let budgets = [];
let recurringTransactions = [];
let recurringOccurrenceStatuses = [];
let savingsGoals = [];
let reportEmailPreference = null;

let editingGoalId = null;

let pendingTransactionDelete = null;
let pendingTransferDelete = null;
let transactionUndoTimer = null;
let transactionSuccessTimer = null;

let editingAccountId = null;
let editingCreditCardId = null;
let selectedCreditCardId = null;
let editingCategoryId = null;
let editingIncomeSourceId = null;
let editingTransactionId = null;
let editingTransferId = null;
let editingBudgetId = null;
let editingRecurringId = null;
let pendingRecurringId = null;
let pendingRecurringDueDate = null;

let selectedReceiptFile = null;
let selectedReceiptObjectUrl = null;
let editingReceiptPath = null;
let removeEditingReceipt = false;

const RECEIPT_BUCKET = "receipts";
const MAX_RECEIPT_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_RECEIPT_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
]);

let receiptOcrWorker = null;
let receiptOcrResultData = null;
let receiptOcrRunning = false;
let receiptAiRunning = false;

const RECEIPT_AI_CONFIDENCE_THRESHOLD = 65;
const RECEIPT_AI_FEATURE_ENABLED = false;

let showAllTransactions = false;

const TRANSACTION_PREVIEW_LIMIT = 10;


// ======================================================
// STARTER DATA
// ======================================================

const starterCategories = [
    {
        name: "Food & Dining",
        type: "expense"
    },
    {
        name: "Transportation",
        type: "expense"
    },
    {
        name: "Bills",
        type: "expense"
    },
    {
        name: "Shopping",
        type: "expense"
    },
    {
        name: "Entertainment",
        type: "expense"
    },
    {
        name: "Health",
        type: "expense"
    },
    {
        name: "Salary",
        type: "income"
    },
    {
        name: "Side Income",
        type: "income"
    },
    {
        name: "Investment",
        type: "income"
    }
];


const starterIncomeSources = [
    "Salary",
    "Grab",
    "Freelance",
    "Business",
    "Investment",
    "Bonus"
];


// ======================================================
// SETTINGS / PROFILE / APPEARANCE
// ======================================================

const APP_APPEARANCE_STORAGE_PREFIX =
    "financeAppearance:";

let selectedAvatarValue =
    "initials";


function getDisplayNameFromUser(user) {

    const metadataName =
        user
            ?.user_metadata
            ?.display_name;

    if (
        typeof metadataName ===
            "string"
        &&
        metadataName.trim()
    ) {

        return metadataName.trim();
    }


    const emailPrefix =
        user
            ?.email
            ?.split("@")[0]
            ?.trim();

    return (
        emailPrefix
        ||
        "User"
    );
}


function getInitials(name) {

    const cleaned =
        String(
            name
            ||
            "User"
        )
            .trim()
            .replace(
                /\s+/g,
                " "
            );

    if (!cleaned) {
        return "U";
    }


    const parts =
        cleaned.split(" ");

    if (
        parts.length === 1
    ) {

        return parts[0]
            .slice(
                0,
                2
            )
            .toUpperCase();
    }


    return (
        parts[0][0]
        +
        parts[
            parts.length - 1
        ][0]
    ).toUpperCase();
}


function getAvatarValueFromUser(user) {

    const avatar =
        user
            ?.user_metadata
            ?.avatar_value;

    if (
        typeof avatar ===
            "string"
        &&
        avatar.trim()
    ) {

        return avatar.trim();
    }

    return "initials";
}


function getAppearanceStorageKey() {

    return (
        currentUser?.id
        ? APP_APPEARANCE_STORAGE_PREFIX
            + currentUser.id
        : APP_APPEARANCE_STORAGE_PREFIX
            + "guest"
    );
}


function normaliseAppearance(value) {

    return [
        "light",
        "dark",
        "system"
    ].includes(
        value
    )
        ? value
        : "system";
}


function getStoredAppearance(user) {

    const metadataAppearance =
        user
            ?.user_metadata
            ?.appearance;

    if (
        [
            "light",
            "dark",
            "system"
        ].includes(
            metadataAppearance
        )
    ) {

        return metadataAppearance;
    }


    const localAppearance =
        localStorage.getItem(
            user?.id
                ? APP_APPEARANCE_STORAGE_PREFIX
                    + user.id
                : APP_APPEARANCE_STORAGE_PREFIX
                    + "guest"
        );


    if (
        [
            "light",
            "dark",
            "system"
        ].includes(
            localAppearance
        )
    ) {

        return localAppearance;
    }


    // New users start with Kira's light appearance.
    return "light";
}


function resolveTheme(appearance) {

    if (
        appearance === "system"
    ) {

        return window
            .matchMedia(
                "(prefers-color-scheme: dark)"
            )
            .matches
                ? "dark"
                : "light";
    }

    return appearance;
}


function applyAppearance(
    appearance,
    options = {}
) {

    const {
        persistLocal = true
    } = options;

    const safeAppearance =
        normaliseAppearance(
            appearance
        );

    const resolvedTheme =
        resolveTheme(
            safeAppearance
        );


    document.documentElement
        .setAttribute(
            "data-theme",
            resolvedTheme
        );

    document.body
        .setAttribute(
            "data-theme",
            resolvedTheme
        );

    document.documentElement
        .style
        .colorScheme =
            resolvedTheme;


    const themeMeta =
        document.querySelector(
            'meta[name="theme-color"]'
        );

    if (themeMeta) {

        themeMeta.content =
            resolvedTheme === "dark"
                ? "#0b1220"
                : "#111827";
    }


    if (persistLocal) {

        localStorage.setItem(
            getAppearanceStorageKey(),
            safeAppearance
        );
    }


    settingsThemeOptions
        .forEach(
            function (radio) {

                radio.checked =
                    radio.value ===
                    safeAppearance;
            }
        );


    return safeAppearance;
}


function updateAvatarUi(
    displayName,
    avatarValue
) {

    const initials =
        getInitials(
            displayName
        );

    const safeAvatar =
        avatarValue
        ||
        "initials";

    selectedAvatarValue =
        safeAvatar;

    const renderedAvatar =
        safeAvatar ===
            "initials"
            ? initials
            : safeAvatar;


    if (sidebarUserAvatar) {

        sidebarUserAvatar
            .textContent =
                renderedAvatar;
    }


    if (settingsAvatarPreview) {

        settingsAvatarPreview
            .textContent =
                renderedAvatar;
    }


    if (settingsAvatarInitials) {

        settingsAvatarInitials
            .textContent =
                initials;
    }


    settingsAvatarOptions
        .forEach(
            function (radio) {

                radio.checked =
                    radio.value ===
                    safeAvatar;
            }
        );
}


function renderUserSettings(user) {

    if (!user) {
        return;
    }


    const displayName =
        getDisplayNameFromUser(
            user
        );

    const avatarValue =
        getAvatarValueFromUser(
            user
        );

    const appearance =
        getStoredAppearance(
            user
        );


    if (settingsDisplayName) {

        settingsDisplayName.value =
            displayName;
    }


    if (settingsProfilePreviewName) {

        settingsProfilePreviewName
            .textContent =
                displayName;
    }


    if (settingsProfileEmail) {

        settingsProfileEmail
            .textContent =
                user.email
                ||
                "Signed in";
    }


    updateAvatarUi(
        displayName,
        avatarValue
    );

    applyAppearance(
        appearance
    );

    renderAccountSecurityDetails(
        user
    );
}


settingsDisplayName
    ?.addEventListener(
        "input",
        function () {

            const previewName =
                settingsDisplayName
                    .value
                    .trim()
                ||
                getDisplayNameFromUser(
                    currentUser
                );


            if (
                settingsProfilePreviewName
            ) {

                settingsProfilePreviewName
                    .textContent =
                        previewName;
            }


            updateAvatarUi(
                previewName,
                selectedAvatarValue
            );
        }
    );


settingsAvatarOptions
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    if (!radio.checked) {
                        return;
                    }


                    selectedAvatarValue =
                        radio.value;


                    const previewName =
                        settingsDisplayName
                            ?.value
                            ?.trim()
                        ||
                        getDisplayNameFromUser(
                            currentUser
                        );


                    updateAvatarUi(
                        previewName,
                        selectedAvatarValue
                    );
                }
            );
        }
    );


saveProfileSettingsButton
    ?.addEventListener(
        "click",
        async function () {

            const {
                data: sessionData,
                error: sessionError
            } =
                await supabase.auth.getSession();

            let session =
                sessionData?.session || null;

            if (
                sessionError
                ||
                !session
            ) {

                const {
                    data: refreshData,
                    error: refreshError
                } =
                    await supabase.auth.refreshSession();

                if (
                    refreshError
                    ||
                    !refreshData?.session
                ) {

                    settingsProfileMessage.textContent =
                        "Your login session expired. Please log in again.";

                    return;
                }

                session =
                    refreshData.session;
            }

            const activeUser =
                session?.user || currentUser;

            if (!activeUser) {

                settingsProfileMessage.textContent =
                    "Unable to find the signed-in user. Please log in again.";

                return;
            }

            currentUser =
                activeUser;

            const displayName =
                settingsDisplayName?.value?.trim()
                ||
                getDisplayNameFromUser(
                    activeUser
                );

            if (
                displayName.length > 40
            ) {

                settingsProfileMessage.textContent =
                    "Display name is too long.";

                return;
            }

            saveProfileSettingsButton.disabled =
                true;

            settingsProfileMessage.textContent =
                "Saving…";

            const {
                data,
                error
            } =
                await supabase.auth.updateUser({
                    data: {
                        ...activeUser.user_metadata,
                        display_name:
                            displayName,
                        avatar_value:
                            selectedAvatarValue,
                        appearance:
                            getStoredAppearance(
                                activeUser
                            )
                    }
                });

            saveProfileSettingsButton.disabled =
                false;

            if (error) {

                settingsProfileMessage.textContent =
                    error.message;

                return;
            }

            if (data?.user) {

                currentUser =
                    data.user;

                renderUserSettings(
                    currentUser
                );
            }

            settingsProfileMessage.textContent =
                "Profile saved.";

            setTimeout(
                function () {

                    if (
                        settingsProfileMessage.textContent ===
                        "Profile saved."
                    ) {

                        settingsProfileMessage.textContent =
                            "";
                    }
                },
                3000
            );
        }
    );


settingsThemeOptions
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                async function () {

                    if (!radio.checked) {
                        return;
                    }

                    const appearance =
                        applyAppearance(
                            radio.value
                        );

                    if (
                        settingsThemeMessage
                    ) {

                        settingsThemeMessage.textContent =
                            "Saving appearance…";
                    }

                    const {
                        data: sessionData,
                        error: sessionError
                    } =
                        await supabase.auth.getSession();

                    let session =
                        sessionData?.session || null;

                    if (
                        sessionError
                        ||
                        !session
                    ) {

                        const {
                            data: refreshData,
                            error: refreshError
                        } =
                            await supabase.auth.refreshSession();

                        if (
                            refreshError
                            ||
                            !refreshData?.session
                        ) {

                            if (
                                settingsThemeMessage
                            ) {

                                settingsThemeMessage.textContent =
                                    "Theme saved on this device. Log in again to sync it to your account.";
                            }

                            return;
                        }

                        session =
                            refreshData.session;
                    }

                    const activeUser =
                        session?.user || currentUser;

                    if (!activeUser) {

                        if (
                            settingsThemeMessage
                        ) {

                            settingsThemeMessage.textContent =
                                "Theme saved on this device. Log in again to sync it to your account.";
                        }

                        return;
                    }

                    currentUser =
                        activeUser;

                    const {
                        data,
                        error
                    } =
                        await supabase.auth.updateUser({
                            data: {
                                ...activeUser.user_metadata,
                                appearance:
                                    appearance
                            }
                        });

                    if (error) {

                        if (
                            settingsThemeMessage
                        ) {

                            settingsThemeMessage.textContent =
                                "Theme saved on this device, but account sync failed.";
                        }

                        return;
                    }

                    if (data?.user) {

                        currentUser =
                            data.user;
                    }

                    if (
                        settingsThemeMessage
                    ) {

                        const label =
                            appearance[0].toUpperCase()
                            +
                            appearance.slice(1);

                        settingsThemeMessage.textContent =
                            `${label} appearance saved.`;

                        setTimeout(
                            function () {

                                if (
                                    settingsThemeMessage.textContent ===
                                    `${label} appearance saved.`
                                ) {

                                    settingsThemeMessage.textContent =
                                        "";
                                }
                            },
                            2500
                        );
                    }
                }
            );
        }
    );


const systemThemeMedia =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


function handleSystemThemeChange() {

    const appearance =
        getStoredAppearance(
            currentUser
        );

    if (
        appearance === "system"
    ) {

        applyAppearance(
            "system",
            {
                persistLocal: false
            }
        );
    }
}


if (
    typeof systemThemeMedia
        .addEventListener ===
    "function"
) {

    systemThemeMedia
        .addEventListener(
            "change",
            handleSystemThemeChange
        );
}
else if (
    typeof systemThemeMedia
        .addListener ===
    "function"
) {

    systemThemeMedia
        .addListener(
            handleSystemThemeChange
        );
}



// ======================================================
// PHASE 12 — ACCOUNT, SECURITY & DATA
// ======================================================

function formatAccountDate(
    value,
    includeTime = false
) {

    if (!value) {
        return "—";
    }

    const parsed =
        new Date(value);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-MY",
        includeTime
            ? {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
            : {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
    ).format(
        parsed
    );
}


function renderAccountSecurityDetails(
    user
) {

    if (!user) {
        return;
    }


    if (settingsSecurityEmail) {

        settingsSecurityEmail
            .textContent =
                user.email
                ||
                "—";
    }


    if (settingsMemberSince) {

        settingsMemberSince
            .textContent =
                formatAccountDate(
                    user.created_at
                );
    }


    if (settingsLastSignIn) {

        settingsLastSignIn
            .textContent =
                formatAccountDate(
                    user.last_sign_in_at,
                    true
                );
    }


    if (settingsNewEmail) {

        settingsNewEmail
            .value =
                "";
    }
}


function getPasswordResetRedirectUrl() {

    // Use the existing Supabase Site URL for native email recovery.
    // localhost belongs to the bundled WebView and is not an email callback.
    if (isNativeApp) return undefined;

    return (
        window.location.origin
        +
        window.location.pathname
    );
}


function setPasswordResetButtonState(
    button,
    secondsRemaining,
    idleLabel =
        "Forgot password?"
) {

    if (!button) {
        return;
    }

    if (secondsRemaining > 0) {

        button.disabled =
            true;

        button.textContent =
            `Resend available in ${secondsRemaining}s`;

        return;
    }

    button.disabled =
        false;

    button.textContent =
        idleLabel;
}


function startPasswordResetCooldown(
    button,
    seconds = 60,
    idleLabel =
        "Forgot password?"
) {

    if (passwordResetCooldownTimer) {

        clearInterval(
            passwordResetCooldownTimer
        );
    }

    passwordResetCooldownSeconds =
        seconds;

    setPasswordResetButtonState(
        button,
        passwordResetCooldownSeconds,
        idleLabel
    );

    passwordResetCooldownTimer =
        setInterval(
            function () {

                passwordResetCooldownSeconds =
                    Math.max(
                        0,
                        passwordResetCooldownSeconds - 1
                    );

                setPasswordResetButtonState(
                    button,
                    passwordResetCooldownSeconds,
                    idleLabel
                );

                if (
                    passwordResetCooldownSeconds <= 0
                ) {

                    clearInterval(
                        passwordResetCooldownTimer
                    );

                    passwordResetCooldownTimer =
                        null;
                }
            },
            1000
        );
}


function getFriendlyAuthEmailError(
    error
) {

    const message =
        String(
            error?.message
            ||
            ""
        )
            .trim();

    const lower =
        message.toLowerCase();

    if (
        lower.includes("rate limit")
        ||
        lower.includes("too many requests")
        ||
        lower.includes("email rate limit exceeded")
    ) {

        return "Please wait a moment before requesting another reset email.";
    }

    return (
        message
        ||
        "Unable to send the reset email right now."
    );
}


async function sendPasswordResetEmail(
    email,
    messageElement,
    buttonElement = null,
    idleLabel =
        "Forgot password?"
) {

    const safeEmail =
        String(
            email
            ||
            ""
        )
            .trim()
            .toLowerCase();

    if (!safeEmail) {

        if (messageElement) {

            messageElement.textContent =
                "Enter your email address first.";
        }

        return false;
    }

    if (
        buttonElement
        &&
        passwordResetCooldownSeconds > 0
    ) {

        if (messageElement) {

            messageElement.textContent =
                `Please wait ${passwordResetCooldownSeconds}s before requesting another reset email.`;
        }

        return false;
    }

    if (messageElement) {

        messageElement.textContent =
            "Sending reset link…";
    }

    if (buttonElement) {

        buttonElement.disabled =
            true;
    }

    const {
        error
    } =
        await supabase.auth.resetPasswordForEmail(
            safeEmail,
            {
                redirectTo:
                    getPasswordResetRedirectUrl()
            }
        );

    if (error) {

        const friendlyMessage =
            getFriendlyAuthEmailError(
                error
            );

        const isRateLimited =
            friendlyMessage ===
            "Please wait a moment before requesting another reset email.";

        if (
            buttonElement
            &&
            isRateLimited
        ) {

            startPasswordResetCooldown(
                buttonElement,
                60,
                idleLabel
            );

        } else if (
            buttonElement
            &&
            passwordResetCooldownSeconds <= 0
        ) {

            buttonElement.disabled =
                false;
        }

        if (messageElement) {

            messageElement.textContent =
                friendlyMessage;
        }

        return false;
    }

    if (messageElement) {

        messageElement.textContent =
            "Password reset email sent. Check your inbox.";
    }

    if (buttonElement) {

        startPasswordResetCooldown(
            buttonElement,
            60,
            idleLabel
        );
    }

    return true;
}


forgotPasswordButton
    ?.addEventListener(
        "click",
        async function () {

            const emailInput =
                document.getElementById(
                    "auth-email"
                );

            await sendPasswordResetEmail(
                emailInput?.value,
                authMessage,
                forgotPasswordButton,
                "Forgot password?"
            );
        }
    );


updateEmailButton
    ?.addEventListener(
        "click",
        async function () {

            const email =
                settingsNewEmail
                    ?.value
                    ?.trim()
                    ?.toLowerCase();


            if (
                !email
                ||
                !email.includes("@")
            ) {

                settingsEmailMessage
                    .textContent =
                        "Enter a valid new email address.";

                return;
            }


            updateEmailButton.disabled =
                true;

            settingsEmailMessage
                .textContent =
                    "Updating email…";


            const {
                data,
                error
            } =
                await supabase
                    .auth
                    .updateUser({
                        email
                    });


            updateEmailButton.disabled =
                false;


            if (error) {

                settingsEmailMessage
                    .textContent =
                        error.message;

                return;
            }


            if (data?.user) {

                currentUser =
                    data.user;

                renderUserSettings(
                    currentUser
                );
            }


            settingsEmailMessage
                .textContent =
                    "Email update requested. Check your inbox for any confirmation message.";

            if (settingsNewEmail) {

                settingsNewEmail.value =
                    "";
            }
        }
    );


updatePasswordButton
    ?.addEventListener(
        "click",
        async function () {

            const password =
                settingsNewPassword
                    ?.value
                ||
                "";

            const confirmation =
                settingsConfirmPassword
                    ?.value
                ||
                "";


            if (
                password.length <
                8
            ) {

                settingsPasswordMessage
                    .textContent =
                        "Password must be at least 8 characters.";

                return;
            }


            if (
                password !==
                confirmation
            ) {

                settingsPasswordMessage
                    .textContent =
                        "The two passwords do not match.";

                return;
            }


            updatePasswordButton.disabled =
                true;

            settingsPasswordMessage
                .textContent =
                    "Updating password…";


            const {
                data,
                error
            } =
                await supabase
                    .auth
                    .updateUser({
                        password
                    });


            updatePasswordButton.disabled =
                false;


            if (error) {

                settingsPasswordMessage
                    .textContent =
                        error.message;

                return;
            }


            if (data?.user) {

                currentUser =
                    data.user;
            }


            settingsNewPassword.value =
                "";

            settingsConfirmPassword.value =
                "";

            passwordRecoveryMode =
                false;

            passwordRecoveryBanner
                ?.classList
                .add(
                    "hidden-button"
                );


            settingsPasswordMessage
                .textContent =
                    "Password updated successfully.";
        }
    );


sendResetEmailButton
    ?.addEventListener(
        "click",
        async function () {

            await sendPasswordResetEmail(
                currentUser?.email,
                settingsPasswordMessage,
                sendResetEmailButton,
                "Email me a reset link"
            );
        }
    );


signOutOtherSessionsButton
    ?.addEventListener(
        "click",
        async function () {

            signOutOtherSessionsButton
                .disabled =
                    true;

            settingsSessionMessage
                .textContent =
                    "Signing out other sessions…";


            const {
                error
            } =
                await supabase
                    .auth
                    .signOut({
                        scope:
                            "others"
                    });


            signOutOtherSessionsButton
                .disabled =
                    false;


            if (error) {

                settingsSessionMessage
                    .textContent =
                        error.message;

                return;
            }


            settingsSessionMessage
                .textContent =
                    "Other sessions have been signed out.";
        }
    );


async function exportCurrentUserData() {

    if (!currentUser) {

        throw new Error(
            "No signed-in user."
        );
    }


    const userId =
        currentUser.id;


    const tableNames = [
        "accounts",
        "categories",
        "income_sources",
        "transactions",
        "budgets",
        "recurring_transactions",
        "recurring_occurrence_statuses",
        "savings_goals",
        "tags",
        "report_email_preferences"
    ];


    const exportedTables =
        {};


    for (
        const tableName
        of tableNames
    ) {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    tableName
                )
                .select("*")
                .eq(
                    "user_id",
                    userId
                );


        if (error) {
            throw error;
        }


        exportedTables[
            tableName
        ] =
            data
            ||
            [];
    }


    const transactionIds =
        exportedTables
            .transactions
            .map(
                item =>
                    item.id
            );


    let transactionTags =
        [];


    if (
        transactionIds.length
    ) {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    "transaction_tags"
                )
                .select("*")
                .in(
                    "transaction_id",
                    transactionIds
                );


        if (error) {
            throw error;
        }


        transactionTags =
            data
            ||
            [];
    }


    return {
        product:
            "Kira",
        export_version:
            1,
        generated_at:
            new Date()
                .toISOString(),
        account: {
            id:
                currentUser.id,
            email:
                currentUser.email
                ||
                null,
            created_at:
                currentUser.created_at
                ||
                null,
            last_sign_in_at:
                currentUser.last_sign_in_at
                ||
                null,
            user_metadata:
                currentUser.user_metadata
                ||
                {}
        },
        notes: {
            receipt_files:
                "Receipt paths are included in transaction records. The receipt image/PDF binaries are not embedded in this JSON export."
        },
        tables: {
            ...exportedTables,
            transaction_tags:
                transactionTags
        }
    };
}


function downloadJsonFile(
    filename,
    value
) {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    value,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const anchor =
        document.createElement(
            "a"
        );

    anchor.href =
        url;

    anchor.download =
        filename;

    document.body
        .appendChild(
            anchor
        );

    anchor.click();

    anchor.remove();


    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );
        },
        0
    );
}


exportMyDataButton
    ?.addEventListener(
        "click",
        async function () {

            exportMyDataButton.disabled =
                true;

            settingsExportMessage
                .textContent =
                    "Preparing your backup…";


            try {

                const backup =
                    await exportCurrentUserData();


                const date =
                    new Date()
                        .toISOString()
                        .slice(
                            0,
                            10
                        );


                downloadJsonFile(
                    `kira-backup-${date}.json`,
                    backup
                );


                settingsExportMessage
                    .textContent =
                        "Backup downloaded.";

            } catch (error) {

                settingsExportMessage
                    .textContent =
                        error?.message
                        ||
                        "Could not export your data.";

            } finally {

                exportMyDataButton.disabled =
                    false;
            }
        }
    );


deleteAccountConfirmation
    ?.addEventListener(
        "input",
        function () {

            const confirmed =
                deleteAccountConfirmation
                    .value
                    .trim()
                    .toUpperCase() ===
                "DELETE";


            deleteAccountButton.disabled =
                !confirmed;
        }
    );


deleteAccountButton
    ?.addEventListener(
        "click",
        async function () {

            const confirmation =
                deleteAccountConfirmation
                    ?.value
                    ?.trim()
                    ?.toUpperCase();


            if (
                confirmation !==
                "DELETE"
            ) {
                return;
            }


            const accepted =
                window.confirm(
                    "Delete your Kira account permanently? This removes your finance records, receipts and login account. This cannot be undone."
                );


            if (!accepted) {
                return;
            }


            deleteAccountButton.disabled =
                true;

            settingsDeleteMessage
                .textContent =
                    "Deleting your account…";


            try {

                const {
                    data: sessionData,
                    error: sessionError
                } =
                    await supabase
                        .auth
                        .getSession();


                if (
                    sessionError
                    ||
                    !sessionData?.session
                ) {

                    throw new Error(
                        "Your login session expired. Please log in again before deleting the account."
                    );
                }


                const {
                    data,
                    error
                } =
                    await supabase
                        .functions
                        .invoke(
                            "delete-my-account",
                            {
                                body: {
                                    confirmation:
                                        "DELETE"
                                },
                                headers: {
                                    Authorization:
                                        `Bearer ${sessionData.session.access_token}`
                                }
                            }
                        );


                if (error) {
                    throw error;
                }


                if (
                    !data?.ok
                ) {

                    throw new Error(
                        data?.error
                        ||
                        "Account deletion failed."
                    );
                }


                settingsDeleteMessage
                    .textContent =
                        "Account deleted.";


                await supabase
                    .auth
                    .signOut()
                    .catch(
                        () => {}
                    );


                window.location.hash =
                    "";

                window.location.reload();

            } catch (error) {

                settingsDeleteMessage
                    .textContent =
                        error?.message
                        ||
                        "Could not delete your account.";

                deleteAccountButton.disabled =
                    false;
            }
        }
    );


// ======================================================
// AUTH UI
// ======================================================

function showLoggedOutState() {

    currentUser = null;

    accounts = [];
    categories = [];
    incomeSources = [];
    tags = [];
    transactionTagLinks = [];

    transactions = [];
    deletedTransactions = [];
    transfers = [];

    pendingTransferDelete = null;
    editingTransferId = null;

    budgets = [];
    recurringTransactions = [];
    recurringOccurrenceStatuses = [];
    savingsGoals = [];
    reportEmailPreference = null;

    editingGoalId = null;

    authSection.style.display = "flex";
    financeApp.style.display = "none";
}


async function waitForNativeConnection() {
    if (!isNativeApp || window.navigator.onLine) return;
    await new Promise(resolve => {
        window.addEventListener("online", resolve, { once: true });
    });
}

async function showLoggedInState(user) {

    currentUser = user;

    authSection.style.display = "none";
    financeApp.style.display = "block";

    userEmail.textContent =
        user.email || "Signed in";

    renderUserSettings(
        user
    );

    authMessage.textContent = "";

    // A bundled Android shell can open offline before any finance data is loaded.
    // Wait instead of treating failed reads as an empty account and seeding defaults.
    await waitForNativeConnection();
    if (currentUser?.id !== user.id) return;

    await loadAccounts();

    try {
        await cleanupDeletedAccountTransfers(
            currentUser.id
        );
    } catch (error) {
        console.warn(
            "Stale transfer cleanup skipped:",
            error
        );
    }

    await loadTransfers(
        false,
        false
    );

    await loadCategories();

    await loadIncomeSources();

    await ensureDefaultPaymentMethods(
        currentUser.id
    );

    await loadPaymentMethods();

    await loadCreditCardData();

    await seedStarterData();

    await loadTags();

    await cleanupStaleDeletedTransactions();

    await loadTransactions();

    renderCreditCardsPage();
    renderCreditCardDashboardSummary();

    setDefaultBudgetMonth();

    setDefaultReportMonth();

    await loadBudgets();

    await loadRecurringTransactions();

    await loadSavingsGoals();

    await loadReportEmailPreference();

    refreshTransactionDropdowns();

    refreshRecurringFormOptions();

    refreshGoalAccountOptions();

    renderPlanningTools();

    await initializeFirstTimeOnboarding();

    if (isNativeApp) {
        window.dispatchEvent(
            new CustomEvent("kira:app-ready")
        );
    }
}


// ======================================================
// REGISTER
// ======================================================

registerButton.addEventListener(
    "click",
    async function () {

        const email =
            document
                .getElementById("auth-email")
                .value
                .trim();

        const password =
            document
                .getElementById("auth-password")
                .value;

        if (
            !email ||
            password.length < 8
        ) {

            authMessage.textContent =
                "Enter a valid email and a password of at least 8 characters.";

            return;
        }

        registerButton.disabled = true;

        authMessage.textContent =
            "Creating account...";

        const {
            data,
            error
        } =
            await supabase.auth.signUp({

                email,
                password,

                options: {
                    emailRedirectTo:
                        isNativeApp ? undefined : window.location.origin
                }

            });

        registerButton.disabled = false;

        if (error) {

            authMessage.textContent =
                error.message;

            return;
        }

        if (!data.session) {

            authMessage.textContent =
                "Account created. Check your email to confirm your account before logging in.";

            return;
        }

        await showLoggedInState(
            data.user
        );
    }
);


// ======================================================
// LOGIN
// ======================================================

authForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document
                .getElementById("auth-email")
                .value
                .trim();

        const password =
            document
                .getElementById("auth-password")
                .value;

        loginButton.disabled = true;

        authMessage.textContent =
            "Signing in...";

        const {
            data,
            error
        } =
            await supabase.auth
                .signInWithPassword({

                    email,
                    password

                });

        loginButton.disabled = false;

        if (error) {

            authMessage.textContent =
                error.message;

            return;
        }

        await showLoggedInState(
            data.user
        );
    }
);


// ======================================================
// LOGOUT
// ======================================================

async function handleLogout() {

    const {
        error
    } =
        await supabase.auth.signOut();

    if (error) {

        alert(
            error.message
        );

        return;
    }

    showLoggedOutState();
}


logoutButton
    ?.addEventListener(
        "click",
        handleLogout
    );


mobileLogoutButton
    ?.addEventListener(
        "click",
        handleLogout
    );


// ======================================================
// INITIAL AUTH
// ======================================================

async function initializeAuth() {

    const {
        data,
        error
    } =
        await supabase.auth.getSession();

    if (error) {

        console.error(
            "Session error:",
            error
        );

        showLoggedOutState();

        return;
    }

    if (data.session) {

        await showLoggedInState(
            data.session.user
        );

    } else {

        showLoggedOutState();
    }

    // Resolve the initial route only after authentication and finance
    // data have finished loading. This prevents direct/deep-link
    // refreshes (for example #recurring) from rendering empty state
    // before recurring data is available.
    initializeAppNavigation();
}


supabase.auth.onAuthStateChange(
    async function (
        event,
        session
    ) {

        console.log(
            "Auth:",
            event
        );

        if (session?.user) {

            currentUser =
                session.user;

            renderUserSettings(
                currentUser
            );

            userEmail.textContent =
                currentUser.email
                ||
                "Signed in";


            if (
                event ===
                "PASSWORD_RECOVERY"
            ) {

                passwordRecoveryMode =
                    true;

                passwordRecoveryBanner
                    ?.classList
                    .remove(
                        "hidden-button"
                    );


                if (
                    financeApp.style.display ===
                    "none"
                    ||
                    !financeApp.style.display
                ) {

                    await showLoggedInState(
                        currentUser
                    );
                }


                navigateToPage(
                    "settings"
                );


                setTimeout(
                    function () {

                        settingsNewPassword
                            ?.focus();

                        passwordRecoveryBanner
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "center"
                            });
                    },
                    250
                );

                return;
            }


            return;
        }

        if (
            event === "SIGNED_OUT"
        ) {

            currentUser =
                null;

            showLoggedOutState();
        }
    }
);



function scrollToFormAndFocus(
    form,
    focusElement
) {

    if (!form) {
        return;
    }

    requestAnimationFrame(
        function () {

            form.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "start"
            });

            window.setTimeout(
                function () {

                    focusElement?.focus({
                        preventScroll:
                            true
                    });
                },
                450
            );
        }
    );
}


async function getReferenceCount(
    table,
    column,
    value
) {

    const {
        count,
        error
    } =
        await supabase
            .from(table)
            .select(
                "id",
                {
                    count:
                        "exact",
                    head:
                        true
                }
            )
            .eq(
                column,
                value
            );

    if (error) {
        throw error;
    }

    return count || 0;
}


// ======================================================
// CREDIT CARD MANAGEMENT
// ======================================================

async function loadCreditCardData(
    throwOnError = false
) {

    if (!currentUser) {
        creditCards = [];
        creditCardStatements = [];
        creditCardReconciliations = [];
        return;
    }

    try {

        const [
            cards,
            statements,
            reconciliations
        ] =
            await Promise.all([
                fetchCreditCards(
                    currentUser.id
                ),
                fetchCreditCardStatements(
                    currentUser.id
                ),
                fetchCreditCardReconciliations(
                    currentUser.id
                )
            ]);

        creditCards =
            cards;

        creditCardStatements =
            statements;

        creditCardReconciliations =
            reconciliations;

    } catch (error) {

        creditCards = [];
        creditCardStatements = [];
        creditCardReconciliations = [];

        if (throwOnError) {
            throw error;
        }

        console.warn(
            "Credit card data unavailable:",
            error
        );
    }
}


function getCreditCardById(
    cardId
) {

    return creditCards.find(
        card =>
            card.id ===
            cardId
    ) || null;
}


function getCreditCardByAccountId(
    accountId
) {

    if (!accountId) {
        return null;
    }

    return creditCards.find(
        card =>
            card.account_id ===
            accountId
    ) || null;
}


function getCreditCardAccount(
    card
) {

    if (!card) {
        return null;
    }

    return accounts.find(
        account =>
            account.id ===
            card.account_id
    ) || null;
}


function calculateAccountBalanceAsOf(
    accountId,
    dateValue
) {

    const account =
        accounts.find(
            item =>
                item.id ===
                accountId
        );

    if (!account) {
        return 0;
    }

    let balance =
        Number(
            account.opening_balance
        );

    transactions
        .filter(
            transaction =>
                transaction.account_id ===
                    accountId
                &&
                (
                    !dateValue ||
                    transaction.transaction_date <=
                        dateValue
                )
        )
        .forEach(
            function (transaction) {

                const amount =
                    Number(
                        transaction.amount
                    );

                balance +=
                    transaction.type ===
                        "income"
                        ? amount
                        : -amount;
            }
        );

    balance +=
        getTransferAccountDelta(
            transfers.filter(
                transfer =>
                    !dateValue ||
                    transfer.transfer_date <=
                        dateValue
            ),
            accountId
        );

    return balance;
}


function getCurrentCreditCardOutstanding(
    card
) {

    return getCreditCardOutstanding(
        calculateAccountBalance(
            card.account_id
        )
    );
}


function getCreditCardOutstandingAsOf(
    card,
    dateValue
) {

    return getCreditCardOutstanding(
        calculateAccountBalanceAsOf(
            card.account_id,
            dateValue
        )
    );
}


function formatIsoLocalDate(
    date
) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}


function getNextCreditCardStatementDate(
    card,
    baseDate = getTodayDate()
) {

    const statementDay =
        Number(
            card?.statement_day
        );

    if (
        !Number.isInteger(
            statementDay
        )
        ||
        statementDay < 1
        ||
        statementDay > 31
    ) {
        return null;
    }

    const base =
        new Date(
            `${baseDate}T00:00:00`
        );

    if (
        Number.isNaN(
            base.getTime()
        )
    ) {
        return null;
    }

    const makeCandidate =
        function (
            year,
            monthIndex
        ) {

            const lastDay =
                new Date(
                    year,
                    monthIndex + 1,
                    0
                ).getDate();

            return new Date(
                year,
                monthIndex,
                Math.min(
                    statementDay,
                    lastDay
                )
            );
        };

    let candidate =
        makeCandidate(
            base.getFullYear(),
            base.getMonth()
        );

    if (
        candidate <
        base
    ) {

        candidate =
            makeCandidate(
                base.getMonth() ===
                    11
                    ? base.getFullYear() + 1
                    : base.getFullYear(),
                (
                    base.getMonth() + 1
                ) % 12
            );
    }

    return formatIsoLocalDate(
        candidate
    );
}


function getCreditCardStatementPayments(
    card,
    statement
) {

    if (
        !card ||
        !statement
    ) {
        return 0;
    }

    return getStatementPayments(
        transfers,
        card.account_id,
        statement.statement_date,
        getTodayDate()
    );
}


function getLastCreditCardPayment(
    card
) {

    return transfers
        .filter(
            transfer =>
                !transfer.deleted_at &&
                transfer.to_account_id ===
                    card.account_id
        )
        .sort(
            (
                first,
                second
            ) =>
                second.transfer_date
                    .localeCompare(
                        first.transfer_date
                    )
                ||
                String(
                    second.created_at ||
                    ""
                ).localeCompare(
                    String(
                        first.created_at ||
                        ""
                    )
                )
        )[0] || null;
}


function getCreditCardProjection(
    card
) {

    const latestStatement =
        getLatestCreditCardStatement(
            creditCardStatements,
            card.id
        );

    const paymentsSinceStatement =
        getCreditCardStatementPayments(
            card,
            latestStatement
        );

    return projectCreditCard({
        currentOutstanding:
            getCurrentCreditCardOutstanding(
                card
            ),
        latestStatement,
        paymentsSinceStatement,
        annualRate:
            card.purchase_apr,
        minimumPaymentPercent:
            card.minimum_payment_percent,
        minimumPaymentFloor:
            card.minimum_payment_floor,
        today:
            getTodayDate(),
        nextStatementDate:
            getNextCreditCardStatementDate(
                card
            )
    });
}


function populateCreditCardFeatureSelects() {

    const cardSelectIds = [
        "credit-card-statement-card",
        "credit-card-payment-card",
        "credit-card-reconcile-card"
    ];

    cardSelectIds.forEach(
        function (id) {

            const select =
                document.getElementById(
                    id
                );

            if (!select) {
                return;
            }

            const selected =
                select.value ||
                selectedCreditCardId ||
                "";

            select.innerHTML =
                '<option value="">Select card</option>';

            creditCards
                .filter(
                    card =>
                        card.is_active ||
                        card.id ===
                            selected
                )
                .forEach(
                    function (card) {

                        addSelectOption(
                            select,
                            card.id,
                            card.card_name +
                                (
                                    card.is_active
                                        ? ""
                                        : " (Inactive)"
                                )
                        );
                    }
                );

            select.value =
                creditCards.some(
                    card =>
                        card.id ===
                            selected
                )
                    ? selected
                    : "";
        }
    );

    const settlementSelect =
        document.getElementById(
            "credit-card-settlement-account"
        );

    if (settlementSelect) {

        const selected =
            settlementSelect.value;

        settlementSelect.innerHTML =
            '<option value="">Choose later</option>';

        accounts
            .filter(
                account =>
                    account.is_active &&
                    account.account_type !==
                        "credit_card"
            )
            .forEach(
                function (account) {

                    addSelectOption(
                        settlementSelect,
                        account.id,
                        account.name
                    );
                }
            );

        settlementSelect.value =
            accounts.some(
                account =>
                    account.id ===
                        selected
            )
                ? selected
                : "";
    }

    updateCreditCardPaymentSourceOptions();
}


function updateCreditCardPaymentSourceOptions() {

    const cardSelect =
        document.getElementById(
            "credit-card-payment-card"
        );

    const sourceSelect =
        document.getElementById(
            "credit-card-payment-from"
        );

    if (
        !cardSelect ||
        !sourceSelect
    ) {
        return;
    }

    const card =
        getCreditCardById(
            cardSelect.value
        );

    const selected =
        sourceSelect.value ||
        card?.settlement_account_id ||
        "";

    sourceSelect.innerHTML =
        '<option value="">Select account</option>';

    accounts
        .filter(
            account =>
                account.is_active &&
                account.account_type !==
                    "credit_card" &&
                account.id !==
                    card?.account_id
        )
        .forEach(
            function (account) {

                addSelectOption(
                    sourceSelect,
                    account.id,
                    account.name
                );
            }
        );

    sourceSelect.value =
        accounts.some(
            account =>
                account.id ===
                    selected
        )
            ? selected
            : "";
}


function updateCreditCardPaymentAmount() {

    const card =
        getCreditCardById(
            document.getElementById(
                "credit-card-payment-card"
            )?.value
        );

    const mode =
        document.getElementById(
            "credit-card-payment-mode"
        )?.value;

    const amountInput =
        document.getElementById(
            "credit-card-payment-amount"
        );

    if (
        !card ||
        !amountInput
    ) {
        return;
    }

    if (
        mode ===
        "custom"
    ) {
        amountInput.readOnly =
            false;

        return;
    }

    const latestStatement =
        getLatestCreditCardStatement(
            creditCardStatements,
            card.id
        );

    const payments =
        getCreditCardStatementPayments(
            card,
            latestStatement
        );

    const projection =
        getCreditCardProjection(
            card
        );

    let amount =
        0;

    if (
        mode ===
        "statement"
    ) {

        amount =
            getRemainingStatementDue(
                latestStatement,
                payments
            );

    } else if (
        mode ===
        "outstanding"
    ) {

        amount =
            getCurrentCreditCardOutstanding(
                card
            );

    } else if (
        mode ===
        "minimum"
    ) {

        amount =
            latestStatement
                ? Number(
                    latestStatement.minimum_payment
                )
                : projection
                    .estimatedMinimumPayment;
    }

    amountInput.value =
        Number(amount)
            .toFixed(
                2
            );

    amountInput.readOnly =
        true;
}


function renderCreditCardDashboardSummary() {

    if (
        !dashboardCreditCardSummary ||
        !dashboardCreditCardTotals ||
        !dashboardCreditCardList
    ) {
        return;
    }

    const activeCards =
        creditCards.filter(
            card =>
                card.is_active
        );

    dashboardCreditCardSummary.hidden =
        activeCards.length ===
        0;

    if (!activeCards.length) {
        dashboardCreditCardTotals.innerHTML =
            "";

        dashboardCreditCardList.innerHTML =
            "";

        return;
    }

    const totalOutstanding =
        activeCards.reduce(
            (
                total,
                card
            ) =>
                total +
                getCurrentCreditCardOutstanding(
                    card
                ),
            0
        );

    const totalLimit =
        activeCards.reduce(
            (
                total,
                card
            ) =>
                total +
                Number(
                    card.credit_limit
                ),
            0
        );

    const totalAvailable =
        Math.max(
            0,
            totalLimit -
            totalOutstanding
        );

    const utilisation =
        totalLimit >
        0
            ? (
                totalOutstanding /
                totalLimit
            ) *
                100
            : 0;

    dashboardCreditCardTotals.innerHTML =
        [
            [
                "Total Card Debt",
                formatMoney(
                    totalOutstanding
                ),
                "Across active cards"
            ],
            [
                "Available Credit",
                formatMoney(
                    totalAvailable
                ),
                `of ${formatMoney(totalLimit)} total limit`
            ],
            [
                "Overall Utilisation",
                `${utilisation.toFixed(1)}%`,
                "Outstanding ÷ credit limits"
            ]
        ]
            .map(
                item =>
                    `
                        <article class="credit-card-dashboard-total">
                            <span>${item[0]}</span>
                            <strong>${item[1]}</strong>
                            <p>${item[2]}</p>
                        </article>
                    `
            )
            .join(
                ""
            );

    dashboardCreditCardList.innerHTML =
        "";

    activeCards
        .slice()
        .sort(
            function (
                first,
                second
            ) {

                const firstDue =
                    getLatestCreditCardStatement(
                        creditCardStatements,
                        first.id
                    )?.due_date ||
                    "9999-12-31";

                const secondDue =
                    getLatestCreditCardStatement(
                        creditCardStatements,
                        second.id
                    )?.due_date ||
                    "9999-12-31";

                return firstDue
                    .localeCompare(
                        secondDue
                    );
            }
        )
        .slice(
            0,
            4
        )
        .forEach(
            function (card) {

                const statement =
                    getLatestCreditCardStatement(
                        creditCardStatements,
                        card.id
                    );

                const outstanding =
                    getCurrentCreditCardOutstanding(
                        card
                    );

                const row =
                    document.createElement(
                        "button"
                    );

                row.type =
                    "button";

                row.className =
                    "credit-card-dashboard-row";

                const copy =
                    document.createElement(
                        "div"
                    );

                const name =
                    document.createElement(
                        "strong"
                    );

                name.textContent =
                    card.card_name;

                const meta =
                    document.createElement(
                        "span"
                    );

                meta.textContent =
                    statement?.due_date
                        ? `Due ${formatDate(statement.due_date)}`
                        : "No statement saved";

                copy.append(
                    name,
                    meta
                );

                const amount =
                    document.createElement(
                        "div"
                    );

                amount.className =
                    "amount";

                amount.innerHTML =
                    `<strong>${formatMoney(outstanding)}</strong><span>outstanding</span>`;

                row.append(
                    copy,
                    amount
                );

                row.addEventListener(
                    "click",
                    function () {

                        selectedCreditCardId =
                            card.id;

                        navigateToPage(
                            "credit-cards"
                        );

                        renderCreditCardsPage();
                    }
                );

                dashboardCreditCardList
                    .appendChild(
                        row
                    );
            }
        );
}


function renderCreditCardSummaryCards() {

    const ids = {
        outstanding:
            document.getElementById(
                "credit-card-total-outstanding"
            ),
        limit:
            document.getElementById(
                "credit-card-total-limit"
            ),
        available:
            document.getElementById(
                "credit-card-total-available"
            ),
        utilisation:
            document.getElementById(
                "credit-card-total-utilisation"
            )
    };

    if (
        !ids.outstanding ||
        !ids.limit ||
        !ids.available ||
        !ids.utilisation
    ) {
        return;
    }

    const activeCards =
        creditCards.filter(
            card =>
                card.is_active
        );

    const outstanding =
        activeCards.reduce(
            (
                total,
                card
            ) =>
                total +
                getCurrentCreditCardOutstanding(
                    card
                ),
            0
        );

    const limit =
        activeCards.reduce(
            (
                total,
                card
            ) =>
                total +
                Number(
                    card.credit_limit
                ),
            0
        );

    ids.outstanding.textContent =
        formatMoney(
            outstanding
        );

    ids.limit.textContent =
        formatMoney(
            limit
        );

    ids.available.textContent =
        formatMoney(
            Math.max(
                0,
                limit -
                outstanding
            )
        );

    ids.utilisation.textContent =
        limit >
        0
            ? `${(
                outstanding /
                limit *
                100
            ).toFixed(1)}%`
            : "0%";
}


function renderCreditCardList() {

    if (!creditCardList) {
        return;
    }

    creditCardList.innerHTML =
        "";

    if (!creditCards.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-state";

        empty.textContent =
            "No credit cards yet. Add one below to start tracking card debt.";

        creditCardList.appendChild(
            empty
        );

        return;
    }

    creditCards.forEach(
        function (card) {

            const outstanding =
                getCurrentCreditCardOutstanding(
                    card
                );

            const available =
                getAvailableCredit(
                    card.credit_limit,
                    outstanding
                );

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "credit-card-list-item";

            if (
                card.id ===
                selectedCreditCardId
            ) {
                button.classList.add(
                    "active"
                );
            }

            if (!card.is_active) {
                button.classList.add(
                    "inactive"
                );
            }

            button.innerHTML =
                `
                    <div class="credit-card-list-item-header">
                        <strong>${escapeOnboardingHtml(card.card_name)}</strong>
                        <span>${card.last_four ? "•••• " + escapeOnboardingHtml(card.last_four) : ""}</span>
                    </div>
                    <div class="credit-card-list-item-footer">
                        <span>Outstanding</span>
                        <strong>${formatMoney(outstanding)}</strong>
                    </div>
                    <div class="credit-card-list-item-footer">
                        <span>Available</span>
                        <strong>${formatMoney(available)}</strong>
                    </div>
                `;

            button.addEventListener(
                "click",
                function () {

                    selectedCreditCardId =
                        card.id;

                    renderCreditCardsPage();
                }
            );

            creditCardList.appendChild(
                button
            );
        }
    );
}


function renderCreditCardDetail() {

    if (!creditCardDetail) {
        return;
    }

    const card =
        getCreditCardById(
            selectedCreditCardId
        );

    if (!card) {

        creditCardDetail.innerHTML =
            `
                <div class="credit-card-empty-detail">
                    <strong>Select a credit card</strong>
                    <p>Card details, statements, projections and payment tools will appear here.</p>
                </div>
            `;

        return;
    }

    const outstanding =
        getCurrentCreditCardOutstanding(
            card
        );

    const available =
        getAvailableCredit(
            card.credit_limit,
            outstanding
        );

    const utilisation =
        getCreditUtilisation(
            card.credit_limit,
            outstanding
        );

    const statement =
        getLatestCreditCardStatement(
            creditCardStatements,
            card.id
        );

    const statementPayments =
        getCreditCardStatementPayments(
            card,
            statement
        );

    const remainingStatement =
        getRemainingStatementDue(
            statement,
            statementPayments
        );

    const projection =
        getCreditCardProjection(
            card
        );

    const lastPayment =
        getLastCreditCardPayment(
            card
        );

    const reconciliation =
        getLatestCreditCardReconciliation(
            creditCardReconciliations,
            card.id
        );

    const reconciliationOutstanding =
        reconciliation
            ? getCreditCardOutstandingAsOf(
                card,
                reconciliation.as_of_date
            )
            : null;

    const reconciliationDifference =
        reconciliation
            ? Number(
                reconciliation.bank_outstanding
            ) -
                reconciliationOutstanding
            : null;

    const statementStatus =
        statement
            ? remainingStatement <=
                0.009
                ? "paid"
                : (
                    statement.due_date <
                    getTodayDate()
                        ? "due"
                        : "open"
                )
            : "";

    const progress =
        statement &&
        Number(
            statement.amount_due ??
            statement.statement_balance
        ) >
        0
            ? Math.min(
                100,
                (
                    statementPayments /
                    Number(
                        statement.amount_due ??
                        statement.statement_balance
                    )
                ) *
                    100
            )
            : 0;

    creditCardDetail.innerHTML =
        `
            <div class="credit-card-detail-hero">
                <div class="credit-card-detail-heading">
                    <div>
                        <strong>${escapeOnboardingHtml(card.card_name)}</strong>
                        <small>${[
                            card.issuer,
                            card.last_four ? "•••• " + card.last_four : ""
                        ].filter(Boolean).map(escapeOnboardingHtml).join(" • ")}</small>
                    </div>
                    <span>${card.is_active ? "Active" : "Inactive"}</span>
                </div>

                <div class="credit-card-detail-outstanding">
                    <span>Current Outstanding</span>
                    <strong>${formatMoney(outstanding)}</strong>
                </div>

                <div class="credit-card-limit-progress">
                    <span style="width: ${Math.min(100, utilisation).toFixed(2)}%"></span>
                </div>

                <div class="credit-card-hero-meta">
                    <span>Available ${formatMoney(available)}</span>
                    <span>${utilisation.toFixed(1)}% of ${formatMoney(card.credit_limit)}</span>
                </div>
            </div>

            <div class="credit-card-detail-sections">

                <section class="credit-card-detail-section">
                    <h3>Statement</h3>
                    <div class="credit-card-detail-row">
                        <span>Statement Balance</span>
                        <strong>${statement ? formatMoney(statement.statement_balance) : "Not recorded"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Statement Date</span>
                        <strong>${statement ? formatDate(statement.statement_date) : "—"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Payment Due Date</span>
                        <strong>${statement ? formatDate(statement.due_date) : "—"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Minimum Payment</span>
                        <strong>${statement ? formatMoney(statement.minimum_payment) : "—"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Remaining Statement Due</span>
                        <strong>${statement ? formatMoney(remainingStatement) : "—"}</strong>
                    </div>
                    ${statement ? `
                        <div class="credit-card-payment-progress">
                            <span style="width: ${progress.toFixed(2)}%"></span>
                        </div>
                        <div class="credit-card-payment-progress-copy">
                            <span>${formatMoney(statementPayments)} paid since statement</span>
                            <span class="credit-card-status-badge ${statementStatus}">
                                ${statementStatus === "paid" ? "Paid" : statementStatus === "due" ? "Overdue" : "Open"}
                            </span>
                        </div>
                    ` : ""}
                </section>

                <section class="credit-card-detail-section">
                    <h3>Kira Projection</h3>
                    <div class="credit-card-detail-row">
                        <span>Purchase APR</span>
                        <strong>${Number(card.purchase_apr).toFixed(2)}% p.a.</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Estimated Finance Charge</span>
                        <strong>${formatMoney(projection.estimatedFinanceCharge)}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Projected Next Statement</span>
                        <strong>${formatMoney(projection.projectedStatementBalance)}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Estimated Next Minimum</span>
                        <strong>${formatMoney(projection.estimatedMinimumPayment)}</strong>
                    </div>
                    <div class="credit-card-estimate-notice">
                        Estimates use your configured card rules and a simplified daily-balance assumption. Your bank statement remains the source of truth.
                    </div>
                </section>

                <section class="credit-card-detail-section">
                    <h3>Payment</h3>
                    <div class="credit-card-detail-row">
                        <span>Last Payment</span>
                        <strong>${lastPayment ? formatMoney(lastPayment.amount) : "—"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Last Payment Date</span>
                        <strong>${lastPayment ? formatDate(lastPayment.transfer_date) : "—"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Default Payment Account</span>
                        <strong>${getAccountName(card.settlement_account_id) || "Not set"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Interest-Free Period</span>
                        <strong>${Number(card.interest_free_days)} days</strong>
                    </div>
                </section>

                <section class="credit-card-detail-section">
                    <h3>Reconciliation</h3>
                    <div class="credit-card-detail-row">
                        <span>Latest Bank Outstanding</span>
                        <strong>${reconciliation ? formatMoney(reconciliation.bank_outstanding) : "Not checked"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Kira on Same Date</span>
                        <strong>${reconciliation ? formatMoney(reconciliationOutstanding) : "—"}</strong>
                    </div>
                    <div class="credit-card-detail-row">
                        <span>Difference</span>
                        <strong>${reconciliation ? formatMoney(reconciliationDifference) : "—"}</strong>
                    </div>
                    ${reconciliation ? `
                        <div class="credit-card-reconcile-notice ${Math.abs(reconciliationDifference) >= 0.01 ? "warning" : ""}">
                            Checked ${formatDate(reconciliation.as_of_date)}. A difference means Kira and the bank do not currently agree; review missing purchases, fees, refunds or payments before adjusting anything.
                        </div>
                    ` : `
                        <div class="credit-card-reconcile-notice">
                            Save the outstanding shown by your banking app to compare it with Kira.
                        </div>
                    `}
                </section>

            </div>

            <div class="credit-card-detail-actions">
                <button type="button" class="secondary-button" data-credit-card-action="transaction">
                    Add Card Transaction
                </button>
                <button type="button" class="secondary-button" data-credit-card-action="statement">
                    Add Statement
                </button>
                <button type="button" class="primary-button" data-credit-card-action="payment">
                    Pay Card
                </button>
                <button type="button" class="secondary-button" data-credit-card-action="reconcile">
                    Reconcile
                </button>
                <button type="button" class="secondary-button" data-credit-card-action="edit">
                    Edit Card
                </button>
                <button type="button" class="secondary-button" data-credit-card-action="toggle">
                    ${card.is_active ? "Deactivate" : "Reactivate"}
                </button>
            </div>
        `;

    creditCardDetail
        .querySelectorAll(
            "[data-credit-card-action]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const action =
                            button.dataset
                                .creditCardAction;

                        if (
                            action ===
                            "transaction"
                        ) {

                            resetTransactionForm(
                                true
                            );

                            transactionTypeSelect.value =
                                "expense";

                            refreshTransactionDropdowns({
                                account_id:
                                    card.account_id,
                                payment_method_id:
                                    card.payment_method_id
                            });

                            navigateToPage(
                                "transactions",
                                {
                                    scrollToTop:
                                        false
                                }
                            );

                            requestAnimationFrame(
                                () =>
                                    transactionForm
                                        .scrollIntoView({
                                            behavior:
                                                "smooth",
                                            block:
                                                "start"
                                        })
                            );

                            return;
                        }

                        if (
                            action ===
                            "statement"
                        ) {

                            const select =
                                document.getElementById(
                                    "credit-card-statement-card"
                                );

                            if (select) {
                                select.value =
                                    card.id;
                            }

                            creditCardStatementForm
                                ?.scrollIntoView({
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                });

                            return;
                        }

                        if (
                            action ===
                            "payment"
                        ) {

                            const select =
                                document.getElementById(
                                    "credit-card-payment-card"
                                );

                            if (select) {
                                select.value =
                                    card.id;
                            }

                            updateCreditCardPaymentSourceOptions();
                            updateCreditCardPaymentAmount();

                            creditCardPaymentForm
                                ?.scrollIntoView({
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                });

                            return;
                        }

                        if (
                            action ===
                            "reconcile"
                        ) {

                            const select =
                                document.getElementById(
                                    "credit-card-reconcile-card"
                                );

                            if (select) {
                                select.value =
                                    card.id;
                            }

                            const bankOutstanding =
                                document.getElementById(
                                    "credit-card-bank-outstanding"
                                );

                            if (
                                bankOutstanding
                            ) {

                                bankOutstanding.value =
                                    outstanding.toFixed(
                                        2
                                    );
                            }

                            creditCardReconcileForm
                                ?.scrollIntoView({
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                });

                            return;
                        }

                        if (
                            action ===
                            "edit"
                        ) {

                            editCreditCard(
                                card.id
                            );

                            return;
                        }

                        if (
                            action ===
                            "toggle"
                        ) {

                            button.disabled =
                                true;

                            try {

                                await setCreditCardActive(
                                    card,
                                    !card.is_active
                                );

                                await refreshCreditCardFeature();

                            } catch (
                                error
                            ) {

                                alert(
                                    error.message
                                );
                            }
                        }
                    }
                );
            }
        );
}


function renderCreditCardsPage() {

    renderCreditCardSummaryCards();
    renderCreditCardList();
    populateCreditCardFeatureSelects();
    renderCreditCardDetail();
    updateCreditCardPaymentAmount();
}


async function refreshCreditCardFeature() {

    await loadAccounts(
        true
    );

    await loadPaymentMethods(
        true
    );

    await loadCreditCardData(
        true
    );

    renderCreditCardsPage();
    renderCreditCardDashboardSummary();
    refreshTransactionDropdowns();
    refreshRecurringFormOptions();
    updateDashboard();
}


function resetCreditCardForm() {

    editingCreditCardId =
        null;

    creditCardForm
        ?.reset();

    if (
        creditCardFormTitle
    ) {

        creditCardFormTitle.textContent =
            "Add Credit Card";
    }

    if (
        creditCardOpeningOutstandingField
    ) {

        creditCardOpeningOutstandingField
            .classList
            .remove(
                "hidden-button"
            );
    }

    const openingInput =
        document.getElementById(
            "credit-card-opening-outstanding"
        );

    if (openingInput) {
        openingInput.required =
            true;
        openingInput.value =
            "0";
    }

    const defaults = {
        "credit-card-cash-apr":
            "18",
        "credit-card-min-payment-percent":
            "5",
        "credit-card-min-payment-floor":
            "50",
        "credit-card-late-fee-percent":
            "1",
        "credit-card-late-fee-min":
            "10",
        "credit-card-late-fee-max":
            "100",
        "credit-card-interest-free-days":
            "20"
    };

    Object.entries(
        defaults
    ).forEach(
        function (
            [
                id,
                value
            ]
        ) {

            const input =
                document.getElementById(
                    id
                );

            if (input) {
                input.value =
                    value;
            }
        }
    );

    cancelCreditCardEditButton
        ?.classList
        .add(
            "hidden-button"
        );

    if (creditCardMessage) {
        creditCardMessage.textContent =
            "";
    }

    populateCreditCardFeatureSelects();
}


function editCreditCard(
    cardId
) {

    const card =
        getCreditCardById(
            cardId
        );

    if (
        !card ||
        !creditCardForm
    ) {
        return;
    }

    editingCreditCardId =
        card.id;

    selectedCreditCardId =
        card.id;

    const values = {
        "credit-card-name":
            card.card_name,
        "credit-card-issuer":
            card.issuer || "",
        "credit-card-last-four":
            card.last_four || "",
        "credit-card-limit":
            card.credit_limit,
        "credit-card-purchase-apr":
            card.purchase_apr,
        "credit-card-cash-apr":
            card.cash_advance_apr,
        "credit-card-min-payment-percent":
            card.minimum_payment_percent,
        "credit-card-min-payment-floor":
            card.minimum_payment_floor,
        "credit-card-late-fee-percent":
            card.late_fee_percent,
        "credit-card-late-fee-min":
            card.late_fee_min,
        "credit-card-late-fee-max":
            card.late_fee_max,
        "credit-card-interest-free-days":
            card.interest_free_days,
        "credit-card-statement-day":
            card.statement_day || ""
    };

    Object.entries(
        values
    ).forEach(
        function (
            [
                id,
                value
            ]
        ) {

            const input =
                document.getElementById(
                    id
                );

            if (input) {
                input.value =
                    value;
            }
        }
    );

    const settlement =
        document.getElementById(
            "credit-card-settlement-account"
        );

    if (settlement) {
        settlement.value =
            card.settlement_account_id ||
            "";
    }

    const openingInput =
        document.getElementById(
            "credit-card-opening-outstanding"
        );

    if (openingInput) {
        openingInput.required =
            false;
    }

    creditCardOpeningOutstandingField
        ?.classList
        .add(
            "hidden-button"
        );

    if (creditCardFormTitle) {
        creditCardFormTitle.textContent =
            "Edit Credit Card";
    }

    cancelCreditCardEditButton
        ?.classList
        .remove(
            "hidden-button"
        );

    creditCardForm
        .scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
}


function getCreditCardFormValues() {

    const value =
        id =>
            document.getElementById(
                id
            )?.value
            ?.trim?.()
            ??
            document.getElementById(
                id
            )?.value
            ??
            "";

    return {
        cardName:
            value(
                "credit-card-name"
            ),
        issuer:
            value(
                "credit-card-issuer"
            ),
        lastFour:
            value(
                "credit-card-last-four"
            ),
        creditLimit:
            value(
                "credit-card-limit"
            ),
        currentOutstanding:
            value(
                "credit-card-opening-outstanding"
            ),
        settlementAccountId:
            value(
                "credit-card-settlement-account"
            ),
        purchaseApr:
            value(
                "credit-card-purchase-apr"
            ),
        cashAdvanceApr:
            value(
                "credit-card-cash-apr"
            ),
        minimumPaymentPercent:
            value(
                "credit-card-min-payment-percent"
            ),
        minimumPaymentFloor:
            value(
                "credit-card-min-payment-floor"
            ),
        lateFeePercent:
            value(
                "credit-card-late-fee-percent"
            ),
        lateFeeMin:
            value(
                "credit-card-late-fee-min"
            ),
        lateFeeMax:
            value(
                "credit-card-late-fee-max"
            ),
        interestFreeDays:
            value(
                "credit-card-interest-free-days"
            ),
        statementDay:
            value(
                "credit-card-statement-day"
            )
    };
}


function validateCreditCardValues(
    values
) {

    if (!values.cardName) {
        return "Enter a card name.";
    }

    if (
        values.lastFour &&
        !/^[0-9]{4}$/.test(
            values.lastFour
        )
    ) {
        return "Last 4 digits must contain exactly four numbers.";
    }

    const numericFields = [
        [
            values.creditLimit,
            "Enter a valid credit limit."
        ],
        [
            values.purchaseApr,
            "Enter the purchase APR from your card terms."
        ],
        [
            values.cashAdvanceApr,
            "Enter a valid cash advance APR."
        ],
        [
            values.minimumPaymentPercent,
            "Enter a valid minimum payment percentage."
        ],
        [
            values.minimumPaymentFloor,
            "Enter a valid minimum payment floor."
        ],
        [
            values.lateFeePercent,
            "Enter a valid late fee percentage."
        ],
        [
            values.lateFeeMin,
            "Enter a valid late fee minimum."
        ],
        [
            values.lateFeeMax,
            "Enter a valid late fee maximum."
        ],
        [
            values.interestFreeDays,
            "Enter valid interest-free days."
        ]
    ];

    for (
        const [
            field,
            message
        ] of numericFields
    ) {

        if (
            field ===
            ""
            ||
            !Number.isFinite(
                Number(
                    field
                )
            )
            ||
            Number(
                field
            ) <
            0
        ) {
            return message;
        }
    }

    if (
        editingCreditCardId ===
        null
        &&
        (
            values.currentOutstanding ===
                ""
            ||
            !Number.isFinite(
                Number(
                    values.currentOutstanding
                )
            )
            ||
            Number(
                values.currentOutstanding
            ) <
            0
        )
    ) {
        return "Enter the current outstanding shown by your bank.";
    }

    if (
        Number(
            values.lateFeeMax
        ) <
        Number(
            values.lateFeeMin
        )
    ) {
        return "Late fee maximum cannot be below the late fee minimum.";
    }

    if (
        values.statementDay &&
        (
            !Number.isInteger(
                Number(
                    values.statementDay
                )
            )
            ||
            Number(
                values.statementDay
            ) <
            1
            ||
            Number(
                values.statementDay
            ) >
            31
        )
    ) {
        return "Statement day must be between 1 and 31.";
    }

    return "";
}


async function recordCreditCardPayment() {

    const card =
        getCreditCardById(
            document.getElementById(
                "credit-card-payment-card"
            )?.value
        );

    const fromAccountId =
        document.getElementById(
            "credit-card-payment-from"
        )?.value;

    const amount =
        Number(
            document.getElementById(
                "credit-card-payment-amount"
            )?.value
        );

    const paymentDate =
        document.getElementById(
            "credit-card-payment-date"
        )?.value;

    if (
        !card ||
        !fromAccountId ||
        !Number.isFinite(
            amount
        )
        ||
        amount <=
        0
        ||
        !paymentDate
    ) {
        throw new Error(
            "Choose the card, payment account, amount and payment date."
        );
    }

    await saveAccountTransfer({
        userId:
            currentUser.id,
        fromAccountId,
        toAccountId:
            card.account_id,
        amount,
        transferDate:
            paymentDate,
        description:
            `Credit card payment — ${card.card_name}`,
        notes:
            "Recorded from Credit Card Management."
    });

    selectedCreditCardId =
        card.id;

    await loadTransfers(
        true
    );

    renderCreditCardsPage();
    renderCreditCardDashboardSummary();
}


function syncPaymentMethodForSelectedCreditCard(
    accountSelect =
        transactionAccountSelect,
    paymentMethodSelect =
        transactionPaymentMethodSelect
) {

    if (
        !accountSelect ||
        !paymentMethodSelect
    ) {
        return;
    }

    const card =
        getCreditCardByAccountId(
            accountSelect.value
        );

    if (
        card &&
        transactionTypeSelect?.value !==
            "transfer"
    ) {

        paymentMethodSelect.value =
            card.payment_method_id;

        paymentMethodSelect.disabled =
            true;

    } else {

        paymentMethodSelect.disabled =
            false;
    }
}


function syncRecurringPaymentMethodForSelectedCreditCard() {

    if (
        !recurringAccountSelect ||
        !recurringPaymentMethodSelect
    ) {
        return;
    }

    const card =
        getCreditCardByAccountId(
            recurringAccountSelect.value
        );

    if (card) {

        recurringPaymentMethodSelect.value =
            card.payment_method_id;

        recurringPaymentMethodSelect.disabled =
            true;

    } else {

        recurringPaymentMethodSelect.disabled =
            false;
    }
}


creditCardForm
    ?.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();

            const values =
                getCreditCardFormValues();

            const validation =
                validateCreditCardValues(
                    values
                );

            if (validation) {

                creditCardMessage.textContent =
                    validation;

                return;
            }

            creditCardMessage.textContent =
                "Saving credit card...";

            try {

                if (
                    editingCreditCardId ===
                    null
                ) {

                    const created =
                        await createCreditCardProfile({
                            userId:
                                currentUser.id,
                            ...values
                        });

                    selectedCreditCardId =
                        created.id;

                } else {

                    const card =
                        getCreditCardById(
                            editingCreditCardId
                        );

                    await updateCreditCardProfile(
                        card,
                        values
                    );

                    selectedCreditCardId =
                        card.id;
                }

                resetCreditCardForm();

                await refreshCreditCardFeature();

                creditCardMessage.textContent =
                    "Credit card saved.";

            } catch (
                error
            ) {

                console.error(
                    "Save credit card error:",
                    error
                );

                creditCardMessage.textContent =
                    error.message ||
                    "Unable to save the credit card.";
            }
        }
    );


cancelCreditCardEditButton
    ?.addEventListener(
        "click",
        resetCreditCardForm
    );


creditCardStatementForm
    ?.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();

            creditCardStatementMessage.textContent =
                "Saving statement...";

            try {

                const creditCardId =
                    document.getElementById(
                        "credit-card-statement-card"
                    ).value;

                await saveCreditCardStatement({
                    userId:
                        currentUser.id,
                    creditCardId,
                    statementDate:
                        document.getElementById(
                            "credit-card-statement-date"
                        ).value,
                    dueDate:
                        document.getElementById(
                            "credit-card-due-date"
                        ).value,
                    statementBalance:
                        document.getElementById(
                            "credit-card-statement-balance"
                        ).value,
                    amountDue:
                        document.getElementById(
                            "credit-card-amount-due"
                        ).value,
                    minimumPayment:
                        document.getElementById(
                            "credit-card-minimum-payment"
                        ).value,
                    financeCharge:
                        document.getElementById(
                            "credit-card-finance-charge"
                        ).value,
                    instalmentDue:
                        document.getElementById(
                            "credit-card-instalment-due"
                        ).value,
                    pastDueAmount:
                        document.getElementById(
                            "credit-card-past-due"
                        ).value,
                    overLimitAmount:
                        document.getElementById(
                            "credit-card-over-limit"
                        ).value,
                    notes:
                        document.getElementById(
                            "credit-card-statement-notes"
                        ).value
                });

                selectedCreditCardId =
                    creditCardId;

                await loadCreditCardData(
                    true
                );

                renderCreditCardsPage();
                renderCreditCardDashboardSummary();

                creditCardStatementMessage.textContent =
                    "Statement saved.";

            } catch (
                error
            ) {

                console.error(
                    "Save card statement error:",
                    error
                );

                creditCardStatementMessage.textContent =
                    error.message ||
                    "Unable to save the statement.";
            }
        }
    );


creditCardPaymentForm
    ?.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();

            creditCardPaymentMessage.textContent =
                "Recording payment...";

            try {

                await recordCreditCardPayment();

                creditCardPaymentMessage.textContent =
                    "Payment recorded as an account transfer.";

            } catch (
                error
            ) {

                console.error(
                    "Record card payment error:",
                    error
                );

                creditCardPaymentMessage.textContent =
                    error.message ||
                    "Unable to record the card payment.";
            }
        }
    );


creditCardReconcileForm
    ?.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();

            creditCardReconcileMessage.textContent =
                "Saving reconciliation...";

            try {

                const creditCardId =
                    document.getElementById(
                        "credit-card-reconcile-card"
                    ).value;

                await saveCreditCardReconciliation({
                    userId:
                        currentUser.id,
                    creditCardId,
                    asOfDate:
                        document.getElementById(
                            "credit-card-reconcile-date"
                        ).value,
                    bankOutstanding:
                        document.getElementById(
                            "credit-card-bank-outstanding"
                        ).value,
                    notes:
                        document.getElementById(
                            "credit-card-reconcile-notes"
                        ).value
                });

                selectedCreditCardId =
                    creditCardId;

                await loadCreditCardData(
                    true
                );

                renderCreditCardsPage();

                creditCardReconcileMessage.textContent =
                    "Reconciliation saved.";

            } catch (
                error
            ) {

                console.error(
                    "Save card reconciliation error:",
                    error
                );

                creditCardReconcileMessage.textContent =
                    error.message ||
                    "Unable to save the reconciliation.";
            }
        }
    );


document
    .getElementById(
        "credit-card-payment-card"
    )
    ?.addEventListener(
        "change",
        function () {

            updateCreditCardPaymentSourceOptions();
            updateCreditCardPaymentAmount();
        }
    );


document
    .getElementById(
        "credit-card-payment-mode"
    )
    ?.addEventListener(
        "change",
        updateCreditCardPaymentAmount
    );


dashboardCreditCardViewAll
    ?.addEventListener(
        "click",
        function () {

            navigateToPage(
                "credit-cards"
            );
        }
    );


const cardDateDefaults = [
    "credit-card-payment-date",
    "credit-card-reconcile-date"
];

cardDateDefaults.forEach(
    function (id) {

        const input =
            document.getElementById(
                id
            );

        if (
            input &&
            !input.value
        ) {

            input.value =
                getTodayDate();
        }
    }
);


// ======================================================
// ACCOUNTS
// ======================================================

async function loadAccounts(throwOnError = false) {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("accounts")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: true
                }
            );

    if (error) {
        if (throwOnError) throw error;

        accountMessage.textContent =
            "Unable to load account entries. Please refresh and try again.";

        console.error(error);

        return;
    }

    accounts =
        data || [];

    accountMessage.textContent = "";

    renderAccounts();

    // Keep native dashboard totals current after account edits or deletion.
    if (isNativeApp) {
        updateDashboard();
        renderPlanningTools();
    }

}


function renderAccounts() {

    accountList.innerHTML = "";

    renderSetupChecklist();

    const managedAccounts =
        accounts.filter(
            account =>
                account.account_type !==
                    "credit_card"
        );

    if (!managedAccounts.length) {

        renderEmptyState(
            accountList,
            {
                title:
                    "No accounts yet",

                description:
                    "Add where you keep money so Kira can track balances and transactions accurately.",

                actionLabel:
                    "Add account",

                actionPage:
                    "accounts",

                actionTargetId:
                    "account-form",

                focusId:
                    "account-name"
            }
        );

        return;
    }

    managedAccounts.forEach(
        function (account) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "management-card";

            if (!account.is_active) {

                card.classList.add(
                    "inactive"
                );
            }

            const left =
                document.createElement(
                    "div"
                );

            const name =
                document.createElement(
                    "p"
                );

            name.className =
                "management-name";

            name.textContent =
                account.name;

            const meta =
                document.createElement(
                    "p"
                );

            meta.className =
                "management-meta";

            meta.textContent =
                formatAccountType(
                    account.account_type
                );

            if (!account.is_active) {

                meta.textContent +=
                    " • Inactive";
            }

            left.appendChild(name);
            left.appendChild(meta);


            const right =
                document.createElement(
                    "div"
                );

            right.className =
                "management-actions";

            const balance =
                document.createElement(
                    "p"
                );

            balance.className =
                "management-value";

            const accountBalance =
                calculateAccountBalance(
                    account.id
                );

            balance.textContent =
                account.account_type ===
                    "credit_card"
                    ? `${formatMoney(
                        getCreditCardOutstanding(
                            accountBalance
                        )
                    )} outstanding`
                    : formatMoney(
                        accountBalance
                    );

            const buttons =
                createManagementButtons(
                    function () {

                        editAccount(
                            account.id
                        );
                    },

                    function () {

                        toggleAccountStatus(
                            account.id
                        );
                    },

                    account.is_active,

                    function () {

                        deleteAccountPermanently(
                            account
                        );
                    }
                );

            right.appendChild(balance);
            right.appendChild(buttons);

            card.appendChild(left);
            card.appendChild(right);

            accountList.appendChild(
                card
            );
        }
    );
}


// Phase 14C-1A: interaction state is scoped to these three management forms.
const managementSaveStates = new WeakMap();

function clearManagementFeedback(form, message, extraFields = []) {
    message.textContent = "";
    [...form.querySelectorAll('[aria-invalid="true"]'), ...extraFields].forEach(field => {
        field.removeAttribute("aria-invalid");
        const ids = (field.getAttribute("aria-describedby") || "")
            .split(" ").filter(id => id && id !== message.id);
        if (ids.length) field.setAttribute("aria-describedby", ids.join(" "));
        else field.removeAttribute("aria-describedby");
    });
}

function managementSaveError(error, label) {
    if (error?.code === "23505") {
        return "An entry with these details already exists. Check your " + label.toLowerCase() + " entries or use a different name.";
    }
    if (["42501", "PGRST301", "PGRST302", "PGRST303"].includes(error?.code)) {
        return "Your session may have expired or you do not have permission to save. Sign in again and try once more.";
    }
    return "We couldn't confirm whether your " + label.toLowerCase() + " was saved. Check your connection and refresh the list before trying again. Your entries have been kept.";
}

function configureManagementSave({ form, button, cancel, message, list, label,
    getEditId, reset, validate, save, refresh }) {
    const state = { pending: false };
    managementSaveStates.set(form, state);
    form.noValidate = true;
    button.textContent = "Add " + label;
    cancel.textContent = "Cancel";
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    message.setAttribute("aria-atomic", "true");
    form.addEventListener("input", () => {
        if (!state.pending) clearManagementFeedback(form, message);
    });
    // Also covers newly rendered list buttons while a save is in progress.
    list.addEventListener("click", event => {
        if (state.pending) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (state.pending) return;
        state.pending = true;
        const editId = getEditId();
        const disabledStates = new Map();
        const disable = element => {
            if (!disabledStates.has(element)) disabledStates.set(element, element.disabled);
            element.disabled = true;
        };
        // Lock synchronously, before validation and before the first request.
        form.querySelectorAll("button").forEach(disable);
        list.querySelectorAll("button").forEach(disable);
        button.textContent = "Saving...";
        form.setAttribute("aria-busy", "true");
        clearManagementFeedback(form, message);
        let invalid;
        let saved = false;
        try {
            if (!currentUser) {
                message.textContent = "Please sign in again before saving.";
                return;
            }
            invalid = validate();
            if (invalid) {
                message.textContent = invalid.message;
                invalid.field.setAttribute("aria-invalid", "true");
                const ids = new Set((invalid.field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
                ids.add(message.id);
                invalid.field.setAttribute("aria-describedby", [...ids].join(" "));
                return;
            }
            form.querySelectorAll("input, select, textarea").forEach(disable);
            const result = await save(editId);
            if (result.error) throw result.error;
            saved = true;
            reset();
            button.textContent = "Saving...";
            showTransactionSuccessSnackbar({
                title: label + (editId === null ? " added" : " updated"),
                message: "Your " + label.toLowerCase() + " has been saved successfully."
            });
            await refresh();
        } catch (error) {
            console.error(label + (saved ? " refresh error:" : " save error:"), error);
            message.textContent = saved
                ? "Your " + label.toLowerCase() + " was saved, but the list could not refresh. Refresh the page to see it."
                : managementSaveError(error, label);
        } finally {
            disabledStates.forEach((disabled, element) => { element.disabled = disabled; });
            state.pending = false;
            form.removeAttribute("aria-busy");
            button.textContent = getEditId() === null ? "Add " + label : "Save Changes";
            if (invalid) invalid.field.focus();
        }
    });
}

function validateManagementField(id, message, isValid) {
    const field = document.getElementById(id);
    return isValid(field) ? null : { field, message };
}

// Phase 14C-1B through 1D: one synchronous guard covers preparation and saving.
const financeSaveStates = new WeakMap();

function financeSavePending(form) {
    return financeSaveStates.get(form)?.pending === true;
}

function financeField(field, message, valid = !!field.value.trim()) {
    return valid ? null : { field, message };
}

function financeAmount(field, allowZero = false) {
    const value = Number(field.value);
    return financeField(field, allowZero
        ? "Enter a saved amount of zero or more, with no more than two decimal places."
        : "Enter an amount greater than zero, with no more than two decimal places.",
        field.value.trim() !== "" && Number.isFinite(value)
        && (allowZero ? value >= 0 : value > 0) && field.validity.valid);
}

function financeDate(field, label, optional = false) {
    return financeField(field, "Enter a valid " + label + ".",
        (optional && !field.value && !field.validity.badInput)
        || (!!field.value && field.validity.valid));
}

function configureFinanceSubmit({ form, button, cancel, message, label,
    getEditId, validate, extraControls = [], afterUnlock = () => {} }, submit) {
    if (!form) return;
    const state = { pending: false, extraControls };
    financeSaveStates.set(form, state);
    form.noValidate = true;
    if (!message) {
        message = document.createElement("p");
        message.id = form.id + "-message";
        message.className = "form-message";
        form.appendChild(message);
    }
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    message.setAttribute("aria-atomic", "true");
    button.textContent = "Add " + label;
    cancel.textContent = "Cancel";
    state.message = message;
    form.addEventListener("input", () => {
        if (!state.pending) clearFinanceFeedback(form);
    });
    extraControls.forEach(field => field.addEventListener("input", () => {
        if (!state.pending) clearFinanceFeedback(form);
    }));
    form.addEventListener("click", event => {
        if (state.pending) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (state.pending) return;
        state.pending = true;
        const disabledStates = new Map();
        const disable = element => {
            if (!element) return;
            if (!disabledStates.has(element)) disabledStates.set(element, element.disabled);
            element.disabled = true;
        };
        form.querySelectorAll("button").forEach(disable);
        button.textContent = "Saving...";
        form.setAttribute("aria-busy", "true");
        clearFinanceFeedback(form);
        let invalid;
        let saved = false;
        try {
            if (!currentUser) {
                message.textContent = "Please sign in again before saving.";
                return;
            }
            invalid = validate();
            if (invalid) {
                message.textContent = invalid.message;
                invalid.field.setAttribute("aria-invalid", "true");
                const ids = new Set((invalid.field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
                ids.add(message.id);
                invalid.field.setAttribute("aria-describedby", [...ids].join(" "));
                return;
            }
            form.querySelectorAll("input, select, textarea").forEach(disable);
            extraControls.forEach(disable);
            await submit(event, () => { saved = true; });
        } catch (error) {
            console.error(label + (saved ? " post-save error:" : " save error:"), error);
            message.textContent = saved
                ? "Your " + label.toLowerCase() + " was saved, but a follow-up step failed. Refresh the page to check it before making further changes."
                : managementSaveError(error, label);
        } finally {
            disabledStates.forEach((disabled, element) => { element.disabled = disabled; });
            state.pending = false;
            form.removeAttribute("aria-busy");
            button.textContent = getEditId() === null ? "Add " + label : "Save Changes";
            afterUnlock();
            if (invalid) invalid.field.focus();
        }
    });
}

function clearFinanceFeedback(form) {
    const state = financeSaveStates.get(form);
    if (state?.message) clearManagementFeedback(form, state.message, state.extraControls);
}

function validateRecurringSubmit() {
    return financeField(recurringNameInput, "Enter a recurring item name.")
        || financeField(recurringKindSelect, "Choose a recurring item kind.", ["recurring", "subscription"].includes(recurringKindSelect.value))
        || financeField(recurringTypeSelect, "Choose an income or expense type.", ["income", "expense"].includes(recurringTypeSelect.value))
        || financeField(recurringAccountSelect, "Choose an account.")
        || financeField(recurringCategorySelect, "Choose a category.")
        || (recurringCategorySelect.value === "__create_new__" && financeField(recurringCustomCategoryInput, "Enter a new category name."))
        || (recurringTypeSelect.value === "income" && financeField(recurringIncomeSourceSelect, "Choose an income source."))
        || financeAmount(recurringAmountInput)
        || financeField(recurringFrequencySelect, "Choose a frequency.", ["weekly", "monthly", "yearly"].includes(recurringFrequencySelect.value))
        || financeDate(recurringNextDueDateInput, "next due date")
        || (recurringReminderEnabled?.checked && financeField(recurringReminderDays,
            "Enter a whole number of reminder days from 0 to 30.",
            recurringReminderDays.value.trim() !== "" && Number.isInteger(Number(recurringReminderDays.value))
            && Number(recurringReminderDays.value) >= 0 && Number(recurringReminderDays.value) <= 30));
}

function validateTransactionSubmit() {
    const type =
        transactionTypeSelect.value;

    if (
        type === "transfer" &&
        editingTransactionId !== null
    ) {
        return {
            field:
                transactionTypeSelect,
            message:
                "Cancel the current transaction edit before creating a transfer."
        };
    }

    if (type === "transfer") {
        return financeField(transactionDescriptionInput, "Enter a transfer description.")
            || financeField(transferFromAccountSelect, "Choose the account money is leaving.")
            || financeField(transferToAccountSelect, "Choose the destination account.")
            || financeField(
                transferToAccountSelect,
                "Choose a different destination account.",
                transferFromAccountSelect.value !== transferToAccountSelect.value
            )
            || financeAmount(document.getElementById("amount"))
            || financeDate(dateInput, "transfer date");
    }

    return financeField(transactionDescriptionInput, "Enter a transaction description.")
        || financeField(transactionAccountSelect, "Choose an account.")
        || financeField(transactionTypeSelect, "Choose an income, expense or transfer type.", ["income", "expense", "transfer"].includes(type))
        || financeField(transactionCategorySelect, "Choose a category.")
        || (transactionCategorySelect.value === "__other__" && financeField(customCategoryInput, "Enter a new category name."))
        || (type === "income" && financeField(transactionIncomeSourceSelect, "Choose an income source."))
        || (type === "income" && transactionIncomeSourceSelect.value === "__other__"
            && financeField(customIncomeSourceInput, "Enter a new income source name."))
        || financeAmount(document.getElementById("amount"))
        || financeDate(dateInput, "transaction date")
        || (receiptOcrRunning && { field: transactionDescriptionInput,
            message: "Wait for receipt scanning to finish, then review the details and save." });
}


configureManagementSave({
    form: accountForm,
    button: saveAccountButton,
    cancel: cancelAccountEditButton,
    message: accountMessage,
    list: accountList,
    label: "Account",
    getEditId: () => editingAccountId,
    reset: resetAccountForm,
    validate: () => validateManagementField("account-name", "Enter an account name.", field => !!field.value.trim())
            || validateManagementField("account-type", "Choose an account type.", field => ["bank", "cash", "e_wallet", "savings", "other"].includes(field.value))
            || validateManagementField("opening-balance", "Enter a valid opening balance with no more than two decimal places (for example, 0.00).", field => field.value.trim() !== "" && Number.isFinite(Number(field.value)) && field.validity.valid),
    save: async editId => {
        const payload = {
            name: document.getElementById("account-name").value.trim(),
            account_type: document.getElementById("account-type").value,
            opening_balance: Number(document.getElementById("opening-balance").value)
        };
        return editId === null
            ? await supabase.from("accounts").insert({ user_id: currentUser.id, ...payload })
            : await supabase.from("accounts").update(payload).eq("id", editId);
    },
    refresh: async () => {
        await loadAccounts(true);
        updateDashboard();
        refreshTransactionDropdowns();
        refreshGoalAccountOptions();
        renderPlanningTools();
    }
});


function editAccount(id) {
    if (managementSaveStates.get(accountForm)?.pending) return;
    clearManagementFeedback(accountForm, accountMessage);

    const account =
        accounts.find(
            item =>
                item.id === id
        );

    if (!account) {
        return;
    }

    document
        .getElementById("account-name")
        .value =
        account.name;

    document
        .getElementById("account-type")
        .value =
        account.account_type;

    document
        .getElementById("opening-balance")
        .value =
        account.opening_balance;

    editingAccountId =
        id;

    accountFormTitle.textContent =
        "Edit Account";

    saveAccountButton.textContent =
        "Save Changes";

    cancelAccountEditButton.style.display =
        "block";

    scrollToFormAndFocus(
        accountForm,
        document.getElementById(
            "account-name"
        )
    );
}


async function toggleAccountStatus(id) {
    if (managementSaveStates.get(accountForm)?.pending) return;

    const account =
        accounts.find(
            item =>
                item.id === id
        );

    if (!account) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("accounts")
            .update({

                is_active:
                    !account.is_active

            })
            .eq(
                "id",
                id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }

    await loadAccounts();

    refreshTransactionDropdowns();

    refreshGoalAccountOptions();

    renderPlanningTools();
}



async function deleteAccountPermanently(
    account
) {
    if (managementSaveStates.get(accountForm)?.pending) return;

    if (
        !account ||
        account.is_active
    ) {
        return;
    }

    try {

        const [
            transactionCount,
            recurringCount,
            outgoingTransferCount,
            incomingTransferCount
        ] =
            await Promise.all([
                getReferenceCount(
                    "transactions",
                    "account_id",
                    account.id
                ),
                getReferenceCount(
                    "recurring_transactions",
                    "account_id",
                    account.id
                ),
                getReferenceCount(
                    "account_transfers",
                    "from_account_id",
                    account.id
                ),
                getReferenceCount(
                    "account_transfers",
                    "to_account_id",
                    account.id
                )
            ]);

        if (
            transactionCount > 0 ||
            recurringCount > 0 ||
            outgoingTransferCount > 0 ||
            incomingTransferCount > 0
        ) {

            alert(
                `"${account.name}" cannot be permanently deleted because it has transaction, recurring or transfer history. Keep the account inactive instead.`
            );

            return;
        }

        const confirmed =
            confirm(
                `Delete "${account.name}" permanently?\n\nThis cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        const {
            error
        } =
            await supabase
                .from("accounts")
                .delete()
                .eq(
                    "id",
                    account.id
                );

        if (error) {
            throw error;
        }

        resetAccountForm();

        await loadAccounts();

        refreshTransactionDropdowns();

        refreshRecurringFormOptions();

    } catch (error) {

        console.error(
            "Delete account error:",
            error
        );

        alert(
            error.message ||
            "Unable to permanently delete this account."
        );
    }
}


function resetAccountForm() {
    clearManagementFeedback(accountForm, accountMessage);

    editingAccountId =
        null;

    accountForm.reset();

    document
        .getElementById("opening-balance")
        .value =
        "0";

    accountFormTitle.textContent =
        "Add Account";

    saveAccountButton.textContent =
        "Add Account";

    cancelAccountEditButton.style.display =
        "none";

    accountMessage.textContent =
        "";
}


cancelAccountEditButton.addEventListener(
    "click",
    () => {
        if (!managementSaveStates.get(accountForm)?.pending) resetAccountForm();
    }
);


// ======================================================
// CATEGORIES
// ======================================================

async function loadCategories(throwOnError = false) {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("categories")
            .select("*")
            .order(
                "name",
                {
                    ascending: true
                }
            );

    if (error) {
        if (throwOnError) throw error;

        categoryMessage.textContent =
            "Unable to load category entries. Please refresh and try again.";

        console.error(error);

        return;
    }

    categories =
        data || [];

    categoryMessage.textContent =
        "";

    renderCategories();
}


function renderCategories() {

    categoryList.innerHTML =
        "";

    if (!categories.length) {

        renderEmptyState(
            categoryList,
            "No categories yet."
        );

        return;
    }

    categories.forEach(
        function (category) {

            const card =
                createSimpleManagementCard({

                    name:
                        category.name,

                    meta:
                        formatCategoryType(
                            category.type
                        ),

                    active:
                        category.is_active,

                    onEdit:
                        function () {

                            editCategory(
                                category.id
                            );
                        },

                    onToggle:
                        function () {

                            toggleCategoryStatus(
                                category.id
                            );
                        },

                    onDelete:
                        function () {

                            deleteCategoryPermanently(
                                category
                            );
                        }
                });

            categoryList.appendChild(
                card
            );
        }
    );
}


configureManagementSave({
    form: categoryForm,
    button: saveCategoryButton,
    cancel: cancelCategoryEditButton,
    message: categoryMessage,
    list: categoryList,
    label: "Category",
    getEditId: () => editingCategoryId,
    reset: resetCategoryForm,
    validate: () => validateManagementField("category-name", "Enter a category name.", field => !!field.value.trim())
            || validateManagementField("category-type", "Choose a category type.", field => ["expense", "income", "both"].includes(field.value)),
    save: async editId => {
        const payload = {
            name: document.getElementById("category-name").value.trim(),
            type: document.getElementById("category-type").value
        };
        return editId === null
            ? await supabase.from("categories").insert({ user_id: currentUser.id, ...payload })
            : await supabase.from("categories").update(payload).eq("id", editId);
    },
    refresh: async () => {
        await loadCategories(true);
        populateBudgetCategorySelect();
        refreshTransactionDropdowns();
        renderBudgets();
    }
});


function editCategory(id) {
    if (managementSaveStates.get(categoryForm)?.pending) return;
    clearManagementFeedback(categoryForm, categoryMessage);

    const category =
        categories.find(
            item =>
                item.id === id
        );

    if (!category) {
        return;
    }

    document
        .getElementById("category-name")
        .value =
        category.name;

    document
        .getElementById("category-type")
        .value =
        category.type;

    editingCategoryId =
        id;

    categoryFormTitle.textContent =
        "Edit Category";

    saveCategoryButton.textContent =
        "Save Changes";

    cancelCategoryEditButton.style.display =
        "block";

    scrollToFormAndFocus(
        categoryForm,
        document.getElementById(
            "category-name"
        )
    );
}


async function toggleCategoryStatus(id) {
    if (managementSaveStates.get(categoryForm)?.pending) return;

    const category =
        categories.find(
            item =>
                item.id === id
        );

    if (!category) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("categories")
            .update({

                is_active:
                    !category.is_active

            })
            .eq(
                "id",
                id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }

    await loadCategories();

    populateBudgetCategorySelect();

    refreshTransactionDropdowns();

    renderBudgets();

    renderReports();
    renderSmartInsights();
}



async function deleteCategoryPermanently(
    category
) {
    if (managementSaveStates.get(categoryForm)?.pending) return;

    if (
        !category ||
        category.is_active
    ) {
        return;
    }

    try {

        const [
            transactionCount,
            recurringCount,
            budgetCount
        ] =
            await Promise.all([
                getReferenceCount(
                    "transactions",
                    "category_id",
                    category.id
                ),
                getReferenceCount(
                    "recurring_transactions",
                    "category_id",
                    category.id
                ),
                getReferenceCount(
                    "budgets",
                    "category_id",
                    category.id
                )
            ]);

        if (
            transactionCount > 0 ||
            recurringCount > 0 ||
            budgetCount > 0
        ) {

            alert(
                `"${category.name}" cannot be permanently deleted because it is used by transaction, recurring, or budget history. Keep it inactive instead.`
            );

            return;
        }

        const confirmed =
            confirm(
                `Delete category "${category.name}" permanently?\n\nThis cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        const {
            error
        } =
            await supabase
                .from("categories")
                .delete()
                .eq(
                    "id",
                    category.id
                );

        if (error) {
            throw error;
        }

        resetCategoryForm();

        await loadCategories();

        populateBudgetCategorySelect();

        refreshTransactionDropdowns();

        refreshRecurringFormOptions();

        renderBudgets();

    } catch (error) {

        console.error(
            "Delete category error:",
            error
        );

        alert(
            error.message ||
            "Unable to permanently delete this category."
        );
    }
}


function resetCategoryForm() {
    clearManagementFeedback(categoryForm, categoryMessage);

    editingCategoryId =
        null;

    categoryForm.reset();

    categoryFormTitle.textContent =
        "Add Category";

    saveCategoryButton.textContent =
        "Add Category";

    cancelCategoryEditButton.style.display =
        "none";

    categoryMessage.textContent =
        "";
}


cancelCategoryEditButton.addEventListener(
    "click",
    () => {
        if (!managementSaveStates.get(categoryForm)?.pending) resetCategoryForm();
    }
);


// ======================================================
// INCOME SOURCES
// ======================================================

async function loadIncomeSources(throwOnError = false) {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("income_sources")
            .select("*")
            .order(
                "name",
                {
                    ascending: true
                }
            );

    if (error) {
        if (throwOnError) throw error;

        incomeSourceMessage.textContent =
            "Unable to load income source entries. Please refresh and try again.";

        console.error(error);

        return;
    }

    incomeSources =
        data || [];

    incomeSourceMessage.textContent =
        "";

    renderIncomeSources();
}


function renderIncomeSources() {

    incomeSourceList.innerHTML =
        "";

    if (!incomeSources.length) {

        renderEmptyState(
            incomeSourceList,
            "No income sources yet."
        );

        return;
    }

    incomeSources.forEach(
        function (source) {

            const card =
                createSimpleManagementCard({

                    name:
                        source.name,

                    meta:
                        "Income Source",

                    active:
                        source.is_active,

                    onEdit:
                        function () {

                            editIncomeSource(
                                source.id
                            );
                        },

                    onToggle:
                        function () {

                            toggleIncomeSourceStatus(
                                source.id
                            );
                        },

                    onDelete:
                        function () {

                            deleteIncomeSourcePermanently(
                                source
                            );
                        }
                });

            incomeSourceList.appendChild(
                card
            );
        }
    );
}


configureManagementSave({
    form: incomeSourceForm,
    button: saveIncomeSourceButton,
    cancel: cancelIncomeSourceEditButton,
    message: incomeSourceMessage,
    list: incomeSourceList,
    label: "Income Source",
    getEditId: () => editingIncomeSourceId,
    reset: resetIncomeSourceForm,
    validate: () => validateManagementField("income-source-name", "Enter an income source name.", field => !!field.value.trim()),
    save: async editId => {
        const payload = {
            name: document.getElementById("income-source-name").value.trim()
        };
        return editId === null
            ? await supabase.from("income_sources").insert({ user_id: currentUser.id, ...payload })
            : await supabase.from("income_sources").update(payload).eq("id", editId);
    },
    refresh: async () => {
        await loadIncomeSources(true);
        refreshTransactionDropdowns();
    }
});


function editIncomeSource(id) {
    if (managementSaveStates.get(incomeSourceForm)?.pending) return;
    clearManagementFeedback(incomeSourceForm, incomeSourceMessage);

    const source =
        incomeSources.find(
            item =>
                item.id === id
        );

    if (!source) {
        return;
    }

    document
        .getElementById("income-source-name")
        .value =
        source.name;

    editingIncomeSourceId =
        id;

    incomeSourceFormTitle.textContent =
        "Edit Income Source";

    saveIncomeSourceButton.textContent =
        "Save Changes";

    cancelIncomeSourceEditButton.style.display =
        "block";

    scrollToFormAndFocus(
        incomeSourceForm,
        document.getElementById(
            "income-source-name"
        )
    );
}


async function toggleIncomeSourceStatus(id) {
    if (managementSaveStates.get(incomeSourceForm)?.pending) return;

    const source =
        incomeSources.find(
            item =>
                item.id === id
        );

    if (!source) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("income_sources")
            .update({

                is_active:
                    !source.is_active
            })
            .eq(
                "id",
                id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }

    await loadIncomeSources();

    refreshTransactionDropdowns();
}



async function deleteIncomeSourcePermanently(
    source
) {
    if (managementSaveStates.get(incomeSourceForm)?.pending) return;

    if (
        !source ||
        source.is_active
    ) {
        return;
    }

    try {

        const [
            transactionCount,
            recurringCount
        ] =
            await Promise.all([
                getReferenceCount(
                    "transactions",
                    "income_source_id",
                    source.id
                ),
                getReferenceCount(
                    "recurring_transactions",
                    "income_source_id",
                    source.id
                )
            ]);

        if (
            transactionCount > 0 ||
            recurringCount > 0
        ) {

            alert(
                `"${source.name}" cannot be permanently deleted because it is used by transaction or recurring history. Keep it inactive instead.`
            );

            return;
        }

        const confirmed =
            confirm(
                `Delete income source "${source.name}" permanently?\n\nThis cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        const {
            error
        } =
            await supabase
                .from("income_sources")
                .delete()
                .eq(
                    "id",
                    source.id
                );

        if (error) {
            throw error;
        }

        resetIncomeSourceForm();

        await loadIncomeSources();

        refreshTransactionDropdowns();

        refreshRecurringFormOptions();

    } catch (error) {

        console.error(
            "Delete income source error:",
            error
        );

        alert(
            error.message ||
            "Unable to permanently delete this income source."
        );
    }
}


function resetIncomeSourceForm() {
    clearManagementFeedback(incomeSourceForm, incomeSourceMessage);

    editingIncomeSourceId =
        null;

    incomeSourceForm.reset();

    incomeSourceFormTitle.textContent =
        "Add Income Source";

    saveIncomeSourceButton.textContent =
        "Add Income Source";

    cancelIncomeSourceEditButton.style.display =
        "none";

    incomeSourceMessage.textContent =
        "";
}


cancelIncomeSourceEditButton.addEventListener(
    "click",
    () => {
        if (!managementSaveStates.get(incomeSourceForm)?.pending) resetIncomeSourceForm();
    }
);


// ======================================================
// SEED STARTER DATA
// ======================================================

async function seedStarterData() {

    let changed =
        false;

    if (
        categories.length === 0
    ) {

        const rows =
            starterCategories.map(
                item => ({

                    user_id:
                        currentUser.id,

                    name:
                        item.name,

                    type:
                        item.type
                })
            );

        const {
            error
        } =
            await supabase
                .from("categories")
                .insert(rows);

        if (!error) {
            changed = true;
        }
    }

    if (
        incomeSources.length === 0
    ) {

        const rows =
            starterIncomeSources.map(
                name => ({

                    user_id:
                        currentUser.id,

                    name
                })
            );

        const {
            error
        } =
            await supabase
                .from("income_sources")
                .insert(rows);

        if (!error) {
            changed = true;
        }
    }

    if (changed) {

        await loadCategories();
        await loadIncomeSources();
    }
}


// ======================================================
// BUDGET MONTH
// ======================================================

function setDefaultBudgetMonth() {

    if (!budgetMonthInput.value) {

        budgetMonthInput.value =
            getCurrentMonthValue();
    }
}


budgetMonthInput.addEventListener(
    "change",
    async function () {

        resetBudgetForm();

        await loadBudgets();
    }
);


// ======================================================
// LOAD BUDGETS
// ======================================================

async function loadBudgets(throwOnError = false) {

    if (
        !currentUser ||
        !budgetMonthInput.value
    ) {
        return;
    }

    const monthStart =
        `${budgetMonthInput.value}-01`;

    budgetMessage.textContent =
        "Loading budget...";

    const {
        data,
        error
    } =
        await supabase
            .from("budgets")
            .select("*")
            .eq(
                "month_start",
                monthStart
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );

    if (error) {
        if (throwOnError) throw error;

        console.error(
            "Load budget error:",
            error
        );

        budgets = [];

        budgetMessage.textContent =
            error.message;

        renderBudgets();

        return;
    }

    budgets =
        data || [];

    budgetMessage.textContent =
        "";

    populateBudgetCategorySelect();

    renderBudgets();

    loadDashboardBudgetSummary();
}


// ======================================================
// BUDGET CATEGORY DROPDOWN
// ======================================================

function populateBudgetCategorySelect(
    selectedValue = ""
) {

    budgetCategorySelect.innerHTML =
        '<option value="">Select category</option>';

    categories
        .filter(
            function (category) {

                const canBudget =
                    category.type === "expense" ||
                    category.type === "both";

                if (!canBudget) {
                    return false;
                }

                if (
                    category.id ===
                    selectedValue
                ) {
                    return true;
                }

                if (!category.is_active) {
                    return false;
                }

                const alreadyUsed =
                    budgets.some(
                        budget =>
                            budget.category_id ===
                                category.id
                            &&
                            budget.id !==
                                editingBudgetId
                    );

                return !alreadyUsed;
            }
        )
        .forEach(
            function (category) {

                addSelectOption(
                    budgetCategorySelect,
                    category.id,
                    category.name
                );
            }
        );

    budgetCategorySelect.value =
        selectedValue;
}


// ======================================================
// CREATE / UPDATE BUDGET
// ======================================================

configureFinanceSubmit({
    form: budgetForm, button: saveBudgetButton, cancel: cancelBudgetEditButton,
    message: budgetMessage, label: "Budget", getEditId: () => editingBudgetId,
    extraControls: [budgetMonthInput],
    validate: () => financeField(budgetCategorySelect, "Choose a budget category.")
        || financeAmount(budgetAmountInput)
        || financeDate(budgetMonthInput, "budget month")
}, async function (event, markSaved) {

        event.preventDefault();

        if (!currentUser) {
            return;
        }

        const categoryId =
            budgetCategorySelect.value;

        const amount =
            parseFloat(
                budgetAmountInput.value
            );

        const selectedMonth =
            budgetMonthInput.value;

        const monthStart =
            `${selectedMonth}-01`;

        let result;

        if (
            editingBudgetId === null
        ) {

            result =
                await supabase
                    .from("budgets")
                    .insert({

                        user_id:
                            currentUser.id,

                        category_id:
                            categoryId,

                        month_start:
                            monthStart,

                        amount:
                            amount
                    });

        } else {

            result =
                await supabase
                    .from("budgets")
                    .update({

                        category_id:
                            categoryId,

                        month_start:
                            monthStart,

                        amount:
                            amount
                    })
                    .eq(
                        "id",
                        editingBudgetId
                    );
        }
        if (result.error) throw result.error;
        markSaved();

        const wasEditing = editingBudgetId !== null;
        resetBudgetForm(true);
        showTransactionSuccessSnackbar({
            title: "Budget" + (wasEditing ? " updated" : " added"),
            message: "Your budget was saved successfully."
        });

        await loadBudgets(true);
    }
);


// ======================================================
// EDIT BUDGET
// ======================================================

function editBudget(id) {
    if (financeSavePending(budgetForm)) return;
    clearFinanceFeedback(budgetForm);

    const budget =
        budgets.find(
            item =>
                item.id === id
        );

    if (!budget) {
        return;
    }

    editingBudgetId =
        budget.id;

    budgetAmountInput.value =
        budget.amount;

    budgetFormTitle.textContent =
        "Edit Budget";

    saveBudgetButton.textContent =
        "Save Changes";

    cancelBudgetEditButton.style.display =
        "block";

    populateBudgetCategorySelect(
        budget.category_id
    );

    budgetForm.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"
    });
}


// ======================================================
// DELETE BUDGET
// ======================================================

async function deleteBudget(id) {
    if (financeSavePending(budgetForm)) return;

    const budget =
        budgets.find(
            item =>
                item.id === id
        );

    if (!budget) {
        return;
    }

    const categoryName =
        getCategoryName(
            budget.category_id
        ) ||
        "this category";

    const confirmed =
        confirm(
            `Delete budget for "${categoryName}"?`
        );

    if (!confirmed) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("budgets")
            .delete()
            .eq(
                "id",
                id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }

    resetBudgetForm();

    await loadBudgets();
}


// ======================================================
// RESET BUDGET FORM
// ======================================================

function resetBudgetForm(force = false) {
    if (financeSavePending(budgetForm) && force !== true) return;
    clearFinanceFeedback(budgetForm);

    editingBudgetId =
        null;

    budgetForm.reset();

    budgetFormTitle.textContent =
        "Add Budget";

    saveBudgetButton.textContent = financeSavePending(budgetForm) ? "Saving..." : "Add Budget";

    saveBudgetButton.disabled = financeSavePending(budgetForm);

    cancelBudgetEditButton.style.display =
        "none";

    budgetMessage.textContent =
        "";

    populateBudgetCategorySelect();
}


cancelBudgetEditButton.addEventListener(
    "click",
    resetBudgetForm
);


// ======================================================
// RENDER BUDGETS
// ======================================================

function renderBudgets() {

    budgetList.innerHTML =
        "";

    renderSetupChecklist();

    budgetMonthLabel.textContent =
        formatBudgetMonth(
            budgetMonthInput.value
        );

    budgetInsight.classList.remove(
        "insight-warning"
    );

    if (!budgets.length) {

        renderEmptyState(
            budgetList,
            {
                title:
                    "No budget for this month",

                description:
                    "Set a spending limit for one category and Kira will track your progress automatically.",

                actionLabel:
                    "Create budget",

                actionPage:
                    "budgets",

                actionTargetId:
                    "budget-form",

                focusId:
                    "budget-category"
            }
        );

        budgetInsight.textContent =
            "Set a category budget to start tracking your spending.";

        return;
    }

    const stats =
        [];

    budgets.forEach(
        function (budget) {

            const categoryName =
                getCategoryName(
                    budget.category_id
                ) ||
                "Unknown Category";

            const limit =
                Number(
                    budget.amount
                );

            const spent =
                calculateCategorySpending(
                    budget.category_id,
                    budgetMonthInput.value
                );

            const remaining =
                limit - spent;

            const percentage =
                limit > 0
                    ? (
                        spent /
                        limit
                    ) * 100
                    : 0;

            stats.push({
                categoryName,
                limit,
                spent,
                remaining,
                percentage
            });


            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "budget-card";


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "budget-card-top";


            const left =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "p"
                );

            name.className =
                "budget-category-name";

            name.textContent =
                categoryName;


            const numbers =
                document.createElement(
                    "p"
                );

            numbers.className =
                "budget-numbers";

            numbers.textContent =
                `${formatMoney(spent)} / ${formatMoney(limit)}`;


            left.appendChild(name);
            left.appendChild(numbers);


            const percentageText =
                document.createElement(
                    "p"
                );

            percentageText.className =
                "budget-percentage";

            percentageText.textContent =
                `${percentage.toFixed(1)}%`;


            top.appendChild(left);
            top.appendChild(
                percentageText
            );


            const progress =
                document.createElement(
                    "div"
                );

            progress.className =
                "budget-progress";


            const progressFill =
                document.createElement(
                    "div"
                );

            progressFill.className =
                "budget-progress-fill";

            if (
                percentage >= 100
            ) {

                progressFill.classList.add(
                    "budget-over"
                );

            } else if (
                percentage >= 80
            ) {

                progressFill.classList.add(
                    "budget-warning"
                );
            }

            progressFill.style.width =
                `${Math.min(
                    percentage,
                    100
                )}%`;

            progress.appendChild(
                progressFill
            );


            const footer =
                document.createElement(
                    "div"
                );

            footer.className =
                "budget-card-footer";


            const remainingText =
                document.createElement(
                    "p"
                );

            if (
                remaining >= 0
            ) {

                remainingText.className =
                    "budget-remaining";

                remainingText.textContent =
                    `${formatMoney(remaining)} remaining`;

            } else {

                remainingText.className =
                    "budget-over-text";

                remainingText.textContent =
                    `${formatMoney(
                        Math.abs(
                            remaining
                        )
                    )} over budget`;
            }


            const buttons =
                document.createElement(
                    "div"
                );

            buttons.className =
                "budget-buttons";


            const editButton =
                createTextButton(
                    "Edit",
                    "edit-button"
                );


            const deleteButton =
                createTextButton(
                    "Delete",
                    "delete-button delete-permanently-button"
                );


            editButton.addEventListener(
                "click",
                function () {

                    editBudget(
                        budget.id
                    );
                }
            );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteBudget(
                        budget.id
                    );
                }
            );


            buttons.appendChild(
                editButton
            );

            buttons.appendChild(
                deleteButton
            );


            footer.appendChild(
                remainingText
            );

            footer.appendChild(
                buttons
            );


            card.appendChild(top);
            card.appendChild(progress);
            card.appendChild(footer);


            budgetList.appendChild(
                card
            );
        }
    );

    updateBudgetInsight(
        stats
    );
}


// ======================================================
// CATEGORY SPENDING FOR BUDGET
// ======================================================

function calculateCategorySpending(
    categoryId,
    month
) {

    return transactions
        .filter(
            function (transaction) {

                return (
                    transaction.type ===
                        "expense"
                    &&
                    transaction.category_id ===
                        categoryId
                    &&
                    transaction.transaction_date
                        ?.startsWith(
                            month
                        )
                );
            }
        )
        .reduce(
            function (
                total,
                transaction
            ) {

                return (
                    total +
                    Number(
                        transaction.amount
                    )
                );
            },
            0
        );
}


// ======================================================
// BUDGET INSIGHT
// ======================================================

function updateBudgetInsight(stats) {

    budgetInsight.classList.remove(
        "insight-warning"
    );

    if (!stats.length) {

        budgetInsight.textContent =
            "No budget data available.";

        return;
    }

    const overBudget =
        stats
            .filter(
                item =>
                    item.remaining < 0
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.remaining -
                    b.remaining
            );

    if (
        overBudget.length
    ) {

        const worst =
            overBudget[0];

        budgetInsight.textContent =
            `${worst.categoryName} is over budget by ${formatMoney(
                Math.abs(
                    worst.remaining
                )
            )}.`;

        budgetInsight.classList.add(
            "insight-warning"
        );

        return;
    }

    const totalBudget =
        stats.reduce(
            (
                total,
                item
            ) =>
                total +
                item.limit,
            0
        );

    const totalSpent =
        stats.reduce(
            (
                total,
                item
            ) =>
                total +
                item.spent,
            0
        );

    const remaining =
        totalBudget -
        totalSpent;

    const highestUsage =
        [...stats]
            .sort(
                (
                    a,
                    b
                ) =>
                    b.percentage -
                    a.percentage
            )[0];

    if (
        highestUsage.percentage >= 80
    ) {

        budgetInsight.textContent =
            `${highestUsage.categoryName} has used ${highestUsage.percentage.toFixed(
                0
            )}% of its monthly budget.`;

        return;
    }

    budgetInsight.textContent =
        `You still have ${formatMoney(
            remaining
        )} remaining across your budgets this month.`;
}


// ======================================================
// PAYMENT METHODS
// ======================================================

async function loadPaymentMethods(
    throwOnError = false
) {

    if (!currentUser) {
        paymentMethods = [];
        return;
    }

    try {

        paymentMethods =
            await fetchPaymentMethods(
                currentUser.id
            );

    } catch (error) {

        paymentMethods = [];

        if (throwOnError) {
            throw error;
        }

        console.error(
            "Load payment methods error:",
            error
        );
    }
}


function getPaymentMethodName(
    paymentMethodId
) {

    if (!paymentMethodId) {
        return "";
    }

    return (
        paymentMethods.find(
            item =>
                item.id ===
                paymentMethodId
        )?.name
        ||
        ""
    );
}


function populatePaymentMethodSelect(
    select,
    selectedValue = "",
    placeholder = "Not specified"
) {

    if (!select) {
        return;
    }

    select.innerHTML =
        `<option value="">${placeholder}</option>`;

    paymentMethods
        .filter(
            method =>
                method.is_active ||
                method.id ===
                    selectedValue
        )
        .forEach(
            function (method) {

                addSelectOption(
                    select,
                    method.id,
                    method.name +
                        (
                            method.is_active
                                ? ""
                                : " (Inactive)"
                        )
                );
            }
        );

    select.value =
        paymentMethods.some(
            method =>
                method.id ===
                selectedValue
        )
            ? selectedValue
            : "";
}


// ======================================================
// TRANSACTION TAGS
// ======================================================

async function loadTags() {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("tags")
            .select("*")
            .order(
                "name",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "Load tags error:",
            error
        );

        return;
    }

    tags =
        data || [];
}


function getTagName(tagId) {

    const tag =
        tags.find(
            item =>
                item.id === tagId
        );

    return tag?.name || "";
}


function getTransactionTagIds(
    transaction
) {

    return Array.isArray(
        transaction?.tag_ids
    )
        ? transaction.tag_ids
        : [];
}


function getTransactionTagNames(
    transaction
) {

    return getTransactionTagIds(
        transaction
    )
        .map(getTagName)
        .filter(Boolean);
}


function parseTransactionTagNames(
    value
) {

    const seen =
        new Set();

    return String(value || "")
        .split(",")
        .map(
            item =>
                item
                    .trim()
                    .replace(
                        /\s+/g,
                        " "
                    )
        )
        .filter(Boolean)
        .filter(
            function (name) {

                const key =
                    name.toLowerCase();

                if (seen.has(key)) {
                    return false;
                }

                seen.add(key);

                return true;
            }
        );
}


async function ensureTagsForNames(
    names
) {

    if (!names.length) {
        return [];
    }

    if (names.length > 10) {

        throw new Error(
            "Use up to 10 tags per transaction."
        );
    }

    const invalid =
        names.find(
            name =>
                name.length > 30
        );

    if (invalid) {

        throw new Error(
            `Tag "${invalid}" is too long. Keep each tag within 30 characters.`
        );
    }

    const tagIds =
        [];

    for (const name of names) {

        const existing =
            tags.find(
                item =>
                    item.name
                        .trim()
                        .toLowerCase() ===
                    name.toLowerCase()
            );

        if (existing) {

            tagIds.push(
                existing.id
            );

            continue;
        }

        const {
            data,
            error
        } =
            await supabase
                .from("tags")
                .insert({
                    user_id:
                        currentUser.id,
                    name
                })
                .select("*")
                .single();

        if (error) {

            // A case-insensitive unique race is unlikely,
            // but reload once before treating it as a failure.
            await loadTags();

            const afterReload =
                tags.find(
                    item =>
                        item.name
                            .trim()
                            .toLowerCase() ===
                        name.toLowerCase()
                );

            if (afterReload) {

                tagIds.push(
                    afterReload.id
                );

                continue;
            }

            throw error;
        }

        tags.push(data);

        tags.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

        tagIds.push(
            data.id
        );
    }

    return tagIds;
}


async function syncTransactionTags(
    transactionId,
    desiredTagIds
) {

    const existingTagIds =
        transactionTagLinks
            .filter(
                link =>
                    link.transaction_id ===
                    transactionId
            )
            .map(
                link =>
                    link.tag_id
            );

    const toInsert =
        desiredTagIds.filter(
            tagId =>
                !existingTagIds.includes(
                    tagId
                )
        );

    const toDelete =
        existingTagIds.filter(
            tagId =>
                !desiredTagIds.includes(
                    tagId
                )
        );


    if (toInsert.length) {

        const {
            error
        } =
            await supabase
                .from(
                    "transaction_tags"
                )
                .insert(
                    toInsert.map(
                        tagId => ({
                            transaction_id:
                                transactionId,
                            tag_id:
                                tagId,
                            user_id:
                                currentUser.id
                        })
                    )
                );

        if (error) {
            throw error;
        }
    }


    if (toDelete.length) {

        const {
            error
        } =
            await supabase
                .from(
                    "transaction_tags"
                )
                .delete()
                .eq(
                    "transaction_id",
                    transactionId
                )
                .in(
                    "tag_id",
                    toDelete
                );

        if (error) {
            throw error;
        }
    }
}


function attachTagIdsToTransactions(
    transactionRows
) {

    const tagIdsByTransaction =
        new Map();

    transactionTagLinks.forEach(
        function (link) {

            if (
                !tagIdsByTransaction.has(
                    link.transaction_id
                )
            ) {

                tagIdsByTransaction.set(
                    link.transaction_id,
                    []
                );
            }

            tagIdsByTransaction
                .get(
                    link.transaction_id
                )
                .push(
                    link.tag_id
                );
        }
    );

    return transactionRows.map(
        transaction => ({
            ...transaction,
            tag_ids:
                tagIdsByTransaction.get(
                    transaction.id
                )
                ||
                []
        })
    );
}


// ======================================================
// LOAD ACTIVE TRANSACTIONS
// ======================================================


async function loadTransactions(throwOnError = false) {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("transactions")
            .select("*")
            .is(
                "deleted_at",
                null
            )
            .order(
                "transaction_date",
                {
                    ascending: false
                }
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {
        if (throwOnError) throw error;

        console.error(
            "Load transactions error:",
            error
        );

        alert(
            error.message
        );

        return;
    }

    const {
        data: tagLinkData,
        error: tagLinkError
    } =
        await supabase
            .from(
                "transaction_tags"
            )
            .select(
                "transaction_id, tag_id"
            );

    if (tagLinkError) {
        if (throwOnError) throw tagLinkError;

        console.error(
            "Load transaction tags error:",
            tagLinkError
        );

        transactionTagLinks =
            [];

    } else {

        transactionTagLinks =
            tagLinkData || [];
    }

    transactions =
        attachTagIdsToTransactions(
            data || []
        );


    // Recurring activity depends on the latest transaction list.
    // Re-render after transactions are refreshed so newly logged
    // recurring occurrences can resolve their linked transaction.
    renderRecentRecurringActivity();

    updateDashboard();

    renderTransactions();

    renderAccounts();

    renderCreditCardsPage();
    renderCreditCardDashboardSummary();

    renderSpendingDashboard();

    renderDashboardRecentTransactions();

    loadDashboardBudgetSummary();

    renderDashboardGoalsSummary();

    renderPlanningTools();

    renderReports();

    renderSmartInsights();

    if (
        budgetMonthInput.value &&
        budgets.length
    ) {

        renderBudgets();
    }
}


// ======================================================
// LOAD DELETED TRANSACTIONS
// ======================================================

async function loadDeletedTransactions() {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("transactions")
            .select("*")
            .not(
                "deleted_at",
                "is",
                null
            )
            .order(
                "deleted_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Deleted transaction error:",
            error
        );

        return;
    }

    deletedTransactions =
        data || [];

    renderDeletedTransactions();
}


// ======================================================
// ACCOUNT TRANSFERS
// ======================================================

async function loadTransfers(
    throwOnError = false,
    render = true
) {

    if (!currentUser) {
        transfers = [];
        return;
    }

    try {

        transfers =
            await fetchAccountTransfers(
                currentUser.id
            );

        if (render) {
            renderAccounts();
            renderTransactions();
            renderCreditCardsPage();
            renderCreditCardDashboardSummary();
        }

    } catch (error) {

        transfers = [];

        if (throwOnError) {
            throw error;
        }

        console.warn(
            "Load account transfers error:",
            error
        );
    }
}


function populateTransferAccountSelects(
    fromValue = "",
    toValue = ""
) {

    if (
        !transferFromAccountSelect ||
        !transferToAccountSelect
    ) {
        return;
    }

    const currentFrom =
        fromValue ||
        transferFromAccountSelect.value;

    const currentTo =
        toValue ||
        transferToAccountSelect.value;

    const eligibleAccounts =
        accounts.filter(
            account =>
                account.is_active ||
                account.id === currentFrom ||
                account.id === currentTo
        );

    const populate =
        function (
            select,
            selectedValue,
            placeholder
        ) {

            select.innerHTML =
                `<option value="">${placeholder}</option>`;

            eligibleAccounts.forEach(
                function (account) {

                    addSelectOption(
                        select,
                        account.id,
                        account.name +
                            (
                                account.is_active
                                    ? ""
                                    : " (Inactive)"
                            )
                    );
                }
            );

            select.value =
                eligibleAccounts.some(
                    account =>
                        account.id ===
                            selectedValue
                )
                    ? selectedValue
                    : "";
        };

    populate(
        transferFromAccountSelect,
        currentFrom,
        "Select source account"
    );

    populate(
        transferToAccountSelect,
        currentTo,
        "Select destination account"
    );
}


function updateTransactionMode() {

    const isTransfer =
        transactionTypeSelect.value ===
        "transfer";

    if (transactionAccountLabel) {
        transactionAccountLabel.style.display =
            isTransfer
                ? "none"
                : "";
    }

    if (transactionAccountSelect) {
        transactionAccountSelect.style.display =
            isTransfer
                ? "none"
                : "";
        transactionAccountSelect.required =
            !isTransfer;
    }

    if (transferAccountGroup) {
        transferAccountGroup.style.display =
            isTransfer
                ? "block"
                : "none";
    }

    if (transactionPaymentMethodGroup) {
        transactionPaymentMethodGroup.style.display =
            isTransfer
                ? "none"
                : "";
    }

    if (isTransfer) {
        transactionPaymentMethodSelect.disabled =
            true;
    } else {
        syncPaymentMethodForSelectedCreditCard();
    }

    if (transferFromAccountSelect) {
        transferFromAccountSelect.required =
            isTransfer;
    }

    if (transferToAccountSelect) {
        transferToAccountSelect.required =
            isTransfer;
    }

    if (transactionCategoryLabel) {
        transactionCategoryLabel.style.display =
            isTransfer
                ? "none"
                : "";
    }

    if (transactionCategorySelect) {
        transactionCategorySelect.style.display =
            isTransfer
                ? "none"
                : "";
        transactionCategorySelect.required =
            !isTransfer;
    }

    if (customCategoryGroup) {
        customCategoryGroup.style.display =
            "none";
    }

    if (incomeSourceGroup) {
        incomeSourceGroup.style.display =
            !isTransfer &&
            transactionTypeSelect.value ===
                "income"
                ? "block"
                : "none";
    }

    if (customIncomeSourceGroup) {
        customIncomeSourceGroup.style.display =
            "none";
    }

    if (transactionTagsField) {
        transactionTagsField.style.display =
            isTransfer
                ? "none"
                : "";
    }

    if (receiptUploadSection) {
        receiptUploadSection.style.display =
            isTransfer
                ? "none"
                : "";
    }

    if (descriptionSuggestionHelp) {
        descriptionSuggestionHelp.style.display =
            isTransfer
                ? "none"
                : "";
    }

    if (transferAccountMessage) {
        transferAccountMessage.textContent =
            isTransfer
                ? "Transfers move money between your own accounts and do not count as income or spending."
                : "";
    }

    if (isTransfer) {
        hideDescriptionSuggestions();

        formTitle.textContent =
            editingTransferId !== null
                ? "Edit Transfer"
                : "Add Transfer";

        submitButton.textContent =
            editingTransferId !== null
                ? "Save Transfer"
                : "Transfer Money";

    } else {

        formTitle.textContent =
            editingTransactionId !== null
                ? "Edit Transaction"
                : "Add Transaction";

        submitButton.textContent =
            editingTransactionId !== null
                ? "Save Changes"
                : "Add Transaction";
    }
}


// ======================================================
// TRANSACTION DROPDOWNS
// ======================================================

function refreshTransactionDropdowns(
    transaction = null
) {

    populateAccountSelect(
        transaction?.account_id || ""
    );

    populatePaymentMethodSelect(
        transactionPaymentMethodSelect,
        transaction?.payment_method_id || ""
    );

    syncPaymentMethodForSelectedCreditCard();

    populateCategorySelect(
        transaction?.category_id || ""
    );

    updateIncomeSourceVisibility(
        transaction?.income_source_id || ""
    );

    customCategoryGroup.style.display =
        "none";

    customIncomeSourceGroup.style.display =
        "none";

    populateTransferAccountSelects(
        transaction?.from_account_id || "",
        transaction?.to_account_id || ""
    );

    populateTransactionFilterOptions();

    updateTransactionMode();
}


function populateAccountSelect(
    selectedValue = ""
) {

    transactionAccountSelect.innerHTML =
        '<option value="">Select account</option>';

    accounts
        .filter(
            account =>
                account.is_active ||
                account.id ===
                    selectedValue
        )
        .forEach(
            function (account) {

                addSelectOption(
                    transactionAccountSelect,
                    account.id,
                    account.name
                );
            }
        );

    transactionAccountSelect.value =
        selectedValue;
}


function populateCategorySelect(
    selectedValue = ""
) {

    const transactionType =
        transactionTypeSelect.value;

    transactionCategorySelect.innerHTML =
        '<option value="">Select category</option>';

    categories
        .filter(
            category =>
                (
                    category.is_active ||
                    category.id ===
                        selectedValue
                )
                &&
                (
                    category.type ===
                        transactionType
                    ||
                    category.type ===
                        "both"
                )
        )
        .forEach(
            function (category) {

                addSelectOption(
                    transactionCategorySelect,
                    category.id,
                    category.name
                );
            }
        );

    addSelectOption(
        transactionCategorySelect,
        "__other__",
        "Other / Create New"
    );

    transactionCategorySelect.value =
        selectedValue;
}


function updateIncomeSourceVisibility(
    selectedValue = ""
) {

    const isIncome =
        transactionTypeSelect.value ===
        "income";

    if (!isIncome) {

        incomeSourceGroup.style.display =
            "none";

        customIncomeSourceGroup.style.display =
            "none";

        transactionIncomeSourceSelect.innerHTML =
            "";

        return;
    }

    incomeSourceGroup.style.display =
        "block";

    transactionIncomeSourceSelect.innerHTML =
        '<option value="">Select income source</option>';

    incomeSources
        .filter(
            source =>
                source.is_active ||
                source.id ===
                    selectedValue
        )
        .forEach(
            function (source) {

                addSelectOption(
                    transactionIncomeSourceSelect,
                    source.id,
                    source.name
                );
            }
        );

    addSelectOption(
        transactionIncomeSourceSelect,
        "__other__",
        "Other / Create New"
    );

    transactionIncomeSourceSelect.value =
        selectedValue;
}


// ======================================================
// RECURRING & SUBSCRIPTIONS
// ======================================================

async function loadRecurringTransactions(throwOnError = false) {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("recurring_transactions")
            .select("*")
            .order(
                "next_due_date",
                {
                    ascending: true
                }
            );

    if (error) {
        if (throwOnError) throw error;

        console.error(
            "Load recurring transactions error:",
            error
        );

        return;
    }

    recurringTransactions =
        data || [];

    await loadRecurringOccurrenceStatuses();

    renderRecurringTransactions();
    renderRecurringSummary();
    renderRecurringAnalytics();
    renderRecurringReminderCenter();
    renderRecentRecurringActivity();
    renderFinancialCalendar();
    renderDashboardUpcomingCommitments();
    renderPlanningTools();
    renderSmartInsights();
}



async function loadRecurringOccurrenceStatuses() {

    if (!currentUser) {

        recurringOccurrenceStatuses =
            [];

        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from(
                "recurring_occurrence_statuses"
            )
            .select(
                "id, recurring_id, due_date, status, created_at, updated_at"
            )
            .order(
                "due_date",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "Load recurring payment statuses error:",
            error
        );

        recurringOccurrenceStatuses =
            [];

        return;
    }

    recurringOccurrenceStatuses =
        data || [];
}


function getRecurringOccurrenceStatus(
    recurringId,
    dueDate
) {

    const row =
        recurringOccurrenceStatuses.find(
            item =>
                item.recurring_id ===
                    recurringId
                &&
                item.due_date ===
                    dueDate
        );

    return row?.status ||
        "pending";
}


function getRecurringStatusLabel(
    status
) {

    return {
        pending:
            "Pending",
        paid:
            "Paid",
        skipped:
            "Skipped"
    }[status] || "Pending";
}


async function setRecurringOccurrenceStatus(
    recurring,
    status
) {

    if (
        !currentUser ||
        !recurring?.id ||
        !recurring?.next_due_date
    ) {
        return;
    }

    if (
        ![
            "pending",
            "paid",
            "skipped"
        ].includes(status)
    ) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from(
                "recurring_occurrence_statuses"
            )
            .upsert(
                {
                    user_id:
                        currentUser.id,
                    recurring_id:
                        recurring.id,
                    due_date:
                        recurring.next_due_date,
                    status
                },
                {
                    onConflict:
                        "user_id,recurring_id,due_date"
                }
            );

    if (error) {

        console.error(
            "Update recurring payment status error:",
            error
        );

        alert(
            error.message ||
            "Unable to update the recurring payment status."
        );

        return;
    }

    await loadRecurringOccurrenceStatuses();

    renderRecurringSummary();
    renderRecurringReminderCenter();
    renderFinancialCalendar();
    renderDashboardUpcomingCommitments();
}


async function markRecurringOccurrencePaid(
    recurringId,
    dueDate
) {

    if (
        !currentUser ||
        !recurringId ||
        !dueDate
    ) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from(
                "recurring_occurrence_statuses"
            )
            .upsert(
                {
                    user_id:
                        currentUser.id,
                    recurring_id:
                        recurringId,
                    due_date:
                        dueDate,
                    status:
                        "paid"
                },
                {
                    onConflict:
                        "user_id,recurring_id,due_date"
                }
            );

    if (error) {
        throw error;
    }
}



function getRecurringReminderDays(
    item
) {

    const days =
        Number.parseInt(
            item?.reminder_days_before,
            10
        );

    if (
        Number.isInteger(days) &&
        days >= 0 &&
        days <= 30
    ) {
        return days;
    }

    return 3;
}


function isRecurringReminderDue(
    item
) {

    if (
        !item ||
        !item.is_active ||
        item.reminder_enabled === false ||
        !item.next_due_date
    ) {
        return false;
    }

    if (
        getRecurringOccurrenceStatus(
            item.id,
            item.next_due_date
        ) !==
        "pending"
    ) {
        return false;
    }

    const today =
        parseRecurringLocalDate(
            getTodayDate()
        );

    const due =
        parseRecurringLocalDate(
            item.next_due_date
        );

    const reminderStart =
        new Date(due);

    reminderStart.setDate(
        reminderStart.getDate() -
        getRecurringReminderDays(
            item
        )
    );

    return today >=
        reminderStart;
}


function getRecurringReminderLabel(
    item
) {

    const today =
        parseRecurringLocalDate(
            getTodayDate()
        );

    const due =
        parseRecurringLocalDate(
            item.next_due_date
        );

    const days =
        Math.round(
            (
                due -
                today
            ) /
            86400000
        );

    if (days < 0) {

        return `${Math.abs(
            days
        )} day${
            Math.abs(days) ===
            1
                ? ""
                : "s"
        } overdue`;
    }

    if (days === 0) {
        return "Due today";
    }

    return `Due in ${days} day${
        days === 1
            ? ""
            : "s"
    }`;
}


function getRecurringReminderItems() {

    return recurringTransactions
        .filter(
            isRecurringReminderDue
        )
        .sort(
            (
                first,
                second
            ) =>
                first.next_due_date
                    .localeCompare(
                        second.next_due_date
                    )
        );
}


function updateRecurringReminderControls() {

    if (
        !recurringReminderEnabled ||
        !recurringReminderDays ||
        !recurringReminderDaysGroup
    ) {
        return;
    }

    const enabled =
        recurringReminderEnabled.checked;

    recurringReminderDays.disabled =
        !enabled;

    recurringReminderDaysGroup.classList.toggle(
        "disabled",
        !enabled
    );
}



function getRecurringActivityTransaction(
    statusRow
) {

    if (!statusRow) {
        return null;
    }

    return transactions.find(
        transaction =>
            transaction.recurring_id ===
                statusRow.recurring_id
            &&
            transaction.recurring_due_date ===
                statusRow.due_date
    ) || null;
}


function getRecurringActivityTimestamp(
    statusRow,
    transaction
) {

    if (transaction?.created_at) {

        return new Date(
            transaction.created_at
        );
    }

    if (statusRow?.updated_at) {

        return new Date(
            statusRow.updated_at
        );
    }

    if (statusRow?.created_at) {

        return new Date(
            statusRow.created_at
        );
    }

    return new Date(
        `${statusRow.due_date}T00:00:00`
    );
}


function formatActivityRecordedDate(
    dateValue
) {

    const date =
        dateValue instanceof Date
            ? dateValue
            : new Date(
                dateValue
            );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "en-MY",
        {
            day:
                "numeric",
            month:
                "short",
            year:
                "numeric"
        }
    );
}


function renderRecentRecurringActivity() {

    if (!recurringActivityList) {
        return;
    }

    recurringActivityList.innerHTML =
        "";


    const activityRows =
        recurringOccurrenceStatuses
            .filter(
                row =>
                    row.status ===
                        "paid"
                    ||
                    row.status ===
                        "skipped"
            )
            .map(
                function (row) {

                    const recurring =
                        recurringTransactions.find(
                            item =>
                                item.id ===
                                row.recurring_id
                        );

                    if (!recurring) {
                        return null;
                    }

                    const transaction =
                        getRecurringActivityTransaction(
                            row
                        );

                    const timestamp =
                        getRecurringActivityTimestamp(
                            row,
                            transaction
                        );

                    return {
                        row,
                        recurring,
                        transaction,
                        timestamp
                    };
                }
            )
            .filter(Boolean)
            .sort(
                (
                    first,
                    second
                ) =>
                    second.timestamp -
                    first.timestamp
            )
            .slice(
                0,
                10
            );


    if (!activityRows.length) {

        recurringActivityList.textContent =
            "No recurring activity yet.";

        return;
    }


    activityRows.forEach(
        function ({
            row,
            recurring,
            transaction,
            timestamp
        }) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "recurring-activity-card";


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "recurring-activity-top";


            const copy =
                document.createElement(
                    "div"
                );

            copy.className =
                "recurring-activity-copy";


            const titleRow =
                document.createElement(
                    "div"
                );

            titleRow.className =
                "recurring-activity-title-row";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                recurring.name;


            const badge =
                document.createElement(
                    "span"
                );

            badge.className =
                `recurring-activity-status ${row.status}`;

            badge.textContent =
                getRecurringStatusLabel(
                    row.status
                );


            titleRow.append(
                title,
                badge
            );


            const mainMeta =
                document.createElement(
                    "p"
                );

            const recordedDate =
                transaction?.transaction_date
                    ? formatDate(
                        transaction.transaction_date
                    )
                    : formatActivityRecordedDate(
                        timestamp
                    );

            const activityVerb =
                row.status ===
                    "paid"
                    ? (
                        transaction
                            ? "Paid"
                            : "Marked paid"
                    )
                    : "Skipped";

            mainMeta.textContent =
                `${activityVerb} ${recordedDate} • Due ${formatDate(row.due_date)}`;


            const details =
                document.createElement(
                    "p"
                );

            details.className =
                "recurring-activity-details";


            const account =
                accounts.find(
                    item =>
                        item.id ===
                        (
                            transaction?.account_id
                            ||
                            recurring.account_id
                        )
                );


            const category =
                categories.find(
                    item =>
                        item.id ===
                        (
                            transaction?.category_id
                            ||
                            recurring.category_id
                        )
                );


            const detailParts =
                [];


            if (account?.name) {

                detailParts.push(
                    account.name
                );
            }


            if (category?.name) {

                detailParts.push(
                    category.name
                );
            }


            if (
                row.status ===
                    "paid"
                &&
                !transaction
            ) {

                detailParts.push(
                    "No linked transaction"
                );
            }


            details.textContent =
                detailParts.join(
                    " • "
                );


            copy.append(
                titleRow,
                mainMeta
            );


            if (details.textContent) {

                copy.appendChild(
                    details
                );
            }


            const amount =
                document.createElement(
                    "strong"
                );

            amount.className =
                recurring.type ===
                    "income"
                    ? "recurring-activity-amount income"
                    : "recurring-activity-amount expense";

            amount.textContent =
                `${recurring.type === "income" ? "+" : "-"}${formatMoney(recurring.amount)}`;


            top.append(
                copy,
                amount
            );


            const footer =
                document.createElement(
                    "div"
                );

            footer.className =
                "recurring-activity-footer";


            const recorded =
                document.createElement(
                    "span"
                );

            recorded.textContent =
                `Recorded ${formatActivityRecordedDate(timestamp)}`;


            const source =
                document.createElement(
                    "span"
                );

            source.textContent =
                transaction
                    ? "Linked transaction"
                    : "Recurring status only";


            footer.append(
                recorded,
                source
            );


            card.append(
                top,
                footer
            );


            recurringActivityList.appendChild(
                card
            );
        }
    );
}


function renderRecurringReminderCenter() {

    if (!recurringReminderList) {
        return;
    }

    recurringReminderList.innerHTML =
        "";

    const items =
        getRecurringReminderItems();

    if (!items.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "recurring-reminder-empty";

        empty.textContent =
            "No reminders due right now.";

        recurringReminderList.appendChild(
            empty
        );

        return;
    }

    items.forEach(
        function (item) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "recurring-reminder-item";


            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "recurring-reminder-icon";

            icon.textContent =
                "!";


            const copy =
                document.createElement(
                    "div"
                );

            copy.className =
                "recurring-reminder-copy";


            const titleRow =
                document.createElement(
                    "div"
                );

            titleRow.className =
                "recurring-reminder-title-row";


            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                item.name;


            const due =
                document.createElement(
                    "span"
                );

            due.className =
                "recurring-reminder-due";

            due.textContent =
                getRecurringReminderLabel(
                    item
                );


            titleRow.append(
                name,
                due
            );


            const meta =
                document.createElement(
                    "span"
                );

            meta.textContent =
                [
                    item.kind ===
                        "subscription"
                        ? "Subscription"
                        : formatRecurringFrequency(
                            item.frequency
                        ),
                    getAccountName(
                        item.account_id
                    ),
                    getCategoryName(
                        item.category_id
                    ),
                    `Remind ${getRecurringReminderDays(
                        item
                    )} day${
                        getRecurringReminderDays(
                            item
                        ) === 1
                            ? ""
                            : "s"
                    } before`
                ]
                    .filter(Boolean)
                    .join(" • ");


            copy.append(
                titleRow,
                meta
            );


            const amount =
                document.createElement(
                    "strong"
                );

            amount.className =
                `recurring-reminder-amount ${item.type}`;

            amount.textContent =
                `${
                    item.type ===
                    "income"
                        ? "+"
                        : "-"
                }${formatMoney(
                    item.amount
                )}`;


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "recurring-reminder-actions";


            const log =
                document.createElement(
                    "button"
                );

            log.type =
                "button";

            log.className =
                "recurring-reminder-log-button";

            log.textContent =
                item.type ===
                "income"
                    ? "Log Income"
                    : item.kind ===
                        "subscription"
                        ? "Log Payment"
                        : "Log Expense";

            log.addEventListener(
                "click",
                function () {

                    useRecurringItem(
                        item
                    );
                }
            );


            const paid =
                document.createElement(
                    "button"
                );

            paid.type =
                "button";

            paid.textContent =
                "Paid";

            paid.addEventListener(
                "click",
                async function () {

                    paid.disabled =
                        true;

                    await setRecurringOccurrenceStatus(
                        item,
                        "paid"
                    );
                }
            );


            const skipped =
                document.createElement(
                    "button"
                );

            skipped.type =
                "button";

            skipped.textContent =
                "Skip";

            skipped.addEventListener(
                "click",
                async function () {

                    skipped.disabled =
                        true;

                    await setRecurringOccurrenceStatus(
                        item,
                        "skipped"
                    );
                }
            );


            actions.append(
                log,
                paid,
                skipped
            );


            card.append(
                icon,
                copy,
                amount,
                actions
            );

            recurringReminderList.appendChild(
                card
            );
        }
    );
}


function refreshRecurringFormOptions(
    recurring = null
) {

    if (
        !recurringAccountSelect ||
        !recurringCategorySelect ||
        !recurringIncomeSourceSelect ||
        !recurringTypeSelect
    ) {
        return;
    }

    const selectedAccount =
        recurring?.account_id || "";

    const selectedPaymentMethod =
        recurring?.payment_method_id || "";

    const selectedCategory =
        recurring?.category_id || "";

    const selectedIncomeSource =
        recurring?.income_source_id || "";


    recurringAccountSelect.innerHTML =
        '<option value="">Select account</option>';

    accounts
        .filter(
            account =>
                account.is_active ||
                account.id ===
                    selectedAccount
        )
        .forEach(
            function (account) {

                addSelectOption(
                    recurringAccountSelect,
                    account.id,
                    account.name
                );
            }
        );

    recurringAccountSelect.value =
        selectedAccount;

    populatePaymentMethodSelect(
        recurringPaymentMethodSelect,
        selectedPaymentMethod
    );

    syncRecurringPaymentMethodForSelectedCreditCard();


    recurringCategorySelect.innerHTML =
        '<option value="">Select category</option>';

    categories
        .filter(
            category =>
                (
                    category.is_active ||
                    category.id ===
                        selectedCategory
                )
                &&
                (
                    category.type ===
                        recurringTypeSelect.value
                    ||
                    category.type ===
                        "both"
                )
        )
        .forEach(
            function (category) {

                addSelectOption(
                    recurringCategorySelect,
                    category.id,
                    category.name
                );
            }
        );

    addSelectOption(
        recurringCategorySelect,
        "__create_new__",
        "+ Other / Create New"
    );

    recurringCategorySelect.value =
        selectedCategory;

    if (
        recurringCustomCategoryGroup &&
        recurringCustomCategoryInput
    ) {

        const creatingNew =
            recurringCategorySelect.value ===
            "__create_new__";

        recurringCustomCategoryGroup.style.display =
            creatingNew
                ? "block"
                : "none";

        recurringCustomCategoryInput.required =
            creatingNew;

        if (!creatingNew) {
            recurringCustomCategoryInput.value =
                "";
        }
    }


    const isIncome =
        recurringTypeSelect.value ===
        "income";

    recurringIncomeSourceGroup.style.display =
        isIncome
            ? "block"
            : "none";

    recurringIncomeSourceSelect.innerHTML =
        '<option value="">Select income source</option>';

    if (isIncome) {

        incomeSources
            .filter(
                source =>
                    source.is_active ||
                    source.id ===
                        selectedIncomeSource
            )
            .forEach(
                function (source) {

                    addSelectOption(
                        recurringIncomeSourceSelect,
                        source.id,
                        source.name
                    );
                }
            );

        recurringIncomeSourceSelect.value =
            selectedIncomeSource;
    }
}


function resetRecurringForm(force = false) {
    if (financeSavePending(recurringForm) && force !== true) return;
    clearFinanceFeedback(recurringForm);

    editingRecurringId =
        null;

    recurringForm?.reset();

    if (recurringKindSelect) {
        recurringKindSelect.value =
            "recurring";
    }

    if (recurringTypeSelect) {
        recurringTypeSelect.value =
            "expense";
    }

    if (recurringFrequencySelect) {
        recurringFrequencySelect.value =
            "monthly";
    }

    if (recurringCustomCategoryInput) {
        recurringCustomCategoryInput.value =
            "";
    }

    if (recurringCustomCategoryGroup) {
        recurringCustomCategoryGroup.style.display =
            "none";
    }

    if (recurringNextDueDateInput) {
        recurringNextDueDateInput.value =
            getTodayDate();
    }

    if (recurringReminderEnabled) {
        recurringReminderEnabled.checked =
            true;
    }

    if (recurringReminderDays) {
        recurringReminderDays.value =
            "3";
    }

    updateRecurringReminderControls();

    recurringFormTitle.textContent =
        "Add Recurring Item";

    saveRecurringButton.textContent = financeSavePending(recurringForm) ? "Saving..." : "Add Recurring Item";

    saveRecurringButton.disabled = financeSavePending(recurringForm);

    cancelRecurringEditButton.style.display =
        "none";

    recurringMessage.textContent =
        "";

    refreshRecurringFormOptions();
}


function formatRecurringFrequency(
    frequency
) {

    return {
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }[frequency] || frequency;
}


function recurringMonthlyEquivalent(
    item
) {

    const amount =
        Number(item.amount);

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return 0;
    }

    if (
        item.frequency ===
        "weekly"
    ) {
        return amount * 52 / 12;
    }

    if (
        item.frequency ===
        "yearly"
    ) {
        return amount / 12;
    }

    return amount;
}



function getRecurringCategoryName(
    categoryId
) {

    if (!categoryId) {
        return "Uncategorized";
    }

    return (
        categories.find(
            category =>
                category.id ===
                categoryId
        )?.name
        ||
        "Uncategorized"
    );
}


function createRecurringAnalyticsRow({
    title,
    subtitle,
    amount,
    total,
    amountClass = ""
}) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "recurring-analytics-row";


    const copy =
        document.createElement(
            "div"
        );

    copy.className =
        "recurring-analytics-row-copy";


    const heading =
        document.createElement(
            "strong"
        );

    heading.textContent =
        title;


    const description =
        document.createElement(
            "span"
        );

    description.textContent =
        subtitle;


    copy.append(
        heading,
        description
    );


    const right =
        document.createElement(
            "div"
        );

    right.className =
        "recurring-analytics-row-right";


    const amountElement =
        document.createElement(
            "strong"
        );

    amountElement.className =
        amountClass;

    amountElement.textContent =
        formatMoney(amount);


    right.appendChild(
        amountElement
    );


    if (
        Number.isFinite(total) &&
        total > 0
    ) {

        const share =
            Math.max(
                0,
                Math.min(
                    100,
                    amount /
                    total *
                    100
                )
            );

        const shareText =
            document.createElement(
                "span"
            );

        shareText.textContent =
            `${share.toFixed(1)}%`;

        right.appendChild(
            shareText
        );
    }


    row.append(
        copy,
        right
    );


    return row;
}


function renderRecurringAnalytics() {

    if (
        !recurringAnalyticsIncome ||
        !recurringAnalyticsExpenses ||
        !recurringAnalyticsNet ||
        !recurringAnalyticsAnnualExpenses ||
        !recurringAnalyticsCategoryList ||
        !recurringAnalyticsTopList
    ) {
        return;
    }


    const active =
        recurringTransactions.filter(
            item =>
                item.is_active
        );


    const activeIncome =
        active.filter(
            item =>
                item.type ===
                "income"
        );


    const activeExpenses =
        active.filter(
            item =>
                item.type ===
                "expense"
        );


    const monthlyIncome =
        activeIncome.reduce(
            (
                total,
                item
            ) =>
                total +
                recurringMonthlyEquivalent(
                    item
                ),
            0
        );


    const monthlyExpenses =
        activeExpenses.reduce(
            (
                total,
                item
            ) =>
                total +
                recurringMonthlyEquivalent(
                    item
                ),
            0
        );


    const net =
        monthlyIncome -
        monthlyExpenses;


    recurringAnalyticsIncome.textContent =
        formatMoney(
            monthlyIncome
        );

    recurringAnalyticsExpenses.textContent =
        formatMoney(
            monthlyExpenses
        );

    recurringAnalyticsNet.textContent =
        formatMoney(
            net
        );

    recurringAnalyticsNet.classList.toggle(
        "income",
        net >= 0
    );

    recurringAnalyticsNet.classList.toggle(
        "expense",
        net < 0
    );

    recurringAnalyticsAnnualExpenses.textContent =
        formatMoney(
            monthlyExpenses *
            12
        );


    // ----------------------------------------------
    // Expense category breakdown
    // ----------------------------------------------

    recurringAnalyticsCategoryList.innerHTML =
        "";


    const categoryTotals =
        new Map();


    activeExpenses.forEach(
        function (item) {

            const categoryName =
                getRecurringCategoryName(
                    item.category_id
                );

            const monthlyAmount =
                recurringMonthlyEquivalent(
                    item
                );

            categoryTotals.set(
                categoryName,
                (
                    categoryTotals.get(
                        categoryName
                    )
                    ||
                    0
                )
                +
                monthlyAmount
            );
        }
    );


    const categoryRows =
        Array.from(
            categoryTotals.entries()
        )
            .sort(
                (
                    first,
                    second
                ) =>
                    second[1] -
                    first[1]
            );


    if (!categoryRows.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "recurring-analytics-empty";

        empty.textContent =
            "No active recurring expenses yet.";

        recurringAnalyticsCategoryList.appendChild(
            empty
        );

    } else {

        categoryRows.forEach(
            (
                [
                    categoryName,
                    amount
                ]
            ) => {

                recurringAnalyticsCategoryList.appendChild(
                    createRecurringAnalyticsRow({
                        title:
                            categoryName,
                        subtitle:
                            "Monthly equivalent",
                        amount,
                        total:
                            monthlyExpenses,
                        amountClass:
                            "expense"
                    })
                );
            }
        );
    }


    // ----------------------------------------------
    // Top commitments
    // ----------------------------------------------

    recurringAnalyticsTopList.innerHTML =
        "";


    const topExpenses =
        activeExpenses
            .map(
                item => ({
                    ...item,
                    monthlyEquivalent:
                        recurringMonthlyEquivalent(
                            item
                        )
                })
            )
            .sort(
                (
                    first,
                    second
                ) =>
                    second.monthlyEquivalent -
                    first.monthlyEquivalent
            )
            .slice(
                0,
                5
            );


    if (!topExpenses.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "recurring-analytics-empty";

        empty.textContent =
            "No recurring commitments to analyse yet.";

        recurringAnalyticsTopList.appendChild(
            empty
        );

    } else {

        topExpenses.forEach(
            function (item) {

                const categoryName =
                    getRecurringCategoryName(
                        item.category_id
                    );

                const frequency =
                    formatRecurringFrequency(
                        item.frequency
                    );

                recurringAnalyticsTopList.appendChild(
                    createRecurringAnalyticsRow({
                        title:
                            item.name,
                        subtitle:
                            `${frequency} • ${categoryName}`,
                        amount:
                            item.monthlyEquivalent,
                        total:
                            monthlyExpenses,
                        amountClass:
                            "expense"
                    })
                );
            }
        );
    }
}


function renderRecurringSummary() {

    if (
        !recurringActiveCount ||
        !recurringDueSoonCount ||
        !recurringMonthlyEstimate
    ) {
        return;
    }

    const active =
        recurringTransactions.filter(
            item =>
                item.is_active
        );

    recurringActiveCount.textContent =
        String(active.length);

    const today =
        new Date(
            `${getTodayDate()}T12:00:00`
        );

    const sevenDays =
        new Date(today);

    sevenDays.setDate(
        sevenDays.getDate() +
        7
    );

    recurringDueSoonCount.textContent =
        String(
            active.filter(
                item =>
                    new Date(
                        `${item.next_due_date}T12:00:00`
                    ) <=
                    sevenDays
                    &&
                    getRecurringOccurrenceStatus(
                        item.id,
                        item.next_due_date
                    ) ===
                        "pending"
            ).length
        );

    const estimate =
        active
            .filter(
                item =>
                    item.type ===
                    "expense"
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    recurringMonthlyEquivalent(
                        item
                    ),
                0
            );

    recurringMonthlyEstimate.textContent =
        formatMoney(estimate);

    if (recurringReminderCount) {

        recurringReminderCount.textContent =
            String(
                getRecurringReminderItems()
                    .length
            );
    }
}


function recurringDueLabel(
    dateValue
) {

    const today =
        new Date(
            `${getTodayDate()}T12:00:00`
        );

    const due =
        new Date(
            `${dateValue}T12:00:00`
        );

    const days =
        Math.round(
            (due - today) /
            86400000
        );

    if (days < 0) {

        return {
            text:
                `${Math.abs(days)} day${
                    Math.abs(days) === 1
                        ? ""
                        : "s"
                } overdue`,
            className:
                "overdue"
        };
    }

    if (days === 0) {
        return {
            text:
                "Due today",
            className:
                "today"
        };
    }

    if (days <= 7) {
        return {
            text:
                `Due in ${days} day${
                    days === 1
                        ? ""
                        : "s"
                }`,
            className:
                "soon"
        };
    }

    return {
        text:
            formatDate(dateValue),
        className:
            "future"
    };
}



function parseRecurringLocalDate(
    dateValue
) {
    return new Date(
        `${dateValue}T12:00:00`
    );
}


function getRecurringMonthRange(
    monthValue
) {

    const safeMonth =
        /^\d{4}-\d{2}$/
            .test(
                monthValue || ""
            )
            ? monthValue
            : getCurrentMonthValue();

    const [
        year,
        month
    ] =
        safeMonth
            .split("-")
            .map(Number);

    return {
        start:
            new Date(
                year,
                month - 1,
                1,
                12
            ),

        end:
            new Date(
                year,
                month,
                0,
                12
            )
    };
}


function generateRecurringOccurrences(
    item,
    rangeStart,
    rangeEnd
) {

    if (
        !item ||
        !item.is_active ||
        !item.next_due_date
    ) {
        return [];
    }

    const occurrences =
        [];

    let dateValue =
        item.next_due_date;

    let date =
        parseRecurringLocalDate(
            dateValue
        );

    let guard =
        0;

    while (
        date <
            rangeStart &&
        guard <
            80
    ) {

        dateValue =
            addRecurringInterval(
                dateValue,
                item.frequency
            );

        date =
            parseRecurringLocalDate(
                dateValue
            );

        guard +=
            1;
    }

    while (
        date <=
            rangeEnd &&
        guard <
            80
    ) {

        occurrences.push({
            recurring_id:
                item.id,
            name:
                item.name,
            kind:
                item.kind,
            type:
                item.type,
            amount:
                Number(
                    item.amount
                ),
            frequency:
                item.frequency,
            date:
                dateValue,
            account_id:
                item.account_id,
            category_id:
                item.category_id
        });

        dateValue =
            addRecurringInterval(
                dateValue,
                item.frequency
            );

        date =
            parseRecurringLocalDate(
                dateValue
            );

        guard +=
            1;
    }

    return occurrences;
}


function getFinancialCalendarOccurrences(
    monthValue
) {

    const range =
        getRecurringMonthRange(
            monthValue
        );

    return recurringTransactions
        .flatMap(
            item =>
                generateRecurringOccurrences(
                    item,
                    range.start,
                    range.end
                )
        )
        .sort(
            (
                first,
                second
            ) =>
                first.date.localeCompare(
                    second.date
                )
                ||
                first.name.localeCompare(
                    second.name
                )
        );
}


function renderFinancialCalendar() {

    if (
        !recurringCalendarMonth ||
        !recurringCalendarSummary ||
        !recurringCalendarList
    ) {
        return;
    }

    if (
        !recurringCalendarMonth.value
    ) {
        recurringCalendarMonth.value =
            getCurrentMonthValue();
    }

    const occurrences =
        getFinancialCalendarOccurrences(
            recurringCalendarMonth.value
        );

    const income =
        occurrences
            .filter(
                item =>
                    item.type ===
                    "income"
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.amount,
                0
            );

    const expenses =
        occurrences
            .filter(
                item =>
                    item.type ===
                    "expense"
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.amount,
                0
            );

    recurringCalendarSummary.innerHTML =
        "";

    [
        [
            "Expected Income",
            formatMoney(
                income
            ),
            "income"
        ],
        [
            "Expected Expenses",
            formatMoney(
                expenses
            ),
            "expense"
        ],
        [
            "Net Recurring",
            formatMoney(
                income -
                expenses
            ),
            income -
            expenses >=
            0
                ? "income"
                : "expense"
        ],
        [
            "Occurrences",
            String(
                occurrences.length
            ),
            ""
        ]
    ].forEach(
        function (summary) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "financial-calendar-summary-card";

            const label =
                document.createElement(
                    "span"
                );

            label.textContent =
                summary[0];

            const value =
                document.createElement(
                    "strong"
                );

            value.textContent =
                summary[1];

            if (summary[2]) {
                value.classList.add(
                    summary[2]
                );
            }

            card.append(
                label,
                value
            );

            recurringCalendarSummary
                .appendChild(
                    card
                );
        }
    );

    recurringCalendarList.innerHTML =
        "";

    if (!occurrences.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-state";

        empty.textContent =
            "No recurring commitments in this month.";

        recurringCalendarList
            .appendChild(
                empty
            );

        return;
    }

    const groups =
        new Map();

    occurrences.forEach(
        function (item) {

            if (
                !groups.has(
                    item.date
                )
            ) {
                groups.set(
                    item.date,
                    []
                );
            }

            groups
                .get(
                    item.date
                )
                .push(
                    item
                );
        }
    );

    groups.forEach(
        function (
            items,
            dateValue
        ) {

            const day =
                document.createElement(
                    "article"
                );

            day.className =
                "financial-calendar-day";

            const dateWrap =
                document.createElement(
                    "div"
                );

            dateWrap.className =
                "financial-calendar-date";

            const parsed =
                parseRecurringLocalDate(
                    dateValue
                );

            const weekday =
                document.createElement(
                    "span"
                );

            weekday.textContent =
                parsed.toLocaleDateString(
                    "en-MY",
                    {
                        weekday:
                            "short"
                    }
                );

            const number =
                document.createElement(
                    "strong"
                );

            number.textContent =
                String(
                    parsed.getDate()
                );

            const month =
                document.createElement(
                    "span"
                );

            month.textContent =
                parsed.toLocaleDateString(
                    "en-MY",
                    {
                        month:
                            "short"
                    }
                );

            dateWrap.append(
                weekday,
                number,
                month
            );

            const itemsWrap =
                document.createElement(
                    "div"
                );

            itemsWrap.className =
                "financial-calendar-day-items";

            items.forEach(
                function (item) {

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "financial-calendar-entry";

                    const copy =
                        document.createElement(
                            "div"
                        );

                    copy.className =
                        "financial-calendar-entry-copy";

                    const name =
                        document.createElement(
                            "strong"
                        );

                    name.textContent =
                        item.name;

                    const meta =
                        document.createElement(
                            "span"
                        );

                    meta.textContent =
                        [
                            item.kind ===
                                "subscription"
                                ? "Subscription"
                                : formatRecurringFrequency(
                                    item.frequency
                                ),
                            getAccountName(
                                item.account_id
                            ),
                            getCategoryName(
                                item.category_id
                            )
                        ]
                            .filter(Boolean)
                            .join(" • ");

                    copy.append(
                        name,
                        meta
                    );

                    const calendarStatus =
                        getRecurringOccurrenceStatus(
                            item.recurring_id,
                            item.date
                        );

                    const statusBadge =
                        document.createElement(
                            "span"
                        );

                    statusBadge.className =
                        `financial-calendar-status ${calendarStatus}`;

                    statusBadge.textContent =
                        getRecurringStatusLabel(
                            calendarStatus
                        );

                    copy.appendChild(
                        statusBadge
                    );

                    const amount =
                        document.createElement(
                            "strong"
                        );

                    amount.className =
                        `financial-calendar-entry-amount ${item.type}`;

                    amount.textContent =
                        `${
                            item.type ===
                            "income"
                                ? "+"
                                : "-"
                        }${formatMoney(
                            item.amount
                        )}`;

                    row.append(
                        copy,
                        amount
                    );

                    itemsWrap.appendChild(
                        row
                    );
                }
            );

            day.append(
                dateWrap,
                itemsWrap
            );

            recurringCalendarList
                .appendChild(
                    day
                );
        }
    );
}


function renderDashboardUpcomingCommitments() {

    if (
        !dashboardUpcomingCommitments
    ) {
        return;
    }

    dashboardUpcomingCommitments.innerHTML =
        "";

    const today =
        parseRecurringLocalDate(
            getTodayDate()
        );

    const horizon =
        new Date(today);

    horizon.setDate(
        horizon.getDate() +
        30
    );

    const items =
        recurringTransactions
            .filter(
                item =>
                    item.is_active
            )
            .map(
                function (item) {

                    return {
                        ...item,
                        due:
                            parseRecurringLocalDate(
                                item.next_due_date
                            )
                    };
                }
            )
            .filter(
                item =>
                    item.due <=
                    horizon
            )
            .sort(
                (
                    first,
                    second
                ) =>
                    first.due -
                    second.due
            )
            .slice(
                0,
                5
            );

    if (!items.length) {

        const empty =
            document.createElement(
                "p"
            );

        empty.className =
            "dashboard-upcoming-empty";

        empty.textContent =
            "Nothing is due in the next 30 days.";

        dashboardUpcomingCommitments
            .appendChild(
                empty
            );

        return;
    }

    items.forEach(
        function (item) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "dashboard-upcoming-item";

            const date =
                document.createElement(
                    "div"
                );

            date.className =
                "dashboard-upcoming-date";

            const day =
                document.createElement(
                    "strong"
                );

            day.textContent =
                String(
                    item.due.getDate()
                );

            const month =
                document.createElement(
                    "span"
                );

            month.textContent =
                item.due.toLocaleDateString(
                    "en-MY",
                    {
                        month:
                            "short"
                    }
                );

            date.append(
                day,
                month
            );

            const copy =
                document.createElement(
                    "div"
                );

            copy.className =
                "dashboard-upcoming-copy";

            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                item.name;

            const due =
                recurringDueLabel(
                    item.next_due_date
                );

            const meta =
                document.createElement(
                    "span"
                );

            const reminderText =
                isRecurringReminderDue(
                    item
                )
                    ? " • Reminder"
                    : "";

            meta.textContent =
                `${
                    item.kind ===
                    "subscription"
                        ? "Subscription"
                        : formatRecurringFrequency(
                            item.frequency
                        )
                } • ${due.text}${reminderText}`;

            copy.append(
                name,
                meta
            );

            const amount =
                document.createElement(
                    "strong"
                );

            amount.className =
                `dashboard-upcoming-amount ${item.type}`;

            amount.textContent =
                `${
                    item.type ===
                    "income"
                        ? "+"
                        : "-"
                }${formatMoney(
                    item.amount
                )}`;

            row.append(
                date,
                copy,
                amount
            );

            const currentStatus =
                getRecurringOccurrenceStatus(
                    item.id,
                    item.next_due_date
                );

            const statusRow =
                document.createElement(
                    "div"
                );

            statusRow.className =
                "dashboard-upcoming-status-row";

            const statusLabel =
                document.createElement(
                    "div"
                );

            statusLabel.className =
                `dashboard-upcoming-current-status ${currentStatus}`;

            statusLabel.textContent =
                `Status: ${getRecurringStatusLabel(
                    currentStatus
                )}`;

            const controls =
                document.createElement(
                    "div"
                );

            controls.className =
                "dashboard-upcoming-status-controls";

            [
                ["pending", "Pending"],
                ["paid", "Paid"],
                ["skipped", "Skipped"]
            ].forEach(
                function (
                    [
                        status,
                        label
                    ]
                ) {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "dashboard-upcoming-status-button";

                    if (
                        currentStatus ===
                        status
                    ) {

                        button.classList.add(
                            "active",
                            status
                        );
                    }

                    button.textContent =
                        label;

                    button.addEventListener(
                        "click",
                        async function () {

                            if (
                                currentStatus ===
                                status
                            ) {
                                return;
                            }

                            button.disabled =
                                true;

                            await setRecurringOccurrenceStatus(
                                item,
                                status
                            );
                        }
                    );

                    controls.appendChild(
                        button
                    );
                }
            );

            statusRow.append(
                statusLabel,
                controls
            );

            row.appendChild(
                statusRow
            );

            dashboardUpcomingCommitments
                .appendChild(
                    row
                );
        }
    );
}


if (recurringCalendarMonth) {
    recurringCalendarMonth.addEventListener(
        "change",
        renderFinancialCalendar
    );
}


function renderRecurringTransactions() {

    if (!recurringList) {
        return;
    }

    recurringList.innerHTML =
        "";

    renderSetupChecklist();

    if (!recurringTransactions.length) {

        renderEmptyState(
            recurringList,
            {
                title:
                    "No recurring items yet",

                description:
                    "Add bills, subscriptions or regular income so upcoming commitments are easier to plan for.",

                actionLabel:
                    "Add recurring item",

                actionPage:
                    "recurring",

                actionTargetId:
                    "recurring-form",

                focusId:
                    "recurring-name"
            }
        );

        return;
    }

    recurringTransactions.forEach(
        function (item) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "recurring-card";

            if (!item.is_active) {
                card.classList.add(
                    "inactive"
                );
            }


            const main =
                document.createElement(
                    "div"
                );

            main.className =
                "recurring-card-main";


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "recurring-card-heading";


            const titleWrap =
                document.createElement(
                    "div"
                );

            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                item.name;

            const kind =
                document.createElement(
                    "span"
                );

            kind.className =
                item.kind ===
                "subscription"
                    ? "recurring-kind-badge subscription"
                    : "recurring-kind-badge";

            kind.textContent =
                item.kind ===
                "subscription"
                    ? "Subscription"
                    : "Recurring";

            titleWrap.append(
                title,
                kind
            );


            const amount =
                document.createElement(
                    "strong"
                );

            amount.className =
                `recurring-amount ${item.type}`;

            amount.textContent =
                `${
                    item.type ===
                    "income"
                        ? "+"
                        : "-"
                }${formatMoney(
                    item.amount
                )}`;


            top.append(
                titleWrap,
                amount
            );


            const meta =
                document.createElement(
                    "p"
                );

            meta.className =
                "recurring-meta";

            meta.textContent =
                [
                    formatRecurringFrequency(
                        item.frequency
                    ),
                    getAccountName(
                        item.account_id
                    ),
                    getCategoryName(
                        item.category_id
                    )
                ]
                    .filter(Boolean)
                    .join(" • ");


            const due =
                document.createElement(
                    "span"
                );

            const dueInfo =
                recurringDueLabel(
                    item.next_due_date
                );

            due.className =
                `recurring-due-badge ${
                    item.is_active
                        ? dueInfo.className
                        : "future"
                }`;

            due.textContent =
                item.is_active
                    ? dueInfo.text
                    : "Inactive";


            main.append(
                top,
                meta,
                due
            );


            if (item.notes) {

                const notes =
                    document.createElement(
                        "p"
                    );

                notes.className =
                    "recurring-notes";

                notes.textContent =
                    item.notes;

                main.appendChild(
                    notes
                );
            }


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "recurring-actions";


            if (item.is_active) {

                const log =
                    document.createElement(
                        "button"
                    );

                log.type =
                    "button";

                log.className =
                    "recurring-primary-action";

                log.textContent =
                    item.type ===
                    "income"
                        ? "Log Income"
                        : item.kind ===
                            "subscription"
                            ? "Log Payment"
                            : "Log Expense";

                log.addEventListener(
                    "click",
                    () =>
                        useRecurringItem(
                            item
                        )
                );

                actions.appendChild(log);
            }


            if (item.is_active) {

                const edit =
                    document.createElement(
                        "button"
                    );

                edit.type =
                    "button";

                edit.className =
                    "inline-action-button edit-button";

                edit.textContent =
                    "Edit";

                applySemanticActionButtonStyle(
                    edit,
                    "Edit"
                );

                edit.addEventListener(
                    "click",
                    () =>
                        editRecurringItem(
                            item
                        )
                );

                actions.appendChild(edit);
            }


            const toggle =
                document.createElement(
                    "button"
                );

            toggle.type =
                "button";

            toggle.className =
                item.is_active
                    ? "inline-action-button status-button"
                    : "inline-action-button status-button positive-action-button";

            toggle.textContent =
                item.is_active
                    ? "Deactivate"
                    : "Reactivate";

            if (item.is_active) {
                toggle.className =
                    "danger-text-button";
            }

            toggle.addEventListener(
                "click",
                () =>
                    toggleRecurringItem(
                        item
                    )
            );

            actions.appendChild(toggle);


            if (!item.is_active) {

                const remove =
                    document.createElement(
                        "button"
                    );

                remove.type =
                    "button";

                remove.className =
                    "inline-action-button delete-permanently-button recurring-delete-button";

                remove.textContent =
                    "Delete Permanently";

                remove.addEventListener(
                    "click",
                    () =>
                        deleteRecurringItemPermanently(
                            item
                        )
                );

                actions.appendChild(
                    remove
                );
            }


            card.append(
                main,
                actions
            );

            recurringList.appendChild(
                card
            );
        }
    );
}


function editRecurringItem(item) {
    if (financeSavePending(recurringForm)) return;
    clearFinanceFeedback(recurringForm);

    editingRecurringId =
        item.id;

    recurringNameInput.value =
        item.name;

    recurringKindSelect.value =
        item.kind;

    recurringTypeSelect.value =
        item.type;

    recurringAmountInput.value =
        Number(
            item.amount
        ).toFixed(2);

    recurringFrequencySelect.value =
        item.frequency;

    recurringNextDueDateInput.value =
        item.next_due_date;

    if (recurringReminderEnabled) {

        recurringReminderEnabled.checked =
            item.reminder_enabled !==
            false;
    }

    if (recurringReminderDays) {

        recurringReminderDays.value =
            String(
                getRecurringReminderDays(
                    item
                )
            );
    }

    updateRecurringReminderControls();

    recurringNotesInput.value =
        item.notes || "";

    refreshRecurringFormOptions(
        item
    );

    recurringFormTitle.textContent =
        "Edit Recurring Item";

    saveRecurringButton.textContent =
        "Save Changes";

    cancelRecurringEditButton.style.display =
        "inline-flex";

    scrollToFormAndFocus(
        recurringForm,
        recurringNameInput
    );
}


async function toggleRecurringItem(item) {
    if (financeSavePending(recurringForm)) return;

    const {
        error
    } =
        await supabase
            .from(
                "recurring_transactions"
            )
            .update({
                is_active:
                    !item.is_active
            })
            .eq(
                "id",
                item.id
            );

    if (error) {
        alert(
            error.message ||
            "Unable to update recurring item."
        );
        return;
    }

    await loadRecurringTransactions();
}



async function deleteRecurringItemPermanently(
    item
) {
    if (financeSavePending(recurringForm)) return;

    if (
        !item ||
        item.is_active
    ) {
        return;
    }

    const confirmed =
        confirm(
            `Delete "${item.name}" permanently?\n\nIts recurring schedule and saved occurrence statuses will be removed. Logged transactions remain unchanged.`
        );

    if (!confirmed) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from(
                "recurring_transactions"
            )
            .delete()
            .eq(
                "id",
                item.id
            );

    if (error) {

        console.error(
            "Delete recurring item error:",
            error
        );

        alert(
            error.message ||
            "Unable to permanently delete this recurring item."
        );

        return;
    }

    if (
        editingRecurringId ===
        item.id
    ) {
        resetRecurringForm();
    }

    await loadRecurringTransactions();
}


function addRecurringInterval(
    dateValue,
    frequency
) {

    const date =
        new Date(
            `${dateValue}T12:00:00`
        );

    if (
        frequency ===
        "weekly"
    ) {

        date.setDate(
            date.getDate() +
            7
        );

    } else if (
        frequency ===
        "yearly"
    ) {

        const originalMonth =
            date.getMonth();

        date.setFullYear(
            date.getFullYear() +
            1
        );

        if (
            date.getMonth() !==
            originalMonth
        ) {
            date.setDate(0);
        }

    } else {

        const originalDay =
            date.getDate();

        date.setDate(1);

        date.setMonth(
            date.getMonth() +
            1
        );

        const lastDay =
            new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            ).getDate();

        date.setDate(
            Math.min(
                originalDay,
                lastDay
            )
        );
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}


function nextRecurringDateAfter(
    item,
    dueDate,
    transactionDate
) {

    let next =
        addRecurringInterval(
            dueDate,
            item.frequency
        );

    let guard =
        0;

    while (
        next <= transactionDate &&
        guard < 60
    ) {

        next =
            addRecurringInterval(
                next,
                item.frequency
            );

        guard += 1;
    }

    return next;
}


async function advanceRecurringSchedule(
    recurringId,
    dueDate,
    nextDueDate
) {

    if (
        !recurringId ||
        !dueDate ||
        !nextDueDate
    ) {
        return;
    }

    await markRecurringOccurrencePaid(
        recurringId,
        dueDate
    );

    const {
        error
    } =
        await supabase
            .from(
                "recurring_transactions"
            )
            .update({
                next_due_date:
                    nextDueDate
            })
            .eq(
                "id",
                recurringId
            );

    if (error) {
        throw error;
    }

    await loadRecurringOccurrenceStatuses();
    await loadRecurringTransactions();
}


function useRecurringItem(item) {
    if (financeSavePending(transactionForm)) return;

    resetTransactionForm();

    pendingRecurringId =
        item.id;

    pendingRecurringDueDate =
        item.next_due_date;

    transactionDescriptionInput.value =
        item.name;

    transactionTypeSelect.value =
        item.type;

    refreshTransactionDropdowns({
        account_id:
            item.account_id,
        payment_method_id:
            item.payment_method_id,
        category_id:
            item.category_id,
        income_source_id:
            item.income_source_id
    });

    document
        .getElementById("amount")
        .value =
        Number(
            item.amount
        ).toFixed(2);

    dateInput.value =
        getTodayDate();

    document
        .getElementById("notes")
        .value =
        item.notes || "";

    formTitle.textContent =
        item.kind ===
        "subscription"
            ? "Log Subscription Payment"
            : item.type ===
                "income"
                ? "Log Recurring Income"
                : "Log Recurring Expense";

    cancelEditButton.textContent =
        "Cancel";

    cancelEditButton.style.display =
        "inline-flex";

    navigateToPage(
        "transactions",
        {
            scrollToTop:
                false
        }
    );

    requestAnimationFrame(
        () =>
            transactionForm
                .scrollIntoView({
                    behavior:
                        "smooth",
                    block:
                        "start"
                })
    );
}


if (recurringReminderEnabled) {

    recurringReminderEnabled
        .addEventListener(
            "change",
            updateRecurringReminderControls
        );
}


if (recurringAccountSelect) {

    recurringAccountSelect
        .addEventListener(
            "change",
            syncRecurringPaymentMethodForSelectedCreditCard
        );
}


if (recurringTypeSelect) {

    recurringTypeSelect
        .addEventListener(
            "change",
            () =>
                refreshRecurringFormOptions()
        );
}


if (recurringCategorySelect) {

    recurringCategorySelect
        .addEventListener(
            "change",
            function () {

                const creatingNew =
                    recurringCategorySelect.value ===
                    "__create_new__";

                if (
                    recurringCustomCategoryGroup &&
                    recurringCustomCategoryInput
                ) {

                    recurringCustomCategoryGroup.style.display =
                        creatingNew
                            ? "block"
                            : "none";

                    recurringCustomCategoryInput.required =
                        creatingNew;

                    if (creatingNew) {

                        window.setTimeout(
                            () =>
                                recurringCustomCategoryInput
                                    .focus(),
                            50
                        );

                    } else {

                        recurringCustomCategoryInput.value =
                            "";
                    }
                }
            }
        );
}


if (cancelRecurringEditButton) {

    cancelRecurringEditButton
        .addEventListener(
            "click",
            resetRecurringForm
        );
}



async function resolveRecurringCategoryId(
    selectedCategoryId,
    type
) {

    if (
        selectedCategoryId !==
        "__create_new__"
    ) {
        return selectedCategoryId;
    }

    const name =
        recurringCustomCategoryInput
            ?.value
            .trim();

    if (!name) {

        throw new Error(
            "Enter a name for the new category."
        );
    }

    const existing =
        categories.find(
            category =>
                category.name
                    .trim()
                    .toLowerCase() ===
                    name.toLowerCase()
                &&
                (
                    category.type ===
                        type
                    ||
                    category.type ===
                        "both"
                )
        );

    if (existing) {

        if (!existing.is_active) {

            const {
                error
            } =
                await supabase
                    .from("categories")
                    .update({
                        is_active:
                            true
                    })
                    .eq(
                        "id",
                        existing.id
                    );

            if (error) {
                throw error;
            }
        }

        await loadCategories();

        return existing.id;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("categories")
            .insert({
                user_id:
                    currentUser.id,
                name,
                type
            })
            .select(
                "id"
            )
            .single();

    if (error) {
        throw error;
    }

    await loadCategories();

    return data.id;
}


if (recurringForm) {

    configureFinanceSubmit({
    form: recurringForm, button: saveRecurringButton, cancel: cancelRecurringEditButton,
    message: recurringMessage, label: "Recurring Item", getEditId: () => editingRecurringId,
    validate: validateRecurringSubmit, afterUnlock: updateRecurringReminderControls
}, async function (event, markSaved) {

            event.preventDefault();

            if (!currentUser) {
                return;
            }

            const name =
                recurringNameInput
                    .value
                    .trim();

            const kind =
                recurringKindSelect.value;

            const type =
                recurringTypeSelect.value;

            const accountId =
                recurringAccountSelect.value;

            const recurringPaymentMethodId =
                recurringPaymentMethodSelect
                    ?.value ||
                null;

            let categoryId =
                recurringCategorySelect.value;

            const amount =
                Number.parseFloat(
                    recurringAmountInput
                        .value
                );

            const frequency =
                recurringFrequencySelect
                    .value;

            const nextDueDate =
                recurringNextDueDateInput
                    .value;

            const reminderEnabled =
                recurringReminderEnabled
                    ? recurringReminderEnabled
                        .checked
                    : true;

            const reminderDaysBefore =
                Number.parseInt(
                    recurringReminderDays
                        ?.value ||
                    "3",
                    10
                );

            const notes =
                recurringNotesInput
                    .value
                    .trim();

            let incomeSourceId =
                null;

            if (type === "income") incomeSourceId = recurringIncomeSourceSelect.value;
            categoryId = await resolveRecurringCategoryId(categoryId, type);

            const payload = {
                user_id:
                    currentUser.id,
                name,
                kind,
                type,
                account_id:
                    accountId,
                payment_method_id:
                    recurringPaymentMethodId || null,
                category_id:
                    categoryId,
                income_source_id:
                    incomeSourceId,
                amount,
                frequency,
                next_due_date:
                    nextDueDate,
                reminder_enabled:
                    reminderEnabled,
                reminder_days_before:
                    reminderEnabled
                        ? reminderDaysBefore
                        : 3,
                notes:
                    notes || null
            };

            const result =
                editingRecurringId ===
                null
                    ? await supabase
                        .from(
                            "recurring_transactions"
                        )
                        .insert(payload)
                    : await supabase
                        .from(
                            "recurring_transactions"
                        )
                        .update(payload)
                        .eq(
                            "id",
                            editingRecurringId
                        );
        if (result.error) throw result.error;
        markSaved();

            const wasEditing = editingRecurringId !== null;
        resetRecurringForm(true);
        showTransactionSuccessSnackbar({
            title: "Recurring Item" + (wasEditing ? " updated" : " added"),
            message: "Your recurring item was saved successfully."
        });

            await loadRecurringTransactions(true);
        }
    );
}


// ======================================================
// SMART QUICK FILL
// ======================================================

function normaliseQuickFillText(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


function getQuickFillCandidates(
    searchValue = ""
) {

    const search =
        normaliseQuickFillText(
            searchValue
        );

    const seenDescriptions =
        new Set();

    const candidates =
        [];

    transactions.forEach(
        function (transaction) {

            const description =
                String(
                    transaction.description ||
                    ""
                ).trim();

            if (!description) {
                return;
            }

            const normalisedDescription =
                normaliseQuickFillText(
                    description
                );

            if (
                search &&
                !normalisedDescription.includes(
                    search
                )
            ) {
                return;
            }

            if (
                seenDescriptions.has(
                    normalisedDescription
                )
            ) {
                return;
            }

            seenDescriptions.add(
                normalisedDescription
            );

            candidates.push(
                transaction
            );
        }
    );

    return candidates.slice(
        0,
        5
    );
}


function hideDescriptionSuggestions() {

    if (!descriptionSuggestions) {
        return;
    }

    descriptionSuggestions.style.display =
        "none";

    descriptionSuggestions.innerHTML =
        "";
}


function formatQuickFillMeta(
    transaction
) {

    const parts = [
        getCategoryName(
            transaction.category_id
        ),
        getAccountName(
            transaction.account_id
        )
    ];

    if (
        transaction.type ===
        "income"
    ) {

        const source =
            getIncomeSourceName(
                transaction.income_source_id
            );

        if (source) {
            parts.push(source);
        }
    }

    const paymentMethodName =
        getPaymentMethodName(
            transaction.payment_method_id
        );

    if (paymentMethodName) {
        parts.push(
            paymentMethodName
        );
    }

    const tagNames =
        getTransactionTagNames(
            transaction
        );

    if (tagNames.length) {
        parts.push(
            tagNames.join(", ")
        );
    }

    return parts
        .filter(Boolean)
        .join(" • ");
}


function applyQuickFillSuggestion(
    transaction
) {

    if (!transaction) {
        return;
    }

    transactionDescriptionInput.value =
        transaction.description || "";

    transactionTypeSelect.value =
        transaction.type ||
        "expense";

    refreshTransactionDropdowns(
        transaction
    );

    if (transactionTagsInput) {

        transactionTagsInput.value =
            getTransactionTagNames(
                transaction
            ).join(", ");
    }

    customCategoryGroup.style.display =
        "none";

    customIncomeSourceGroup.style.display =
        "none";

    hideDescriptionSuggestions();

    transactionDescriptionInput.focus();
}


function renderDescriptionSuggestions(
    searchValue = ""
) {

    if (
        !descriptionSuggestions ||
        editingTransactionId !== null ||
        transactionTypeSelect?.value ===
            "transfer"
    ) {

        hideDescriptionSuggestions();

        return;
    }

    const candidates =
        getQuickFillCandidates(
            searchValue
        );

    descriptionSuggestions.innerHTML =
        "";

    if (!candidates.length) {

        hideDescriptionSuggestions();

        return;
    }

    candidates.forEach(
        function (transaction) {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "description-suggestion-item";


            const textWrap =
                document.createElement(
                    "span"
                );

            textWrap.className =
                "description-suggestion-text";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                transaction.description;


            const meta =
                document.createElement(
                    "span"
                );

            meta.textContent =
                formatQuickFillMeta(
                    transaction
                );


            textWrap.appendChild(
                title
            );

            if (meta.textContent) {
                textWrap.appendChild(
                    meta
                );
            }


            const badge =
                document.createElement(
                    "span"
                );

            badge.className =
                "description-suggestion-badge";

            badge.textContent =
                "Quick Fill";


            button.appendChild(
                textWrap
            );

            button.appendChild(
                badge
            );


            button.addEventListener(
                "click",
                function () {

                    applyQuickFillSuggestion(
                        transaction
                    );
                }
            );


            descriptionSuggestions.appendChild(
                button
            );
        }
    );

    descriptionSuggestions.style.display =
        "grid";
}


if (transactionDescriptionInput) {

    transactionDescriptionInput.addEventListener(
        "focus",
        function () {

            if (
                editingTransactionId ===
                null
            ) {

                renderDescriptionSuggestions(
                    transactionDescriptionInput
                        .value
                );
            }
        }
    );


    transactionDescriptionInput.addEventListener(
        "input",
        function () {

            if (
                editingTransactionId !==
                null
            ) {

                hideDescriptionSuggestions();

                return;
            }

            const value =
                transactionDescriptionInput
                    .value;

            if (
                value.trim().length <
                2
            ) {

                if (
                    !value.trim()
                ) {

                    renderDescriptionSuggestions(
                        ""
                    );

                } else {

                    hideDescriptionSuggestions();
                }

                return;
            }

            renderDescriptionSuggestions(
                value
            );
        }
    );
}


document.addEventListener(
    "click",
    function (event) {

        if (
            !descriptionSuggestions ||
            !transactionDescriptionInput
        ) {
            return;
        }

        const target =
            event.target;

        if (
            descriptionSuggestions.contains(
                target
            ) ||
            transactionDescriptionInput.contains(
                target
            )
        ) {
            return;
        }

        hideDescriptionSuggestions();
    }
);


// ======================================================
// TRANSACTION DROPDOWN EVENTS
// ======================================================

transactionAccountSelect
    ?.addEventListener(
        "change",
        function () {

            syncPaymentMethodForSelectedCreditCard();
        }
    );


transactionTypeSelect.addEventListener(
    "change",
    function () {

        if (
            editingTransactionId !== null &&
            transactionTypeSelect.value ===
                "transfer"
        ) {

            const existingTransaction =
                transactions.find(
                    item =>
                        item.id ===
                            editingTransactionId
                );

            transactionTypeSelect.value =
                existingTransaction?.type ||
                "expense";

            alert(
                "Cancel the current transaction edit before creating a transfer."
            );
        }

        populateCategorySelect();

        updateIncomeSourceVisibility();

        customCategoryGroup.style.display =
            "none";

        customIncomeSourceGroup.style.display =
            "none";

        updateTransactionMode();
    }
);


transactionCategorySelect.addEventListener(
    "change",
    function () {

        customCategoryGroup.style.display =
            transactionCategorySelect.value ===
                "__other__"
                ? "block"
                : "none";
    }
);


transactionIncomeSourceSelect.addEventListener(
    "change",
    function () {

        customIncomeSourceGroup.style.display =
            transactionIncomeSourceSelect.value ===
                "__other__"
                ? "block"
                : "none";
    }
);


// ======================================================
// CUSTOM CATEGORY
// ======================================================

async function createCategoryFromTransaction(
    type
) {

    const name =
        customCategoryInput
            .value
            .trim();

    if (!name) {

        alert(
            "Enter a new category name."
        );

        return null;
    }

    const existing =
        categories.find(
            category =>
                category.name
                    .toLowerCase() ===
                    name.toLowerCase()
                &&
                (
                    category.type ===
                        type
                    ||
                    category.type ===
                        "both"
                )
        );

    if (existing) {

        return existing;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("categories")
            .insert({

                user_id:
                    currentUser.id,

                name,
                type
            })
            .select()
            .single();

    if (error) throw error;

    categories.push(
        data
    );

    renderCategories();

    populateBudgetCategorySelect();

    return data;
}


// ======================================================
// CUSTOM INCOME SOURCE
// ======================================================

async function createIncomeSourceFromTransaction() {

    const name =
        customIncomeSourceInput
            .value
            .trim();

    if (!name) {

        alert(
            "Enter a new income source name."
        );

        return null;
    }

    const existing =
        incomeSources.find(
            source =>
                source.name
                    .toLowerCase() ===
                    name.toLowerCase()
        );

    if (existing) {

        return existing;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("income_sources")
            .insert({

                user_id:
                    currentUser.id,

                name
            })
            .select()
            .single();

    if (error) throw error;

    incomeSources.push(
        data
    );

    renderIncomeSources();

    return data;
}


// ======================================================
// RECEIPT OCR V3
// Region OCR + fuzzy merchant + MY date recovery
// ======================================================

let receiptOcrProgressOffset =
    0;

let receiptOcrProgressScale =
    1;


const RECEIPT_MERCHANT_LIBRARY = [
    {
        name:
            "Watsons",
        aliases: [
            "watsons",
            "watson"
        ]
    },
    {
        name:
            "Guardian",
        aliases: [
            "guardian"
        ]
    },
    {
        name:
            "99 Speedmart",
        aliases: [
            "99speedmart",
            "speedmart"
        ]
    },
    {
        name:
            "7-Eleven",
        aliases: [
            "7eleven",
            "seveneleven"
        ]
    },
    {
        name:
            "Mydin",
        aliases: [
            "mydin"
        ]
    },
    {
        name:
            "Lotus's",
        aliases: [
            "lotuss",
            "lotus"
        ]
    },
    {
        name:
            "MR.DIY",
        aliases: [
            "mrdiy",
            "mr diy"
        ]
    },
    {
        name:
            "FamilyMart",
        aliases: [
            "familymart",
            "family mart"
        ]
    },
    {
        name:
            "KK Super Mart",
        aliases: [
            "kksupermart",
            "kk super mart"
        ]
    },
    {
        name:
            "Jaya Grocer",
        aliases: [
            "jayagrocer",
            "jaya grocer"
        ]
    },
    {
        name:
            "Village Grocer",
        aliases: [
            "villagegrocer",
            "village grocer"
        ]
    },
    {
        name:
            "AEON",
        aliases: [
            "aeon"
        ]
    }
];


function isReceiptImage(file) {

    return Boolean(
        file &&
        file.type &&
        file.type.startsWith("image/")
    );
}


function resetReceiptOcr() {

    receiptOcrResultData =
        null;

    if (receiptOcrResult) {
        receiptOcrResult.style.display =
            "none";
    }

    if (receiptOcrProgress) {
        receiptOcrProgress.style.display =
            "none";
    }

    if (receiptOcrProgressFill) {
        receiptOcrProgressFill.style.width =
            "0%";
    }

    if (receiptOcrStatus) {
        receiptOcrStatus.textContent =
            "Ready to scan.";
    }

    if (receiptOcrConfidence) {
        receiptOcrConfidence.textContent =
            "";
    }

    if (receiptOcrMerchant) {
        receiptOcrMerchant.value =
            "";
    }

    if (receiptOcrAmount) {
        receiptOcrAmount.value =
            "";
    }

    if (receiptOcrDate) {
        receiptOcrDate.value =
            "";
    }

    if (receiptOcrRawText) {
        receiptOcrRawText.textContent =
            "";
    }

    if (receiptAiFallback) {
        receiptAiFallback.style.display =
            "none";
    }

    if (receiptAiStatus) {
        receiptAiStatus.textContent =
            "";
        receiptAiStatus.className =
            "receipt-ai-status";
    }

    updateReceiptScanButton();
}


function updateReceiptScanButton() {

    if (!scanReceiptButton) {
        return;
    }

    const canScan =
        isReceiptImage(
            selectedReceiptFile
        ) &&
        !receiptOcrRunning;

    scanReceiptButton.disabled =
        !canScan;

    scanReceiptButton.textContent =
        receiptOcrRunning
            ? "Scanning..."
            : "Scan Receipt";
}


function setReceiptOcrProgress(
    progress,
    message
) {

    const safeProgress =
        Math.max(
            0,
            Math.min(
                1,
                Number(progress) || 0
            )
        );

    if (receiptOcrProgress) {
        receiptOcrProgress.style.display =
            "block";
    }

    if (receiptOcrProgressFill) {
        receiptOcrProgressFill.style.width =
            `${Math.round(
                safeProgress * 100
            )}%`;
    }

    if (receiptOcrStatus) {
        receiptOcrStatus.textContent =
            message ||
            `Scanning ${Math.round(
                safeProgress * 100
            )}%`;
    }
}


function normaliseReceiptText(text) {

    return String(text || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .trim();
}


function getReceiptLines(text) {

    return normaliseReceiptText(text)
        .split("\n")
        .map(
            line =>
                line
                    .replace(/\s+/g, " ")
                    .trim()
        )
        .filter(Boolean);
}


function mergeReceiptLines(
    ...texts
) {

    const merged =
        [];

    const seen =
        new Set();

    texts.forEach(
        function (text) {

            getReceiptLines(text)
                .forEach(
                    function (line) {

                        const key =
                            line
                                .toLowerCase()
                                .replace(
                                    /[^a-z0-9]/g,
                                    ""
                                );

                        if (
                            !key ||
                            seen.has(key)
                        ) {
                            return;
                        }

                        seen.add(key);

                        merged.push(line);
                    }
                );
        }
    );

    return merged;
}


function looksLikeReceiptDateLine(line) {

    return (
        /\b\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}\b/.test(line)
        ||
        /\b\d{4}[\/.\-]\d{1,2}[\/.\-]\d{1,2}\b/.test(line)
        ||
        /\b[0-3]\d[01]\d20\d{2}\b/.test(line)
        ||
        /\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{2,4}\b/i.test(line)
        ||
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}\b/i.test(line)
    );
}


function looksLikeReceiptAmountLine(line) {

    return (
        /\b(?:RM|MYR)\s*\d/i.test(line)
        ||
        /\b\d{1,6}[.,]\d{2}\b/.test(line)
    );
}


function cleanMerchantName(value) {

    return String(value || "")
        .replace(
            /^[^A-Za-z0-9]+|[^A-Za-z0-9)&.'\- ]+$/g,
            ""
        )
        .replace(/\s{2,}/g, " ")
        .trim();
}


function normaliseMerchantForMatch(value) {

    return String(value || "")
        .toLowerCase()
        .replace(/0/g, "o")
        .replace(/[1|!]/g, "i")
        .replace(/[^a-z0-9]/g, "");
}


function levenshteinDistance(
    first,
    second
) {

    const a =
        String(first || "");

    const b =
        String(second || "");

    if (!a.length) {
        return b.length;
    }

    if (!b.length) {
        return a.length;
    }

    let previous =
        Array.from(
            {
                length:
                    b.length + 1
            },
            (
                _,
                index
            ) =>
                index
        );

    for (
        let row = 1;
        row <= a.length;
        row += 1
    ) {

        const current = [
            row
        ];

        for (
            let column = 1;
            column <= b.length;
            column += 1
        ) {

            const substitutionCost =
                a[row - 1] ===
                b[column - 1]
                    ? 0
                    : 1;

            current[column] =
                Math.min(
                    current[
                        column - 1
                    ] + 1,
                    previous[
                        column
                    ] + 1,
                    previous[
                        column - 1
                    ] +
                    substitutionCost
                );
        }

        previous =
            current;
    }

    return previous[
        b.length
    ];
}


function merchantSimilarity(
    first,
    second
) {

    const a =
        normaliseMerchantForMatch(
            first
        );

    const b =
        normaliseMerchantForMatch(
            second
        );

    if (
        !a ||
        !b
    ) {
        return 0;
    }

    if (
        a.includes(b) ||
        b.includes(a)
    ) {

        const shortLength =
            Math.min(
                a.length,
                b.length
            );

        if (
            shortLength >=
            5
        ) {
            return 0.96;
        }
    }

    const distance =
        levenshteinDistance(
            a,
            b
        );

    return (
        1 -
        distance /
        Math.max(
            a.length,
            b.length
        )
    );
}


function findFuzzyKnownMerchant(lines) {

    let best =
        null;

    lines
        .slice(0, 24)
        .forEach(
            function (
                line,
                lineIndex
            ) {

                const cleaned =
                    cleanMerchantName(
                        line
                    );

                if (
                    cleaned.length < 3 ||
                    cleaned.length > 90
                ) {
                    return;
                }

                const chunks = [
                    cleaned,
                    ...cleaned
                        .split(/\s+/)
                        .filter(
                            item =>
                                item.length >=
                                3
                        )
                ];

                RECEIPT_MERCHANT_LIBRARY
                    .forEach(
                        function (
                            merchant
                        ) {

                            merchant.aliases
                                .forEach(
                                    function (
                                        alias
                                    ) {

                                        chunks.forEach(
                                            function (
                                                chunk
                                            ) {

                                                const similarity =
                                                    merchantSimilarity(
                                                        chunk,
                                                        alias
                                                    );

                                                let score =
                                                    similarity;

                                                score +=
                                                    Math.max(
                                                        0,
                                                        0.08 -
                                                        lineIndex *
                                                        0.004
                                                    );

                                                if (
                                                    !best ||
                                                    score >
                                                    best.score
                                                ) {

                                                    best = {
                                                        name:
                                                            merchant.name,
                                                        score,
                                                        source:
                                                            cleaned
                                                    };
                                                }
                                            }
                                        );
                                    }
                                );
                        }
                    );
            }
        );

    if (
        best &&
        best.score >=
        0.68
    ) {

        return best.name;
    }

    return null;
}


function canonicaliseReceiptMerchant(value) {

    const cleaned =
        cleanMerchantName(value);

    if (!cleaned) {
        return null;
    }

    const fuzzy =
        findFuzzyKnownMerchant(
            [cleaned]
        );

    if (fuzzy) {
        return fuzzy;
    }

    return cleaned
        .replace(
            /\b(?:sdn\.?\s*bhd\.?|berhad|enterprise)\b.*$/i,
            ""
        )
        .trim()
        ||
        cleaned;
}


function extractReceiptMerchant(
    topLines,
    fullLines
) {

    const regionLines =
        mergeReceiptLines(
            topLines.join("\n"),
            fullLines
                .slice(0, 20)
                .join("\n")
        );

    const fuzzyMerchant =
        findFuzzyKnownMerchant(
            regionLines
        );

    if (fuzzyMerchant) {
        return fuzzyMerchant;
    }

    const rejected =
        /\b(receipt|tax invoice|invoice|official receipt|cash bill|welcome|thank you|thanks|tel|telephone|phone|fax|email|www\.|http|gst|sst|tax|date|time|cashier|counter|table|order|queue|transaction|terminal|merchant id|address|company reg|registration|loyalty|statement|opening balance|closing balance|earned points)\b/i;

    const addressLike =
        /\b(jalan|jln|lorong|persiaran|taman|lot|level|tingkat|floor|unit|no\.?|postcode|selangor|kuala lumpur|malaysia|plaza|mall|centre|center)\b/i;

    let best =
        null;

    regionLines
        .slice(0, 24)
        .forEach(
            function (
                line,
                index
            ) {

                const cleaned =
                    cleanMerchantName(
                        line
                    );

                if (
                    cleaned.length < 3 ||
                    cleaned.length > 80
                ) {
                    return;
                }

                if (
                    rejected.test(cleaned) ||
                    looksLikeReceiptDateLine(cleaned) ||
                    looksLikeReceiptAmountLine(cleaned)
                ) {
                    return;
                }

                const letters =
                    (
                        cleaned.match(
                            /[A-Za-z]/g
                        )
                        ||
                        []
                    ).length;

                const digits =
                    (
                        cleaned.match(
                            /\d/g
                        )
                        ||
                        []
                    ).length;

                if (
                    letters < 3 ||
                    digits > letters
                ) {
                    return;
                }

                let score =
                    22 -
                    Math.min(
                        index,
                        18
                    );

                if (
                    /\b(sdn\.?\s*bhd\.?|berhad|enterprise|trading|restaurant|restoran|cafe|coffee|mart|market|pharmacy|store|stores|shop|bakery|kitchen|food|hotel|personal care)\b/i
                        .test(cleaned)
                ) {
                    score += 13;
                }

                const uppercaseLetters =
                    (
                        cleaned.match(
                            /[A-Z]/g
                        )
                        ||
                        []
                    ).length;

                if (
                    letters >= 4 &&
                    uppercaseLetters /
                    letters >
                    0.58
                ) {
                    score += 4;
                }

                if (
                    addressLike.test(cleaned)
                ) {
                    score -= 8;
                }

                if (
                    /reg\.?\s*no|sst|company/i
                        .test(cleaned)
                ) {
                    score -= 10;
                }

                if (
                    !best ||
                    score >
                    best.score
                ) {

                    best = {
                        value:
                            canonicaliseReceiptMerchant(
                                cleaned
                            ),
                        score
                    };
                }
            }
        );

    return best?.value || null;
}


function parseReceiptMoney(value) {

    if (!value) {
        return null;
    }

    let cleaned =
        String(value)
            .replace(
                /(?:RM|MYR|\s)/gi,
                ""
            )
            .replace(
                /[^\d,.\-]/g,
                ""
            );

    if (
        cleaned.includes(",") &&
        cleaned.includes(".")
    ) {

        cleaned =
            cleaned.replace(/,/g, "");

    } else if (
        cleaned.includes(",") &&
        !cleaned.includes(".")
    ) {

        const parts =
            cleaned.split(",");

        if (
            parts.length === 2 &&
            parts[1].length === 2
        ) {

            cleaned =
                `${parts[0]}.${parts[1]}`;

        } else {

            cleaned =
                cleaned.replace(/,/g, "");
        }
    }

    const number =
        Number.parseFloat(cleaned);

    if (
        !Number.isFinite(number) ||
        number <= 0 ||
        number > 1000000
    ) {
        return null;
    }

    return Math.round(
        number * 100
    ) / 100;
}


function getMoneyValuesFromLine(line) {

    const normalised =
        String(line || "")
            .replace(
                /R[MNm]\s*/g,
                "RM"
            );

    const matches =
        normalised.match(
            /(?:RM|MYR)?\s*\d{1,7}(?:[,.]\d{2})/gi
        )
        ||
        [];

    return matches
        .map(parseReceiptMoney)
        .filter(
            value =>
                value !== null
        );
}


function scoreReceiptAmountLine(line) {

    let score =
        0;

    if (
        /\bgrand\s*total\b/i.test(line)
    ) {
        score += 150;

    } else if (
        /\b(total\s*amount|amount\s*due|net\s*total|balance\s*due)\b/i
            .test(line)
    ) {
        score += 140;

    } else if (
        /\bsub\s*total\b|\bsubtotal\b/i
            .test(line)
    ) {
        score += 115;

    } else if (
        /\btotal\b/i.test(line)
    ) {
        score += 130;
    }

    if (
        /\b(RM|MYR)\b/i.test(line)
    ) {
        score += 20;
    }

    if (
        /\b(mastercard|visa|debit|credit|card|online|ewallet|e-wallet|wallet|duitnow|touch.?n.?go|tng)\b/i
            .test(line)
    ) {
        score += 75;
    }

    if (
        /\b(payment|paid|tender)\b/i
            .test(line)
    ) {
        score += 45;
    }

    if (
        /\b(change|cash change|balance change)\b/i
            .test(line)
    ) {
        score -= 170;
    }

    if (
        /\b(discount|saving|voucher|rebate)\b/i
            .test(line)
    ) {
        score -= 80;
    }

    if (
        /\b(sst|gst|service charge|tax)\b/i
            .test(line)
    ) {
        score -= 80;
    }

    return score;
}


function extractReceiptAmount(
    fullLines,
    amountLines
) {

    const candidates =
        [];

    [
        {
            lines:
                fullLines,
            sourceBonus:
                0
        },
        {
            lines:
                amountLines,
            sourceBonus:
                0
        }
    ].forEach(
        function (group) {

            group.lines.forEach(
                function (
                    line,
                    index
                ) {

                    const values =
                        getMoneyValuesFromLine(
                            line
                        );

                    if (!values.length) {
                        return;
                    }

                    const lineScore =
                        scoreReceiptAmountLine(
                            line
                        );

                    values.forEach(
                        function (value) {

                            candidates.push({
                                value,
                                score:
                                    lineScore +
                                    group.sourceBonus +
                                    Math.max(
                                        0,
                                        8 -
                                        Math.floor(
                                            index / 8
                                        )
                                    ),
                                line
                            });
                        }
                    );
                }
            );
        }
    );

    if (!candidates.length) {
        return null;
    }

    candidates.forEach(
        function (candidate) {

            const sameValue =
                candidates.filter(
                    item =>
                        Math.abs(
                            item.value -
                            candidate.value
                        ) <
                        0.005
                );

            candidate.score +=
                Math.min(
                    48,
                    Math.max(
                        0,
                        sameValue.length - 1
                    ) *
                    12
                );
        }
    );

    candidates.sort(
        function (a, b) {

            if (
                b.score !==
                a.score
            ) {
                return (
                    b.score -
                    a.score
                );
            }

            return (
                b.value -
                a.value
            );
        }
    );

    const best =
        candidates[0];

    if (
        best.score <
        25
    ) {

        return Math.max(
            ...candidates.map(
                item =>
                    item.value
            )
        );
    }

    return best.value;
}


function padReceiptDatePart(value) {

    return String(value)
        .padStart(2, "0");
}


function makeReceiptIsoDate(
    year,
    month,
    day
) {

    const numericYear =
        Number(year);

    const numericMonth =
        Number(month);

    const numericDay =
        Number(day);

    const fullYear =
        numericYear < 100
            ? 2000 +
            numericYear
            : numericYear;

    if (
        fullYear < 2000 ||
        fullYear > 2100 ||
        numericMonth < 1 ||
        numericMonth > 12 ||
        numericDay < 1 ||
        numericDay > 31
    ) {
        return null;
    }

    const iso =
        `${fullYear}-${padReceiptDatePart(
            numericMonth
        )}-${padReceiptDatePart(
            numericDay
        )}`;

    const parsed =
        new Date(
            `${iso}T00:00:00`
        );

    if (
        Number.isNaN(
            parsed.getTime()
        ) ||
        parsed.getFullYear() !==
            fullYear ||
        parsed.getMonth() + 1 !==
            numericMonth ||
        parsed.getDate() !==
            numericDay
    ) {
        return null;
    }

    return iso;
}


function receiptMonthNumber(name) {

    const key =
        String(name || "")
            .toLowerCase()
            .slice(0, 3);

    const map = {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12
    };

    return map[key] || null;
}


function normaliseOcrDateToken(value) {

    return String(value || "")
        .toUpperCase()
        .replace(/[OQD]/g, "0")
        .replace(/[IL|!]/g, "1")
        .replace(/Z/g, "2")
        .replace(/S/g, "5")
        .replace(/G/g, "6")
        .replace(/B/g, "8")
        .replace(
            /[^0-9]/g,
            ""
        );
}


function pushReceiptDateCandidate(
    candidates,
    iso,
    score,
    source
) {

    if (!iso) {
        return;
    }

    candidates.push({
        value:
            iso,
        score,
        source
    });
}


function getReceiptDateCandidates(
    lines,
    sourceBonus = 0,
    sourceName = "full"
) {

    const candidates =
        [];

    lines.forEach(
        function (
            line,
            index
        ) {

            if (
                /\b(exp(?:iry|iration)?\s*date|valid\s*thru|valid\s*until)\b/i
                    .test(line)
            ) {
                return;
            }

            const timeBonus =
                /\b\d{1,2}:\d{2}(?::\d{2})?\b/
                    .test(line)
                    ? 34
                    : 0;

            const labelBonus =
                /\b(date|transaction date|trx date)\b/i
                    .test(line)
                    ? 30
                    : 0;

            const positionBonus =
                Math.max(
                    0,
                    12 -
                    Math.floor(
                        index / 8
                    )
                );

            const baseScore =
                sourceBonus +
                timeBonus +
                labelBonus +
                positionBonus;


            let match =
                line.match(
                    /\b(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})\b/
                );

            if (match) {

                pushReceiptDateCandidate(
                    candidates,
                    makeReceiptIsoDate(
                        match[1],
                        match[2],
                        match[3]
                    ),
                    baseScore +
                    45,
                    sourceName
                );
            }


            match =
                line.match(
                    /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/
                );

            if (match) {

                pushReceiptDateCandidate(
                    candidates,
                    makeReceiptIsoDate(
                        match[3],
                        match[2],
                        match[1]
                    ),
                    baseScore +
                    45,
                    sourceName
                );
            }


            match =
                line.match(
                    /\b(\d{1,2})\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{2,4})\b/i
                );

            if (match) {

                pushReceiptDateCandidate(
                    candidates,
                    makeReceiptIsoDate(
                        match[3],
                        receiptMonthNumber(
                            match[2]
                        ),
                        match[1]
                    ),
                    baseScore +
                    50,
                    sourceName
                );
            }


            // Tolerant compact-date recovery.
            // It can recover strings such as I8O82O26 -> 18082026.
            const tokens =
                String(line || "")
                    .split(
                        /[\s,;]+/
                    )
                    .filter(Boolean);

            tokens.forEach(
                function (token) {

                    const digits =
                        normaliseOcrDateToken(
                            token
                        );

                    if (
                        digits.length <
                        6
                    ) {
                        return;
                    }

                    const windows =
                        [];

                    if (
                        digits.length ===
                        8
                    ) {

                        windows.push({
                            value:
                                digits,
                            exact:
                                true
                        });

                    } else if (
                        digits.length >
                        8
                    ) {

                        for (
                            let offset = 0;
                            offset <=
                                digits.length -
                                8;
                            offset += 1
                        ) {

                            windows.push({
                                value:
                                    digits.slice(
                                        offset,
                                        offset + 8
                                    ),
                                exact:
                                    false
                            });
                        }
                    }


                    windows.forEach(
                        function (
                            windowValue
                        ) {

                            const value =
                                windowValue.value;

                            const day =
                                value.slice(
                                    0,
                                    2
                                );

                            const month =
                                value.slice(
                                    2,
                                    4
                                );

                            const year =
                                value.slice(
                                    4,
                                    8
                                );

                            const iso =
                                makeReceiptIsoDate(
                                    year,
                                    month,
                                    day
                                );

                            pushReceiptDateCandidate(
                                candidates,
                                iso,
                                baseScore +
                                (
                                    windowValue.exact
                                        ? 72
                                        : 42
                                ),
                                sourceName
                            );
                        }
                    );


                    if (
                        digits.length ===
                        6
                    ) {

                        pushReceiptDateCandidate(
                            candidates,
                            makeReceiptIsoDate(
                                digits.slice(
                                    4,
                                    6
                                ),
                                digits.slice(
                                    2,
                                    4
                                ),
                                digits.slice(
                                    0,
                                    2
                                )
                            ),
                            baseScore +
                            35,
                            sourceName
                        );
                    }
                }
            );
        }
    );

    return candidates;
}


function extractReceiptDate(
    fullLines,
    dateLines
) {

    const candidates = [
        ...getReceiptDateCandidates(
            fullLines,
            0,
            "full"
        ),
        ...getReceiptDateCandidates(
            dateLines,
            65,
            "bottom-region"
        )
    ];

    if (!candidates.length) {
        return null;
    }

    const today =
        new Date();

    candidates.forEach(
        function (candidate) {

            const parsed =
                new Date(
                    `${candidate.value}T00:00:00`
                );

            const futureLimit =
                new Date(today);

            futureLimit.setDate(
                futureLimit.getDate() +
                7
            );

            if (
                parsed >
                futureLimit
            ) {
                candidate.score -=
                    35;
            }

            const duplicates =
                candidates.filter(
                    item =>
                        item.value ===
                        candidate.value
                );

            candidate.score +=
                Math.min(
                    35,
                    Math.max(
                        0,
                        duplicates.length -
                        1
                    ) *
                    10
                );

            if (
                duplicates.some(
                    item =>
                        item.source ===
                        "bottom-region"
                )
            ) {
                candidate.score +=
                    15;
            }
        }
    );

    candidates.sort(
        (a, b) =>
            b.score -
            a.score
    );

    return (
        candidates[0]?.value
        ||
        null
    );
}


function analyseReceiptOcrRegions(
    fullData,
    merchantData,
    amountData,
    dateData
) {

    const fullText =
        fullData?.text || "";

    const merchantText =
        merchantData?.text || "";

    const amountText =
        amountData?.text || "";

    const dateText =
        dateData?.text || "";

    const fullLines =
        getReceiptLines(
            fullText
        );

    const topLines =
        getReceiptLines(
            merchantText
        );

    const amountLines =
        getReceiptLines(
            amountText
        );

    const dateLines =
        getReceiptLines(
            dateText
        );

    const confidenceValues = [
        Number(
            fullData?.confidence
        ) || 0,
        Number(
            merchantData?.confidence
        ) || 0,
        Number(
            amountData?.confidence
        ) || 0,
        Number(
            dateData?.confidence
        ) || 0
    ];

    return {
        merchant:
            extractReceiptMerchant(
                topLines,
                fullLines
            ),

        amount:
            extractReceiptAmount(
                fullLines,
                amountLines
            ),

        date:
            extractReceiptDate(
                fullLines,
                dateLines
            ),

        confidence:
            Math.max(
                ...confidenceValues
            ),

        rawText:
            [
                "FULL RECEIPT",
                normaliseReceiptText(
                    fullText
                )
                ||
                "No text recognised.",
                "",
                "TOP REGION — MERCHANT",
                normaliseReceiptText(
                    merchantText
                )
                ||
                "No text recognised.",
                "",
                "FULL HIGH-CONTRAST — AMOUNT",
                normaliseReceiptText(
                    amountText
                )
                ||
                "No text recognised.",
                "",
                "LOWER REGION — DATE",
                normaliseReceiptText(
                    dateText
                )
                ||
                "No text recognised."
            ].join("\n")
    };
}



function getReviewedReceiptOcrValues() {

    const merchant =
        receiptOcrMerchant
            ? receiptOcrMerchant.value.trim()
            : "";

    const amountValue =
        receiptOcrAmount
            ? Number.parseFloat(
                receiptOcrAmount.value
            )
            : NaN;

    const date =
        receiptOcrDate
            ? receiptOcrDate.value
            : "";

    return {
        merchant:
            merchant ||
            null,

        amount:
            Number.isFinite(
                amountValue
            ) &&
            amountValue > 0
                ? Math.round(
                    amountValue * 100
                ) / 100
                : null,

        date:
            date ||
            null
    };
}


function getReceiptAiFallbackReason(result) {

    if (!result) {
        return null;
    }

    const missing = [];

    if (!result.merchant) {
        missing.push(
            "merchant"
        );
    }

    if (
        result.amount ===
        null
    ) {
        missing.push(
            "amount"
        );
    }

    if (!result.date) {
        missing.push(
            "date"
        );
    }

    const confidence =
        Number(
            result.confidence
        ) || 0;

    if (missing.length) {

        return `Local OCR could not confidently find: ${missing.join(
            ", "
        )}.`;
    }

    if (
        confidence <
        RECEIPT_AI_CONFIDENCE_THRESHOLD
    ) {

        return `Local OCR confidence is ${Math.round(
            confidence
        )}%, below the ${RECEIPT_AI_CONFIDENCE_THRESHOLD}% review threshold.`;
    }

    return null;
}


function renderReceiptAiFallback(result) {

    if (!receiptAiFallback) {
        return;
    }

    const reason =
        getReceiptAiFallbackReason(
            result
        );

    receiptAiFallback.style.display =
        reason
            ? "flex"
            : "none";

    if (
        reason &&
        receiptAiReason
    ) {

        receiptAiReason.textContent =
            "AI Receipt Scan";
    }

    if (improveReceiptAiButton) {

        improveReceiptAiButton.disabled =
            true;

        improveReceiptAiButton.textContent =
            "Coming Soon";
    }

    if (
        reason &&
        receiptAiStatus
    ) {

        receiptAiStatus.textContent =
            "You can still edit Merchant, Amount and Date manually before applying the result.";

        receiptAiStatus.className =
            "receipt-ai-status";
    }
}


function setReceiptAiStatus(
    message,
    type = ""
) {

    if (!receiptAiStatus) {
        return;
    }

    receiptAiStatus.textContent =
        message || "";

    receiptAiStatus.className =
        "receipt-ai-status";

    if (type) {
        receiptAiStatus.classList.add(
            type
        );
    }
}


async function resizeReceiptForAi(file) {

    if (
        !file ||
        !file.type.startsWith(
            "image/"
        )
    ) {

        throw new Error(
            "AI receipt improvement currently supports image receipts only."
        );
    }

    const image =
        await loadReceiptImageElement(
            file
        );

    const maxDimension =
        1800;

    const scale =
        Math.min(
            1,
            maxDimension /
            Math.max(
                image.width,
                image.height
            )
        );

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        Math.max(
            1,
            Math.round(
                image.width *
                scale
            )
        );

    canvas.height =
        Math.max(
            1,
            Math.round(
                image.height *
                scale
            )
        );

    const context =
        canvas.getContext(
            "2d"
        );

    context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const dataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.84
        );

    canvas.width =
        1;

    canvas.height =
        1;

    return dataUrl;
}


function normaliseAiReceiptResult(data) {

    if (
        !data ||
        typeof data !==
        "object"
    ) {

        throw new Error(
            "AI returned an invalid receipt result."
        );
    }

    const merchant =
        typeof data.merchant ===
        "string"
            ? data.merchant.trim()
            : "";

    const amountNumber =
        typeof data.amount ===
        "number"
            ? data.amount
            : Number.parseFloat(
                data.amount
            );

    const date =
        typeof data.date ===
        "string"
            ? data.date.trim()
            : "";

    const confidenceNumber =
        Number(
            data.confidence
        );

    return {
        merchant:
            merchant ||
            null,

        amount:
            Number.isFinite(
                amountNumber
            ) &&
            amountNumber > 0
                ? Math.round(
                    amountNumber * 100
                ) / 100
                : null,

        date:
            /^\d{4}-\d{2}-\d{2}$/
                .test(date)
                ? date
                : null,

        confidence:
            Number.isFinite(
                confidenceNumber
            )
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        confidenceNumber
                    )
                )
                : 0
    };
}


async function improveReceiptWithAi() {

    if (!RECEIPT_AI_FEATURE_ENABLED) {

        setReceiptAiStatus(
            "AI Receipt Scan will be available in a future update."
        );

        return;
    }

    if (
        receiptAiRunning ||
        !selectedReceiptFile
    ) {
        return;
    }

    receiptAiRunning =
        true;

    if (improveReceiptAiButton) {
        improveReceiptAiButton.disabled =
            true;

        improveReceiptAiButton.textContent =
            "Improving...";
    }

    setReceiptAiStatus(
        "Preparing a smaller secure copy for AI review...",
        "working"
    );

    try {

        const imageDataUrl =
            await resizeReceiptForAi(
                selectedReceiptFile
            );

        const localResult =
            getReviewedReceiptOcrValues();

        setReceiptAiStatus(
            "AI is reviewing merchant, amount and transaction date...",
            "working"
        );

        const {
            data,
            error
        } =
            await supabase.functions
                .invoke(
                    "receipt-ai-scan",
                    {
                        body: {
                            image_data_url:
                                imageDataUrl,

                            local_result: {
                                ...localResult,

                                confidence:
                                    Number(
                                        receiptOcrResultData
                                            ?.confidence
                                    ) || 0
                            }
                        }
                    }
                );

        if (error) {
            throw error;
        }

        if (
            !data ||
            data.error
        ) {

            throw new Error(
                data?.error ||
                "AI receipt review failed."
            );
        }

        const improved =
            normaliseAiReceiptResult(
                data.result
            );

        receiptOcrResultData = {
            ...receiptOcrResultData,
            ...improved,
            source:
                "ai"
        };

        renderReceiptOcrResult(
            receiptOcrResultData
        );

        if (receiptOcrConfidence) {
            receiptOcrConfidence.textContent =
                `AI review confidence: ${Math.round(
                    improved.confidence
                )}%`;
        }

        if (receiptAiFallback) {
            receiptAiFallback.style.display =
                "none";
        }

        setReceiptAiStatus(
            "AI review complete. Edit any value if needed, then Apply to Form.",
            "success"
        );

    } catch (error) {

        console.error(
            "Receipt AI fallback error:",
            error
        );

        const message =
            error?.message ||
            "Unable to improve this receipt with AI.";

        setReceiptAiStatus(
            message,
            "error"
        );

        alert(message);

    } finally {

        receiptAiRunning =
            false;

        if (improveReceiptAiButton) {
            improveReceiptAiButton.disabled =
                true;

            improveReceiptAiButton.textContent =
                "Coming Soon";
        }
    }
}


if (improveReceiptAiButton) {

    improveReceiptAiButton.addEventListener(
        "click",
        improveReceiptWithAi
    );
}


function formatReceiptOcrDate(value) {

    if (!value) {
        return "Not found";
    }

    return formatDate(value);
}


function renderReceiptOcrResult(result) {

    if (!result) {
        return;
    }

    receiptOcrResultData =
        result;

    if (receiptOcrMerchant) {
        receiptOcrMerchant.value =
            result.merchant ||
            "";
    }

    if (receiptOcrAmount) {
        receiptOcrAmount.value =
            result.amount !== null
                ? Number(
                    result.amount
                ).toFixed(2)
                : "";
    }

    if (receiptOcrDate) {
        receiptOcrDate.value =
            result.date ||
            "";
    }

    if (receiptOcrConfidence) {

        const rounded =
            Math.round(
                result.confidence
            );

        receiptOcrConfidence.textContent =
            Number.isFinite(rounded)
                ? `Best OCR confidence: ${rounded}%`
                : "";
    }

    if (receiptOcrRawText) {
        receiptOcrRawText.textContent =
            result.rawText ||
            "No text recognised.";
    }

    if (receiptOcrResult) {
        receiptOcrResult.style.display =
            "block";
    }

    renderReceiptAiFallback(
        result
    );
}


async function loadReceiptImageElement(
    file
) {

    const objectUrl =
        URL.createObjectURL(
            file
        );

    try {

        const image =
            new Image();

        image.decoding =
            "async";

        await new Promise(
            function (
                resolve,
                reject
            ) {

                image.onload =
                    resolve;

                image.onerror =
                    function () {

                        reject(
                            new Error(
                                "Unable to read the receipt image."
                            )
                        );
                    };

                image.src =
                    objectUrl;
            }
        );

        return image;

    } finally {

        URL.revokeObjectURL(
            objectUrl
        );
    }
}


function getReceiptCanvasSize(
    image
) {

    const maxWidth =
        1650;

    const maxHeight =
        3000;

    const minWidth =
        1250;

    let scale =
        1;

    if (
        image.width <
        minWidth
    ) {

        scale =
            minWidth /
            image.width;
    }

    if (
        image.width *
        scale >
        maxWidth
    ) {

        scale =
            maxWidth /
            image.width;
    }

    if (
        image.height *
        scale >
        maxHeight
    ) {

        scale =
            Math.min(
                scale,
                maxHeight /
                image.height
            );
    }

    return {
        width:
            Math.max(
                1,
                Math.round(
                    image.width *
                    scale
                )
            ),

        height:
            Math.max(
                1,
                Math.round(
                    image.height *
                    scale
                )
            )
    };
}


function createReceiptBaseCanvas(
    image
) {

    const size =
        getReceiptCanvasSize(
            image
        );

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        size.width;

    canvas.height =
        size.height;

    const context =
        canvas.getContext(
            "2d",
            {
                willReadFrequently:
                    true
            }
        );

    context.imageSmoothingEnabled =
        true;

    context.imageSmoothingQuality =
        "high";

    context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas;
}


function cropReceiptRegion(
    sourceCanvas,
    startRatio,
    endRatio
) {

    const safeStart =
        Math.max(
            0,
            Math.min(
                0.95,
                startRatio
            )
        );

    const safeEnd =
        Math.max(
            safeStart +
            0.05,
            Math.min(
                1,
                endRatio
            )
        );

    const sourceY =
        Math.round(
            sourceCanvas.height *
            safeStart
        );

    const sourceHeight =
        Math.max(
            1,
            Math.round(
                sourceCanvas.height *
                (
                    safeEnd -
                    safeStart
                )
            )
        );

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        sourceCanvas.width;

    canvas.height =
        sourceHeight;

    const context =
        canvas.getContext(
            "2d",
            {
                willReadFrequently:
                    true
            }
        );

    context.drawImage(
        sourceCanvas,
        0,
        sourceY,
        sourceCanvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas;
}


function calculateOtsuThreshold(
    grayscaleValues
) {

    const histogram =
        new Array(256)
            .fill(0);

    grayscaleValues.forEach(
        value => {

            histogram[value] +=
                1;
        }
    );

    const total =
        grayscaleValues.length;

    let sum =
        0;

    for (
        let index = 0;
        index < 256;
        index += 1
    ) {

        sum +=
            index *
            histogram[index];
    }

    let sumBackground =
        0;

    let weightBackground =
        0;

    let bestVariance =
        -1;

    let threshold =
        160;

    for (
        let index = 0;
        index < 256;
        index += 1
    ) {

        weightBackground +=
            histogram[index];

        if (
            weightBackground ===
            0
        ) {
            continue;
        }

        const weightForeground =
            total -
            weightBackground;

        if (
            weightForeground ===
            0
        ) {
            break;
        }

        sumBackground +=
            index *
            histogram[index];

        const meanBackground =
            sumBackground /
            weightBackground;

        const meanForeground =
            (
                sum -
                sumBackground
            ) /
            weightForeground;

        const variance =
            weightBackground *
            weightForeground *
            (
                meanBackground -
                meanForeground
            ) ** 2;

        if (
            variance >
            bestVariance
        ) {

            bestVariance =
                variance;

            threshold =
                index;
        }
    }

    return threshold;
}


function preprocessReceiptCanvas(
    sourceCanvas,
    mode
) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        sourceCanvas.width;

    canvas.height =
        sourceCanvas.height;

    const context =
        canvas.getContext(
            "2d",
            {
                willReadFrequently:
                    true
            }
        );

    context.drawImage(
        sourceCanvas,
        0,
        0
    );

    const imageData =
        context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    const pixels =
        imageData.data;

    const grayscale =
        new Uint8Array(
            pixels.length / 4
        );

    let grayIndex =
        0;

    for (
        let index = 0;
        index < pixels.length;
        index += 4
    ) {

        const value =
            Math.round(
                pixels[index] *
                    0.299
                +
                pixels[index + 1] *
                    0.587
                +
                pixels[index + 2] *
                    0.114
            );

        grayscale[grayIndex] =
            value;

        grayIndex +=
            1;
    }


    if (
        mode ===
        "binary"
    ) {

        const otsu =
            calculateOtsuThreshold(
                grayscale
            );

        const threshold =
            Math.min(
                225,
                otsu + 10
            );

        grayIndex =
            0;

        for (
            let index = 0;
            index < pixels.length;
            index += 4
        ) {

            const value =
                grayscale[
                    grayIndex
                ] <
                threshold
                    ? 0
                    : 255;

            pixels[index] =
                value;

            pixels[index + 1] =
                value;

            pixels[index + 2] =
                value;

            pixels[index + 3] =
                255;

            grayIndex +=
                1;
        }

    } else {

        const contrast =
            mode ===
            "merchant"
                ? 1.75
                : 1.55;

        const brightness =
            mode ===
            "merchant"
                ? 12
                : 8;

        grayIndex =
            0;

        for (
            let index = 0;
            index < pixels.length;
            index += 4
        ) {

            let value =
                grayscale[
                    grayIndex
                ];

            value =
                (
                    value -
                    128
                ) *
                contrast
                +
                128
                +
                brightness;

            value =
                Math.max(
                    0,
                    Math.min(
                        255,
                        Math.round(
                            value
                        )
                    )
                );

            pixels[index] =
                value;

            pixels[index + 1] =
                value;

            pixels[index + 2] =
                value;

            pixels[index + 3] =
                255;

            grayIndex +=
                1;
        }
    }

    context.putImageData(
        imageData,
        0,
        0
    );

    return canvas;
}


function releaseReceiptCanvas(canvas) {

    if (!canvas) {
        return;
    }

    canvas.width =
        1;

    canvas.height =
        1;
}


async function getReceiptOcrWorker() {

    if (receiptOcrWorker) {
        return receiptOcrWorker;
    }

    setReceiptOcrProgress(
        0.02,
        "Preparing OCR engine..."
    );

    receiptOcrWorker =
        await createWorker(
            "eng",
            1,
            {
                logger:
                    function (message) {

                        if (
                            typeof message.progress ===
                            "number"
                        ) {

                            const mappedProgress =
                                receiptOcrProgressOffset
                                +
                                message.progress *
                                receiptOcrProgressScale;

                            const label =
                                message.status
                                    ? message.status
                                        .replace(/_/g, " ")
                                    : "Scanning receipt";

                            setReceiptOcrProgress(
                                mappedProgress,
                                label
                            );
                        }
                    }
            }
        );

    return receiptOcrWorker;
}


async function recogniseReceiptCanvas(
    worker,
    canvas,
    {
        offset,
        scale,
        message,
        pageSegMode,
        whitelist = ""
    }
) {

    receiptOcrProgressOffset =
        offset;

    receiptOcrProgressScale =
        scale;

    setReceiptOcrProgress(
        offset,
        message
    );

    const parameters = {
        tessedit_pageseg_mode:
            pageSegMode,
        preserve_interword_spaces:
            "1"
    };

    if (whitelist) {
        parameters.tessedit_char_whitelist =
            whitelist;
    } else {
        parameters.tessedit_char_whitelist =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:/-()&' ";
    }

    await worker.setParameters(
        parameters
    );

    return worker.recognize(
        canvas
    );
}


async function scanSelectedReceipt() {

    if (
        receiptOcrRunning ||
        !isReceiptImage(
            selectedReceiptFile
        )
    ) {
        return;
    }

    receiptOcrRunning =
        true;

    receiptOcrResultData =
        null;

    updateReceiptScanButton();

    if (receiptOcrResult) {
        receiptOcrResult.style.display =
            "none";
    }

    let baseCanvas =
        null;

    setReceiptOcrProgress(
        0,
        "Preparing receipt image..."
    );

    try {

        const worker =
            await getReceiptOcrWorker();

        const image =
            await loadReceiptImageElement(
                selectedReceiptFile
            );

        baseCanvas =
            createReceiptBaseCanvas(
                image
            );


        // 1. Full receipt baseline.
        let fullProcessed =
            preprocessReceiptCanvas(
                baseCanvas,
                "grayscale"
            );

        const fullResult =
            await recogniseReceiptCanvas(
                worker,
                fullProcessed,
                {
                    offset:
                        0.08,
                    scale:
                        0.20,
                    message:
                        "1 of 4: reading full receipt...",
                    pageSegMode:
                        "6"
                }
            );

        releaseReceiptCanvas(
            fullProcessed
        );

        fullProcessed =
            null;


        // 2. Top region: merchant / logo / company name.
        let topCrop =
            cropReceiptRegion(
                baseCanvas,
                0,
                0.38
            );

        let topProcessed =
            preprocessReceiptCanvas(
                topCrop,
                "merchant"
            );

        releaseReceiptCanvas(
            topCrop
        );

        topCrop =
            null;

        const merchantResult =
            await recogniseReceiptCanvas(
                worker,
                topProcessed,
                {
                    offset:
                        0.30,
                    scale:
                        0.19,
                    message:
                        "2 of 4: checking merchant region...",
                    pageSegMode:
                        "11"
                }
            );

        releaseReceiptCanvas(
            topProcessed
        );

        topProcessed =
            null;


        // 3. Full-receipt high-contrast pass for amount.
        // This restores the v2 strategy that was much more stable
        // for TOTAL / SUBTOTAL / card-payment lines.
        let amountProcessed =
            preprocessReceiptCanvas(
                baseCanvas,
                "binary"
            );

        const amountResult =
            await recogniseReceiptCanvas(
                worker,
                amountProcessed,
                {
                    offset:
                        0.51,
                    scale:
                        0.19,
                    message:
                        "3 of 4: checking totals across full receipt...",
                    pageSegMode:
                        "11"
                }
            );

        releaseReceiptCanvas(
            amountProcessed
        );

        amountProcessed =
            null;


        // 4. Lower region: date-specific digit OCR.
        // v3.2 extends the overlapping lower scan all the way
        // to the bottom edge so dates printed very low are included.
        // Full-receipt date candidates are still kept separately.
        let dateCrop =
            cropReceiptRegion(
                baseCanvas,
                0.50,
                1.00
            );

        let dateProcessed =
            preprocessReceiptCanvas(
                dateCrop,
                "binary"
            );

        releaseReceiptCanvas(
            dateCrop
        );

        dateCrop =
            null;

        const dateResult =
            await recogniseReceiptCanvas(
                worker,
                dateProcessed,
                {
                    offset:
                        0.72,
                    scale:
                        0.20,
                    message:
                        "4 of 4: searching lower receipt for date...",
                    pageSegMode:
                        "11",
                    whitelist:
                        "0123456789/.-: OQDBSILZG"
                }
            );

        releaseReceiptCanvas(
            dateProcessed
        );

        dateProcessed =
            null;


        setReceiptOcrProgress(
            0.94,
            "Combining region results..."
        );

        const result =
            analyseReceiptOcrRegions(
                fullResult?.data,
                merchantResult?.data,
                amountResult?.data,
                dateResult?.data
            );

        renderReceiptOcrResult(
            result
        );

        setReceiptOcrProgress(
            1,
            "Scan complete. Review merchant, amount and date before applying."
        );

    } catch (error) {

        console.error(
            "Receipt OCR v3 error:",
            error
        );

        setReceiptOcrProgress(
            0,
            "Receipt scan failed."
        );

        alert(
            error?.message
            ||
            "Unable to scan this receipt image."
        );

    } finally {

        receiptOcrRunning =
            false;

        receiptOcrProgressOffset =
            0;

        receiptOcrProgressScale =
            1;

        releaseReceiptCanvas(
            baseCanvas
        );

        updateReceiptScanButton();
    }
}


if (scanReceiptButton) {

    scanReceiptButton.addEventListener(
        "click",
        scanSelectedReceipt
    );
}


if (applyReceiptOcrButton) {

    applyReceiptOcrButton.addEventListener(
        "click",
        function () {

            if (!receiptOcrResultData) {
                return;
            }

            const descriptionInput =
                document.getElementById(
                    "description"
                );

            const amountInput =
                document.getElementById(
                    "amount"
                );

            const reviewed =
                getReviewedReceiptOcrValues();

            if (
                reviewed.merchant &&
                descriptionInput
            ) {

                descriptionInput.value =
                    reviewed.merchant;
            }

            if (
                reviewed.amount !==
                    null &&
                amountInput
            ) {

                amountInput.value =
                    reviewed.amount.toFixed(
                        2
                    );
            }

            if (
                reviewed.date &&
                dateInput
            ) {

                dateInput.value =
                    reviewed.date;
            }

            receiptOcrResultData = {
                ...receiptOcrResultData,
                ...reviewed
            };

            if (receiptOcrStatus) {
                receiptOcrStatus.textContent =
                    "Your reviewed values were applied to the transaction form. Check once more before saving.";
            }

            transactionForm.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "start"
            });
        }
    );
}


if (dismissReceiptOcrButton) {

    dismissReceiptOcrButton.addEventListener(
        "click",
        function () {

            if (receiptOcrResult) {
                receiptOcrResult.style.display =
                    "none";
            }
        }
    );
}


// ======================================================
// RECEIPT STORAGE / PREVIEW
// ======================================================

function formatReceiptFileSize(bytes) {

    const size =
        Number(bytes) || 0;

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(
            size / 1024
        ).toFixed(1)} KB`;
    }

    return `${(
        size / (1024 * 1024)
    ).toFixed(1)} MB`;
}


function clearReceiptObjectUrl() {

    if (selectedReceiptObjectUrl) {

        URL.revokeObjectURL(
            selectedReceiptObjectUrl
        );

        selectedReceiptObjectUrl =
            null;
    }
}


function clearSelectedReceipt() {

    selectedReceiptFile =
        null;

    resetReceiptOcr();

    clearReceiptObjectUrl();

    if (receiptFileInput) {
        receiptFileInput.value =
            "";
    }

    if (receiptPreviewImage) {
        receiptPreviewImage.src =
            "";

        receiptPreviewImage.style.display =
            "none";
    }

    if (receiptPreviewPdf) {
        receiptPreviewPdf.style.display =
            "none";
    }

    if (receiptPreview) {
        receiptPreview.style.display =
            "none";
    }

    if (receiptFileName) {
        receiptFileName.textContent =
            "";
    }

    if (receiptFileMeta) {
        receiptFileMeta.textContent =
            "";
    }
}


function renderSelectedReceiptPreview(file) {

    if (!file || !receiptPreview) {
        return;
    }

    clearReceiptObjectUrl();

    selectedReceiptFile =
        file;

    receiptPreview.style.display =
        "flex";

    if (receiptFileName) {
        receiptFileName.textContent =
            file.name ||
            "Receipt";
    }

    if (receiptFileMeta) {
        receiptFileMeta.textContent =
            `${formatReceiptFileSize(
                file.size
            )} • ${
                file.type === "application/pdf"
                    ? "PDF"
                    : "Image"
            }`;
    }

    if (
        file.type ===
        "application/pdf"
    ) {

        if (receiptPreviewImage) {
            receiptPreviewImage.style.display =
                "none";
        }

        if (receiptPreviewPdf) {
            receiptPreviewPdf.style.display =
                "flex";
        }

    } else {

        selectedReceiptObjectUrl =
            URL.createObjectURL(file);

        if (receiptPreviewImage) {
            receiptPreviewImage.src =
                selectedReceiptObjectUrl;

            receiptPreviewImage.style.display =
                "block";
        }

        if (receiptPreviewPdf) {
            receiptPreviewPdf.style.display =
                "none";
        }
    }

    updateReceiptScanButton();

    setReceiptAiStatus(
        ""
    );

    if (receiptMessage) {

        if (
            file.type ===
            "application/pdf"
        ) {

            receiptMessage.textContent =
                "PDF is ready to upload. Receipt Scan currently works with JPG, PNG and WebP images only.";

        } else {

            receiptMessage.textContent =
                editingReceiptPath
                    ? "This new receipt will replace the saved receipt when you save changes. You can scan it before saving."
                    : "Receipt ready to upload. You can scan it before saving the transaction.";
        }
    }
}


function renderSavedReceiptPanel() {

    if (!savedReceiptPanel) {
        return;
    }

    const shouldShow =
        Boolean(editingReceiptPath);

    savedReceiptPanel.style.display =
        shouldShow
            ? "flex"
            : "none";

    savedReceiptPanel.classList.toggle(
        "marked-for-removal",
        removeEditingReceipt
    );

    if (viewSavedReceiptButton) {

        viewSavedReceiptButton.disabled =
            removeEditingReceipt;
    }

    if (removeSavedReceiptButton) {

        removeSavedReceiptButton.textContent =
            removeEditingReceipt
                ? "Undo"
                : "Remove";
    }
}


function getReceiptExtension(file) {

    const extensionByType = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "application/pdf": "pdf"
    };

    return (
        extensionByType[file.type]
        ||
        "bin"
    );
}


function generateReceiptUniqueId() {

    if (
        globalThis.crypto &&
        typeof globalThis.crypto.randomUUID === "function"
    ) {

        return globalThis.crypto.randomUUID();
    }

    const timestamp =
        Date.now().toString(36);

    const randomPart =
        Math.random()
            .toString(36)
            .slice(2, 12);

    return `${timestamp}-${randomPart}`;
}


function createReceiptStoragePath(file) {

    const extension =
        getReceiptExtension(file);

    const dateFolder =
        getTodayDate();

    const uniqueId =
        generateReceiptUniqueId();

    return `${currentUser.id}/${dateFolder}/${uniqueId}.${extension}`;
}


async function uploadReceipt(file) {

    const path =
        createReceiptStoragePath(file);

    const {
        data,
        error
    } =
        await supabase.storage
            .from(RECEIPT_BUCKET)
            .upload(
                path,
                file,
                {
                    cacheControl:
                        "3600",
                    upsert:
                        false,
                    contentType:
                        file.type
                }
            );

    if (error) {
        throw error;
    }

    return (
        data?.path
        ||
        path
    );
}


async function deleteReceipt(path) {

    if (!path) {
        return true;
    }

    const {
        error
    } =
        await supabase.storage
            .from(RECEIPT_BUCKET)
            .remove([path]);

    if (error) {

        console.warn(
            "Receipt cleanup error:",
            error
        );

        return false;
    }

    return true;
}


async function openReceipt(path) {

    if (!path) {
        return;
    }

    const previewWindow =
        isNativeApp ? null : window.open(
            "about:blank",
            "_blank"
        );

    const {
        data,
        error
    } =
        await supabase.storage
            .from(RECEIPT_BUCKET)
            .createSignedUrl(
                path,
                60
            );

    if (error || !data?.signedUrl) {

        if (previewWindow) {
            previewWindow.close();
        }

        alert(
            error?.message
            ||
            "Unable to open this receipt."
        );

        return;
    }

    if (previewWindow) {

        previewWindow.location.href =
            data.signedUrl;

    } else {

        window.location.href =
            data.signedUrl;
    }
}


if (receiptFileInput) {

    receiptFileInput.addEventListener(
        "change",
        function () {

            const file =
                receiptFileInput.files?.[0];

            if (!file) {
                clearSelectedReceipt();
                return;
            }

            if (
                !ALLOWED_RECEIPT_TYPES.has(
                    file.type
                )
            ) {

                alert(
                    "Receipt must be JPG, PNG, WebP or PDF."
                );

                clearSelectedReceipt();

                return;
            }

            if (
                file.size >
                MAX_RECEIPT_FILE_SIZE
            ) {

                alert(
                    "Receipt must be 5 MB or smaller."
                );

                clearSelectedReceipt();

                return;
            }

            removeEditingReceipt =
                false;

            renderSavedReceiptPanel();

            renderSelectedReceiptPreview(
                file
            );
        }
    );
}


if (removeSelectedReceiptButton) {

    removeSelectedReceiptButton.addEventListener(
        "click",
        function () {

            clearSelectedReceipt();

            if (receiptMessage) {
                receiptMessage.textContent =
                    "";
            }
        }
    );
}


if (viewSavedReceiptButton) {

    viewSavedReceiptButton.addEventListener(
        "click",
        function () {

            if (
                editingReceiptPath &&
                !removeEditingReceipt
            ) {

                openReceipt(
                    editingReceiptPath
                );
            }
        }
    );
}


if (removeSavedReceiptButton) {

    removeSavedReceiptButton.addEventListener(
        "click",
        function () {

            if (!editingReceiptPath) {
                return;
            }

            removeEditingReceipt =
                !removeEditingReceipt;

            renderSavedReceiptPanel();

            if (receiptMessage) {

                receiptMessage.textContent =
                    removeEditingReceipt
                        ? "Saved receipt will be removed when you save changes."
                        : "Saved receipt will be kept.";
            }
        }
    );
}


// ======================================================
// CREATE / UPDATE TRANSACTION
// ======================================================

configureFinanceSubmit({
    form: transactionForm, button: submitButton, cancel: cancelEditButton,
    label: "Transaction", getEditId: () => editingTransactionId ?? editingTransferId,
    validate: validateTransactionSubmit,
    afterUnlock: () => {
        if (editingTransferId === null) {
            transactionTypeSelect.disabled = false;
        }
        updateReceiptScanButton();
        updateTransactionMode();
    }
}, async function (event, markSaved) {

        event.preventDefault();

        if (!currentUser) {
            return;
        }

        const description =
            transactionDescriptionInput
                .value
                .trim();

        const accountId =
            transactionAccountSelect.value;

        const paymentMethodId =
            transactionPaymentMethodSelect
                ?.value ||
            null;

        const type =
            transactionTypeSelect.value;

        let categoryId =
            transactionCategorySelect.value;

        let incomeSourceId =
            null;

        const amount =
            parseFloat(
                document
                    .getElementById("amount")
                    .value
            );

        const transactionDate =
            document
                .getElementById("date")
                .value;

        const wasEditingTransaction =
            editingTransactionId !== null;

        const wasRecurringLog =
            editingTransactionId === null &&
            pendingRecurringId !== null;

        const recurringIdToAdvance =
            editingTransactionId === null
                ? pendingRecurringId
                : null;

        const recurringDueDateToAdvance =
            recurringIdToAdvance
                ? pendingRecurringDueDate
                : null;

        const notes =
            document
                .getElementById("notes")
                .value
                .trim();

        if (
            type ===
            "transfer"
        ) {

            const wasEditingTransfer =
                editingTransferId !== null;

            await saveAccountTransfer({
                id:
                    editingTransferId,
                userId:
                    currentUser.id,
                fromAccountId:
                    transferFromAccountSelect.value,
                toAccountId:
                    transferToAccountSelect.value,
                amount,
                transferDate:
                    transactionDate,
                description,
                notes
            });

            markSaved();

            resetTransactionForm(
                true
            );

            showTransactionSuccessSnackbar({
                title:
                    wasEditingTransfer
                        ? "Transfer updated"
                        : "Transfer completed",
                message:
                    "Account balances were updated without changing income or spending."
            });

            await loadTransfers(
                true
            );

            return;
        }

        const tagNames =
            parseTransactionTagNames(
                transactionTagsInput
                    ?.value
            );

        // CUSTOM CATEGORY

        if (
            categoryId ===
            "__other__"
        ) {

            const category =
                await createCategoryFromTransaction(
                    type
                );

            if (!category) {
                return;
            }

            categoryId =
                category.id;
        }


        // INCOME SOURCE

        if (
            type === "income"
        ) {

            incomeSourceId =
                transactionIncomeSourceSelect.value;

            if (!incomeSourceId) {

                alert(
                    "Please select an income source."
                );

                return;
            }

            if (
                incomeSourceId ===
                "__other__"
            ) {

                const source =
                    await createIncomeSourceFromTransaction();

                if (!source) {
                    return;
                }

                incomeSourceId =
                    source.id;
            }
        }

        const desiredTagIds = await ensureTagsForNames(tagNames);

        const originalReceiptPath =
            editingTransactionId === null
                ? null
                : editingReceiptPath;

        let uploadedReceiptPath =
            null;

        let nextReceiptPath =
            originalReceiptPath;


        {

            if (selectedReceiptFile) {

                uploadedReceiptPath =
                    await uploadReceipt(
                        selectedReceiptFile
                    );

                nextReceiptPath =
                    uploadedReceiptPath;

            } else if (
                editingTransactionId !== null &&
                removeEditingReceipt
            ) {

                nextReceiptPath =
                    null;
            }


            let recurringNextDueDate =
                null;

            if (
                recurringIdToAdvance &&
                recurringDueDateToAdvance
            ) {

                const recurringItem =
                    recurringTransactions.find(
                        item =>
                            item.id ===
                            recurringIdToAdvance
                    );

                if (recurringItem) {

                    recurringNextDueDate =
                        nextRecurringDateAfter(
                            recurringItem,
                            recurringDueDateToAdvance,
                            transactionDate
                        );
                }
            }


            const existingTransaction =
                editingTransactionId !== null
                    ? transactions.find(
                        item =>
                            item.id ===
                            editingTransactionId
                    )
                    : null;


            const transactionData = {

                user_id:
                    currentUser.id,

                account_id:
                    accountId,

                payment_method_id:
                    paymentMethodId || null,

                category_id:
                    categoryId,

                income_source_id:
                    incomeSourceId,

                description,

                notes:
                    notes || null,

                amount,

                type,

                transaction_date:
                    transactionDate,

                receipt_path:
                    nextReceiptPath,

                recurring_id:
                    recurringIdToAdvance ||
                    existingTransaction?.recurring_id ||
                    null,

                recurring_due_date:
                    recurringDueDateToAdvance ||
                    existingTransaction?.recurring_due_date ||
                    null,

                recurring_next_due_date:
                    recurringNextDueDate ||
                    existingTransaction?.recurring_next_due_date ||
                    null
            };


            let result;

            if (
                editingTransactionId === null
            ) {

                result =
                    await supabase
                        .from("transactions")
                        .insert(
                            transactionData
                        )
                        .select("id")
                        .single();

            } else {

                result =
                    await supabase
                        .from("transactions")
                        .update(
                            transactionData
                        )
                        .eq(
                            "id",
                            editingTransactionId
                        )
                        .select("id")
                        .single();
            }


            if (result.error) {

                if (uploadedReceiptPath) {
                    await deleteReceipt(
                        uploadedReceiptPath
                    );
                }

                throw result.error;
            }


            markSaved();

            const savedTransactionId =
                result.data?.id ||
                editingTransactionId;

            let tagSyncWarning =
                null;

            try {

                await syncTransactionTags(
                    savedTransactionId,
                    desiredTagIds
                );

            } catch (error) {

                console.error(
                    "Transaction tag sync error:",
                    error
                );

                tagSyncWarning =
                    "Transaction saved, but its tags could not be fully updated.";
            }


            if (
                originalReceiptPath &&
                originalReceiptPath !==
                    nextReceiptPath
            ) {

                await deleteReceipt(
                    originalReceiptPath
                );
            }


            let recurringAdvanceWarning =
                null;

            if (recurringIdToAdvance) {

                try {

                    await advanceRecurringSchedule(
                        recurringIdToAdvance,
                        recurringDueDateToAdvance,
                        recurringNextDueDate
                    );

                } catch (error) {
                    console.error("Recurring schedule advance error:", error);

                    recurringAdvanceWarning =
                        "Transaction saved, but the recurring schedule could not be advanced.";
                }
            }

            resetTransactionForm(true);



            if (wasRecurringLog) {

                showTransactionSuccessSnackbar({
                    title:
                        "Recurring transaction logged",
                    message:
                        recurringAdvanceWarning || "The transaction was saved and the recurring schedule was updated."
                });

            } else if (wasEditingTransaction) {

                showTransactionSuccessSnackbar({
                    title:
                        "Transaction updated",
                    message:
                        "Your changes were saved successfully."
                });

            } else {

                showTransactionSuccessSnackbar({
                    title:
                        "Transaction added",
                    message:
                        "Your transaction was saved successfully."
                });
            }

            if (tagSyncWarning) {
                alert(
                    tagSyncWarning
                );
            }

            if (recurringAdvanceWarning) {
                alert(
                    recurringAdvanceWarning
                );
            }

            await loadTransactions(true);

        }
    }
);


// ======================================================
// RENDER TRANSACTIONS
// ======================================================

function populateTransactionFilterOptions() {

    if (
        !transactionFilterAccount ||
        !transactionFilterCategory ||
        !transactionFilterTag ||
        !transactionFilterPaymentMethod
    ) {
        return;
    }

    const selectedAccount =
        transactionFilterAccount.value ||
        "all";

    const selectedCategory =
        transactionFilterCategory.value ||
        "all";

    const selectedTag =
        transactionFilterTag.value ||
        "all";

    const selectedPaymentMethod =
        transactionFilterPaymentMethod.value ||
        "all";


    transactionFilterAccount.innerHTML =
        '<option value="all">All Accounts</option>';

    accounts.forEach(
        function (account) {

            addSelectOption(
                transactionFilterAccount,
                account.id,
                account.name +
                    (
                        account.is_active
                            ? ""
                            : " (Inactive)"
                    )
            );
        }
    );


    transactionFilterCategory.innerHTML =
        '<option value="all">All Categories</option>';

    categories.forEach(
        function (category) {

            addSelectOption(
                transactionFilterCategory,
                category.id,
                category.name +
                    (
                        category.is_active
                            ? ""
                            : " (Inactive)"
                    )
            );
        }
    );


    transactionFilterTag.innerHTML =
        '<option value="all">All Tags</option>';

    tags.forEach(
        function (tag) {

            addSelectOption(
                transactionFilterTag,
                tag.id,
                tag.name
            );
        }
    );


    transactionFilterPaymentMethod.innerHTML =
        '<option value="all">All Payment Methods</option>';

    addSelectOption(
        transactionFilterPaymentMethod,
        "none",
        "Not Specified"
    );

    paymentMethods.forEach(
        function (method) {

            addSelectOption(
                transactionFilterPaymentMethod,
                method.id,
                method.name +
                    (
                        method.is_active
                            ? ""
                            : " (Inactive)"
                    )
            );
        }
    );


    transactionFilterAccount.value =
        Array.from(
            transactionFilterAccount.options
        ).some(
            option =>
                option.value ===
                    selectedAccount
        )
            ? selectedAccount
            : "all";


    transactionFilterCategory.value =
        Array.from(
            transactionFilterCategory.options
        ).some(
            option =>
                option.value ===
                    selectedCategory
        )
            ? selectedCategory
            : "all";

    transactionFilterTag.value =
        Array.from(
            transactionFilterTag.options
        ).some(
            option =>
                option.value ===
                    selectedTag
        )
            ? selectedTag
            : "all";

    transactionFilterPaymentMethod.value =
        Array.from(
            transactionFilterPaymentMethod.options
        ).some(
            option =>
                option.value ===
                    selectedPaymentMethod
        )
            ? selectedPaymentMethod
            : "all";
}


function getFilteredTransactions() {

    const searchTerm =
        transactionSearchInput
            ?.value
            .trim()
            .toLowerCase()
        ||
        "";

    const selectedType =
        transactionFilterType
            ?.value
        ||
        "all";

    const selectedAccount =
        transactionFilterAccount
            ?.value
        ||
        "all";

    const selectedCategory =
        transactionFilterCategory
            ?.value
        ||
        "all";

    const selectedTag =
        transactionFilterTag
            ?.value
        ||
        "all";

    const selectedPaymentMethod =
        transactionFilterPaymentMethod
            ?.value
        ||
        "all";

    const selectedMonth =
        transactionFilterMonth
            ?.value
        ||
        "";

    const selectedFromDate =
        transactionFilterFromDate
            ?.value
        ||
        "";

    const selectedToDate =
        transactionFilterToDate
            ?.value
        ||
        "";

    const hasCustomDateRange =
        Boolean(
            selectedFromDate ||
            selectedToDate
        );

    const sortMode =
        transactionSortSelect
            ?.value
        ||
        "newest";


    if (
        selectedFromDate &&
        selectedToDate &&
        selectedFromDate >
            selectedToDate
    ) {
        return [];
    }


    const filtered =
        transactions.filter(
            function (transaction) {

                if (
                    selectedType !== "all" &&
                    transaction.type !==
                        selectedType
                ) {
                    return false;
                }


                if (
                    selectedAccount !== "all" &&
                    transaction.account_id !==
                        selectedAccount
                ) {
                    return false;
                }


                if (
                    selectedCategory !== "all" &&
                    transaction.category_id !==
                        selectedCategory
                ) {
                    return false;
                }


                if (
                    selectedTag !== "all" &&
                    !getTransactionTagIds(
                        transaction
                    ).includes(
                        selectedTag
                    )
                ) {
                    return false;
                }


                if (
                    selectedPaymentMethod === "none" &&
                    transaction.payment_method_id
                ) {
                    return false;
                }

                if (
                    selectedPaymentMethod !== "all" &&
                    selectedPaymentMethod !== "none" &&
                    transaction.payment_method_id !==
                        selectedPaymentMethod
                ) {
                    return false;
                }


                const transactionDate =
                    String(
                        transaction.transaction_date ||
                        ""
                    );


                if (
                    !hasCustomDateRange &&
                    selectedMonth &&
                    !transactionDate.startsWith(
                        selectedMonth
                    )
                ) {
                    return false;
                }


                if (
                    selectedFromDate &&
                    transactionDate <
                        selectedFromDate
                ) {
                    return false;
                }


                if (
                    selectedToDate &&
                    transactionDate >
                        selectedToDate
                ) {
                    return false;
                }


                if (searchTerm) {

                    const searchableText = [
                        transaction.description,
                        transaction.smart_description,
                        transaction.notes,
                        getCategoryName(
                            transaction.category_id
                        ),
                        getAccountName(
                            transaction.account_id
                        ),
                        getIncomeSourceName(
                            transaction.income_source_id
                        ),
                        getPaymentMethodName(
                            transaction.payment_method_id
                        ),
                        ...getTransactionTagNames(
                            transaction
                        ),
                        transaction.type
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    if (
                        !searchableText.includes(
                            searchTerm
                        )
                    ) {
                        return false;
                    }
                }


                return true;
            }
        );


    filtered.sort(
        function (a, b) {

            if (
                sortMode ===
                "highest"
            ) {
                return (
                    Number(b.amount) -
                    Number(a.amount)
                );
            }


            if (
                sortMode ===
                "lowest"
            ) {
                return (
                    Number(a.amount) -
                    Number(b.amount)
                );
            }


            const aDate =
                new Date(
                    `${a.transaction_date}T00:00:00`
                ).getTime();

            const bDate =
                new Date(
                    `${b.transaction_date}T00:00:00`
                ).getTime();


            if (aDate !== bDate) {

                return sortMode ===
                    "oldest"
                        ? aDate - bDate
                        : bDate - aDate;
            }


            const aCreated =
                new Date(
                    a.created_at || 0
                ).getTime();

            const bCreated =
                new Date(
                    b.created_at || 0
                ).getTime();


            return sortMode ===
                "oldest"
                    ? aCreated - bCreated
                    : bCreated - aCreated;
        }
    );


    return filtered;
}


function getFilteredTransfers() {

    const searchTerm =
        transactionSearchInput
            ?.value
            .trim()
            .toLowerCase()
        ||
        "";

    const selectedType =
        transactionFilterType
            ?.value
        ||
        "all";

    const selectedAccount =
        transactionFilterAccount
            ?.value
        ||
        "all";

    const selectedCategory =
        transactionFilterCategory
            ?.value
        ||
        "all";

    const selectedTag =
        transactionFilterTag
            ?.value
        ||
        "all";

    const selectedPaymentMethod =
        transactionFilterPaymentMethod
            ?.value
        ||
        "all";

    const selectedMonth =
        transactionFilterMonth
            ?.value
        ||
        "";

    const selectedFromDate =
        transactionFilterFromDate
            ?.value
        ||
        "";

    const selectedToDate =
        transactionFilterToDate
            ?.value
        ||
        "";

    if (
        selectedType !== "all" &&
        selectedType !== "transfer"
    ) {
        return [];
    }

    if (
        selectedCategory !== "all" ||
        selectedTag !== "all" ||
        selectedPaymentMethod !== "all"
    ) {
        return [];
    }

    return transfers.filter(
        function (transfer) {

            if (
                selectedAccount !== "all" &&
                transfer.from_account_id !==
                    selectedAccount &&
                transfer.to_account_id !==
                    selectedAccount
            ) {
                return false;
            }

            const transferDate =
                String(
                    transfer.transfer_date ||
                    ""
                );

            if (
                selectedMonth &&
                !selectedFromDate &&
                !selectedToDate &&
                !transferDate.startsWith(
                    selectedMonth
                )
            ) {
                return false;
            }

            if (
                selectedFromDate &&
                transferDate <
                    selectedFromDate
            ) {
                return false;
            }

            if (
                selectedToDate &&
                transferDate >
                    selectedToDate
            ) {
                return false;
            }

            if (searchTerm) {

                const searchableText = [
                    transfer.description,
                    transfer.notes,
                    getAccountName(
                        transfer.from_account_id
                    ),
                    getAccountName(
                        transfer.to_account_id
                    ),
                    "transfer"
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (
                    !searchableText.includes(
                        searchTerm
                    )
                ) {
                    return false;
                }
            }

            return true;
        }
    );
}


function sortTransactionActivities(
    activities
) {

    const sortMode =
        transactionSortSelect
            ?.value
        ||
        "newest";

    return activities.sort(
        function (
            first,
            second
        ) {

            if (
                sortMode ===
                "highest"
            ) {
                return (
                    Number(second.amount) -
                    Number(first.amount)
                );
            }

            if (
                sortMode ===
                "lowest"
            ) {
                return (
                    Number(first.amount) -
                    Number(second.amount)
                );
            }

            const firstDate =
                new Date(
                    `${first.activityDate}T00:00:00`
                ).getTime();

            const secondDate =
                new Date(
                    `${second.activityDate}T00:00:00`
                ).getTime();

            if (
                firstDate !==
                secondDate
            ) {
                return sortMode ===
                    "oldest"
                        ? firstDate -
                            secondDate
                        : secondDate -
                            firstDate;
            }

            const firstCreated =
                new Date(
                    first.createdAt ||
                    0
                ).getTime();

            const secondCreated =
                new Date(
                    second.createdAt ||
                    0
                ).getTime();

            return sortMode ===
                "oldest"
                    ? firstCreated -
                        secondCreated
                    : secondCreated -
                        firstCreated;
        }
    );
}


function updateTransactionFilterSummary(
    filteredCount,
    visibleCount
) {

    if (!transactionFilterSummary) {
        return;
    }

    transactionFilterSummary.classList.remove(
        "error"
    );

    const selectedFromDate =
        transactionFilterFromDate
            ?.value
        ||
        "";

    const selectedToDate =
        transactionFilterToDate
            ?.value
        ||
        "";

    if (
        selectedFromDate &&
        selectedToDate &&
        selectedFromDate >
            selectedToDate
    ) {

        transactionFilterSummary.textContent =
            "From date cannot be after To date.";

        transactionFilterSummary.classList.add(
            "error"
        );

        return;
    }

    const totalActivityCount =
        transactions.length +
        transfers.length;

    if (
        totalActivityCount ===
        0
    ) {

        transactionFilterSummary.textContent =
            "No active transactions or transfers yet.";

        return;
    }

    if (
        filteredCount ===
        0
    ) {

        transactionFilterSummary.textContent =
            "No activity matches the current filters.";

        return;
    }

    transactionFilterSummary.textContent =
        filteredCount ===
            totalActivityCount
            ? `Showing ${visibleCount} of ${totalActivityCount} activity items.`
            : `Showing ${visibleCount} of ${filteredCount} matching items (${totalActivityCount} total).`;
}


function createTransactionActivityRow(
    transaction
) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "transaction";

    const left =
        document.createElement(
            "div"
        );

    left.className =
        "transaction-info";

    const name =
        document.createElement(
            "p"
        );

    name.className =
        "transaction-name";

    name.textContent =
        transaction.description;

    const category =
        document.createElement(
            "p"
        );

    category.className =
        "transaction-category";

    category.textContent =
        [
            getCategoryName(
                transaction.category_id
            ) || "Uncategorized",
            getAccountName(
                transaction.account_id
            ) || "Unknown Account",
            getPaymentMethodName(
                transaction.payment_method_id
            )
        ]
            .filter(Boolean)
            .join(" • ");

    const date =
        document.createElement(
            "p"
        );

    date.className =
        "transaction-date";

    date.textContent =
        formatDate(
            transaction.transaction_date
        );

    left.append(
        name,
        category,
        date
    );

    const transactionTagNames =
        getTransactionTagNames(
            transaction
        );

    if (
        transactionTagNames.length
    ) {

        const tagList =
            document.createElement(
                "div"
            );

        tagList.className =
            "transaction-tag-list";

        transactionTagNames.forEach(
            function (
                tagName
            ) {

                const tag =
                    document.createElement(
                        "span"
                    );

                tag.className =
                    "transaction-tag-chip";

                tag.textContent =
                    tagName;

                tagList.appendChild(
                    tag
                );
            }
        );

        left.appendChild(
            tagList
        );
    }

    if (
        transaction.type ===
        "income"
    ) {

        const sourceName =
            getIncomeSourceName(
                transaction.income_source_id
            );

        if (sourceName) {

            const source =
                document.createElement(
                    "p"
                );

            source.className =
                "transaction-date";

            source.textContent =
                `Source: ${sourceName}`;

            left.appendChild(
                source
            );
        }
    }

    if (transaction.notes) {

        const note =
            document.createElement(
                "p"
            );

        note.className =
            "transaction-note";

        note.textContent =
            transaction.notes;

        left.appendChild(
            note
        );
    }

    if (transaction.receipt_path) {

        const receiptButton =
            document.createElement(
                "button"
            );

        receiptButton.type =
            "button";

        receiptButton.className =
            "transaction-receipt-button";

        receiptButton.textContent =
            "View Receipt";

        receiptButton.addEventListener(
            "click",
            function () {

                openReceipt(
                    transaction.receipt_path
                );
            }
        );

        left.appendChild(
            receiptButton
        );
    }

    const right =
        document.createElement(
            "div"
        );

    right.className =
        "transaction-actions";

    const amount =
        document.createElement(
            "p"
        );

    amount.className =
        `transaction-amount ${transaction.type}`;

    amount.textContent =
        (
            transaction.type ===
            "income"
                ? "+"
                : "-"
        )
        +
        formatMoney(
            transaction.amount
        );

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "action-buttons";

    const editButton =
        createTextButton(
            "Edit",
            "edit-button"
        );

    const deleteButton =
        createTextButton(
            "Delete",
            "delete-button delete-permanently-button"
        );

    editButton.addEventListener(
        "click",
        function () {

            editTransaction(
                transaction.id
            );
        }
    );

    deleteButton.addEventListener(
        "click",
        function () {

            deleteTransaction(
                transaction.id
            );
        }
    );

    buttons.append(
        editButton,
        deleteButton
    );

    right.append(
        amount,
        buttons
    );

    row.append(
        left,
        right
    );

    return row;
}


function createTransferActivityRow(
    transfer
) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "transaction transfer-activity";

    const left =
        document.createElement(
            "div"
        );

    left.className =
        "transaction-info";

    const name =
        document.createElement(
            "p"
        );

    name.className =
        "transaction-name";

    name.textContent =
        transfer.description ||
        "Account transfer";

    const route =
        document.createElement(
            "p"
        );

    route.className =
        "transaction-category";

    route.textContent =
        `Transfer • ${
            getAccountName(
                transfer.from_account_id
            ) || "Unknown Account"
        } → ${
            getAccountName(
                transfer.to_account_id
            ) || "Unknown Account"
        }`;

    const date =
        document.createElement(
            "p"
        );

    date.className =
        "transaction-date";

    date.textContent =
        formatDate(
            transfer.transfer_date
        );

    left.append(
        name,
        route,
        date
    );

    if (transfer.notes) {

        const note =
            document.createElement(
                "p"
            );

        note.className =
            "transaction-note";

        note.textContent =
            transfer.notes;

        left.appendChild(
            note
        );
    }

    const right =
        document.createElement(
            "div"
        );

    right.className =
        "transaction-actions";

    const amount =
        document.createElement(
            "p"
        );

    amount.className =
        "transaction-amount transfer";

    amount.textContent =
        `↔ ${formatMoney(
            transfer.amount
        )}`;

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "action-buttons";

    const editButton =
        createTextButton(
            "Edit",
            "edit-button"
        );

    const deleteButton =
        createTextButton(
            "Delete",
            "delete-button delete-permanently-button"
        );

    editButton.addEventListener(
        "click",
        function () {

            editTransfer(
                transfer.id
            );
        }
    );

    deleteButton.addEventListener(
        "click",
        function () {

            deleteTransfer(
                transfer.id
            );
        }
    );

    buttons.append(
        editButton,
        deleteButton
    );

    right.append(
        amount,
        buttons
    );

    row.append(
        left,
        right
    );

    return row;
}


function renderTransactions() {

    transactionList.innerHTML =
        "";

    renderSetupChecklist();

    populateTransactionFilterOptions();

    const totalActivityCount =
        transactions.length +
        transfers.length;

    if (
        totalActivityCount ===
        0
    ) {

        if (transactionViewAllButton) {
            transactionViewAllButton.style.display =
                "none";
        }

        updateTransactionFilterSummary(
            0,
            0
        );

        renderEmptyState(
            transactionList,
            {
                title:
                    "No activity yet",

                description:
                    "Record income, spending or a transfer to start building your financial picture.",

                actionLabel:
                    "Add transaction",

                actionPage:
                    "transactions",

                actionTargetId:
                    "transaction-form",

                focusId:
                    "description"
            }
        );

        return;
    }

    const activities = [
        ...getFilteredTransactions()
            .map(
                transaction => ({
                    kind:
                        "transaction",
                    amount:
                        Number(
                            transaction.amount
                        ),
                    activityDate:
                        transaction.transaction_date,
                    createdAt:
                        transaction.created_at,
                    item:
                        transaction
                })
            ),
        ...getFilteredTransfers()
            .map(
                transfer => ({
                    kind:
                        "transfer",
                    amount:
                        Number(
                            transfer.amount
                        ),
                    activityDate:
                        transfer.transfer_date,
                    createdAt:
                        transfer.created_at,
                    item:
                        transfer
                })
            )
    ];

    sortTransactionActivities(
        activities
    );

    if (!activities.length) {

        if (transactionViewAllButton) {
            transactionViewAllButton.style.display =
                "none";
        }

        updateTransactionFilterSummary(
            0,
            0
        );

        renderEmptyState(
            transactionList,
            "No activity matches your search or filters."
        );

        return;
    }

    const shouldLimit =
        !showAllTransactions &&
        activities.length >
            TRANSACTION_PREVIEW_LIMIT;

    const visibleActivities =
        shouldLimit
            ? activities.slice(
                0,
                TRANSACTION_PREVIEW_LIMIT
            )
            : activities;

    if (transactionViewAllButton) {

        if (
            activities.length <=
            TRANSACTION_PREVIEW_LIMIT
        ) {

            transactionViewAllButton.style.display =
                "none";

        } else {

            transactionViewAllButton.style.display =
                "inline-block";

            transactionViewAllButton.textContent =
                showAllTransactions
                    ? "Show Less"
                    : `View All (${activities.length})`;
        }
    }

    updateTransactionFilterSummary(
        activities.length,
        visibleActivities.length
    );

    visibleActivities.forEach(
        function (activity) {

            transactionList.appendChild(
                activity.kind ===
                    "transfer"
                    ? createTransferActivityRow(
                        activity.item
                    )
                    : createTransactionActivityRow(
                        activity.item
                    )
            );
        }
    );
}


function resetTransactionFilters() {

    if (transactionSearchInput) {
        transactionSearchInput.value =
            "";
    }

    if (transactionFilterType) {
        transactionFilterType.value =
            "all";
    }

    if (transactionFilterAccount) {
        transactionFilterAccount.value =
            "all";
    }

    if (transactionFilterCategory) {
        transactionFilterCategory.value =
            "all";
    }

    if (transactionFilterTag) {
        transactionFilterTag.value =
            "all";
    }

    if (transactionFilterPaymentMethod) {
        transactionFilterPaymentMethod.value =
            "all";
    }

    if (transactionFilterMonth) {
        transactionFilterMonth.value =
            "";
    }

    if (transactionFilterFromDate) {
        transactionFilterFromDate.value =
            "";
    }

    if (transactionFilterToDate) {
        transactionFilterToDate.value =
            "";
    }

    if (transactionSortSelect) {
        transactionSortSelect.value =
            "newest";
    }

    showAllTransactions =
        false;

    renderTransactions();
}


[
    transactionSearchInput,
    transactionFilterType,
    transactionFilterAccount,
    transactionFilterCategory,
    transactionFilterTag,
    transactionFilterPaymentMethod,
    transactionSortSelect
]
    .filter(Boolean)
    .forEach(
        function (control) {

            const eventName =
                control ===
                    transactionSearchInput
                    ? "input"
                    : "change";

            control.addEventListener(
                eventName,
                function () {

                    showAllTransactions =
                        false;

                    renderTransactions();
                }
            );
        }
    );


transactionFilterMonth
    ?.addEventListener(
        "change",
        function () {

            if (
                transactionFilterMonth.value
            ) {

                if (transactionFilterFromDate) {
                    transactionFilterFromDate.value =
                        "";
                }

                if (transactionFilterToDate) {
                    transactionFilterToDate.value =
                        "";
                }
            }

            showAllTransactions =
                false;

            renderTransactions();
        }
    );


[
    transactionFilterFromDate,
    transactionFilterToDate
]
    .filter(Boolean)
    .forEach(
        function (control) {

            control.addEventListener(
                "change",
                function () {

                    if (
                        control.value &&
                        transactionFilterMonth
                    ) {
                        transactionFilterMonth.value =
                            "";
                    }

                    showAllTransactions =
                        false;

                    renderTransactions();
                }
            );
        }
    );


resetTransactionFiltersButton
    ?.addEventListener(
        "click",
        resetTransactionFilters
    );


transactionViewAllButton
    ?.addEventListener(
        "click",
        function () {

            showAllTransactions =
                !showAllTransactions;

            renderTransactions();
        }
    );


// ======================================================
// RENDER DELETED
// ======================================================

function renderDeletedTransactions() {

    if (!deletedTransactionList) {
        return;
    }

    deletedTransactionList.innerHTML =
        "";

    if (!deletedTransactions.length) {

        renderEmptyState(
            deletedTransactionList,
            "No deleted transactions."
        );

        return;
    }

    deletedTransactions.forEach(
        function (transaction) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "deleted-transaction";


            const left =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "p"
                );

            name.className =
                "deleted-name";

            name.textContent =
                transaction.description;


            const meta =
                document.createElement(
                    "p"
                );

            meta.className =
                "deleted-meta";

            meta.textContent =
                `${formatMoney(
                    transaction.amount
                )} • Deleted ${formatDeletedDate(
                    transaction.deleted_at
                )}`;


            left.appendChild(name);
            left.appendChild(meta);


            const restore =
                createTextButton(
                    "Restore",
                    "restore-button positive-action-button"
                );


            restore.addEventListener(
                "click",
                function () {

                    restoreTransaction(
                        transaction.id
                    );
                }
            );


            row.appendChild(left);

            row.appendChild(
                restore
            );


            deletedTransactionList.appendChild(
                row
            );
        }
    );
}


// ======================================================
// EDIT / DELETE ACCOUNT TRANSFER
// ======================================================

function editTransfer(
    id
) {

    if (
        financeSavePending(
            transactionForm
        )
    ) {
        return;
    }

    clearFinanceFeedback(
        transactionForm
    );

    const transfer =
        transfers.find(
            item =>
                item.id ===
                id
        );

    if (!transfer) {
        return;
    }

    editingTransactionId =
        null;

    editingTransferId =
        transfer.id;

    transactionDescriptionInput.value =
        transfer.description ||
        "";

    document
        .getElementById(
            "amount"
        )
        .value =
        transfer.amount;

    dateInput.value =
        transfer.transfer_date;

    document
        .getElementById(
            "notes"
        )
        .value =
        transfer.notes ||
        "";

    transactionTypeSelect.value =
        "transfer";

    transactionTypeSelect.disabled =
        true;

    populateTransferAccountSelects(
        transfer.from_account_id,
        transfer.to_account_id
    );

    updateTransactionMode();

    clearSelectedReceipt();

    editingReceiptPath =
        null;

    removeEditingReceipt =
        false;

    renderSavedReceiptPanel();

    cancelEditButton.textContent =
        "Cancel";

    cancelEditButton.style.display =
        "inline-flex";

    scrollToFormAndFocus(
        transactionForm,
        transactionDescriptionInput
    );
}


async function finalizePendingTransferDelete() {

    if (!pendingTransferDelete) {
        return;
    }

    const target =
        pendingTransferDelete;

    pendingTransferDelete =
        null;

    if (transactionUndoTimer) {

        window.clearTimeout(
            transactionUndoTimer
        );

        transactionUndoTimer =
            null;
    }

    hideTransactionUndoSnackbar();

    try {

        await finalizeDeletedAccountTransfer(
            target.id
        );

    } catch (error) {

        console.warn(
            "Transfer cleanup error:",
            error
        );
    }
}


function showTransferUndoSnackbar(
    transfer
) {

    if (!transactionUndoSnackbar) {
        return;
    }

    pendingTransferDelete = {
        id:
            transfer.id,
        description:
            transfer.description ||
            "Account transfer"
    };

    if (transactionUndoTitle) {

        transactionUndoTitle.textContent =
            `"${
                pendingTransferDelete.description
            }" deleted`;
    }

    if (transactionUndoMessage) {

        transactionUndoMessage.textContent =
            "Undo within 5 seconds.";
    }

    transactionUndoSnackbar.classList.add(
        "show"
    );

    if (transactionUndoProgress) {

        transactionUndoProgress.style.animation =
            "none";

        void transactionUndoProgress.offsetWidth;

        transactionUndoProgress.style.animation =
            "transactionUndoCountdown 5s linear forwards";
    }

    transactionUndoTimer =
        window.setTimeout(
            finalizePendingTransferDelete,
            5000
        );
}


async function deleteTransfer(
    id
) {

    const transfer =
        transfers.find(
            item =>
                item.id ===
                id
        );

    if (!transfer) {
        return;
    }

    if (pendingTransactionDelete) {
        await finalizePendingTransactionDelete();
    }

    if (pendingTransferDelete) {
        await finalizePendingTransferDelete();
    }

    try {

        await softDeleteAccountTransfer(
            id
        );

    } catch (error) {

        alert(
            error?.message ||
            "Unable to delete this transfer."
        );

        return;
    }

    transfers =
        transfers.filter(
            item =>
                item.id !==
                id
        );

    renderAccounts();
    renderTransactions();

    showTransferUndoSnackbar(
        transfer
    );
}


async function undoPendingTransferDelete() {

    if (!pendingTransferDelete) {
        return;
    }

    const target =
        pendingTransferDelete;

    pendingTransferDelete =
        null;

    if (transactionUndoTimer) {

        window.clearTimeout(
            transactionUndoTimer
        );

        transactionUndoTimer =
            null;
    }

    hideTransactionUndoSnackbar();

    try {

        await restoreAccountTransfer(
            target.id
        );

        await loadTransfers(
            true
        );

    } catch (error) {

        alert(
            error?.message ||
            "Unable to restore this transfer."
        );
    }
}


async function undoPendingDelete() {

    if (pendingTransferDelete) {
        await undoPendingTransferDelete();
        return;
    }

    await undoPendingTransactionDelete();
}


// ======================================================
// EDIT TRANSACTION
// ======================================================

function editTransaction(id) {
    if (financeSavePending(transactionForm)) return;
    clearFinanceFeedback(transactionForm);

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );

    if (!transaction) {
        return;
    }

    transactionDescriptionInput.value =
        transaction.description;

    document
        .getElementById("amount")
        .value =
        transaction.amount;

    document
        .getElementById("date")
        .value =
        transaction.transaction_date;

    document
        .getElementById("notes")
        .value =
        transaction.notes || "";

    if (transactionTagsInput) {

        transactionTagsInput.value =
            getTransactionTagNames(
                transaction
            )
                .join(", ");
    }

    editingTransferId =
        null;

    transactionTypeSelect.disabled =
        false;

    transactionTypeSelect.value =
        transaction.type;

    editingTransactionId =
        transaction.id;

    hideDescriptionSuggestions();

    refreshTransactionDropdowns(
        transaction
    );

    clearSelectedReceipt();

    editingReceiptPath =
        transaction.receipt_path ||
        null;

    removeEditingReceipt =
        false;

    renderSavedReceiptPanel();

    if (receiptMessage) {
        receiptMessage.textContent =
            editingReceiptPath
                ? "You can view, remove or replace the saved receipt."
                : "";
    }

    formTitle.textContent =
        "Edit Transaction";

    submitButton.textContent =
        "Save Changes";

    cancelEditButton.textContent =
        "Cancel";

    cancelEditButton.style.display =
        "inline-flex";

    scrollToFormAndFocus(
        transactionForm,
        transactionDescriptionInput
    );
}


// ======================================================
// TRANSACTION DELETE WITH 5-SECOND UNDO
// ======================================================


function hideTransactionSuccessSnackbar() {

    if (!transactionSuccessSnackbar) {
        return;
    }

    transactionSuccessSnackbar.classList.remove(
        "show"
    );
}


function showTransactionSuccessSnackbar({
    title,
    message
}) {

    if (!transactionSuccessSnackbar) {
        return;
    }

    if (transactionSuccessTimer) {

        window.clearTimeout(
            transactionSuccessTimer
        );

        transactionSuccessTimer =
            null;
    }

    if (transactionSuccessTitle) {

        transactionSuccessTitle.textContent =
            title ||
            "Transaction saved";
    }

    if (transactionSuccessMessage) {

        transactionSuccessMessage.textContent =
            message ||
            "Your transaction has been saved successfully.";
    }

    transactionSuccessSnackbar.classList.add(
        "show"
    );

    transactionSuccessTimer =
        window.setTimeout(
            function () {

                hideTransactionSuccessSnackbar();

                transactionSuccessTimer =
                    null;
            },
            3200
        );
}


function hideTransactionUndoSnackbar() {

    if (!transactionUndoSnackbar) {
        return;
    }

    transactionUndoSnackbar.classList.remove(
        "show"
    );

    if (transactionUndoProgress) {
        transactionUndoProgress.style.animation =
            "none";
    }
}



async function setRecurringOccurrenceStatusDirect(
    recurringId,
    dueDate,
    status
) {

    if (
        !currentUser ||
        !recurringId ||
        !dueDate
    ) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from(
                "recurring_occurrence_statuses"
            )
            .upsert(
                {
                    user_id:
                        currentUser.id,
                    recurring_id:
                        recurringId,
                    due_date:
                        dueDate,
                    status
                },
                {
                    onConflict:
                        "user_id,recurring_id,due_date"
                }
            );

    if (error) {
        throw error;
    }
}


async function restoreRecurringAfterTransactionDelete(
    transaction
) {

    if (
        !transaction?.recurring_id ||
        !transaction?.recurring_due_date
    ) {
        return false;
    }

    await setRecurringOccurrenceStatusDirect(
        transaction.recurring_id,
        transaction.recurring_due_date,
        "pending"
    );


    if (
        transaction.recurring_next_due_date
    ) {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    "recurring_transactions"
                )
                .select(
                    "id, next_due_date"
                )
                .eq(
                    "id",
                    transaction.recurring_id
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (
            data &&
            (
                data.next_due_date ===
                    transaction.recurring_next_due_date
                ||
                data.next_due_date ===
                    transaction.recurring_due_date
            )
        ) {

            const {
                error:
                    scheduleError
            } =
                await supabase
                    .from(
                        "recurring_transactions"
                    )
                    .update({
                        next_due_date:
                            transaction.recurring_due_date
                    })
                    .eq(
                        "id",
                        transaction.recurring_id
                    );

            if (scheduleError) {
                throw scheduleError;
            }
        }
    }


    await loadRecurringOccurrenceStatuses();
    await loadRecurringTransactions();

    return true;
}


async function reapplyRecurringAfterTransactionUndo(
    transaction
) {

    if (
        !transaction?.recurring_id ||
        !transaction?.recurring_due_date
    ) {
        return false;
    }

    await setRecurringOccurrenceStatusDirect(
        transaction.recurring_id,
        transaction.recurring_due_date,
        "paid"
    );


    if (
        transaction.recurring_next_due_date
    ) {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    "recurring_transactions"
                )
                .select(
                    "id, next_due_date"
                )
                .eq(
                    "id",
                    transaction.recurring_id
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (
            data &&
            data.next_due_date ===
                transaction.recurring_due_date
        ) {

            const {
                error:
                    scheduleError
            } =
                await supabase
                    .from(
                        "recurring_transactions"
                    )
                    .update({
                        next_due_date:
                            transaction.recurring_next_due_date
                    })
                    .eq(
                        "id",
                        transaction.recurring_id
                    );

            if (scheduleError) {
                throw scheduleError;
            }
        }
    }


    await loadRecurringOccurrenceStatuses();
    await loadRecurringTransactions();

    return true;
}


async function permanentlyDeleteTransaction(
    pendingDelete
) {

    if (!pendingDelete?.id) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("transactions")
            .delete()
            .eq(
                "id",
                pendingDelete.id
            )
            .not(
                "deleted_at",
                "is",
                null
            );

    if (error) {

        console.error(
            "Permanent transaction delete error:",
            error
        );

        return;
    }

    if (
        pendingDelete.receipt_path
    ) {

        const receiptRemoved =
            await deleteReceipt(
                pendingDelete.receipt_path
            );

        if (!receiptRemoved) {

            console.warn(
                "Transaction deleted, but its receipt file could not be removed."
            );
        }
    }
}


async function finalizePendingTransactionDelete() {

    if (!pendingTransactionDelete) {
        return;
    }

    const target =
        pendingTransactionDelete;

    pendingTransactionDelete =
        null;

    if (transactionUndoTimer) {

        window.clearTimeout(
            transactionUndoTimer
        );

        transactionUndoTimer =
            null;
    }

    hideTransactionUndoSnackbar();

    await permanentlyDeleteTransaction(
        target
    );
}


function showTransactionUndoSnackbar(
    transaction
) {

    if (!transactionUndoSnackbar) {
        return;
    }

    if (transactionUndoTimer) {

        window.clearTimeout(
            transactionUndoTimer
        );

        transactionUndoTimer =
            null;
    }

    pendingTransactionDelete = {
        id:
            transaction.id,
        description:
            transaction.description,
        receipt_path:
            transaction.receipt_path ||
            null,
        recurring_id:
            transaction.recurring_id ||
            null,
        recurring_due_date:
            transaction.recurring_due_date ||
            null,
        recurring_next_due_date:
            transaction.recurring_next_due_date ||
            null
    };

    if (transactionUndoTitle) {

        transactionUndoTitle.textContent =
            `"${transaction.description}" deleted`;
    }

    if (transactionUndoMessage) {

        transactionUndoMessage.textContent =
            "Undo within 5 seconds.";
    }

    transactionUndoSnackbar.classList.add(
        "show"
    );

    if (transactionUndoProgress) {

        transactionUndoProgress.style.animation =
            "none";

        void transactionUndoProgress.offsetWidth;

        transactionUndoProgress.style.animation =
            "transactionUndoCountdown 5s linear forwards";
    }

    transactionUndoTimer =
        window.setTimeout(
            finalizePendingTransactionDelete,
            5000
        );
}


async function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );

    if (!transaction) {
        return;
    }

    if (pendingTransactionDelete) {
        await finalizePendingTransactionDelete();
    }

    if (pendingTransferDelete) {
        await finalizePendingTransferDelete();
    }

    const deletedAt =
        new Date()
            .toISOString();

    const {
        error
    } =
        await supabase
            .from("transactions")
            .update({
                deleted_at:
                    deletedAt
            })
            .eq(
                "id",
                id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }


    try {

        await restoreRecurringAfterTransactionDelete(
            transaction
        );

    } catch (recurringError) {

        console.error(
            "Recurring delete reversal error:",
            recurringError
        );

        await supabase
            .from("transactions")
            .update({
                deleted_at:
                    null
            })
            .eq(
                "id",
                id
            );

        alert(
            "The transaction was not deleted because its recurring schedule could not be restored. Please try again."
        );

        return;
    }


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );

    updateDashboard();
    renderTransactions();
    renderAccounts();
    renderCreditCardsPage();
    renderCreditCardDashboardSummary();
    renderSpendingDashboard();
    renderDashboardRecentTransactions();
    loadDashboardBudgetSummary();
    renderDashboardUpcomingCommitments();
    renderRecurringSummary();
    renderRecurringAnalytics();
    renderRecurringReminderCenter();
    renderRecentRecurringActivity();
    renderFinancialCalendar();

    showTransactionUndoSnackbar(
        transaction
    );
}


async function undoPendingTransactionDelete() {

    if (!pendingTransactionDelete) {
        return;
    }

    const target =
        pendingTransactionDelete;

    pendingTransactionDelete =
        null;

    if (transactionUndoTimer) {

        window.clearTimeout(
            transactionUndoTimer
        );

        transactionUndoTimer =
            null;
    }

    hideTransactionUndoSnackbar();

    const {
        error
    } =
        await supabase
            .from("transactions")
            .update({
                deleted_at:
                    null
            })
            .eq(
                "id",
                target.id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }


    try {

        await reapplyRecurringAfterTransactionUndo(
            target
        );

    } catch (recurringError) {

        console.error(
            "Recurring undo restore error:",
            recurringError
        );

        alert(
            "The transaction was restored, but its recurring status could not be restored automatically. Please review the recurring item."
        );
    }


    await loadTransactions();

    renderDashboardUpcomingCommitments();
    renderRecurringSummary();
    renderRecurringAnalytics();
    renderRecurringReminderCenter();
    renderRecentRecurringActivity();
    renderFinancialCalendar();
}


async function cleanupStaleDeletedTransactions() {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("transactions")
            .select(
                "id, receipt_path, recurring_id, recurring_due_date, recurring_next_due_date"
            )
            .not(
                "deleted_at",
                "is",
                null
            );

    if (error) {

        console.warn(
            "Stale deleted transaction lookup error:",
            error
        );

        return;
    }

    for (const item of data || []) {

        try {

            await restoreRecurringAfterTransactionDelete(
                item
            );

        } catch (recurringError) {

            console.warn(
                "Stale recurring reversal error:",
                recurringError
            );
        }

        const {
            error: deleteError
        } =
            await supabase
                .from("transactions")
                .delete()
                .eq(
                    "id",
                    item.id
                )
                .not(
                    "deleted_at",
                    "is",
                    null
                );

        if (deleteError) {

            console.warn(
                "Stale transaction cleanup error:",
                deleteError
            );

            continue;
        }

        if (item.receipt_path) {

            const receiptRemoved =
                await deleteReceipt(
                    item.receipt_path
                );

            if (!receiptRemoved) {

                console.warn(
                    "Stale transaction removed, but its receipt file could not be removed."
                );
            }
        }
    }
}


transactionUndoButton
    ?.addEventListener(
        "click",
        undoPendingDelete
    );


// ======================================================
// RESET TRANSACTION FORM
// ======================================================

function resetTransactionForm(force = false) {
    if (financeSavePending(transactionForm) && force !== true) return;
    clearFinanceFeedback(transactionForm);

    editingTransactionId =
        null;

    editingTransferId =
        null;

    transactionTypeSelect.disabled =
        false;

    pendingRecurringId =
        null;

    pendingRecurringDueDate =
        null;

    hideDescriptionSuggestions();

    transactionForm.reset();

    transactionTypeSelect.value =
        "expense";

    dateInput.value =
        getTodayDate();

    formTitle.textContent =
        "Add Transaction";

    submitButton.textContent = financeSavePending(transactionForm) ? "Saving..." : "Add Transaction";

    submitButton.disabled = financeSavePending(transactionForm);

    cancelEditButton.textContent =
        "Cancel";

    cancelEditButton.style.display =
        "none";

    customCategoryGroup.style.display =
        "none";

    customIncomeSourceGroup.style.display =
        "none";

    if (transactionTagsInput) {
        transactionTagsInput.value =
            "";
    }

    clearSelectedReceipt();

    editingReceiptPath =
        null;

    removeEditingReceipt =
        false;

    renderSavedReceiptPanel();

    if (receiptMessage) {
        receiptMessage.textContent =
            "";
    }

    refreshTransactionDropdowns();

    updateTransactionMode();
}


cancelEditButton.addEventListener(
    "click",
    resetTransactionForm
);


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

    let totalIncome =
        0;

    let totalExpenses =
        0;

    transactions.forEach(
        function (transaction) {

            const amount =
                Number(
                    transaction.amount
                );

            if (
                transaction.type ===
                "income"
            ) {

                totalIncome +=
                    amount;

            } else {

                totalExpenses +=
                    amount;
            }
        }
    );


    const totalBalance =
        accounts.reduce(
            (
                total,
                account
            ) =>
                total +
                calculateAccountBalance(
                    account.id
                ),
            0
        );


    incomeElement.textContent =
        formatMoney(
            totalIncome
        );

    expensesElement.textContent =
        formatMoney(
            totalExpenses
        );

    balanceElement.textContent =
        formatMoney(
            totalBalance
        );

    renderSetupChecklist();

    renderCreditCardDashboardSummary();
}


// ======================================================
// ACCOUNT BALANCE
// ======================================================

function calculateAccountBalance(
    accountId
) {

    const account =
        accounts.find(
            item =>
                item.id === accountId
        );

    if (!account) {
        return 0;
    }

    let balance =
        Number(
            account.opening_balance
        );

    transactions
        .filter(
            transaction =>
                transaction.account_id ===
                    accountId
        )
        .forEach(
            function (transaction) {

                const amount =
                    Number(
                        transaction.amount
                    );

                if (
                    transaction.type ===
                    "income"
                ) {

                    balance +=
                        amount;

                } else {

                    balance -=
                        amount;
                }
            }
        );

    balance +=
        getTransferAccountDelta(
            transfers,
            accountId
        );

    return balance;
}

// ======================================================
// SPENDING ANALYTICS
// ======================================================

function renderSpendingDashboard() {

    const currentMonth =
        getCurrentMonthValue();

    const previousMonth =
        getPreviousMonthValue(
            currentMonth
        );

    const currentMonthName =
        formatBudgetMonth(
            currentMonth
        );

    const previousMonthName =
        formatBudgetMonth(
            previousMonth
        );

    const currentSpending =
        getMonthlyExpenseTotal(
            currentMonth
        );

    const previousSpending =
        getMonthlyExpenseTotal(
            previousMonth
        );


    spendingPeriodLabel.textContent =
        `${currentMonthName} vs ${previousMonthName}`;

    currentSpendingLabel.textContent =
        currentMonthName;

    previousSpendingLabel.textContent =
        previousMonthName;

    currentMonthSpendingElement.textContent =
        formatMoney(
            currentSpending
        );

    previousMonthSpendingElement.textContent =
        formatMoney(
            previousSpending
        );


    renderSpendingChange(
        currentSpending,
        previousSpending,
        previousMonthName
    );


    renderAutomaticInsights(
        currentMonth,
        previousMonth,
        currentSpending,
        previousSpending
    );
}


// ======================================================
// MONTHLY EXPENSE TOTAL
// ======================================================

function getMonthlyExpenseTotal(month) {

    return transactions
        .filter(
            (transaction) => (
                transaction.type === "expense"
                &&
                transaction.transaction_date
                    ?.startsWith(month)
            )
        )
        .reduce(
            (total, transaction) =>
                total +
                Number(
                    transaction.amount
                ),
            0
        );
}


// ======================================================
// SPENDING CHANGE
// ======================================================

function renderSpendingChange(
    currentSpending,
    previousSpending,
    previousMonthName
) {

    spendingChangeCard.classList.remove(
        "positive",
        "negative",
        "neutral"
    );


    const difference =
        currentSpending -
        previousSpending;


    if (
        currentSpending === 0 &&
        previousSpending === 0
    ) {

        spendingChangeCard.classList.add(
            "neutral"
        );

        spendingChangeAmount.textContent =
            "No spending recorded for these two months.";

        spendingChangePercent.textContent =
            "";

        return;
    }


    if (
        previousSpending === 0
    ) {

        spendingChangeCard.classList.add(
            "negative"
        );

        spendingChangeAmount.textContent =
            `↑ ${formatMoney(
                currentSpending
            )}`;

        spendingChangePercent.textContent =
            `No spending was recorded in ${previousMonthName}.`;

        return;
    }


    const percentage =
        (
            Math.abs(
                difference
            )
            /
            previousSpending
        )
        *
        100;


    if (
        difference > 0
    ) {

        spendingChangeCard.classList.add(
            "negative"
        );

        spendingChangeAmount.textContent =
            `↑ ${formatMoney(
                difference
            )}`;

        spendingChangePercent.textContent =
            `${percentage.toFixed(
                1
            )}% higher than ${previousMonthName}`;

        return;
    }


    if (
        difference < 0
    ) {

        spendingChangeCard.classList.add(
            "positive"
        );

        spendingChangeAmount.textContent =
            `↓ ${formatMoney(
                Math.abs(
                    difference
                )
            )}`;

        spendingChangePercent.textContent =
            `${percentage.toFixed(
                1
            )}% lower than ${previousMonthName}`;

        return;
    }


    spendingChangeCard.classList.add(
        "neutral"
    );

    spendingChangeAmount.textContent =
        "No change";

    spendingChangePercent.textContent =
        `Spending is the same as ${previousMonthName}.`;
}


// ======================================================
// AUTOMATIC INSIGHTS
// ======================================================

function renderAutomaticInsights(
    currentMonth,
    previousMonth,
    currentSpending,
    previousSpending
) {

    dashboardInsights.innerHTML =
        "";


    const insights =
        [];


    // TOTAL SPENDING CHANGE

    if (
        previousSpending > 0
    ) {

        const difference =
            currentSpending -
            previousSpending;


        const percentage =
            (
                Math.abs(
                    difference
                )
                /
                previousSpending
            )
            *
            100;


        if (
            difference > 0
        ) {

            insights.push({
                type: "warning",

                text:
                    `Your spending increased ${percentage.toFixed(
                        1
                    )}% compared with last month.`
            });

        } else if (
            difference < 0
        ) {

            insights.push({
                type: "good",

                text:
                    `Your spending decreased ${percentage.toFixed(
                        1
                    )}% compared with last month.`
            });

        } else {

            insights.push({
                type: "neutral",

                text:
                    "Your total spending is unchanged compared with last month."
            });
        }

    } else if (
        currentSpending > 0
    ) {

        insights.push({
            type: "neutral",

            text:
                "There is no spending from last month available for comparison yet."
        });
    }


    const currentCategories =
        getCategorySpendingMap(
            currentMonth
        );


    const previousCategories =
        getCategorySpendingMap(
            previousMonth
        );


    const currentEntries =
        Object.entries(
            currentCategories
        );


    // HIGHEST SPENDING CATEGORY

    if (
        currentEntries.length
    ) {

        const [
            highestCategoryId,
            highestAmount
        ] =
            [...currentEntries]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b[1] -
                        a[1]
                )[0];


        const highestCategoryName =
            getCategoryName(
                highestCategoryId
            )
            ||
            "Unknown Category";


        const share =
            currentSpending > 0
                ? (
                    highestAmount /
                    currentSpending
                ) * 100
                : 0;


        insights.push({
            type: "neutral",

            text:
                `${highestCategoryName} is your highest spending category at ${formatMoney(
                    highestAmount
                )}, representing ${share.toFixed(
                    1
                )}% of this month's expenses.`
        });
    }


    // BIGGEST CATEGORY INCREASE

    let biggestIncrease =
        null;


    currentEntries.forEach(
        ([
            categoryId,
            currentAmount
        ]) => {

            const previousAmount =
                previousCategories[
                    categoryId
                ]
                ||
                0;


            const increase =
                currentAmount -
                previousAmount;


            if (
                increase <= 0
            ) {
                return;
            }


            if (
                !biggestIncrease ||
                increase >
                    biggestIncrease.increase
            ) {

                biggestIncrease = {
                    categoryId,
                    currentAmount,
                    previousAmount,
                    increase
                };
            }
        }
    );


    if (
        biggestIncrease
    ) {

        const categoryName =
            getCategoryName(
                biggestIncrease.categoryId
            )
            ||
            "A category";


        if (
            biggestIncrease.previousAmount >
            0
        ) {

            const percentage =
                (
                    biggestIncrease.increase
                    /
                    biggestIncrease.previousAmount
                )
                *
                100;


            insights.push({
                type: "warning",

                text:
                    `${categoryName} increased by ${formatMoney(
                        biggestIncrease.increase
                    )} (${percentage.toFixed(
                        1
                    )}%) compared with last month.`
            });

        } else {

            insights.push({
                type: "neutral",

                text:
                    `${categoryName} has ${formatMoney(
                        biggestIncrease.currentAmount
                    )} of spending this month, with no spending recorded last month.`
            });
        }
    }


    // BIGGEST CATEGORY DECREASE

    let biggestDecrease =
        null;


    Object.entries(
        previousCategories
    )
        .forEach(
            ([
                categoryId,
                previousAmount
            ]) => {

                const currentAmount =
                    currentCategories[
                        categoryId
                    ]
                    ||
                    0;


                const decrease =
                    previousAmount -
                    currentAmount;


                if (
                    decrease <= 0
                ) {
                    return;
                }


                if (
                    !biggestDecrease ||
                    decrease >
                        biggestDecrease.decrease
                ) {

                    biggestDecrease = {
                        categoryId,
                        currentAmount,
                        previousAmount,
                        decrease
                    };
                }
            }
        );


    if (
        biggestDecrease
    ) {

        const categoryName =
            getCategoryName(
                biggestDecrease.categoryId
            )
            ||
            "A category";


        insights.push({
            type: "good",

            text:
                `${categoryName} spending decreased by ${formatMoney(
                    biggestDecrease.decrease
                )} compared with last month.`
        });
    }


    // EMPTY STATE

    if (
        insights.length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "insight-empty";


        empty.textContent =
            "Add more transactions to generate useful spending insights.";


        dashboardInsights.appendChild(
            empty
        );


        return;
    }


    // MAXIMUM 4 INSIGHTS

    insights
        .slice(
            0,
            4
        )
        .forEach(
            (insight) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    `dashboard-insight ${insight.type}`;


                const dot =
                    document.createElement(
                        "span"
                    );


                dot.className =
                    "insight-dot";


                const text =
                    document.createElement(
                        "p"
                    );


                text.textContent =
                    insight.text;


                item.appendChild(
                    dot
                );

                item.appendChild(
                    text
                );


                dashboardInsights.appendChild(
                    item
                );
            }
        );
}


// ======================================================
// CATEGORY SPENDING MAP
// ======================================================

function getCategorySpendingMap(month) {

    const spending =
        {};


    transactions
        .filter(
            (transaction) => (
                transaction.type ===
                    "expense"
                &&
                transaction.transaction_date
                    ?.startsWith(
                        month
                    )
                &&
                transaction.category_id
            )
        )
        .forEach(
            (transaction) => {

                const categoryId =
                    transaction.category_id;


                spending[
                    categoryId
                ] =
                    (
                        spending[
                            categoryId
                        ]
                        ||
                        0
                    )
                    +
                    Number(
                        transaction.amount
                    );
            }
        );


    return spending;
}


// ======================================================
// PREVIOUS MONTH
// ======================================================

function getPreviousMonthValue(month) {

    const [
        year,
        monthNumber
    ] =
        month
            .split("-")
            .map(Number);


    const date =
        new Date(
            year,
            monthNumber - 2,
            1
        );


    const previousYear =
        date.getFullYear();


    const previousMonth =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    return `${previousYear}-${previousMonth}`;
}

// ======================================================
// GENERIC MANAGEMENT CARD
// ======================================================

function createSimpleManagementCard({
    name,
    meta,
    active,
    onEdit,
    onToggle,
    onDelete = null
}) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "management-card";

    if (!active) {

        card.classList.add(
            "inactive"
        );
    }


    const left =
        document.createElement(
            "div"
        );


    const title =
        document.createElement(
            "p"
        );

    title.className =
        "management-name";

    title.textContent =
        name;


    const subtitle =
        document.createElement(
            "p"
        );

    subtitle.className =
        "management-meta";

    subtitle.textContent =
        meta;

    if (!active) {

        subtitle.textContent +=
            " • Inactive";
    }


    left.appendChild(title);
    left.appendChild(subtitle);


    const buttons =
        createManagementButtons(
            onEdit,
            onToggle,
            active,
            onDelete
        );


    card.appendChild(left);
    card.appendChild(buttons);


    return card;
}


// ======================================================
// MANAGEMENT BUTTONS
// ======================================================

function createManagementButtons(
    onEdit,
    onToggle,
    active,
    onDelete = null
) {

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "management-buttons";


    if (active) {

        const edit =
            createTextButton(
                "Edit",
                "edit-button"
            );

        edit.addEventListener(
            "click",
            onEdit
        );

        buttons.appendChild(
            edit
        );
    }


    const status =
        createTextButton(
            active
                ? "Deactivate"
                : "Reactivate",

            active
                ? "status-button"
                : "status-button positive-action-button"
        );

    status.addEventListener(
        "click",
        onToggle
    );

    buttons.appendChild(
        status
    );


    if (
        !active &&
        onDelete
    ) {

        const remove =
            createTextButton(
                "Delete Permanently",
                "delete-permanently-button"
            );

        remove.addEventListener(
            "click",
            onDelete
        );

        buttons.appendChild(
            remove
        );
    }


    return buttons;
}



function applySemanticActionButtonStyle(
    button,
    label
) {

    if (!button) {
        return;
    }

    const normalized =
        String(
            label ||
            button.textContent ||
            ""
        )
            .trim()
            .toLowerCase();

    button.classList.add(
        "inline-action-button"
    );

    if (
        normalized === "edit" ||
        normalized.startsWith("log ")
    ) {

        button.classList.add(
            "edit-button"
        );

        return;
    }

    if (
        normalized === "paid" ||
        normalized === "reactivate" ||
        normalized === "reopen" ||
        normalized === "restore"
    ) {

        button.classList.add(
            "positive-action-button"
        );

        return;
    }

    if (
        normalized.includes("delete") ||
        normalized === "remove"
    ) {

        button.classList.add(
            "delete-permanently-button"
        );

        return;
    }

    if (
        normalized === "skip" ||
        normalized === "pause" ||
        normalized === "deactivate"
    ) {

        button.classList.add(
            "status-button"
        );
    }
}


// ======================================================
// BUTTON HELPER
// ======================================================

function createTextButton(
    text,
    className = ""
) {

    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        [
            "inline-action-button",
            className
        ]
            .filter(Boolean)
            .join(" ");

    button.textContent =
        text;

    applySemanticActionButtonStyle(
        button,
        text
    );

    return button;
}


// ======================================================
// EMPTY STATE
// ======================================================

function openSetupTarget(
    pageName,
    targetId,
    focusId
) {

    navigateToPage(
        pageName,
        {
            scrollToTop:
                false
        }
    );

    requestAnimationFrame(
        function () {

            const target =
                document.getElementById(
                    targetId
                );

            target
                ?.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start"
                });

            if (focusId) {

                setTimeout(
                    function () {

                        document
                            .getElementById(
                                focusId
                            )
                            ?.focus();
                    },
                    300
                );
            }
        }
    );
}


function renderEmptyState(
    element,
    content
) {

    const options =
        typeof content ===
            "string"
            ? {
                title:
                    content
            }
            : content
            || {};

    const empty =
        document.createElement(
            "div"
        );

    empty.className =
        "empty-state";

    const title =
        document.createElement(
            "strong"
        );

    title.className =
        "empty-state-title";

    title.textContent =
        options.title
        ||
        "Nothing here yet";

    empty.appendChild(
        title
    );

    if (
        options.description
    ) {

        const description =
            document.createElement(
                "p"
            );

        description.className =
            "empty-state-description";

        description.textContent =
            options.description;

        empty.appendChild(
            description
        );
    }

    if (
        options.actionLabel
        &&
        options.actionPage
        &&
        options.actionTargetId
    ) {

        const action =
            document.createElement(
                "button"
            );

        action.type =
            "button";

        action.className =
            "empty-state-action";

        action.textContent =
            options.actionLabel;

        action.addEventListener(
            "click",
            function () {

                openSetupTarget(
                    options.actionPage,
                    options.actionTargetId,
                    options.focusId
                );
            }
        );

        empty.appendChild(
            action
        );
    }

    element.appendChild(
        empty
    );
}


let setupChecklistCompletionPersisting =
    false;


async function persistSetupChecklistCompletion() {

    if (
        !currentUser
        ||
        !onboardingState
        ||
        onboardingState.user_id !==
            currentUser.id
        ||
        onboardingState
            .checklist_dismissed_at
        ||
        setupChecklistCompletionPersisting
    ) {
        return;
    }


    setupChecklistCompletionPersisting =
        true;


    try {

        await saveOnboardingState({
            checklist_dismissed_at:
                new Date()
                    .toISOString()
        });

    } catch (
        error
    ) {

        console.error(
            "Persist setup checklist completion error:",
            error
        );

    } finally {

        setupChecklistCompletionPersisting =
            false;
    }
}


function renderSetupChecklist() {

    if (
        !setupChecklist
        ||
        !setupChecklistItems
        ||
        !setupChecklistProgressLabel
        ||
        !setupChecklistProgressBar
    ) {
        return;
    }

    const steps = [
        {
            key:
                "account",

            title:
                "Add your first account",

            description:
                "Tell Kira where your money lives.",

            done:
                accounts.length > 0,

            actionLabel:
                "Add account",

            page:
                "accounts",

            targetId:
                "account-form",

            focusId:
                "account-name"
        },
        {
            key:
                "transaction",

            title:
                "Record your first transaction",

            description:
                "Add an income or expense to start your money history.",

            done:
                transactions.length > 0,

            actionLabel:
                "Add transaction",

            page:
                "transactions",

            targetId:
                "transaction-form",

            focusId:
                "description"
        },
        {
            key:
                "budget",

            title:
                "Set your first budget",

            description:
                "Give one spending category a monthly limit.",

            done:
                budgets.length > 0,

            actionLabel:
                "Create budget",

            page:
                "budgets",

            targetId:
                "budget-form",

            focusId:
                "budget-category"
        },
        {
            key:
                "recurring",

            title:
                "Add a recurring item",

            description:
                "Track a bill, subscription or regular income.",

            done:
                recurringTransactions.length > 0,

            actionLabel:
                "Add recurring",

            page:
                "recurring",

            targetId:
                "recurring-form",

            focusId:
                "recurring-name"
        },
        {
            key:
                "goal",

            title:
                "Create a savings goal",

            description:
                "Turn something you want to save for into a visible target.",

            done:
                savingsGoals.length > 0,

            actionLabel:
                "Create goal",

            page:
                "goals",

            targetId:
                "goal-form",

            focusId:
                "goal-name"
        }
    ];

    const completedCount =
        steps.filter(
            step =>
                step.done
        ).length;


    if (
        onboardingState
            ?.user_id ===
            currentUser?.id
        &&
        onboardingState
            ?.checklist_dismissed_at
    ) {

        setupChecklist.hidden =
            true;

        setupChecklistItems.innerHTML =
            "";

        return;
    }


    if (
        completedCount ===
        steps.length
    ) {

        setupChecklist.hidden =
            true;

        setupChecklistItems.innerHTML =
            "";

        void persistSetupChecklistCompletion();

        return;
    }

    setupChecklist.hidden =
        false;

    setupChecklistProgressLabel.textContent =
        `${completedCount} / ${steps.length}`;

    setupChecklistProgressBar.style.width =
        `${(
            completedCount
            /
            steps.length
        ) * 100}%`;

    if (
        setupChecklistSummary
    ) {

        const remaining =
            steps.length -
            completedCount;

        setupChecklistSummary.textContent =
            remaining === 1
                ? "One step left and your core Kira setup is complete."
                : `${remaining} steps left to complete your core Kira setup.`;
    }

    setupChecklistItems.innerHTML =
        "";

    steps.forEach(
        function (step) {

            const row =
                document.createElement(
                    "article"
                );

            row.className =
                "setup-checklist-item";

            row.classList.toggle(
                "is-complete",
                step.done
            );

            const status =
                document.createElement(
                    "span"
                );

            status.className =
                "setup-checklist-status";

            status.setAttribute(
                "aria-hidden",
                "true"
            );

            status.textContent =
                step.done
                    ? "✓"
                    : "";

            const copy =
                document.createElement(
                    "div"
                );

            copy.className =
                "setup-checklist-copy";

            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                step.title;

            const description =
                document.createElement(
                    "span"
                );

            description.textContent =
                step.done
                    ? "Done"
                    : step.description;

            copy.append(
                title,
                description
            );

            row.append(
                status,
                copy
            );

            if (!step.done) {

                const action =
                    document.createElement(
                        "button"
                    );

                action.type =
                    "button";

                action.className =
                    "setup-checklist-action";

                action.textContent =
                    step.actionLabel;

                action.addEventListener(
                    "click",
                    function () {

                        openSetupTarget(
                            step.page,
                            step.targetId,
                            step.focusId
                        );
                    }
                );

                row.appendChild(
                    action
                );
            }

            setupChecklistItems.appendChild(
                row
            );
        }
    );
}


// ======================================================
// SELECT OPTION
// ======================================================

function addSelectOption(
    select,
    value,
    label
) {

    const option =
        document.createElement(
            "option"
        );

    option.value =
        value;

    option.textContent =
        label;

    select.appendChild(
        option
    );
}


// ======================================================
// LOOKUPS
// ======================================================

function getAccountName(id) {

    return accounts.find(
        item =>
            item.id === id
    )?.name;
}


function getCategoryName(id) {

    return categories.find(
        item =>
            item.id === id
    )?.name;
}


function getIncomeSourceName(id) {

    return incomeSources.find(
        item =>
            item.id === id
    )?.name;
}




// ======================================================
// SMART INSIGHTS
// ======================================================

function getInsightMonthRange(offset = 0) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);

    const toKey = date => [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");

    return {
        start: toKey(startDate),
        end: toKey(endDate)
    };
}


function getInsightRangeTransactions(start, end) {
    return transactions.filter(
        item =>
            item.transaction_date >= start &&
            item.transaction_date < end
    );
}


function getInsightTotals(rows) {
    const income = rows
        .filter(item => item.type === "income")
        .reduce((total, item) => total + Number(item.amount), 0);

    const expenses = rows
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + Number(item.amount), 0);

    return {
        income,
        expenses,
        net: income - expenses
    };
}


function getInsightBudgetRows(currentRows) {
    const monthStart = getInsightMonthRange(0).start;

    return budgets
        .filter(budget => budget.month_start === monthStart)
        .map(budget => {
            const spent = currentRows
                .filter(item =>
                    item.type === "expense" &&
                    item.category_id === budget.category_id
                )
                .reduce((total, item) => total + Number(item.amount), 0);

            const category = categories.find(item => item.id === budget.category_id);
            const limit = Number(budget.amount);

            return {
                categoryName: category?.name || "Unknown Category",
                spent,
                limit,
                percent: limit > 0 ? spent / limit * 100 : 0
            };
        });
}


function getInsightTopCategory(currentRows) {
    const totals = new Map();

    currentRows
        .filter(item => item.type === "expense")
        .forEach(item => {
            const name =
                categories.find(category => category.id === item.category_id)?.name
                || "Uncategorized";

            totals.set(
                name,
                (totals.get(name) || 0) + Number(item.amount)
            );
        });

    return Array.from(totals.entries())
        .sort((a, b) => b[1] - a[1])[0] || null;
}


function getInsightRecurringExpense() {
    return recurringTransactions
        .filter(item => item.is_active && item.type === "expense")
        .reduce(
            (total, item) => total + recurringMonthlyEquivalent(item),
            0
        );
}


function getInsightUnusualTransactions() {
    const current = getInsightMonthRange(0);
    const historyStart = getInsightMonthRange(-3).start;

    const history = getInsightRangeTransactions(historyStart, current.start)
        .filter(item => item.type === "expense");

    const currentExpenses = getInsightRangeTransactions(current.start, current.end)
        .filter(item => item.type === "expense");

    const byCategory = new Map();

    history.forEach(item => {
        const key = item.category_id || "uncategorized";

        if (!byCategory.has(key)) {
            byCategory.set(key, []);
        }

        byCategory.get(key).push(Number(item.amount));
    });

    return currentExpenses
        .map(item => {
            const historyAmounts =
                byCategory.get(item.category_id || "uncategorized") || [];

            if (historyAmounts.length < 2) {
                return null;
            }

            const average =
                historyAmounts.reduce((total, amount) => total + amount, 0)
                / historyAmounts.length;

            const amount = Number(item.amount);

            if (
                average <= 0 ||
                amount < average * 1.75 ||
                amount - average < 10
            ) {
                return null;
            }

            return {
                transaction: item,
                average,
                multiple: amount / average
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.multiple - a.multiple)
        .slice(0, 5);
}


function buildSmartInsightData() {
    const currentRange = getInsightMonthRange(0);
    const previousRange = getInsightMonthRange(-1);

    const currentRows =
        getInsightRangeTransactions(currentRange.start, currentRange.end);

    const previousRows =
        getInsightRangeTransactions(previousRange.start, previousRange.end);

    const currentTotals = getInsightTotals(currentRows);
    const previousTotals = getInsightTotals(previousRows);

    const savingsRate =
        currentTotals.income > 0
            ? currentTotals.net / currentTotals.income * 100
            : 0;

    const spendingTrend =
        previousTotals.expenses > 0
            ? (currentTotals.expenses - previousTotals.expenses)
                / previousTotals.expenses * 100
            : currentTotals.expenses > 0
                ? 100
                : 0;

    const recurringExpenses = getInsightRecurringExpense();

    const recurringShare =
        currentTotals.expenses > 0
            ? recurringExpenses / currentTotals.expenses * 100
            : 0;

    const expenseBase =
        currentTotals.expenses > 0
            ? currentTotals.expenses
            : previousTotals.expenses;

    const emergencyReadiness =
        expenseBase > 0
            ? Math.max(0, getCurrentTotalBalance() / expenseBase)
            : 0;

    return {
        currentRows,
        previousRows,
        currentTotals,
        previousTotals,
        savingsRate,
        spendingTrend,
        recurringExpenses,
        recurringShare,
        emergencyReadiness,
        topCategory: getInsightTopCategory(currentRows),
        budgetRows: getInsightBudgetRows(currentRows),
        unusual: getInsightUnusualTransactions()
    };
}


function buildPriorityInsights(data) {
    const insights = [];

    if (data.currentTotals.income > 0) {
        if (data.savingsRate < 0) {
            insights.push({
                severity: "danger",
                score: 100,
                title: "Negative cash flow this month",
                message: `Your expenses are ${formatMoney(Math.abs(data.currentTotals.net))} higher than your income. Review non-essential spending first.`
            });
        } else if (data.savingsRate < 10) {
            insights.push({
                severity: "warning",
                score: 80,
                title: "Savings rate is low",
                message: `You are currently keeping ${data.savingsRate.toFixed(1)}% of your income after expenses.`
            });
        } else if (data.savingsRate >= 20) {
            insights.push({
                severity: "positive",
                score: 30,
                title: "Healthy savings rate",
                message: `You are keeping ${data.savingsRate.toFixed(1)}% of your income this month.`
            });
        }
    }

    const overBudget = data.budgetRows
        .filter(item => item.percent > 100)
        .sort((a, b) => b.percent - a.percent)[0];

    const nearBudget = data.budgetRows
        .filter(item => item.percent >= 80 && item.percent <= 100)
        .sort((a, b) => b.percent - a.percent)[0];

    if (overBudget) {
        insights.push({
            severity: "danger",
            score: 95,
            title: `${overBudget.categoryName} is over budget`,
            message: `You have used ${overBudget.percent.toFixed(1)}% of this category's monthly budget.`
        });
    } else if (nearBudget) {
        insights.push({
            severity: "warning",
            score: 75,
            title: `${nearBudget.categoryName} is close to its limit`,
            message: `${nearBudget.percent.toFixed(1)}% of the monthly budget has already been used.`
        });
    }

    if (data.previousTotals.expenses > 0 && data.spendingTrend > 20) {
        insights.push({
            severity: "warning",
            score: 70,
            title: "Spending increased from last month",
            message: `Expenses are up ${data.spendingTrend.toFixed(1)}% compared with the previous month.`
        });
    }

    if (data.currentTotals.expenses > 0 && data.recurringShare > 50) {
        insights.push({
            severity: "warning",
            score: 65,
            title: "Recurring commitments are taking a large share",
            message: `Active recurring expenses equal about ${data.recurringShare.toFixed(1)}% of this month's spending.`
        });
    }

    if (data.emergencyReadiness > 0 && data.emergencyReadiness < 3) {
        insights.push({
            severity: "warning",
            score: 85,
            title: "Emergency buffer looks thin",
            message: `Your current balances cover roughly ${data.emergencyReadiness.toFixed(1)} months of recent spending.`
        });
    } else if (data.emergencyReadiness >= 6) {
        insights.push({
            severity: "positive",
            score: 25,
            title: "Strong emergency-fund coverage",
            message: `Your current balances could cover about ${data.emergencyReadiness.toFixed(1)} months of recent spending.`
        });
    }

    if (data.unusual.length) {
        const first = data.unusual[0];

        insights.push({
            severity: "warning",
            score: 60,
            title: "Unusually high transaction detected",
            message: `${first.transaction.description} was ${first.multiple.toFixed(1)}× your recent average for that category.`
        });
    }

    if (!insights.length) {
        insights.push({
            severity: "positive",
            score: 10,
            title: "No major issues detected",
            message: "Your recorded finances do not currently show a strong budget, spending or cash-flow warning."
        });
    }

    return insights
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}


function renderPriorityInsights(data) {
    if (!priorityInsightsList) {
        return;
    }

    priorityInsightsList.innerHTML = "";

    buildPriorityInsights(data).forEach(insight => {
        const card = document.createElement("article");
        card.className = `priority-insight-card ${insight.severity}`;

        const indicator = document.createElement("span");
        indicator.className = "priority-insight-indicator";
        indicator.textContent =
            insight.severity === "danger"
                ? "!"
                : insight.severity === "warning"
                    ? "•"
                    : "✓";

        const copy = document.createElement("div");
        const title = document.createElement("strong");
        const message = document.createElement("p");

        title.textContent = insight.title;
        message.textContent = insight.message;

        copy.append(title, message);
        card.append(indicator, copy);
        priorityInsightsList.appendChild(card);
    });
}


function renderInsightSnapshot(data) {
    if (!insightSpendingSnapshot) {
        return;
    }

    insightSpendingSnapshot.innerHTML = "";

    const rows = [
        ["Income this month", formatMoney(data.currentTotals.income), "income"],
        ["Expenses this month", formatMoney(data.currentTotals.expenses), "expense"],
        ["Net cash flow", formatMoney(data.currentTotals.net), data.currentTotals.net >= 0 ? "income" : "expense"],
        ["Top spending category", data.topCategory ? `${data.topCategory[0]} • ${formatMoney(data.topCategory[1])}` : "No expense data", ""]
    ];

    rows.forEach(([labelText, valueText, className]) => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        const value = document.createElement("strong");

        label.textContent = labelText;
        value.textContent = valueText;

        if (className) {
            value.classList.add(className);
        }

        row.append(label, value);
        insightSpendingSnapshot.appendChild(row);
    });
}


function renderInsightBudgetRisk(data) {
    if (!insightBudgetRiskList) {
        return;
    }

    insightBudgetRiskList.innerHTML = "";

    const risky = data.budgetRows
        .filter(row => row.percent >= 70)
        .sort((a, b) => b.percent - a.percent);

    if (!risky.length) {
        insightBudgetRiskList.textContent =
            data.budgetRows.length
                ? "No budget category is currently above 70% usage."
                : "No budgets are configured for the current month.";
        return;
    }

    risky.forEach(row => {
        const element = document.createElement("div");
        element.className = "insight-detail-row";

        const copy = document.createElement("div");
        const title = document.createElement("strong");
        const description = document.createElement("span");
        const percent = document.createElement("strong");

        title.textContent = row.categoryName;
        description.textContent = `${formatMoney(row.spent)} of ${formatMoney(row.limit)}`;
        percent.textContent = `${row.percent.toFixed(1)}%`;
        percent.className = row.percent > 100 ? "expense" : "warning-text";

        copy.append(title, description);
        element.append(copy, percent);
        insightBudgetRiskList.appendChild(element);
    });
}


function renderInsightUnusual(data) {
    if (!insightUnusualSpendingList) {
        return;
    }

    insightUnusualSpendingList.innerHTML = "";

    if (!data.unusual.length) {
        insightUnusualSpendingList.textContent =
            "No clearly unusual spending was detected from the available recent history.";
        return;
    }

    data.unusual.forEach(item => {
        const element = document.createElement("div");
        element.className = "insight-detail-row";

        const copy = document.createElement("div");
        const title = document.createElement("strong");
        const description = document.createElement("span");
        const amount = document.createElement("strong");

        const category =
            categories.find(row => row.id === item.transaction.category_id)?.name
            || "Uncategorized";

        title.textContent = item.transaction.description;
        description.textContent = `${category} • recent average ${formatMoney(item.average)}`;
        amount.textContent = formatMoney(item.transaction.amount);
        amount.className = "expense";

        copy.append(title, description);
        element.append(copy, amount);
        insightUnusualSpendingList.appendChild(element);
    });
}


function renderInsightMonthlySummary(data) {
    if (!insightMonthlySummary) {
        return;
    }

    insightMonthlySummary.innerHTML = "";

    const trendText =
        data.previousTotals.expenses > 0
            ? data.spendingTrend > 0
                ? `Spending increased ${Math.abs(data.spendingTrend).toFixed(1)}% from last month.`
                : data.spendingTrend < 0
                    ? `Spending decreased ${Math.abs(data.spendingTrend).toFixed(1)}% from last month.`
                    : "Spending is unchanged from last month."
            : "There is not enough previous-month spending data for a comparison.";

    const categoryText =
        data.topCategory
            ? `${data.topCategory[0]} is your largest expense category this month at ${formatMoney(data.topCategory[1])}.`
            : "No expense category has been recorded this month.";

    [
        `Income: ${formatMoney(data.currentTotals.income)} • Expenses: ${formatMoney(data.currentTotals.expenses)} • Net: ${formatMoney(data.currentTotals.net)}.`,
        trendText,
        categoryText,
        `Active recurring expenses are estimated at ${formatMoney(data.recurringExpenses)} per month.`
    ].forEach(text => {
        const row = document.createElement("p");
        row.textContent = text;
        insightMonthlySummary.appendChild(row);
    });
}


function renderDashboardInsights(data) {
    if (!dashboardInsightsPreview) {
        return;
    }

    dashboardInsightsPreview.innerHTML = "";

    buildPriorityInsights(data)
        .slice(0, 3)
        .forEach(insight => {
            const row = document.createElement("div");
            row.className = `dashboard-insight-row ${insight.severity}`;

            const dot = document.createElement("span");
            dot.className = "dashboard-insight-dot";

            const copy = document.createElement("div");
            const title = document.createElement("strong");
            const message = document.createElement("span");

            title.textContent = insight.title;
            message.textContent = insight.message;

            copy.append(title, message);
            row.append(dot, copy);
            dashboardInsightsPreview.appendChild(row);
        });
}


function renderSmartInsights() {
    if (
        !insightSavingsRate ||
        !insightSpendingTrend ||
        !insightRecurringShare ||
        !insightEmergencyReadiness
    ) {
        return;
    }

    const data = buildSmartInsightData();

    insightSavingsRate.textContent = `${data.savingsRate.toFixed(1)}%`;
    insightSavingsRate.classList.toggle("income", data.savingsRate >= 20);
    insightSavingsRate.classList.toggle("expense", data.savingsRate < 0);

    insightSpendingTrend.textContent =
        `${data.spendingTrend > 0 ? "+" : ""}${data.spendingTrend.toFixed(1)}%`;
    insightSpendingTrend.classList.toggle("expense", data.spendingTrend > 20);
    insightSpendingTrend.classList.toggle("income", data.spendingTrend < 0);

    insightRecurringShare.textContent = `${data.recurringShare.toFixed(1)}%`;

    insightEmergencyReadiness.textContent =
        `${data.emergencyReadiness.toFixed(1)} months`;
    insightEmergencyReadiness.classList.toggle(
        "income",
        data.emergencyReadiness >= 6
    );
    insightEmergencyReadiness.classList.toggle(
        "expense",
        data.emergencyReadiness > 0 && data.emergencyReadiness < 3
    );

    renderPriorityInsights(data);
    renderInsightSnapshot(data);
    renderInsightBudgetRisk(data);
    renderInsightUnusual(data);
    renderInsightMonthlySummary(data);
    renderDashboardInsights(data);
}


// ======================================================
// GOALS & PLANNING
// ======================================================

async function loadSavingsGoals(throwOnError = false) {

    if (!currentUser) {

        savingsGoals = [];

        return;
    }

    const {
        data,
        error
    } =
        await supabase
            .from("savings_goals")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: true
                }
            );

    if (error) {
        if (throwOnError) throw error;

        console.error(
            "Load savings goals error:",
            error
        );

        if (goalMessage) {
            goalMessage.textContent =
                error.message;
        }

        return;
    }

    savingsGoals =
        data || [];

    renderSavingsGoals();
    renderGoalsOverview();
    renderDashboardGoalsSummary();
}


function refreshGoalAccountOptions(
    selectedValue = null
) {

    if (!goalAccountSelect) {
        return;
    }

    const current =
        selectedValue !== null
            ? selectedValue
            : goalAccountSelect.value;

    goalAccountSelect.innerHTML =
        '<option value="">No linked account</option>';

    accounts
        .filter(
            account =>
                account.is_active ||
                account.id === current
        )
        .forEach(
            function (account) {

                addSelectOption(
                    goalAccountSelect,
                    account.id,
                    account.name
                );
            }
        );

    goalAccountSelect.value =
        current || "";
}


function getGoalProgress(goal) {

    const target =
        Number(
            goal.target_amount
        );

    const current =
        Number(
            goal.current_amount
        );

    if (
        !Number.isFinite(target) ||
        target <= 0
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            current /
            target *
            100
        )
    );
}


function getGoalRemaining(goal) {

    return Math.max(
        0,
        Number(
            goal.target_amount
        )
        -
        Number(
            goal.current_amount
        )
    );
}


function getGoalTimeText(goal) {

    if (!goal.target_date) {
        return "No target date";
    }

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const target =
        new Date(
            `${goal.target_date}T00:00:00`
        );

    const days =
        Math.ceil(
            (
                target -
                today
            )
            /
            86400000
        );

    if (
        goal.status ===
        "completed"
    ) {
        return `Target date ${formatDate(goal.target_date)}`;
    }

    if (days < 0) {
        return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
    }

    if (days === 0) {
        return "Due today";
    }

    return `${days} day${days === 1 ? "" : "s"} remaining`;
}


function renderGoalsOverview() {

    if (
        !goalsActiveCount ||
        !goalsTotalSaved ||
        !goalsTotalTarget ||
        !goalsOverallProgress
    ) {
        return;
    }

    const active =
        savingsGoals.filter(
            goal =>
                goal.status ===
                "active"
        );

    const totalSaved =
        active.reduce(
            (
                total,
                goal
            ) =>
                total +
                Number(
                    goal.current_amount
                ),
            0
        );

    const totalTarget =
        active.reduce(
            (
                total,
                goal
            ) =>
                total +
                Number(
                    goal.target_amount
                ),
            0
        );

    const overall =
        totalTarget > 0
            ? Math.min(
                100,
                totalSaved /
                totalTarget *
                100
            )
            : 0;

    goalsActiveCount.textContent =
        String(
            active.length
        );

    goalsTotalSaved.textContent =
        formatMoney(
            totalSaved
        );

    goalsTotalTarget.textContent =
        formatMoney(
            totalTarget
        );

    goalsOverallProgress.textContent =
        `${overall.toFixed(1)}%`;
}


function renderSavingsGoals() {

    if (!goalsList) {
        return;
    }

    goalsList.innerHTML =
        "";

    renderSetupChecklist();

    if (!savingsGoals.length) {

        renderEmptyState(
            goalsList,
            {
                title:
                    "No savings goals yet",

                description:
                    "Create a target to turn saving into something visible and measurable.",

                actionLabel:
                    "Create savings goal",

                actionPage:
                    "goals",

                actionTargetId:
                    "goal-form",

                focusId:
                    "goal-name"
            }
        );

        return;
    }

    const ordered =
        [
            ...savingsGoals
        ].sort(
            (
                first,
                second
            ) => {

                const statusOrder = {
                    active: 0,
                    paused: 1,
                    completed: 2
                };

                const statusDifference =
                    (
                        statusOrder[first.status] ??
                        9
                    )
                    -
                    (
                        statusOrder[second.status] ??
                        9
                    );

                if (statusDifference !== 0) {
                    return statusDifference;
                }

                if (
                    first.target_date &&
                    second.target_date
                ) {
                    return first.target_date
                        .localeCompare(
                            second.target_date
                        );
                }

                return 0;
            }
        );

    ordered.forEach(
        function (goal) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "goal-card";

            card.dataset.status =
                goal.status;


            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "goal-card-header";


            const copy =
                document.createElement(
                    "div"
                );

            copy.className =
                "goal-card-copy";


            const titleRow =
                document.createElement(
                    "div"
                );

            titleRow.className =
                "goal-title-row";


            const name =
                document.createElement(
                    "h3"
                );

            name.textContent =
                goal.name;


            const badge =
                document.createElement(
                    "span"
                );

            badge.className =
                `goal-status-badge ${goal.status}`;

            badge.textContent =
                goal.status ===
                    "completed"
                    ? "Completed"
                    : goal.status ===
                        "paused"
                        ? "Paused"
                        : "Active";


            titleRow.append(
                name,
                badge
            );


            const meta =
                document.createElement(
                    "p"
                );

            const account =
                goal.account_id
                    ? accounts.find(
                        item =>
                            item.id ===
                            goal.account_id
                    )?.name
                    : null;

            meta.textContent =
                [
                    getGoalTimeText(goal),
                    account
                        ? `Linked to ${account}`
                        : null
                ]
                    .filter(Boolean)
                    .join(" • ");


            copy.append(
                titleRow,
                meta
            );


            const amount =
                document.createElement(
                    "div"
                );

            amount.className =
                "goal-card-amount";

            amount.innerHTML =
                `<strong>${formatMoney(goal.current_amount)}</strong><span>of ${formatMoney(goal.target_amount)}</span>`;


            header.append(
                copy,
                amount
            );


            const progress =
                getGoalProgress(
                    goal
                );


            const progressHeader =
                document.createElement(
                    "div"
                );

            progressHeader.className =
                "goal-progress-header";


            const progressText =
                document.createElement(
                    "span"
                );

            progressText.textContent =
                `${progress.toFixed(1)}% complete`;


            const remainingText =
                document.createElement(
                    "span"
                );

            remainingText.textContent =
                getGoalRemaining(goal) > 0
                    ? `${formatMoney(getGoalRemaining(goal))} remaining`
                    : "Target reached";


            progressHeader.append(
                progressText,
                remainingText
            );


            const track =
                document.createElement(
                    "div"
                );

            track.className =
                "goal-progress-track";


            const fill =
                document.createElement(
                    "div"
                );

            fill.className =
                "goal-progress-fill";

            fill.style.width =
                `${progress}%`;

            track.appendChild(
                fill
            );


            if (
                goal.notes &&
                goal.notes.trim()
            ) {

                const notes =
                    document.createElement(
                        "p"
                    );

                notes.className =
                    "goal-card-notes";

                notes.textContent =
                    goal.notes;

                card.append(
                    header,
                    progressHeader,
                    track,
                    notes
                );

            } else {

                card.append(
                    header,
                    progressHeader,
                    track
                );
            }


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "goal-card-actions";


            if (
                goal.status !==
                "completed"
            ) {

                const edit =
                    createTextButton(
                        "Edit",
                        "edit-button"
                    );

                edit.addEventListener(
                    "click",
                    () =>
                        editSavingsGoal(
                            goal
                        )
                );

                actions.appendChild(
                    edit
                );
            }


            if (
                goal.status ===
                "active"
            ) {

                const pause =
                    createTextButton(
                        "Pause",
                        "status-button"
                    );

                pause.addEventListener(
                    "click",
                    () =>
                        updateGoalStatus(
                            goal,
                            "paused"
                        )
                );

                actions.appendChild(
                    pause
                );
            }


            if (
                goal.status ===
                "paused"
            ) {

                const reactivate =
                    createTextButton(
                        "Reactivate",
                        "status-button positive-action-button"
                    );

                reactivate.addEventListener(
                    "click",
                    () =>
                        updateGoalStatus(
                            goal,
                            "active"
                        )
                );

                actions.appendChild(
                    reactivate
                );
            }


            if (
                goal.status ===
                "completed"
            ) {

                const reopen =
                    createTextButton(
                        "Reopen",
                        "status-button positive-action-button"
                    );

                reopen.addEventListener(
                    "click",
                    () =>
                        updateGoalStatus(
                            goal,
                            "active"
                        )
                );

                actions.appendChild(
                    reopen
                );
            }


            if (
                goal.status !==
                "active"
            ) {

                const remove =
                    createTextButton(
                        "Delete Permanently",
                        "delete-permanently-button"
                    );

                remove.addEventListener(
                    "click",
                    () =>
                        deleteSavingsGoal(
                            goal
                        )
                );

                actions.appendChild(
                    remove
                );
            }


            card.appendChild(
                actions
            );

            goalsList.appendChild(
                card
            );
        }
    );
}


function resetGoalForm(force = false) {
    if (financeSavePending(goalForm) && force !== true) return;
    clearFinanceFeedback(goalForm);

    if (!goalForm) {
        return;
    }

    goalForm.reset();

    editingGoalId =
        null;

    goalCurrentAmountInput.value =
        "0";

    goalFormTitle.textContent =
        "Add Savings Goal";

    saveGoalButton.textContent = financeSavePending(goalForm) ? "Saving..." : "Add Goal";

    cancelGoalEditButton.style.display =
        "none";

    goalMessage.textContent =
        "";

    refreshGoalAccountOptions(
        ""
    );
}


function editSavingsGoal(
    goal,
    focusElement = goalNameInput
) {
    if (financeSavePending(goalForm)) return;
    clearFinanceFeedback(goalForm);

    if (!goal) {
        return;
    }

    editingGoalId =
        goal.id;

    goalNameInput.value =
        goal.name;

    goalTargetAmountInput.value =
        goal.target_amount;

    goalCurrentAmountInput.value =
        goal.current_amount;

    goalTargetDateInput.value =
        goal.target_date ||
        "";

    goalNotesInput.value =
        goal.notes ||
        "";

    refreshGoalAccountOptions(
        goal.account_id ||
        ""
    );

    goalFormTitle.textContent =
        "Edit Savings Goal";

    saveGoalButton.textContent =
        "Save Changes";

    cancelGoalEditButton.style.display =
        "block";

    scrollToFormAndFocus(
        goalForm,
        focusElement
    );
}


async function updateGoalStatus(
    goal,
    status
) {
    if (financeSavePending(goalForm)) {
        return;
    }

    if (!goal) {
        return;
    }

    const currentAmount =
        Number(
            goal.current_amount
        );

    const targetAmount =
        Number(
            goal.target_amount
        );

    // A fully funded goal cannot return directly to Active.
    // Reopen it in edit mode so the user can reduce the
    // current saved amount below the target first.
    if (
        status === "active" &&
        Number.isFinite(currentAmount) &&
        Number.isFinite(targetAmount) &&
        currentAmount >= targetAmount
    ) {
        editSavingsGoal(
            goal,
            goalCurrentAmountInput
        );

        goalMessage.textContent =
            "Reduce the current saved amount below the target to reopen this goal.";

        return;
    }

    const {
        error
    } =
        await supabase
            .from("savings_goals")
            .update({
                status
            })
            .eq(
                "id",
                goal.id
            );

    if (error) {
        console.error(
            "Update goal status error:",
            error
        );

        goalMessage.textContent =
            "Unable to update this goal right now. Please try again.";

        return;
    }

    if (
        editingGoalId ===
        goal.id
    ) {
        resetGoalForm();
    }

    await loadSavingsGoals();
}


async function deleteSavingsGoal(
    goal
) {
    if (financeSavePending(goalForm)) return;

    if (
        !goal ||
        goal.status ===
            "active"
    ) {
        return;
    }

    const confirmed =
        confirm(
            `Delete savings goal "${goal.name}" permanently?\n\nThis cannot be undone.`
        );

    if (!confirmed) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("savings_goals")
            .delete()
            .eq(
                "id",
                goal.id
            );

    if (error) {

        alert(
            error.message
        );

        return;
    }

    if (
        editingGoalId ===
        goal.id
    ) {
        resetGoalForm();
    }

    await loadSavingsGoals();
}


configureFinanceSubmit({
    form: goalForm, button: saveGoalButton, cancel: cancelGoalEditButton,
    message: goalMessage, label: "Goal", getEditId: () => editingGoalId,
    validate: () => financeField(goalNameInput, "Enter a goal name.")
        || financeAmount(goalTargetAmountInput) || financeAmount(goalCurrentAmountInput, true)
        || financeDate(goalTargetDateInput, "target date", true)
}, async function (event, markSaved) {

            event.preventDefault();

            if (!currentUser) {
                return;
            }

            const name =
                goalNameInput.value
                    .trim();

            const targetAmount =
                Number(
                    goalTargetAmountInput.value
                );

            const currentAmount =
                Number(
                    goalCurrentAmountInput.value
                );

            const targetDate =
                goalTargetDateInput.value ||
                null;

            const accountId =
                goalAccountSelect.value ||
                null;

            const notes =
                goalNotesInput.value
                    .trim() ||
                null;


            const status =
                currentAmount >=
                    targetAmount
                    ? "completed"
                    : (
                        savingsGoals.find(
                            goal =>
                                goal.id ===
                                editingGoalId
                        )?.status ===
                            "paused"
                            ? "paused"
                            : "active"
                    );


            let result;

            if (!editingGoalId) {

                result =
                    await supabase
                        .from(
                            "savings_goals"
                        )
                        .insert({
                            user_id:
                                currentUser.id,
                            name,
                            target_amount:
                                targetAmount,
                            current_amount:
                                currentAmount,
                            target_date:
                                targetDate,
                            account_id:
                                accountId,
                            status,
                            notes
                        });

            } else {

                result =
                    await supabase
                        .from(
                            "savings_goals"
                        )
                        .update({
                            name,
                            target_amount:
                                targetAmount,
                            current_amount:
                                currentAmount,
                            target_date:
                                targetDate,
                            account_id:
                                accountId,
                            status,
                            notes
                        })
                        .eq(
                            "id",
                            editingGoalId
                        );
            }
        if (result.error) throw result.error;
        markSaved();


            const wasEditing =
                editingGoalId !==
                null;


            resetGoalForm(true);




            showTransactionSuccessSnackbar({
                title:
                    wasEditing
                        ? "Goal updated"
                        : (
                            status ===
                                "completed"
                                ? "Goal completed"
                                : "Goal added"
                        ),
                message:
                    status ===
                        "completed"
                        ? "Your savings target has been reached."
                        : "Your savings goal was saved successfully."
            });
            await loadSavingsGoals(true);

        }
    );


cancelGoalEditButton
    ?.addEventListener(
        "click",
        resetGoalForm
    );


function renderDashboardGoalsSummary() {

    if (!dashboardGoalsSummary) {
        return;
    }

    dashboardGoalsSummary.innerHTML =
        "";

    const active =
        savingsGoals
            .filter(
                goal =>
                    goal.status ===
                    "active"
            )
            .sort(
                (
                    first,
                    second
                ) => {

                    if (
                        first.target_date &&
                        second.target_date
                    ) {
                        return first.target_date
                            .localeCompare(
                                second.target_date
                            );
                    }

                    if (first.target_date) {
                        return -1;
                    }

                    if (second.target_date) {
                        return 1;
                    }

                    return 0;
                }
            )
            .slice(
                0,
                3
            );


    if (!active.length) {

        dashboardGoalsSummary.textContent =
            "No active savings goals yet.";

        return;
    }


    const wrap =
        document.createElement(
            "div"
        );

    wrap.className =
        "dashboard-goals-grid";


    active.forEach(
        function (goal) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "dashboard-goal-card";


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "dashboard-goal-top";


            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                goal.name;


            const percent =
                document.createElement(
                    "span"
                );

            const progress =
                getGoalProgress(
                    goal
                );

            percent.textContent =
                `${progress.toFixed(0)}%`;


            top.append(
                name,
                percent
            );


            const amount =
                document.createElement(
                    "p"
                );

            amount.textContent =
                `${formatMoney(goal.current_amount)} of ${formatMoney(goal.target_amount)}`;


            const track =
                document.createElement(
                    "div"
                );

            track.className =
                "goal-progress-track";


            const fill =
                document.createElement(
                    "div"
                );

            fill.className =
                "goal-progress-fill";

            fill.style.width =
                `${progress}%`;

            track.appendChild(
                fill
            );


            card.append(
                top,
                amount,
                track
            );

            wrap.appendChild(
                card
            );
        }
    );


    dashboardGoalsSummary.appendChild(
        wrap
    );
}


function getCurrentTotalBalance() {

    return accounts.reduce(
        (
            total,
            account
        ) =>
            total +
            calculateAccountBalance(
                account.id
            ),
        0
    );
}


function getMonthlyRecurringNet() {

    return recurringTransactions
        .filter(
            item =>
                item.is_active
        )
        .reduce(
            (
                total,
                item
            ) => {

                const monthly =
                    recurringMonthlyEquivalent(
                        item
                    );

                return total +
                    (
                        item.type ===
                            "income"
                            ? monthly
                            : -monthly
                    );
            },
            0
        );
}


function renderEmergencyFundCalculator() {

    if (
        !emergencyMonthlyExpenses ||
        !emergencyMonths ||
        !emergencyFundResult
    ) {
        return;
    }

    const monthly =
        Number(
            emergencyMonthlyExpenses.value
        );

    const months =
        Number(
            emergencyMonths.value
        );

    const target =
        (
            Number.isFinite(monthly) &&
            monthly >= 0 &&
            Number.isFinite(months) &&
            months > 0
        )
            ? monthly *
                months
            : 0;

    emergencyFundResult.textContent =
        formatMoney(
            target
        );
}


function renderFutureBalanceProjection() {

    if (
        !projectionMonths ||
        !projectionCurrentBalance ||
        !projectionMonthlyNet ||
        !projectionResult
    ) {
        return;
    }

    const currentBalance =
        getCurrentTotalBalance();

    const monthlyNet =
        getMonthlyRecurringNet();

    const months =
        Number(
            projectionMonths.value
        );

    const projected =
        currentBalance +
        (
            Number.isFinite(months)
                ? monthlyNet *
                    months
                : 0
        );

    projectionCurrentBalance.textContent =
        formatMoney(
            currentBalance
        );

    projectionMonthlyNet.textContent =
        formatMoney(
            monthlyNet
        );

    projectionMonthlyNet.classList.toggle(
        "income",
        monthlyNet >= 0
    );

    projectionMonthlyNet.classList.toggle(
        "expense",
        monthlyNet < 0
    );

    projectionResult.textContent =
        formatMoney(
            projected
        );

    projectionResult.classList.toggle(
        "income",
        projected >= 0
    );

    projectionResult.classList.toggle(
        "expense",
        projected < 0
    );
}


function renderLoanCalculator() {

    if (
        !loanPrincipal ||
        !loanRate ||
        !loanTermMonths ||
        !loanMonthlyPayment ||
        !loanTotalInterest ||
        !loanTotalRepayment
    ) {
        return;
    }

    const principal =
        Number(
            loanPrincipal.value
        );

    const annualRate =
        Number(
            loanRate.value
        );

    const months =
        Number(
            loanTermMonths.value
        );


    if (
        !Number.isFinite(principal) ||
        principal <= 0 ||
        !Number.isFinite(annualRate) ||
        annualRate < 0 ||
        !Number.isFinite(months) ||
        months <= 0
    ) {

        loanMonthlyPayment.textContent =
            formatMoney(0);

        loanTotalInterest.textContent =
            formatMoney(0);

        loanTotalRepayment.textContent =
            formatMoney(0);

        return;
    }


    const monthlyRate =
        annualRate /
        100 /
        12;


    let monthlyPayment;

    if (monthlyRate === 0) {

        monthlyPayment =
            principal /
            months;

    } else {

        const factor =
            Math.pow(
                1 +
                monthlyRate,
                months
            );

        monthlyPayment =
            principal *
            monthlyRate *
            factor /
            (
                factor -
                1
            );
    }


    const totalRepayment =
        monthlyPayment *
        months;

    const totalInterest =
        Math.max(
            0,
            totalRepayment -
            principal
        );


    loanMonthlyPayment.textContent =
        formatMoney(
            monthlyPayment
        );

    loanTotalInterest.textContent =
        formatMoney(
            totalInterest
        );

    loanTotalRepayment.textContent =
        formatMoney(
            totalRepayment
        );
}


function renderPlanningTools() {

    renderEmergencyFundCalculator();
    renderFutureBalanceProjection();
    renderLoanCalculator();
}


[
    emergencyMonthlyExpenses,
    emergencyMonths
]
    .filter(Boolean)
    .forEach(
        element =>
            element.addEventListener(
                "input",
                renderEmergencyFundCalculator
            )
    );


projectionMonths
    ?.addEventListener(
        "change",
        renderFutureBalanceProjection
    );


[
    loanPrincipal,
    loanRate,
    loanTermMonths
]
    .filter(Boolean)
    .forEach(
        element =>
            element.addEventListener(
                "input",
                renderLoanCalculator
            )
    );




// ======================================================
// SCHEDULED EMAIL REPORTS
// ======================================================

function populateScheduledReportDays() {

    if (!scheduledReportDayOfMonth) {
        return;
    }

    if (
        scheduledReportDayOfMonth
            .options
            .length >
        0
    ) {
        return;
    }

    for (
        let day = 1;
        day <= 28;
        day += 1
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            String(
                day
            );

        option.textContent =
            day === 1
                ? "1st of each month"
                : `${day}th of each month`;

        scheduledReportDayOfMonth
            .appendChild(
                option
            );
    }
}


function updateScheduledReportFrequencyFields() {

    if (
        !scheduledReportFrequency ||
        !scheduledReportMonthlyDayGroup ||
        !scheduledReportWeeklyDayGroup
    ) {
        return;
    }

    const weekly =
        scheduledReportFrequency.value ===
        "weekly";

    scheduledReportMonthlyDayGroup.style.display =
        weekly
            ? "none"
            : "block";

    scheduledReportWeeklyDayGroup.style.display =
        weekly
            ? "block"
            : "none";
}


function updateScheduledReportStatusBadge() {

    if (
        !scheduledReportStatusBadge ||
        !scheduledReportEnabled
    ) {
        return;
    }

    const enabled =
        scheduledReportEnabled.checked;

    scheduledReportStatusBadge.textContent =
        enabled
            ? "Enabled"
            : "Disabled";

    scheduledReportStatusBadge.classList.toggle(
        "enabled",
        enabled
    );

    scheduledReportStatusBadge.classList.toggle(
        "disabled",
        !enabled
    );
}


function formatScheduledReportTimestamp(
    value
) {

    if (!value) {
        return "Never";
    }

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Never";
    }

    return date.toLocaleString(
        "en-MY",
        {
            dateStyle:
                "medium",
            timeStyle:
                "short"
        }
    );
}


function renderReportEmailPreference() {

    populateScheduledReportDays();

    if (
        !scheduledReportForm ||
        !currentUser
    ) {
        return;
    }


    if (!reportEmailPreference) {

        scheduledReportEnabled.checked =
            false;

        scheduledReportEmail.value =
            currentUser.email ||
            "";

        scheduledReportFrequency.value =
            "monthly";

        scheduledReportDayOfMonth.value =
            "1";

        scheduledReportDayOfWeek.value =
            "1";

        scheduledReportTime.value =
            "08:00";

        scheduledReportTimezone.value =
            "Asia/Kuala_Lumpur";

        scheduledReportIncludeCsv.checked =
            false;

        scheduledReportLastSent.textContent =
            "Last sent: Never";

        scheduledReportLastError.textContent =
            "";

        updateScheduledReportFrequencyFields();
        updateScheduledReportStatusBadge();

        return;
    }


    scheduledReportEnabled.checked =
        Boolean(
            reportEmailPreference.enabled
        );

    scheduledReportEmail.value =
        reportEmailPreference.recipient_email ||
        currentUser.email ||
        "";

    scheduledReportFrequency.value =
        reportEmailPreference.frequency ||
        "monthly";

    scheduledReportDayOfMonth.value =
        String(
            reportEmailPreference.day_of_month ||
            1
        );

    scheduledReportDayOfWeek.value =
        String(
            reportEmailPreference.day_of_week ??
            1
        );

    scheduledReportTime.value =
        String(
            reportEmailPreference.send_time ||
            "08:00"
        )
            .slice(
                0,
                5
            );

    scheduledReportTimezone.value =
        reportEmailPreference.timezone ||
        "Asia/Kuala_Lumpur";

    scheduledReportIncludeCsv.checked =
        Boolean(
            reportEmailPreference.include_excel
        );


    scheduledReportLastSent.textContent =
        `Last sent: ${formatScheduledReportTimestamp(reportEmailPreference.last_sent_at)}`;


    if (
        reportEmailPreference.last_error
    ) {

        scheduledReportLastError.textContent =
            `Last error: ${reportEmailPreference.last_error}`;

        scheduledReportLastError.classList.add(
            "error"
        );

    } else {

        scheduledReportLastError.textContent =
            "";

        scheduledReportLastError.classList.remove(
            "error"
        );
    }


    updateScheduledReportFrequencyFields();
    updateScheduledReportStatusBadge();
}


async function loadReportEmailPreference() {

    if (!currentUser) {

        reportEmailPreference =
            null;

        return;
    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "report_email_preferences"
            )
            .select("*")
            .eq(
                "user_id",
                currentUser.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Load email report preference error:",
            error
        );

        if (scheduledReportMessage) {

            scheduledReportMessage.textContent =
                error.message;
        }

        return;
    }


    reportEmailPreference =
        data ||
        null;

    renderReportEmailPreference();
}


scheduledReportFrequency
    ?.addEventListener(
        "change",
        updateScheduledReportFrequencyFields
    );


scheduledReportEnabled
    ?.addEventListener(
        "change",
        updateScheduledReportStatusBadge
    );


scheduledReportForm
    ?.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!currentUser) {
                return;
            }


            const email =
                scheduledReportEmail
                    .value
                    .trim();


            if (!email) {

                scheduledReportMessage.textContent =
                    "Enter a recipient email address.";

                return;
            }


            scheduledReportSaveButton.disabled =
                true;

            scheduledReportMessage.textContent =
                "Saving email schedule...";


            const frequency =
                scheduledReportFrequency.value;


            const payload = {
                user_id:
                    currentUser.id,

                enabled:
                    scheduledReportEnabled.checked,

                frequency,

                day_of_week:
                    frequency ===
                        "weekly"
                        ? Number(
                            scheduledReportDayOfWeek.value
                        )
                        : null,

                day_of_month:
                    frequency ===
                        "monthly"
                        ? Number(
                            scheduledReportDayOfMonth.value
                        )
                        : null,

                send_time:
                    scheduledReportTime.value ||
                    "08:00",

                timezone:
                    scheduledReportTimezone.value ||
                    "Asia/Kuala_Lumpur",

                recipient_email:
                    email,

                include_excel:
                    scheduledReportIncludeCsv.checked
            };


            const {
                data,
                error
            } =
                await supabase
                    .from(
                        "report_email_preferences"
                    )
                    .upsert(
                        payload,
                        {
                            onConflict:
                                "user_id"
                        }
                    )
                    .select("*")
                    .single();


            scheduledReportSaveButton.disabled =
                false;


            if (error) {

                scheduledReportMessage.textContent =
                    error.message;

                return;
            }


            reportEmailPreference =
                data;

            renderReportEmailPreference();

            scheduledReportMessage.textContent =
                "Email schedule saved successfully.";

            showTransactionSuccessSnackbar({
                title:
                    "Email schedule saved",
                message:
                    scheduledReportEnabled.checked
                        ? "Scheduled reports are enabled."
                        : "Your report email settings were saved."
            });
        }
    );


scheduledReportTestButton
    ?.addEventListener(
        "click",
        async function () {

            if (!currentUser) {
                return;
            }


            if (!reportEmailPreference) {

                scheduledReportMessage.textContent =
                    "Save your email report settings first.";

                return;
            }


            scheduledReportTestButton.disabled =
                true;

            scheduledReportMessage.textContent =
                "Sending report email...";


            const {
                data,
                error
            } =
                await supabase
                    .functions
                    .invoke(
                        "scheduled-email-reports",
                        {
                            body: {
                                mode:
                                    "manual",
                                month_start:
                                    getReportMonthStart()
                            }
                        }
                    );


            scheduledReportTestButton.disabled =
                false;


            if (error) {

                scheduledReportMessage.textContent =
                    error.message ||
                    "Unable to send the report email.";

                await loadReportEmailPreference();

                return;
            }


            if (
                data &&
                data.ok === false
            ) {

                scheduledReportMessage.textContent =
                    data.error ||
                    "Unable to send the report email.";

                await loadReportEmailPreference();

                return;
            }


            scheduledReportMessage.textContent =
                "Report email sent successfully.";

            await loadReportEmailPreference();


            showTransactionSuccessSnackbar({
                title:
                    "Report email sent",
                message:
                    "The selected finance report was emailed successfully."
            });
        }
    );


// ======================================================
// REPORTS
// ======================================================

function setDefaultReportMonth() {

    if (!reportMonthInput) {
        return;
    }

    if (!reportMonthInput.value) {

        reportMonthInput.value =
            getCurrentMonthValue();
    }
}


function getReportMonthStart() {

    const value =
        reportMonthInput?.value;

    if (
        !value ||
        !/^\d{4}-\d{2}$/.test(
            value
        )
    ) {
        return `${getCurrentMonthValue()}-01`;
    }

    return `${value}-01`;
}


function addMonthsToMonthStart(
    monthStart,
    amount
) {

    const date =
        new Date(
            `${monthStart}T00:00:00`
        );

    date.setMonth(
        date.getMonth() +
        amount
    );

    return [
        date.getFullYear(),
        String(
            date.getMonth() +
            1
        ).padStart(
            2,
            "0"
        ),
        "01"
    ].join("-");
}


function getMonthEndExclusive(
    monthStart
) {

    return addMonthsToMonthStart(
        monthStart,
        1
    );
}


function getTransactionsForMonth(
    monthStart
) {

    const endExclusive =
        getMonthEndExclusive(
            monthStart
        );

    return transactions.filter(
        transaction =>
            transaction.transaction_date >=
                monthStart
            &&
            transaction.transaction_date <
                endExclusive
    );
}


function getReportTotals(
    monthTransactions
) {

    const income =
        monthTransactions
            .filter(
                item =>
                    item.type ===
                    "income"
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.amount
                    ),
                0
            );

    const expenses =
        monthTransactions
            .filter(
                item =>
                    item.type ===
                    "expense"
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.amount
                    ),
                0
            );

    return {
        income,
        expenses,
        net:
            income -
            expenses,
        count:
            monthTransactions.length
    };
}


function getMonthLabel(
    monthStart
) {

    return new Date(
        `${monthStart}T00:00:00`
    )
        .toLocaleDateString(
            "en-MY",
            {
                month:
                    "long",
                year:
                    "numeric"
            }
        );
}


function getShortMonthLabel(
    monthStart
) {

    return new Date(
        `${monthStart}T00:00:00`
    )
        .toLocaleDateString(
            "en-MY",
            {
                month:
                    "short",
                year:
                    "2-digit"
            }
        );
}


function formatReportChange(
    currentValue,
    previousValue,
    type
) {

    if (
        previousValue === 0
    ) {

        if (
            currentValue === 0
        ) {
            return "No change from last month.";
        }

        return "No comparable value last month.";
    }

    const percent =
        (
            currentValue -
            previousValue
        )
        /
        previousValue *
        100;

    const direction =
        percent > 0
            ? "up"
            : percent < 0
                ? "down"
                : "unchanged";

    if (direction === "unchanged") {
        return "Unchanged from last month.";
    }

    const abs =
        Math.abs(
            percent
        )
            .toFixed(
                1
            );

    if (type === "expense") {

        return `${direction === "up" ? "▲" : "▼"} ${abs}% ${direction} vs last month`;
    }

    return `${direction === "up" ? "▲" : "▼"} ${abs}% ${direction} vs last month`;
}


function createReportListRow({
    title,
    subtitle,
    amount,
    share = null,
    amountClass = ""
}) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "report-list-row";


    const copy =
        document.createElement(
            "div"
        );

    copy.className =
        "report-list-copy";


    const heading =
        document.createElement(
            "strong"
        );

    heading.textContent =
        title;


    const description =
        document.createElement(
            "span"
        );

    description.textContent =
        subtitle;


    copy.append(
        heading,
        description
    );


    const right =
        document.createElement(
            "div"
        );

    right.className =
        "report-list-right";


    const amountElement =
        document.createElement(
            "strong"
        );

    amountElement.className =
        amountClass;

    amountElement.textContent =
        formatMoney(
            amount
        );

    right.appendChild(
        amountElement
    );


    if (
        share !== null &&
        Number.isFinite(
            share
        )
    ) {

        const shareText =
            document.createElement(
                "span"
            );

        shareText.textContent =
            `${share.toFixed(1)}%`;

        right.appendChild(
            shareText
        );
    }


    row.append(
        copy,
        right
    );

    return row;
}


function renderReportCategoryBreakdown(
    monthTransactions,
    totalExpenses
) {

    if (!reportCategoryBreakdown) {
        return;
    }

    reportCategoryBreakdown.innerHTML =
        "";


    const totals =
        new Map();


    monthTransactions
        .filter(
            item =>
                item.type ===
                "expense"
        )
        .forEach(
            function (item) {

                const name =
                    categories.find(
                        category =>
                            category.id ===
                            item.category_id
                    )?.name
                    ||
                    "Uncategorized";

                totals.set(
                    name,
                    (
                        totals.get(
                            name
                        )
                        ||
                        0
                    )
                    +
                    Number(
                        item.amount
                    )
                );
            }
        );


    const rows =
        Array.from(
            totals.entries()
        )
            .sort(
                (
                    first,
                    second
                ) =>
                    second[1] -
                    first[1]
            );


    if (!rows.length) {

        reportCategoryBreakdown.textContent =
            "No expense transactions for this month.";

        return;
    }


    rows.forEach(
        (
            [
                name,
                amount
            ]
        ) => {

            reportCategoryBreakdown.appendChild(
                createReportListRow({
                    title:
                        name,
                    subtitle:
                        "Monthly spending",
                    amount,
                    share:
                        totalExpenses > 0
                            ? amount /
                                totalExpenses *
                                100
                            : 0,
                    amountClass:
                        "expense"
                })
            );
        }
    );
}


function renderReportIncomeBreakdown(
    monthTransactions,
    totalIncome
) {

    if (!reportIncomeBreakdown) {
        return;
    }

    reportIncomeBreakdown.innerHTML =
        "";


    const totals =
        new Map();


    monthTransactions
        .filter(
            item =>
                item.type ===
                "income"
        )
        .forEach(
            function (item) {

                const name =
                    incomeSources.find(
                        source =>
                            source.id ===
                            item.income_source_id
                    )?.name
                    ||
                    "Other Income";

                totals.set(
                    name,
                    (
                        totals.get(
                            name
                        )
                        ||
                        0
                    )
                    +
                    Number(
                        item.amount
                    )
                );
            }
        );


    const rows =
        Array.from(
            totals.entries()
        )
            .sort(
                (
                    first,
                    second
                ) =>
                    second[1] -
                    first[1]
            );


    if (!rows.length) {

        reportIncomeBreakdown.textContent =
            "No income transactions for this month.";

        return;
    }


    rows.forEach(
        (
            [
                name,
                amount
            ]
        ) => {

            reportIncomeBreakdown.appendChild(
                createReportListRow({
                    title:
                        name,
                    subtitle:
                        "Monthly income",
                    amount,
                    share:
                        totalIncome > 0
                            ? amount /
                                totalIncome *
                                100
                            : 0,
                    amountClass:
                        "income"
                })
            );
        }
    );
}


function renderReportAccountBreakdown(
    monthTransactions
) {

    if (!reportAccountBreakdown) {
        return;
    }

    reportAccountBreakdown.innerHTML =
        "";


    const rows =
        accounts
            .map(
                function (account) {

                    const accountTransactions =
                        monthTransactions.filter(
                            item =>
                                item.account_id ===
                                account.id
                        );

                    const totals =
                        getReportTotals(
                            accountTransactions
                        );

                    return {
                        account,
                        ...totals
                    };
                }
            )
            .filter(
                row =>
                    row.count > 0
            )
            .sort(
                (
                    first,
                    second
                ) =>
                    Math.abs(
                        second.net
                    )
                    -
                    Math.abs(
                        first.net
                    )
            );


    if (!rows.length) {

        reportAccountBreakdown.textContent =
            "No account activity for this month.";

        return;
    }


    rows.forEach(
        function (row) {

            const element =
                createReportListRow({
                    title:
                        row.account.name,
                    subtitle:
                        `${row.count} transaction${row.count === 1 ? "" : "s"} • Income ${formatMoney(row.income)} • Expense ${formatMoney(row.expenses)}`,
                    amount:
                        row.net,
                    amountClass:
                        row.net >= 0
                            ? "income"
                            : "expense"
                });

            reportAccountBreakdown.appendChild(
                element
            );
        }
    );
}


function renderReportBudgetPerformance(
    monthStart,
    monthTransactions
) {

    if (!reportBudgetPerformance) {
        return;
    }

    reportBudgetPerformance.innerHTML =
        "";


    const monthBudgets =
        budgets
            .filter(
                budget =>
                    budget.month_start ===
                    monthStart
            );


    if (!monthBudgets.length) {

        reportBudgetPerformance.textContent =
            "No budgets configured for this month.";

        return;
    }


    monthBudgets
        .map(
            function (budget) {

                const spent =
                    monthTransactions
                        .filter(
                            item =>
                                item.type ===
                                    "expense"
                            &&
                                item.category_id ===
                                    budget.category_id
                        )
                        .reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item.amount
                                ),
                            0
                        );

                const category =
                    categories.find(
                        item =>
                            item.id ===
                            budget.category_id
                    );

                return {
                    budget,
                    category,
                    spent
                };
            }
        )
        .sort(
            (
                first,
                second
            ) =>
                (
                    second.spent /
                    Number(
                        second.budget.amount
                    )
                )
                -
                (
                    first.spent /
                    Number(
                        first.budget.amount
                    )
                )
        )
        .forEach(
            function ({
                budget,
                category,
                spent
            }) {

                const limit =
                    Number(
                        budget.amount
                    );

                const percent =
                    limit > 0
                        ? spent /
                            limit *
                            100
                        : 0;

                reportBudgetPerformance.appendChild(
                    createReportListRow({
                        title:
                            category?.name ||
                            "Unknown Category",
                        subtitle:
                            `${percent.toFixed(1)}% used • Budget ${formatMoney(limit)}`,
                        amount:
                            spent,
                        amountClass:
                            spent > limit
                                ? "expense"
                                : ""
                    })
                );
            }
        );
}


function renderReportTrend(
    selectedMonthStart
) {

    if (!reportTrendTable) {
        return;
    }

    reportTrendTable.innerHTML =
        "";


    const table =
        document.createElement(
            "div"
        );

    table.className =
        "report-trend-grid";


    const headers =
        [
            "Month",
            "Income",
            "Expenses",
            "Net"
        ];


    headers.forEach(
        function (label) {

            const cell =
                document.createElement(
                    "strong"
                );

            cell.className =
                "report-trend-header";

            cell.textContent =
                label;

            table.appendChild(
                cell
            );
        }
    );


    for (
        let offset = -5;
        offset <= 0;
        offset += 1
    ) {

        const monthStart =
            addMonthsToMonthStart(
                selectedMonthStart,
                offset
            );

        const totals =
            getReportTotals(
                getTransactionsForMonth(
                    monthStart
                )
            );


        const monthCell =
            document.createElement(
                "span"
            );

        monthCell.textContent =
            getShortMonthLabel(
                monthStart
            );


        const incomeCell =
            document.createElement(
                "span"
            );

        incomeCell.className =
            "income";

        incomeCell.textContent =
            formatMoney(
                totals.income
            );


        const expenseCell =
            document.createElement(
                "span"
            );

        expenseCell.className =
            "expense";

        expenseCell.textContent =
            formatMoney(
                totals.expenses
            );


        const netCell =
            document.createElement(
                "span"
            );

        netCell.className =
            totals.net >= 0
                ? "income"
                : "expense";

        netCell.textContent =
            formatMoney(
                totals.net
            );


        table.append(
            monthCell,
            incomeCell,
            expenseCell,
            netCell
        );
    }


    reportTrendTable.appendChild(
        table
    );
}


function renderReportTransactions(
    monthStart,
    monthTransactions
) {

    if (
        !reportTransactionList ||
        !reportTransactionSubtitle
    ) {
        return;
    }

    reportTransactionList.innerHTML =
        "";

    reportTransactionSubtitle.textContent =
        `${monthTransactions.length} transaction${monthTransactions.length === 1 ? "" : "s"} in ${getMonthLabel(monthStart)}.`;


    if (!monthTransactions.length) {

        reportTransactionList.textContent =
            "No transactions for this month.";

        return;
    }


    [
        ...monthTransactions
    ]
        .sort(
            (
                first,
                second
            ) =>
                second.transaction_date
                    .localeCompare(
                        first.transaction_date
                    )
        )
        .forEach(
            function (transaction) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "report-transaction-row";


                const copy =
                    document.createElement(
                        "div"
                    );


                const title =
                    document.createElement(
                        "strong"
                    );

                title.textContent =
                    transaction.description;


                const meta =
                    document.createElement(
                        "span"
                    );

                const account =
                    accounts.find(
                        item =>
                            item.id ===
                            transaction.account_id
                    )?.name
                    ||
                    "Unknown Account";

                const category =
                    transaction.type ===
                        "expense"
                        ? (
                            categories.find(
                                item =>
                                    item.id ===
                                    transaction.category_id
                            )?.name
                            ||
                            "Uncategorized"
                        )
                        : (
                            incomeSources.find(
                                item =>
                                    item.id ===
                                    transaction.income_source_id
                            )?.name
                            ||
                            "Other Income"
                        );

                meta.textContent =
                    [
                        formatDate(
                            transaction.transaction_date
                        ),
                        account,
                        category,
                        getPaymentMethodName(
                            transaction.payment_method_id
                        )
                    ]
                        .filter(Boolean)
                        .join(" • ");


                copy.append(
                    title,
                    meta
                );


                const amount =
                    document.createElement(
                        "strong"
                    );

                amount.className =
                    transaction.type ===
                        "income"
                        ? "income"
                        : "expense";

                amount.textContent =
                    `${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}`;


                row.append(
                    copy,
                    amount
                );

                reportTransactionList.appendChild(
                    row
                );
            }
        );
}


function renderReports() {

    if (
        !reportMonthInput ||
        !reportTotalIncome ||
        !reportTotalExpenses ||
        !reportNetCashflow ||
        !reportTransactionCount
    ) {
        return;
    }


    setDefaultReportMonth();


    const monthStart =
        getReportMonthStart();

    const previousMonthStart =
        addMonthsToMonthStart(
            monthStart,
            -1
        );


    const monthTransactions =
        getTransactionsForMonth(
            monthStart
        );

    const previousTransactions =
        getTransactionsForMonth(
            previousMonthStart
        );


    const totals =
        getReportTotals(
            monthTransactions
        );

    const previousTotals =
        getReportTotals(
            previousTransactions
        );


    reportTotalIncome.textContent =
        formatMoney(
            totals.income
        );

    reportTotalExpenses.textContent =
        formatMoney(
            totals.expenses
        );

    reportNetCashflow.textContent =
        formatMoney(
            totals.net
        );

    reportNetCashflow.classList.toggle(
        "income",
        totals.net >= 0
    );

    reportNetCashflow.classList.toggle(
        "expense",
        totals.net < 0
    );

    reportTransactionCount.textContent =
        String(
            totals.count
        );


    reportIncomeChange.textContent =
        formatReportChange(
            totals.income,
            previousTotals.income,
            "income"
        );

    reportExpenseChange.textContent =
        formatReportChange(
            totals.expenses,
            previousTotals.expenses,
            "expense"
        );


    renderReportCategoryBreakdown(
        monthTransactions,
        totals.expenses
    );

    renderReportIncomeBreakdown(
        monthTransactions,
        totals.income
    );

    renderReportAccountBreakdown(
        monthTransactions
    );

    renderReportBudgetPerformance(
        monthStart,
        monthTransactions
    );

    renderReportTrend(
        monthStart
    );

    renderReportTransactions(
        monthStart,
        monthTransactions
    );
}


function escapeCsvValue(
    value
) {

    const string =
        String(
            value ??
            ""
        );

    const safeString =
        /^[\t\r ]*[=+\-@]/
            .test(
                string
            )
            ? `'${string}`
            : string;

    if (
        safeString.includes(",") ||
        safeString.includes('"') ||
        safeString.includes("\n")
    ) {

        return `"${safeString.replaceAll('"', '""')}"`;
    }

    return safeString;
}


function exportCurrentReportCsv() {

    const monthStart =
        getReportMonthStart();

    const monthTransactions =
        getTransactionsForMonth(
            monthStart
        );


    const rows =
        [
            [
                "Date",
                "Type",
                "Description",
                "Account",
                "Payment Method",
                "Category / Income Source",
                "Amount",
                "Notes",
                "Recurring"
            ]
        ];


    monthTransactions
        .sort(
            (
                first,
                second
            ) =>
                first.transaction_date
                    .localeCompare(
                        second.transaction_date
                    )
        )
        .forEach(
            function (transaction) {

                const account =
                    accounts.find(
                        item =>
                            item.id ===
                            transaction.account_id
                    )?.name
                    ||
                    "";

                const categoryOrSource =
                    transaction.type ===
                        "expense"
                        ? (
                            categories.find(
                                item =>
                                    item.id ===
                                    transaction.category_id
                            )?.name
                            ||
                            ""
                        )
                        : (
                            incomeSources.find(
                                item =>
                                    item.id ===
                                    transaction.income_source_id
                            )?.name
                            ||
                            ""
                        );

                const recurringName =
                    transaction.recurring_id
                        ? (
                            recurringTransactions.find(
                                item =>
                                    item.id ===
                                    transaction.recurring_id
                            )?.name
                            ||
                            "Recurring"
                        )
                        : "";

                rows.push(
                    [
                        transaction.transaction_date,
                        transaction.type,
                        transaction.description,
                        account,
                        getPaymentMethodName(
                            transaction.payment_method_id
                        ),
                        categoryOrSource,
                        Number(
                            transaction.amount
                        ).toFixed(
                            2
                        ),
                        transaction.notes ||
                            "",
                        recurringName
                    ]
                );
            }
        );


    const csv =
        rows
            .map(
                row =>
                    row
                        .map(
                            escapeCsvValue
                        )
                        .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [
                "\ufeff",
                csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        `finance-report-${monthStart.slice(0, 7)}.csv`;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );


    showTransactionSuccessSnackbar({
        title:
            "Report exported",
        message:
            `${getMonthLabel(monthStart)} CSV has been downloaded.`
    });
}


reportMonthInput
    ?.addEventListener(
        "change",
        renderReports
    );


reportCurrentMonthButton
    ?.addEventListener(
        "click",
        function () {

            reportMonthInput.value =
                getCurrentMonthValue();

            renderReports();
        }
    );


reportExportCsvButton
    ?.addEventListener(
        "click",
        exportCurrentReportCsv
    );


reportPrintButton
    ?.addEventListener(
        "click",
        function () {

            window.print();
        }
    );


// ======================================================
// FORMATTING
// ======================================================

function formatAccountType(type) {

    const values = {
        bank: "Bank",
        cash: "Cash",
        e_wallet: "E-Wallet",
        savings: "Savings",
        credit_card: "Credit Card",
        other: "Other"
    };

    return values[type] || type;
}


function formatCategoryType(type) {

    const values = {
        expense: "Expense",
        income: "Income",
        both: "Income & Expense"
    };

    return values[type] || type;
}


function formatMoney(amount) {

    return new Intl.NumberFormat(
        "en-MY",
        {
            style: "currency",
            currency: "MYR"
        }
    ).format(
        Number(amount)
    );
}


function formatDate(date) {

    if (!date) {
        return "No date";
    }

    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString(
        "en-MY",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatDeletedDate(date) {

    if (!date) {
        return "";
    }

    return new Date(date)
        .toLocaleString(
            "en-MY",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}


function formatBudgetMonth(month) {

    if (!month) {
        return "";
    }

    const [
        year,
        monthNumber
    ] =
        month.split("-");

    const date =
        new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        );

    return date.toLocaleDateString(
        "en-MY",
        {
            month: "long",
            year: "numeric"
        }
    );
}


// ======================================================
// DATE HELPERS
// ======================================================

function getTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}


function getCurrentMonthValue() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}`;
}

// ======================================================
// APP PAGE NAVIGATION
// ======================================================

const pageTitles = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    budgets: "Budgets",
    recurring: "Recurring & Subscriptions",
    goals: "Goals & Planning",
    reports: "Reports",
    insights: "Smart Insights",
    accounts: "Accounts",
    "credit-cards": "Credit Cards",
    manage: "Manage",
    settings: "Settings",
    more: "More"
};


// Native Back keeps drafts intact and dismisses overlays before leaving a page.
const nativePageHistory = [];

function handleNativeBack() {
    if (!isNativeApp) return false;

    if (document.body.classList.contains("kira-update-open")) {
        window.dispatchEvent(
            new CustomEvent("kira:close-update")
        );
        return true;
    }

    if (document.body.classList.contains("kira-notification-open")) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        return true;
    }
    if (document.body.classList.contains("kira-onboarding-open")) {
        closeOnboarding();
        return true;
    }
    const currentPage = document.querySelector(".app-page.active-page")?.dataset.page;
    if (!currentPage || currentPage === "dashboard") return false;
    const previousPage = nativePageHistory.pop() || "dashboard";
    navigateToPage(previousPage, { updateHistory: false });
    history.replaceState({ page: previousPage }, "", "#" + previousPage);
    return true;
}

if (isNativeApp) window.kiraHandleNativeBack = handleNativeBack;

function navigateToPage(
    pageName,
    options = {}
) {

    const {
        updateHistory = true,
        scrollToTop = true
    } = options;


    const targetPage =
        document.querySelector(
            `.app-page[data-page="${pageName}"]`
        );


    if (!targetPage) {

        console.warn(
            `Page not found: ${pageName}`
        );

        return;
    }


    // ----------------------------------------------
    // HIDE ALL PAGES
    // ----------------------------------------------

    if (isNativeApp && updateHistory) {
        const previousPage = document.querySelector(".app-page.active-page")?.dataset.page;
        if (previousPage && previousPage !== pageName) {
            if (pageName === "dashboard") nativePageHistory.length = 0;
            else nativePageHistory.push(previousPage);
        }
    }

    appPages.forEach(
        function (page) {

            page.style.display =
                "none";

            page.classList.remove(
                "active-page"
            );
        }
    );


    // ----------------------------------------------
    // SHOW SELECTED PAGE
    // ----------------------------------------------

    targetPage.style.display =
        "block";

    targetPage.classList.add(
        "active-page"
    );


    // ----------------------------------------------
    // UPDATE NAVIGATION ACTIVE STATE
    // ----------------------------------------------

    desktopNavItems.forEach(
        function (item) {

            item.classList.toggle(
                "active",
                item.dataset.page ===
                    pageName
            );
        }
    );


    mobileNavItems.forEach(
        function (item) {

            const isMoreSection =
                item.dataset.page === "more"
                && [
                    "more",
                    "accounts",
                    "credit-cards",
                    "manage",
                    "recurring",
                    "goals",
                    "reports",
                    "insights",
                    "settings"
                ].includes(
                    pageName
                );

            item.classList.toggle(
                "active",
                item.dataset.page ===
                    pageName
                ||
                isMoreSection
            );
        }
    );


    // ----------------------------------------------
    // PAGE TITLE
    // ----------------------------------------------

    if (appPageTitle) {

        appPageTitle.textContent =
            pageTitles[pageName]
            ||
            "Kira";
    }

    // ----------------------------------------------
    // TOP BAR VISIBILITY
    // ----------------------------------------------

    if (appTopbar) {

        appTopbar.style.display =
            pageName === "dashboard"
                ? "flex"
                : "none";
}


    // ----------------------------------------------
    // URL HISTORY
    // ----------------------------------------------

    if (updateHistory) {

        const newHash =
            `#${pageName}`;

        if (
            window.location.hash !==
            newHash
        ) {

            history.pushState(
                {
                    page:
                        pageName
                },
                "",
                newHash
            );
        }
    }


    // ----------------------------------------------
    // DASHBOARD DATA
    // ----------------------------------------------

    if (
        pageName ===
        "dashboard"
    ) {

        renderDashboardRecentTransactions();

        loadDashboardBudgetSummary();

        renderDashboardUpcomingCommitments();
    }

    if (
        pageName ===
        "recurring"
    ) {

        renderRecurringTransactions();

        renderRecurringSummary();

        renderRecurringAnalytics();

        renderRecurringReminderCenter();

        renderRecentRecurringActivity();

        renderFinancialCalendar();

        refreshRecurringFormOptions();
    }


    // ----------------------------------------------
    // SCROLL
    // ----------------------------------------------

    if (scrollToTop) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


// ======================================================
// NAVIGATION CLICK HANDLERS
// ======================================================

allPageNavItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function (event) {

                const pageName =
                    item.dataset.page;


                if (!pageName) {
                    return;
                }


                event.preventDefault();


                navigateToPage(
                    pageName
                );
            }
        );
    }
);


// ======================================================
// MOBILE MORE HUB
// ======================================================

moreHubPageLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const pageName =
                    link.dataset.page;

                if (!pageName) {
                    return;
                }

                event.preventDefault();

                navigateToPage(
                    pageName
                );
            }
        );
    }
);


moreHubManageLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.dataset.manageTarget;

                if (!targetId) {
                    return;
                }

                event.preventDefault();

                navigateToPage(
                    "manage",
                    {
                        scrollToTop:
                            false
                    }
                );

                requestAnimationFrame(
                    function () {

                        document
                            .getElementById(
                                targetId
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            });
                    }
                );
            }
        );
    }
);



dashboardViewAllTransactions
    ?.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showAllTransactions =
                true;

            navigateToPage(
                "transactions"
            );

            renderTransactions();
        }
    );


// ======================================================
// QUICK ADD TRANSACTION
// ======================================================

quickAddTransactionLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                pendingRecurringId =
                    null;

                // If currently editing a transaction,
                // use the existing cancel/reset behaviour.

                if (
                    cancelEditButton &&
                    !cancelEditButton.classList.contains(
                        "hidden-button"
                    )
                ) {

                    cancelEditButton.click();
                }


                navigateToPage(
                    "transactions",
                    {
                        scrollToTop:
                            false
                    }
                );


                requestAnimationFrame(
                    function () {

                        transactionForm.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });


                        setTimeout(
                            function () {

                                document  
                                  .getElementById("description")
                                    ?.focus(); 

                            },
                            350
                        );
                    }
                );
            }
        );
    }
);



// ======================================================
// PWA / INSTALL APP
// ======================================================

const installAppCard =
    document.getElementById("install-app-card");

const installAppBadge =
    document.getElementById("install-app-badge");

const installAppDescription =
    document.getElementById("install-app-description");

const offlineBanner =
    document.getElementById("offline-banner");

let deferredInstallPrompt =
    null;


function isIosDevice() {

    return /iphone|ipad|ipod/i.test(
        window.navigator.userAgent
    );
}


function isStandaloneMode() {

    if (isNativeApp) return true;

    return (
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches
        ||
        window.navigator.standalone ===
            true
    );
}


function updateInstallAppUi() {

    if (!installAppCard) {
        return;
    }


    if (isStandaloneMode()) {

        installAppBadge.textContent =
            "Installed";

        installAppDescription.textContent =
            "Kira is already installed on this device.";

        installAppCard.classList.add(
            "installed"
        );

        return;
    }


    installAppCard.classList.remove(
        "installed"
    );


    if (isIosDevice()) {

        installAppBadge.textContent =
            "iPhone";

        installAppDescription.textContent =
            "Open Safari Share → Add to Home Screen.";

        return;
    }


    installAppBadge.textContent =
        deferredInstallPrompt
            ? "Ready"
            : "App";

    installAppDescription.textContent =
        deferredInstallPrompt
            ? "Install Kira on this device."
            : "Add Kira to your Home Screen for faster access.";
}


window.addEventListener(
    "beforeinstallprompt",
    function (event) {

        event.preventDefault();

        deferredInstallPrompt =
            event;

        updateInstallAppUi();
    }
);


window.addEventListener(
    "appinstalled",
    function () {

        deferredInstallPrompt =
            null;

        updateInstallAppUi();

        showTransactionSuccessSnackbar({
            title:
                "Kira installed",
            message:
                "You can now open it directly from your Home Screen."
        });
    }
);


installAppCard
    ?.addEventListener(
        "click",
        async function () {

            if (isStandaloneMode()) {

                showTransactionSuccessSnackbar({
                    title:
                        "Already installed",
                    message:
                        "Kira is already running as an installed app."
                });

                return;
            }


            if (isIosDevice()) {

                alert(
                    "On iPhone: open this site in Safari, tap the Share button, then choose “Add to Home Screen”."
                );

                return;
            }


            if (deferredInstallPrompt) {

                deferredInstallPrompt.prompt();

                await deferredInstallPrompt
                    .userChoice;

                deferredInstallPrompt =
                    null;

                updateInstallAppUi();

                return;
            }


            alert(
                "Use your browser menu and choose “Install app” or “Add to Home screen”."
            );
        }
    );


function updateOnlineStatus() {

    if (!offlineBanner) {
        return;
    }


    offlineBanner.classList.toggle(
        "hidden-button",
        window.navigator.onLine
    );
}


window.addEventListener(
    "online",
    updateOnlineStatus
);


window.addEventListener(
    "offline",
    updateOnlineStatus
);


updateOnlineStatus();
updateInstallAppUi();


if (
    !isNativeApp &&
    "serviceWorker" in
    navigator
) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register(
                    "/service-worker.js"
                )
                .catch(
                    function (error) {

                        console.warn(
                            "Service worker registration failed:",
                            error
                        );
                    }
                );
        }
    );
}


// ======================================================
// BROWSER BACK / FORWARD
// ======================================================

window.addEventListener(
    "popstate",
    function () {

        navigateToPage(
            getPageFromHash(),
            {
                updateHistory:
                    false
            }
        );
    }
);


// ======================================================
// PAGE FROM URL
// ======================================================

function getPageFromHash() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            );


    const allowedPages = [
        "dashboard",
        "transactions",
        "budgets",
        "recurring",
        "goals",
        "reports",
        "insights",
        "accounts",
        "manage",
        "settings",
        "more"
    ];


    if (
        allowedPages.includes(
            hash
        )
    ) {

        return hash;
    }


    /*
       Compatibility with our previous
       #transactions-page style URLs.
    */

    const legacyMap = {
        "dashboard-page":
            "dashboard",

        "transactions-page":
            "transactions",

        "budgets-page":
            "budgets",

        "recurring-page":
            "recurring",

        "goals-page":
            "goals",

        "reports-page":
            "reports",

        "insights-page":
            "insights",

        "accounts-page":
            "accounts",

        "manage-page":
            "manage",

        "settings-page":
            "settings",

        "more-page":
            "more"
    };


    return (
        legacyMap[hash]
        ||
        "dashboard"
    );
}


// ======================================================
// INITIALISE NAVIGATION
// ======================================================

function initializeAppNavigation() {

    navigateToPage(
        getPageFromHash(),
        {
            updateHistory:
                false,

            scrollToTop:
                false
        }
    );
}

// ======================================================
// DASHBOARD RECENT TRANSACTIONS
// ======================================================

function renderDashboardRecentTransactions() {

    if (
        !dashboardRecentTransactions
    ) {
        return;
    }


    dashboardRecentTransactions.innerHTML =
        "";


    const recentTransactions =
        transactions
            .slice(
                0,
                5
            );


    if (
        recentTransactions.length ===
        0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.textContent =
            "No transactions yet.";


        dashboardRecentTransactions.appendChild(
            empty
        );


        return;
    }


    recentTransactions.forEach(
        function (transaction) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "transaction dashboard-transaction";


            // ------------------------------------------
            // LEFT
            // ------------------------------------------

            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "transaction-info";


            const name =
                document.createElement(
                    "p"
                );


            name.className =
                "transaction-name";


            name.textContent =
                transaction.description
                ||
                "Transaction";


            const category =
                document.createElement(
                    "p"
                );


            category.className =
                "transaction-category";


            category.textContent =
                getCategoryName(
                    transaction.category_id
                )
                ||
                (
                    transaction.type ===
                        "income"
                        ?
                        "Income"
                        :
                        "Uncategorised"
                );


            const date =
                document.createElement(
                    "p"
                );


            date.className =
                "transaction-date";


            date.textContent =
                formatDashboardTransactionDate(
                    transaction.transaction_date
                );


            info.appendChild(
                name
            );

            info.appendChild(
                category
            );

            info.appendChild(
                date
            );


            // ------------------------------------------
            // RIGHT
            // ------------------------------------------

            const amount =
                document.createElement(
                    "p"
                );


            amount.className =
                `transaction-amount ${transaction.type}`;


            const prefix =
                transaction.type ===
                    "income"
                    ?
                    "+"
                    :
                    "-";


            amount.textContent =
                `${prefix}${formatMoney(
                    Number(
                        transaction.amount
                    )
                )}`;


            row.appendChild(
                info
            );

            row.appendChild(
                amount
            );


            dashboardRecentTransactions.appendChild(
                row
            );
        }
    );
}


// ======================================================
// DASHBOARD TRANSACTION DATE
// ======================================================

function formatDashboardTransactionDate(
    dateValue
) {

    if (!dateValue) {

        return "";
    }


    const date =
        new Date(
            `${dateValue}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-MY",
        {
            day:
                "numeric",

            month:
                "short",

            year:
                "numeric"
        }
    );
}

/* ======================================================
   DASHBOARD BUDGET SUMMARY
====================================================== */


async function loadDashboardBudgetSummary() {

    if (
        !currentUser ||
        !dashboardBudgetSummary
    ) {

        return;
    }


    const currentMonth =
        getCurrentMonthValue();


    const monthStart =
        `${currentMonth}-01`;


    const {
        data,
        error
    } =
        await supabase
            .from("budgets")
            .select("*")
            .eq(
                "month_start",
                monthStart
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Dashboard budget summary error:",
            error
        );

        return;
    }


    renderDashboardBudgetSummary(
        data || [],
        currentMonth
    );
}


// ======================================================
// RENDER DASHBOARD BUDGET SUMMARY
// ======================================================

function renderDashboardBudgetSummary(
    dashboardBudgets,
    month
) {

    if (
        !dashboardBudgetSummary
    ) {

        return;
    }


    dashboardBudgetSummary.innerHTML =
        "";


    if (
        dashboardBudgets.length ===
        0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.textContent =
            "No budgets set for this month yet.";


        dashboardBudgetSummary.appendChild(
            empty
        );


        return;
    }


    dashboardBudgets.forEach(
        function (budget) {

            const limit =
                Number(
                    budget.amount
                );


            const spent =
                calculateCategorySpending(
                    budget.category_id,
                    month
                );


            const percentage =
                limit > 0
                    ?
                    (
                        spent /
                        limit
                    )
                    *
                    100
                    :
                    0;


            const visualPercentage =
                Math.min(
                    percentage,
                    100
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dashboard-budget-item";


            // ------------------------------------------
            // HEADER
            // ------------------------------------------

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "dashboard-budget-header";


            const categoryName =
                document.createElement(
                    "span"
                );


            categoryName.className =
                "dashboard-budget-name";


            categoryName.textContent =
                getCategoryName(
                    budget.category_id
                )
                ||
                "Unknown Category";


            const amountText =
                document.createElement(
                    "span"
                );


            amountText.className =
                "dashboard-budget-amount";


            amountText.textContent =
                `${formatMoney(
                    spent
                )} / ${formatMoney(
                    limit
                )}`;


            header.appendChild(
                categoryName
            );

            header.appendChild(
                amountText
            );


            // ------------------------------------------
            // PROGRESS
            // ------------------------------------------

            const progress =
                document.createElement(
                    "div"
                );


            progress.className =
                "budget-progress";


            const progressFill =
                document.createElement(
                    "div"
                );


            progressFill.className =
                "budget-progress-fill";


            if (
                percentage >=
                100
            ) {

                progressFill.classList.add(
                    "budget-over"
                );

            } else if (
                percentage >=
                80
            ) {

                progressFill.classList.add(
                    "budget-warning"
                );
            }


            progressFill.style.width =
                `${visualPercentage}%`;


            progress.appendChild(
                progressFill
            );


            // ------------------------------------------
            // FOOTER
            // ------------------------------------------

            const footer =
                document.createElement(
                    "div"
                );


            footer.className =
                "dashboard-budget-footer";


            if (
                spent >
                limit
            ) {

                footer.classList.add(
                    "budget-over-text"
                );


                footer.textContent =
                    `${formatMoney(
                        spent - limit
                    )} over budget`;

            } else {

                footer.textContent =
                    `${formatMoney(
                        limit - spent
                    )} remaining`;
            }


            card.appendChild(
                header
            );

            card.appendChild(
                progress
            );

            card.appendChild(
                footer
            );


            dashboardBudgetSummary.appendChild(
                card
            );
        }
    );
}


// ======================================================
// INITIAL LOAD
// ======================================================

dateInput.value =
    getTodayDate();

budgetMonthInput.value =
    getCurrentMonthValue();

if (recurringNextDueDateInput) {
    recurringNextDueDateInput.value =
        getTodayDate();
}

if (recurringCalendarMonth) {
    recurringCalendarMonth.value =
        getCurrentMonthValue();
}

if (recurringReminderEnabled) {
    recurringReminderEnabled.checked =
        true;
}

if (recurringReminderDays) {
    recurringReminderDays.value =
        "3";
}

updateRecurringReminderControls();

initializeAuth();



// ======================================================
// PHASE 14A — FIRST-TIME ONBOARDING
// ======================================================

const ONBOARDING_VERSION =
    1;

const ONBOARDING_MAX_STEP =
    6;

let onboardingState =
    null;

let onboardingCurrentStep =
    1;

let onboardingFirstAccountId =
    null;

let onboardingBusy =
    false;


const onboardingStarterCategories = [
    {
        name:
            "Food & Dining",
        type:
            "expense"
    },
    {
        name:
            "Transportation",
        type:
            "expense"
    },
    {
        name:
            "Bills",
        type:
            "expense"
    },
    {
        name:
            "Shopping",
        type:
            "expense"
    },
    {
        name:
            "Entertainment",
        type:
            "expense"
    },
    {
        name:
            "Health",
        type:
            "expense"
    },
    {
        name:
            "Education",
        type:
            "expense"
    },
    {
        name:
            "Travel",
        type:
            "expense"
    },
    {
        name:
            "Other",
        type:
            "expense"
    },
    {
        name:
            "Salary",
        type:
            "income"
    },
    {
        name:
            "Side Income",
        type:
            "income"
    },
    {
        name:
            "Investment",
        type:
            "income"
    }
];


function escapeOnboardingHtml(
    value
) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        String(
            value
            ??
            ""
        );

    return element.innerHTML;
}


function getOnboardingElement(
    id
) {

    return document
        .getElementById(
            id
        );
}


function setOnboardingMessage(
    message = "",
    type = ""
) {

    const element =
        getOnboardingElement(
            "kira-onboarding-message"
        );

    if (!element) {
        return;
    }


    element.textContent =
        message;

    element.classList.toggle(
        "error",
        type === "error"
    );
}


function setOnboardingBusy(
    isBusy
) {

    onboardingBusy =
        Boolean(
            isBusy
        );


    document
        .querySelectorAll(
            "#kira-onboarding button"
        )
        .forEach(
            function (
                button
            ) {

                button.disabled =
                    onboardingBusy;
            }
        );
}


async function loadOnboardingState() {

    if (!currentUser) {
        return null;
    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "user_onboarding"
            )
            .select(
                "*"
            )
            .eq(
                "user_id",
                currentUser.id
            )
            .maybeSingle();


    if (error) {
        throw error;
    }


    onboardingState =
        data || null;


    if (
        onboardingState
    ) {

        onboardingCurrentStep =
            Number(
                onboardingState
                    .current_step
                ||
                1
            );

        onboardingFirstAccountId =
            onboardingState
                .first_account_id
            ||
            null;
    }


    return onboardingState;
}


async function saveOnboardingState(
    values
) {

    if (!currentUser) {
        return null;
    }


    const payload = {
        user_id:
            currentUser.id,

        version:
            ONBOARDING_VERSION,

        ...values
    };


    const {
        data,
        error
    } =
        await supabase
            .from(
                "user_onboarding"
            )
            .upsert(
                payload,
                {
                    onConflict:
                        "user_id"
                }
            )
            .select(
                "*"
            )
            .single();


    if (error) {
        throw error;
    }


    onboardingState =
        data;

    onboardingCurrentStep =
        Number(
            data.current_step
            ||
            onboardingCurrentStep
            ||
            1
        );

    onboardingFirstAccountId =
        data.first_account_id
        ||
        onboardingFirstAccountId;


    return data;
}


function hasMeaningfulExistingFinanceData() {

    return (
        accounts.length >
            0
        ||
        transactions.length >
            0
        ||
        budgets.length >
            0
        ||
        recurringTransactions.length >
            0
        ||
        savingsGoals.length >
            0
    );
}


async function ensureOnboardingState() {

    if (
        onboardingState
    ) {
        return;
    }


    if (
        hasMeaningfulExistingFinanceData()
    ) {

        await saveOnboardingState({
            status:
                "completed",

            current_step:
                ONBOARDING_MAX_STEP,

            account_completed:
                accounts.length >
                0,

            categories_completed:
                categories.length >
                0,

            income_source_completed:
                incomeSources.length >
                0,

            budget_completed:
                budgets.length >
                0,

            goal_completed:
                savingsGoals.length >
                0,

            completed_at:
                new Date()
                    .toISOString()
        });


        return;
    }


    await saveOnboardingState({
        status:
            "not_started",

        current_step:
            1
    });
}


function openOnboarding() {

    const onboarding =
        getOnboardingElement(
            "kira-onboarding"
        );

    if (!onboarding) {
        return;
    }


    onboarding.hidden =
        false;

    document.body
        .classList
        .add(
            "kira-onboarding-open"
        );


    renderOnboardingStep();
}


function closeOnboarding() {

    const onboarding =
        getOnboardingElement(
            "kira-onboarding"
        );

    if (!onboarding) {
        return;
    }


    onboarding.hidden =
        true;

    document.body
        .classList
        .remove(
            "kira-onboarding-open"
        );
}


function getOnboardingDisplayName() {

    const metadataName =
        currentUser
            ?.user_metadata
            ?.display_name;


    if (
        typeof metadataName ===
            "string"
        &&
        metadataName.trim()
    ) {

        return metadataName.trim();
    }


    return (
        currentUser
            ?.email
            ?.split("@")[0]
        ||
        "there"
    );
}


function setOnboardingActions(
    primaryText,
    secondaryText = ""
) {

    const primaryButton =
        getOnboardingElement(
            "kira-onboarding-primary-action"
        );

    const secondaryButton =
        getOnboardingElement(
            "kira-onboarding-secondary-action"
        );


    if (
        primaryButton
    ) {

        primaryButton.textContent =
            primaryText;
    }


    if (
        secondaryButton
    ) {

        secondaryButton.textContent =
            secondaryText;

        secondaryButton.hidden =
            !secondaryText;
    }
}


function updateOnboardingChrome() {

    const names = {
        1:
            "Welcome",

        2:
            "Your first account",

        3:
            "Categories",

        4:
            "Income source",

        5:
            "Planning",

        6:
            "Ready"
    };


    const stepLabel =
        getOnboardingElement(
            "kira-onboarding-step-label"
        );

    const stepName =
        getOnboardingElement(
            "kira-onboarding-step-name"
        );

    const progressBar =
        getOnboardingElement(
            "kira-onboarding-progress-bar"
        );

    const backButton =
        getOnboardingElement(
            "kira-onboarding-back"
        );

    const skipButton =
        getOnboardingElement(
            "kira-onboarding-skip-top"
        );


    if (
        stepLabel
    ) {

        stepLabel.textContent =
            `Step ${onboardingCurrentStep} of ${ONBOARDING_MAX_STEP}`;
    }


    if (
        stepName
    ) {

        stepName.textContent =
            names[
                onboardingCurrentStep
            ]
            ||
            "Setup";
    }


    if (
        progressBar
    ) {

        progressBar.style.width =
            `${(
                onboardingCurrentStep
                /
                ONBOARDING_MAX_STEP
            ) * 100}%`;
    }


    if (
        backButton
    ) {

        backButton.hidden =
            onboardingCurrentStep <=
            1;
    }


    if (
        skipButton
    ) {

        skipButton.hidden =
            onboardingCurrentStep ===
            ONBOARDING_MAX_STEP;
    }
}


function renderOnboardingStep() {

    updateOnboardingChrome();

    setOnboardingMessage(
        ""
    );


    if (
        onboardingCurrentStep ===
        1
    ) {

        renderOnboardingWelcome();

        return;
    }


    if (
        onboardingCurrentStep ===
        2
    ) {

        renderOnboardingAccount();

        return;
    }


    if (
        onboardingCurrentStep ===
        3
    ) {

        renderOnboardingCategories();

        return;
    }


    if (
        onboardingCurrentStep ===
        4
    ) {

        renderOnboardingIncome();

        return;
    }


    if (
        onboardingCurrentStep ===
        5
    ) {

        renderOnboardingPlanning();

        return;
    }


    renderOnboardingFinish();
}


function renderOnboardingWelcome() {

    const content =
        getOnboardingElement(
            "kira-onboarding-content"
        );

    if (!content) {
        return;
    }


    content.innerHTML =
        `
            <div class="kira-onboarding-hero">

                <div class="kira-onboarding-logo-mark">
                    K
                </div>

                <span class="kira-onboarding-kicker">
                    Welcome, ${escapeOnboardingHtml(
                        getOnboardingDisplayName()
                    )}
                </span>

                <h2>
                    Let's get your money setup ready.
                </h2>

                <p>
                    We'll create the basics Kira needs so your first transaction, budget and goal make sense from day one.
                </p>

            </div>


            <div class="kira-onboarding-benefits">

                <article>
                    <strong>1</strong>
                    <span>
                        Create where your money lives
                    </span>
                </article>

                <article>
                    <strong>2</strong>
                    <span>
                        Organise income and spending
                    </span>
                </article>

                <article>
                    <strong>3</strong>
                    <span>
                        Start planning without spreadsheets
                    </span>
                </article>

            </div>


            <p class="kira-onboarding-note">
                Usually takes about 2–4 minutes. Optional steps can be skipped.
            </p>
        `;


    setOnboardingActions(
        "Start setup"
    );
}


function renderOnboardingAccount() {

    const content =
        getOnboardingElement(
            "kira-onboarding-content"
        );

    if (!content) {
        return;
    }


    const existingAccount =
        accounts.find(
            account =>
                account.id ===
                onboardingFirstAccountId
        );


    content.innerHTML =
        `
            <div class="kira-onboarding-step-heading">

                <span class="kira-onboarding-kicker">
                    Required
                </span>

                <h2>
                    Create your first account
                </h2>

                <p>
                    Kira needs an account before it can record a transaction.
                </p>

            </div>


            <div class="kira-onboarding-form-grid">

                <label class="kira-onboarding-field kira-onboarding-field-wide">

                    <span>
                        Account name
                    </span>

                    <input
                        type="text"
                        id="kira-onboarding-account-name"
                        placeholder="e.g. Maybank"
                        value="${escapeOnboardingHtml(
                            existingAccount
                                ?.name
                            ||
                            ""
                        )}"
                    >

                </label>


                <label class="kira-onboarding-field">

                    <span>
                        Account type
                    </span>

                    <select id="kira-onboarding-account-type">

                        <option value="bank">
                            Bank Account
                        </option>

                        <option value="cash">
                            Cash
                        </option>

                        <option value="e_wallet">
                            E-Wallet
                        </option>

                        <option value="savings">
                            Savings
                        </option>

                        <option value="other">
                            Other
                        </option>

                    </select>

                </label>


                <label class="kira-onboarding-field">

                    <span>
                        Opening balance
                    </span>

                    <div class="kira-onboarding-money-input">

                        <span>
                            RM
                        </span>

                        <input
                            type="number"
                            id="kira-onboarding-opening-balance"
                            step="0.01"
                            value="${Number(
                                existingAccount
                                    ?.opening_balance
                                ||
                                0
                            )}"
                        >

                    </div>

                </label>

            </div>
        `;


    const accountType =
        getOnboardingElement(
            "kira-onboarding-account-type"
        );


    if (
        accountType
        &&
        existingAccount
    ) {

        accountType.value =
            existingAccount
                .account_type;
    }


    setOnboardingActions(
        existingAccount
            ?
            "Continue"
            :
            "Create account"
    );
}


function renderOnboardingCategories() {

    const content =
        getOnboardingElement(
            "kira-onboarding-content"
        );

    if (!content) {
        return;
    }


    const existingKeys =
        new Set(
            categories.map(
                category =>
                    `${category.name.toLowerCase()}::${category.type}`
            )
        );


    content.innerHTML =
        `
            <div class="kira-onboarding-step-heading">

                <span class="kira-onboarding-kicker">
                    Recommended
                </span>

                <h2>
                    Choose starter categories
                </h2>

                <p>
                    Existing categories are kept and never duplicated.
                </p>

            </div>


            <div class="kira-onboarding-category-grid">

                ${onboardingStarterCategories
                    .map(
                        function (
                            item,
                            index
                        ) {

                            const exists =
                                existingKeys.has(
                                    `${item.name.toLowerCase()}::${item.type}`
                                );

                            const checked =
                                (
                                    index <
                                    9
                                )
                                ||
                                exists;

                            return `
                                <label class="kira-onboarding-choice ${checked ? "selected" : ""}">

                                    <input
                                        type="checkbox"
                                        data-onboarding-category
                                        data-name="${escapeOnboardingHtml(
                                            item.name
                                        )}"
                                        data-type="${item.type}"
                                        ${checked ? "checked" : ""}
                                    >

                                    <span>

                                        <strong>
                                            ${escapeOnboardingHtml(
                                                item.name
                                            )}
                                        </strong>

                                        <small>
                                            ${item.type === "income" ? "Income" : "Expense"}${exists ? " • Already added" : ""}
                                        </small>

                                    </span>

                                </label>
                            `;
                        }
                    )
                    .join(
                        ""
                    )}
            </div>
        `;


    content
        .querySelectorAll(
            "[data-onboarding-category]"
        )
        .forEach(
            function (
                checkbox
            ) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        checkbox
                            .closest(
                                ".kira-onboarding-choice"
                            )
                            ?.classList
                            .toggle(
                                "selected",
                                checkbox.checked
                            );
                    }
                );
            }
        );


    setOnboardingActions(
        "Save categories",
        "Use existing categories"
    );
}


function renderOnboardingIncome() {

    const content =
        getOnboardingElement(
            "kira-onboarding-content"
        );

    if (!content) {
        return;
    }


    const existingSources =
        incomeSources
            .filter(
                source =>
                    source.is_active
            )
            .map(
                source =>
                    source.name
            );


    content.innerHTML =
        `
            <div class="kira-onboarding-step-heading">

                <span class="kira-onboarding-kicker">
                    Optional
                </span>

                <h2>
                    Where does your income come from?
                </h2>

                <p>
                    Add one income source now, or skip and manage it later.
                </p>

            </div>


            ${existingSources.length
                ?
                `
                    <div class="kira-onboarding-existing">

                        <strong>
                            Already available
                        </strong>

                        <div>

                            ${existingSources
                                .slice(
                                    0,
                                    8
                                )
                                .map(
                                    source =>
                                        `<span>${escapeOnboardingHtml(source)}</span>`
                                )
                                .join(
                                    ""
                                )}

                        </div>

                    </div>
                `
                :
                ""
            }


            <label class="kira-onboarding-field kira-onboarding-field-wide">

                <span>
                    Income source
                </span>

                <input
                    type="text"
                    id="kira-onboarding-income-source"
                    placeholder="e.g. Salary, Grab, Freelance"
                >

            </label>


            <div class="kira-onboarding-chips">

                ${[
                    "Salary",
                    "Grab",
                    "Freelance",
                    "Business",
                    "Investment",
                    "Bonus"
                ]
                    .map(
                        source =>
                            `
                                <button
                                    type="button"
                                    data-onboarding-income-chip="${escapeOnboardingHtml(source)}"
                                >
                                    ${escapeOnboardingHtml(source)}
                                </button>
                            `
                    )
                    .join(
                        ""
                    )}

            </div>
        `;


    content
        .querySelectorAll(
            "[data-onboarding-income-chip]"
        )
        .forEach(
            function (
                button
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        const input =
                            getOnboardingElement(
                                "kira-onboarding-income-source"
                            );

                        if (
                            input
                        ) {

                            input.value =
                                button.dataset
                                    .onboardingIncomeChip
                                ||
                                "";
                        }
                    }
                );
            }
        );


    setOnboardingActions(
        "Add & continue",
        "Skip for now"
    );
}


function renderOnboardingPlanning() {

    const content =
        getOnboardingElement(
            "kira-onboarding-content"
        );

    if (!content) {
        return;
    }


    const expenseCategories =
        categories.filter(
            function (
                category
            ) {

                return (
                    category.is_active
                    &&
                    (
                        category.type ===
                            "expense"
                        ||
                        category.type ===
                            "both"
                    )
                );
            }
        );


    content.innerHTML =
        `
            <div class="kira-onboarding-step-heading">

                <span class="kira-onboarding-kicker">
                    Optional
                </span>

                <h2>
                    Add a little planning
                </h2>

                <p>
                    Create a budget, a savings goal, both, or skip this step.
                </p>

            </div>


            <div class="kira-onboarding-planning-grid">

                <article class="kira-onboarding-plan-card">

                    <strong>
                        Monthly budget
                    </strong>

                    <small>
                        Set a spending limit for one category.
                    </small>


                    <label class="kira-onboarding-field">

                        <span>
                            Category
                        </span>

                        <select id="kira-onboarding-budget-category">

                            <option value="">
                                Don't create a budget
                            </option>

                            ${expenseCategories
                                .map(
                                    category =>
                                        `
                                            <option value="${category.id}">
                                                ${escapeOnboardingHtml(category.name)}
                                            </option>
                                        `
                                )
                                .join(
                                    ""
                                )}

                        </select>

                    </label>


                    <label class="kira-onboarding-field">

                        <span>
                            Monthly amount
                        </span>

                        <div class="kira-onboarding-money-input">

                            <span>
                                RM
                            </span>

                            <input
                                type="number"
                                id="kira-onboarding-budget-amount"
                                min="0.01"
                                step="0.01"
                                placeholder="500"
                            >

                        </div>

                    </label>

                </article>


                <article class="kira-onboarding-plan-card">

                    <strong>
                        Savings goal
                    </strong>

                    <small>
                        Start with one target you care about.
                    </small>


                    <label class="kira-onboarding-field">

                        <span>
                            Goal name
                        </span>

                        <input
                            type="text"
                            id="kira-onboarding-goal-name"
                            placeholder="e.g. Emergency Fund"
                        >

                    </label>


                    <label class="kira-onboarding-field">

                        <span>
                            Target amount
                        </span>

                        <div class="kira-onboarding-money-input">

                            <span>
                                RM
                            </span>

                            <input
                                type="number"
                                id="kira-onboarding-goal-target"
                                min="0.01"
                                step="0.01"
                                placeholder="5000"
                            >

                        </div>

                    </label>


                    <label class="kira-onboarding-field">

                        <span>
                            Already saved
                        </span>

                        <div class="kira-onboarding-money-input">

                            <span>
                                RM
                            </span>

                            <input
                                type="number"
                                id="kira-onboarding-goal-current"
                                min="0"
                                step="0.01"
                                value="0"
                            >

                        </div>

                    </label>


                    <label class="kira-onboarding-field">

                        <span>
                            Target date
                        </span>

                        <input
                            type="date"
                            id="kira-onboarding-goal-date"
                        >

                    </label>

                </article>

            </div>
        `;


    setOnboardingActions(
        "Save planning",
        "Skip planning"
    );
}


function renderOnboardingFinish() {

    const content =
        getOnboardingElement(
            "kira-onboarding-content"
        );

    if (!content) {
        return;
    }


    const account =
        accounts.find(
            item =>
                item.id ===
                onboardingFirstAccountId
        )
        ||
        accounts[0];


    const summaryItems = [
        {
            name:
                "Account",

            done:
                Boolean(
                    onboardingState
                        ?.account_completed
                ),

            detail:
                account?.name
                ||
                "Not set"
        },
        {
            name:
                "Categories",

            done:
                Boolean(
                    onboardingState
                        ?.categories_completed
                ),

            detail:
                `${categories.length} available`
        },
        {
            name:
                "Income source",

            done:
                Boolean(
                    onboardingState
                        ?.income_source_completed
                ),

            detail:
                onboardingState
                    ?.income_source_completed
                ?
                "Ready"
                :
                "Later"
        },
        {
            name:
                "Monthly budget",

            done:
                Boolean(
                    onboardingState
                        ?.budget_completed
                ),

            detail:
                onboardingState
                    ?.budget_completed
                ?
                "Created"
                :
                "Later"
        },
        {
            name:
                "Savings goal",

            done:
                Boolean(
                    onboardingState
                        ?.goal_completed
                ),

            detail:
                onboardingState
                    ?.goal_completed
                ?
                "Created"
                :
                "Later"
        }
    ];


    content.innerHTML =
        `
            <div class="kira-onboarding-hero">

                <div class="kira-onboarding-success-mark">
                    ✓
                </div>

                <span class="kira-onboarding-kicker">
                    Setup complete
                </span>

                <h2>
                    Kira is ready.
                </h2>

                <p>
                    Your essentials are in place. The best next step is recording your first transaction.
                </p>

            </div>


            <div class="kira-onboarding-summary">

                ${summaryItems
                    .map(
                        item =>
                            `
                                <div>

                                    <span class="${item.done ? "done" : "later"}">
                                        ${item.done ? "✓" : "○"}
                                    </span>

                                    <strong>
                                        ${escapeOnboardingHtml(item.name)}
                                    </strong>

                                    <small>
                                        ${escapeOnboardingHtml(item.detail)}
                                    </small>

                                </div>
                            `
                    )
                    .join(
                        ""
                    )}

            </div>
        `;


    setOnboardingActions(
        "Add my first transaction",
        "Go to Dashboard"
    );
}


async function moveOnboardingToStep(
    step,
    values = {}
) {

    onboardingCurrentStep =
        Math.max(
            1,
            Math.min(
                ONBOARDING_MAX_STEP,
                step
            )
        );


    await saveOnboardingState({
        status:
            "in_progress",

        current_step:
            onboardingCurrentStep,

        ...values
    });


    renderOnboardingStep();
}


async function saveOnboardingAccountStep() {

    const name =
        getOnboardingElement(
            "kira-onboarding-account-name"
        )
            ?.value
            .trim();

    const accountType =
        getOnboardingElement(
            "kira-onboarding-account-type"
        )
            ?.value;

    const openingBalance =
        Number(
            getOnboardingElement(
                "kira-onboarding-opening-balance"
            )
                ?.value
            ||
            0
        );


    if (!name) {
        throw new Error(
            "Enter an account name."
        );
    }


    if (
        ![
            "bank",
            "cash",
            "e_wallet",
            "savings",
            "other"
        ].includes(
            accountType
        )
    ) {

        throw new Error(
            "Choose a valid account type."
        );
    }


    if (
        !Number.isFinite(
            openingBalance
        )
    ) {

        throw new Error(
            "Enter a valid opening balance."
        );
    }


    let account =
        accounts.find(
            item =>
                item.id ===
                onboardingFirstAccountId
        );


    if (!account) {

        account =
            accounts.find(
                item =>
                    item.name
                        .trim()
                        .toLowerCase()
                    ===
                    name.toLowerCase()
            );
    }


    if (!account) {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    "accounts"
                )
                .insert({
                    user_id:
                        currentUser.id,

                    name:
                        name,

                    account_type:
                        accountType,

                    opening_balance:
                        openingBalance
                })
                .select(
                    "*"
                )
                .single();


        if (error) {
            throw error;
        }


        account =
            data;
    }


    onboardingFirstAccountId =
        account.id;


    await loadAccounts();


    await moveOnboardingToStep(
        3,
        {
            account_completed:
                true,

            first_account_id:
                account.id
        }
    );
}


async function saveOnboardingCategoriesStep() {

    const selected =
        Array.from(
            document.querySelectorAll(
                "#kira-onboarding [data-onboarding-category]:checked"
            )
        )
            .map(
                input => ({
                    name:
                        input.dataset
                            .name,

                    type:
                        input.dataset
                            .type
                })
            );


    if (
        selected.length ===
            0
        &&
        categories.length ===
            0
    ) {

        throw new Error(
            "Choose at least one category."
        );
    }


    const existingKeys =
        new Set(
            categories.map(
                category =>
                    `${category.name.trim().toLowerCase()}::${category.type}`
            )
        );


    const missing =
        selected.filter(
            item =>
                !existingKeys.has(
                    `${item.name.trim().toLowerCase()}::${item.type}`
                )
        );


    if (
        missing.length >
        0
    ) {

        const {
            error
        } =
            await supabase
                .from(
                    "categories"
                )
                .insert(
                    missing.map(
                        item => ({
                            user_id:
                                currentUser.id,

                            name:
                                item.name,

                            type:
                                item.type
                        })
                    )
                );


        if (
            error
            &&
            error.code !==
                "23505"
        ) {

            throw error;
        }
    }


    await loadCategories();


    await moveOnboardingToStep(
        4,
        {
            categories_completed:
                categories.length >
                0
        }
    );
}


async function saveOnboardingIncomeStep() {

    const name =
        getOnboardingElement(
            "kira-onboarding-income-source"
        )
            ?.value
            .trim();


    if (!name) {

        await moveOnboardingToStep(
            5,
            {
                income_source_completed:
                    false
            }
        );

        return;
    }


    const exists =
        incomeSources.some(
            source =>
                source.name
                    .trim()
                    .toLowerCase()
                ===
                name.toLowerCase()
        );


    if (!exists) {

        const {
            error
        } =
            await supabase
                .from(
                    "income_sources"
                )
                .insert({
                    user_id:
                        currentUser.id,

                    name:
                        name
                });


        if (
            error
            &&
            error.code !==
                "23505"
        ) {

            throw error;
        }
    }


    await loadIncomeSources();


    await moveOnboardingToStep(
        5,
        {
            income_source_completed:
                true
        }
    );
}


async function saveOnboardingPlanningStep() {

    let budgetCompleted =
        budgets.length >
        0;

    let goalCompleted =
        savingsGoals.length >
        0;


    const categoryId =
        getOnboardingElement(
            "kira-onboarding-budget-category"
        )
            ?.value
        ||
        "";

    const budgetAmount =
        Number(
            getOnboardingElement(
                "kira-onboarding-budget-amount"
            )
                ?.value
            ||
            0
        );


    if (
        categoryId
    ) {

        if (
            !(budgetAmount > 0)
        ) {

            throw new Error(
                "Enter a monthly budget amount greater than RM0."
            );
        }


        const monthStart =
            `${getCurrentMonthValue()}-01`;


        const alreadyExists =
            budgets.some(
                budget =>
                    budget.category_id ===
                        categoryId
                    &&
                    budget.month_start ===
                        monthStart
            );


        if (!alreadyExists) {

            const {
                error
            } =
                await supabase
                    .from(
                        "budgets"
                    )
                    .insert({
                        user_id:
                            currentUser.id,

                        category_id:
                            categoryId,

                        month_start:
                            monthStart,

                        amount:
                            budgetAmount
                    });


            if (
                error
                &&
                error.code !==
                    "23505"
            ) {

                throw error;
            }
        }


        budgetCompleted =
            true;
    }


    const goalName =
        getOnboardingElement(
            "kira-onboarding-goal-name"
        )
            ?.value
            .trim()
        ||
        "";

    const goalTarget =
        Number(
            getOnboardingElement(
                "kira-onboarding-goal-target"
            )
                ?.value
            ||
            0
        );

    const goalCurrent =
        Number(
            getOnboardingElement(
                "kira-onboarding-goal-current"
            )
                ?.value
            ||
            0
        );

    const goalDate =
        getOnboardingElement(
            "kira-onboarding-goal-date"
        )
            ?.value
        ||
        null;


    if (
        goalName
        ||
        goalTarget >
            0
    ) {

        if (!goalName) {

            throw new Error(
                "Enter a savings goal name."
            );
        }


        if (
            !(goalTarget > 0)
        ) {

            throw new Error(
                "Enter a savings goal target greater than RM0."
            );
        }


        if (
            goalCurrent <
            0
        ) {

            throw new Error(
                "Current saved amount cannot be negative."
            );
        }


        const {
            error
        } =
            await supabase
                .from(
                    "savings_goals"
                )
                .insert({
                    user_id:
                        currentUser.id,

                    name:
                        goalName,

                    target_amount:
                        goalTarget,

                    current_amount:
                        goalCurrent,

                    target_date:
                        goalDate,

                    account_id:
                        onboardingFirstAccountId
                        ||
                        null,

                    status:
                        goalCurrent >=
                            goalTarget
                        ?
                        "completed"
                        :
                        "active"
                });


        if (error) {
            throw error;
        }


        goalCompleted =
            true;
    }


    await loadBudgets();

    await loadSavingsGoals();


    await moveOnboardingToStep(
        6,
        {
            budget_completed:
                budgetCompleted,

            goal_completed:
                goalCompleted
        }
    );
}


async function finishOnboarding(
    destination
) {

    await saveOnboardingState({
        status:
            "completed",

        current_step:
            ONBOARDING_MAX_STEP,

        completed_at:
            onboardingState
                ?.completed_at
            ||
            new Date()
                .toISOString(),

        skipped_at:
            null
    });


    // Keep the main app UI in sync with data created inside onboarding.
    // The underlying arrays are already refreshed by each onboarding step,
    // but existing form <select> options still need to be rebuilt.
    refreshTransactionDropdowns();

    refreshRecurringFormOptions();

    refreshGoalAccountOptions();

    updateDashboard();


    closeOnboarding();


    if (
        destination ===
        "transaction"
    ) {

        navigateToPage(
            "transactions",
            {
                scrollToTop:
                    false
            }
        );


        requestAnimationFrame(
            function () {

                transactionForm
                    ?.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "start"
                    });


                setTimeout(
                    function () {

                        document
                            .getElementById(
                                "description"
                            )
                            ?.focus();

                    },
                    350
                );
            }
        );


        return;
    }


    navigateToPage(
        "dashboard"
    );
}


async function skipOnboarding() {

    if (
        onboardingBusy
    ) {
        return;
    }


    try {

        setOnboardingBusy(
            true
        );


        await saveOnboardingState({
            status:
                "skipped",

            current_step:
                onboardingCurrentStep,

            skipped_at:
                new Date()
                    .toISOString()
        });


        closeOnboarding();

    } catch (
        error
    ) {

        console.error(
            "Skip onboarding error:",
            error
        );


        setOnboardingMessage(
            error.message
            ||
            "Unable to skip setup right now.",
            "error"
        );

    } finally {

        setOnboardingBusy(
            false
        );
    }
}


async function handleOnboardingPrimaryAction() {

    if (
        onboardingBusy
    ) {
        return;
    }


    try {

        setOnboardingBusy(
            true
        );

        setOnboardingMessage(
            ""
        );


        if (
            onboardingCurrentStep ===
            1
        ) {

            await saveOnboardingState({
                status:
                    "in_progress",

                current_step:
                    2,

                started_at:
                    onboardingState
                        ?.started_at
                    ||
                    new Date()
                        .toISOString(),

                skipped_at:
                    null
            });


            onboardingCurrentStep =
                2;

            renderOnboardingStep();

            return;
        }


        if (
            onboardingCurrentStep ===
            2
        ) {

            await saveOnboardingAccountStep();

            return;
        }


        if (
            onboardingCurrentStep ===
            3
        ) {

            await saveOnboardingCategoriesStep();

            return;
        }


        if (
            onboardingCurrentStep ===
            4
        ) {

            await saveOnboardingIncomeStep();

            return;
        }


        if (
            onboardingCurrentStep ===
            5
        ) {

            await saveOnboardingPlanningStep();

            return;
        }


        await finishOnboarding(
            "transaction"
        );

    } catch (
        error
    ) {

        console.error(
            "Onboarding error:",
            error
        );


        setOnboardingMessage(
            error.message
            ||
            "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        setOnboardingBusy(
            false
        );
    }
}


async function handleOnboardingSecondaryAction() {

    if (
        onboardingBusy
    ) {
        return;
    }


    try {

        setOnboardingBusy(
            true
        );

        setOnboardingMessage(
            ""
        );


        if (
            onboardingCurrentStep ===
            3
        ) {

            await moveOnboardingToStep(
                4,
                {
                    categories_completed:
                        categories.length >
                        0
                }
            );

            return;
        }


        if (
            onboardingCurrentStep ===
            4
        ) {

            await moveOnboardingToStep(
                5,
                {
                    income_source_completed:
                        false
                }
            );

            return;
        }


        if (
            onboardingCurrentStep ===
            5
        ) {

            await moveOnboardingToStep(
                6,
                {
                    budget_completed:
                        budgets.length >
                        0,

                    goal_completed:
                        savingsGoals.length >
                        0
                }
            );

            return;
        }


        if (
            onboardingCurrentStep ===
            6
        ) {

            await finishOnboarding(
                "dashboard"
            );
        }

    } catch (
        error
    ) {

        console.error(
            "Onboarding secondary action error:",
            error
        );


        setOnboardingMessage(
            error.message
            ||
            "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        setOnboardingBusy(
            false
        );
    }
}


async function handleOnboardingBack() {

    if (
        onboardingBusy
        ||
        onboardingCurrentStep <=
            1
    ) {

        return;
    }


    try {

        setOnboardingBusy(
            true
        );


        await moveOnboardingToStep(
            onboardingCurrentStep -
            1
        );

    } catch (
        error
    ) {

        console.error(
            "Onboarding back error:",
            error
        );


        setOnboardingMessage(
            error.message
            ||
            "Unable to go back right now.",
            "error"
        );

    } finally {

        setOnboardingBusy(
            false
        );
    }
}


function bindOnboardingEvents() {

    getOnboardingElement(
        "kira-onboarding-primary-action"
    )
        ?.addEventListener(
            "click",
            handleOnboardingPrimaryAction
        );


    getOnboardingElement(
        "kira-onboarding-secondary-action"
    )
        ?.addEventListener(
            "click",
            handleOnboardingSecondaryAction
        );


    getOnboardingElement(
        "kira-onboarding-back"
    )
        ?.addEventListener(
            "click",
            handleOnboardingBack
        );


    getOnboardingElement(
        "kira-onboarding-skip-top"
    )
        ?.addEventListener(
            "click",
            skipOnboarding
        );
}


async function initializeFirstTimeOnboarding() {

    if (
        !currentUser
    ) {
        return;
    }


    try {

        await loadOnboardingState();

        await ensureOnboardingState();

        renderSetupChecklist();


        if (
            onboardingState
            &&
            (
                onboardingState.status ===
                    "not_started"
                ||
                onboardingState.status ===
                    "in_progress"
            )
        ) {

            onboardingCurrentStep =
                Number(
                    onboardingState
                        .current_step
                    ||
                    1
                );

            onboardingFirstAccountId =
                onboardingState
                    .first_account_id
                ||
                null;


            openOnboarding();
        }

    } catch (
        error
    ) {

        console.error(
            "Initialize onboarding error:",
            error
        );
    }
}


bindOnboardingEvents();
