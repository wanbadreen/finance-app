import { supabase } from "./supabase.js";
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

const authMessage = document.getElementById("auth-message");
const userEmail = document.getElementById("user-email");


// DASHBOARD

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

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
let tags = [];
let transactionTagLinks = [];

let transactions = [];
let deletedTransactions = [];

let budgets = [];
let recurringTransactions = [];
let recurringOccurrenceStatuses = [];
let savingsGoals = [];
let reportEmailPreference = null;

let editingGoalId = null;

let pendingTransactionDelete = null;
let transactionUndoTimer = null;
let transactionSuccessTimer = null;

let editingAccountId = null;
let editingCategoryId = null;
let editingIncomeSourceId = null;
let editingTransactionId = null;
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

    budgets = [];
    recurringTransactions = [];
    recurringOccurrenceStatuses = [];
    savingsGoals = [];
    reportEmailPreference = null;

    editingGoalId = null;

    authSection.style.display = "flex";
    financeApp.style.display = "none";
}


async function showLoggedInState(user) {

    currentUser = user;

    authSection.style.display = "none";
    financeApp.style.display = "block";

    userEmail.textContent =
        user.email || "Signed in";

    authMessage.textContent = "";

    await loadAccounts();

    await loadCategories();

    await loadIncomeSources();

    await seedStarterData();

    await loadTags();

    await cleanupStaleDeletedTransactions();

    await loadTransactions();

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
            password.length < 6
        ) {

            authMessage.textContent =
                "Enter a valid email and a password of at least 6 characters.";

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
                        window.location.origin
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

logoutButton.addEventListener(
    "click",
    async function () {

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
}


supabase.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "Auth:",
            event
        );

        if (!session) {
            currentUser = null;
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
// ACCOUNTS
// ======================================================

async function loadAccounts() {

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

        accountMessage.textContent =
            error.message;

        console.error(error);

        return;
    }

    accounts =
        data || [];

    accountMessage.textContent = "";

    renderAccounts();
}


function renderAccounts() {

    accountList.innerHTML = "";

    if (!accounts.length) {

        renderEmptyState(
            accountList,
            "No accounts yet."
        );

        return;
    }

    accounts.forEach(
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

            balance.textContent =
                formatMoney(
                    calculateAccountBalance(
                        account.id
                    )
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


accountForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        if (!currentUser) {
            return;
        }

        const name =
            document
                .getElementById("account-name")
                .value
                .trim();

        const accountType =
            document
                .getElementById("account-type")
                .value;

        const openingBalance =
            parseFloat(
                document
                    .getElementById("opening-balance")
                    .value
            );

        if (
            !name ||
            Number.isNaN(
                openingBalance
            )
        ) {

            accountMessage.textContent =
                "Enter valid account details.";

            return;
        }

        let result;

        if (
            editingAccountId === null
        ) {

            result =
                await supabase
                    .from("accounts")
                    .insert({

                        user_id:
                            currentUser.id,

                        name,

                        account_type:
                            accountType,

                        opening_balance:
                            openingBalance
                    });

        } else {

            result =
                await supabase
                    .from("accounts")
                    .update({

                        name,

                        account_type:
                            accountType,

                        opening_balance:
                            openingBalance
                    })
                    .eq(
                        "id",
                        editingAccountId
                    );
        }

        if (result.error) {

            accountMessage.textContent =
                result.error.message;

            return;
        }

        resetAccountForm();

        await loadAccounts();

        updateDashboard();

        refreshTransactionDropdowns();

        refreshGoalAccountOptions();

        renderPlanningTools();
    }
);


function editAccount(id) {

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

    if (
        !account ||
        account.is_active
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
                    "account_id",
                    account.id
                ),
                getReferenceCount(
                    "recurring_transactions",
                    "account_id",
                    account.id
                )
            ]);

        if (
            transactionCount > 0 ||
            recurringCount > 0
        ) {

            alert(
                `"${account.name}" cannot be permanently deleted because it has transaction or recurring history. Keep the account inactive instead.`
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
        "+ Add Account";

    cancelAccountEditButton.style.display =
        "none";

    accountMessage.textContent =
        "";
}


cancelAccountEditButton.addEventListener(
    "click",
    resetAccountForm
);


// ======================================================
// CATEGORIES
// ======================================================

async function loadCategories() {

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

        categoryMessage.textContent =
            error.message;

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


categoryForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document
                .getElementById("category-name")
                .value
                .trim();

        const type =
            document
                .getElementById("category-type")
                .value;

        if (!name) {
            return;
        }

        let result;

        if (
            editingCategoryId === null
        ) {

            result =
                await supabase
                    .from("categories")
                    .insert({

                        user_id:
                            currentUser.id,

                        name,
                        type
                    });

        } else {

            result =
                await supabase
                    .from("categories")
                    .update({

                        name,
                        type
                    })
                    .eq(
                        "id",
                        editingCategoryId
                    );
        }

        if (result.error) {

            categoryMessage.textContent =
                result.error.message;

            return;
        }

        resetCategoryForm();

        await loadCategories();

        populateBudgetCategorySelect();

        refreshTransactionDropdowns();

        renderBudgets();
    }
);


function editCategory(id) {

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

    editingCategoryId =
        null;

    categoryForm.reset();

    categoryFormTitle.textContent =
        "Add Category";

    saveCategoryButton.textContent =
        "+ Add Category";

    cancelCategoryEditButton.style.display =
        "none";

    categoryMessage.textContent =
        "";
}


cancelCategoryEditButton.addEventListener(
    "click",
    resetCategoryForm
);


// ======================================================
// INCOME SOURCES
// ======================================================

async function loadIncomeSources() {

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

        incomeSourceMessage.textContent =
            error.message;

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


incomeSourceForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document
                .getElementById("income-source-name")
                .value
                .trim();

        if (!name) {
            return;
        }

        let result;

        if (
            editingIncomeSourceId === null
        ) {

            result =
                await supabase
                    .from("income_sources")
                    .insert({

                        user_id:
                            currentUser.id,

                        name
                    });

        } else {

            result =
                await supabase
                    .from("income_sources")
                    .update({
                        name
                    })
                    .eq(
                        "id",
                        editingIncomeSourceId
                    );
        }

        if (result.error) {

            incomeSourceMessage.textContent =
                result.error.message;

            return;
        }

        resetIncomeSourceForm();

        await loadIncomeSources();

        refreshTransactionDropdowns();
    }
);


function editIncomeSource(id) {

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

    editingIncomeSourceId =
        null;

    incomeSourceForm.reset();

    incomeSourceFormTitle.textContent =
        "Add Income Source";

    saveIncomeSourceButton.textContent =
        "+ Add Income Source";

    cancelIncomeSourceEditButton.style.display =
        "none";

    incomeSourceMessage.textContent =
        "";
}


cancelIncomeSourceEditButton.addEventListener(
    "click",
    resetIncomeSourceForm
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

async function loadBudgets() {

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

budgetForm.addEventListener(
    "submit",
    async function (event) {

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

        if (
            !categoryId ||
            !selectedMonth ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {

            budgetMessage.textContent =
                "Enter a valid category and budget amount.";

            return;
        }

        const monthStart =
            `${selectedMonth}-01`;

        saveBudgetButton.disabled =
            true;

        saveBudgetButton.textContent =
            "Saving...";

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

        saveBudgetButton.disabled =
            false;

        if (result.error) {

            console.error(
                "Save budget error:",
                result.error
            );

            budgetMessage.textContent =
                result.error.message;

            saveBudgetButton.textContent =
                editingBudgetId
                    ? "Save Changes"
                    : "+ Add Budget";

            return;
        }

        resetBudgetForm();

        await loadBudgets();
    }
);


// ======================================================
// EDIT BUDGET
// ======================================================

function editBudget(id) {

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

function resetBudgetForm() {

    editingBudgetId =
        null;

    budgetForm.reset();

    budgetFormTitle.textContent =
        "Add Budget";

    saveBudgetButton.textContent =
        "+ Add Budget";

    saveBudgetButton.disabled =
        false;

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
            "No budgets set for this month."
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


async function loadTransactions() {

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

    updateDashboard();

    renderTransactions();

    renderAccounts();

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
// TRANSACTION DROPDOWNS
// ======================================================

function refreshTransactionDropdowns(
    transaction = null
) {

    populateAccountSelect(
        transaction?.account_id || ""
    );

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

    populateTransactionFilterOptions();
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

async function loadRecurringTransactions() {

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


function resetRecurringForm() {

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

    saveRecurringButton.textContent =
        "Save Recurring Item";

    saveRecurringButton.disabled =
        false;

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

    if (!recurringTransactions.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-state";

        empty.textContent =
            "No recurring items yet.";

        recurringList.appendChild(
            empty
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
        "Cancel Log";

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

    recurringForm.addEventListener(
        "submit",
        async function (event) {

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

            if (
                type ===
                "income"
            ) {

                incomeSourceId =
                    recurringIncomeSourceSelect
                        .value;

                if (!incomeSourceId) {

                    alert(
                        "Please select an income source."
                    );

                    return;
                }
            }

            if (
                !name ||
                !accountId ||
                !categoryId ||
                !nextDueDate ||
                !Number.isFinite(
                    amount
                ) ||
                amount <= 0
            ) {

                alert(
                    "Please complete all required recurring fields."
                );

                return;
            }

            try {

                categoryId =
                    await resolveRecurringCategoryId(
                        categoryId,
                        type
                    );

            } catch (error) {

                recurringMessage.textContent =
                    error.message ||
                    "Unable to create the category.";

                return;
            }

            if (
                reminderEnabled &&
                (
                    !Number.isInteger(
                        reminderDaysBefore
                    )
                    ||
                    reminderDaysBefore < 0
                    ||
                    reminderDaysBefore > 30
                )
            ) {

                alert(
                    "Reminder days must be between 0 and 30."
                );

                return;
            }

            const payload = {
                user_id:
                    currentUser.id,
                name,
                kind,
                type,
                account_id:
                    accountId,
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

            saveRecurringButton.disabled =
                true;

            saveRecurringButton.textContent =
                "Saving...";

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

            saveRecurringButton.disabled =
                false;

            if (result.error) {

                saveRecurringButton.textContent =
                    editingRecurringId
                        ? "Save Changes"
                        : "Save Recurring Item";

                recurringMessage.textContent =
                    result.error.message;

                return;
            }

            resetRecurringForm();

            await loadRecurringTransactions();
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
        editingTransactionId !== null
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

transactionTypeSelect.addEventListener(
    "change",
    function () {

        populateCategorySelect();

        updateIncomeSourceVisibility();

        customCategoryGroup.style.display =
            "none";

        customIncomeSourceGroup.style.display =
            "none";
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

    if (error) {

        alert(
            error.message
        );

        return null;
    }

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

    if (error) {

        alert(
            error.message
        );

        return null;
    }

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
        window.open(
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

transactionForm.addEventListener(
    "submit",
    async function (event) {

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

        const tagNames =
            parseTransactionTagNames(
                transactionTagsInput
                    ?.value
            );

        if (
            !description ||
            !accountId ||
            !categoryId ||
            !transactionDate ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please complete all required transaction fields."
            );

            return;
        }


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

        let desiredTagIds;

        try {

            desiredTagIds =
                await ensureTagsForNames(
                    tagNames
                );

        } catch (error) {

            alert(
                error?.message
                ||
                "Unable to prepare transaction tags."
            );

            return;
        }


        submitButton.disabled =
            true;

        submitButton.textContent =
            "Saving...";


        const originalReceiptPath =
            editingTransactionId === null
                ? null
                : editingReceiptPath;

        let uploadedReceiptPath =
            null;

        let nextReceiptPath =
            originalReceiptPath;


        try {

            if (selectedReceiptFile) {

                submitButton.textContent =
                    "Uploading receipt...";

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


            submitButton.textContent =
                "Saving...";


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

                    recurringAdvanceWarning =
                        "Transaction saved, but the recurring schedule could not be advanced.";
                }
            }


            submitButton.disabled =
                false;

            resetTransactionForm();

            await loadTransactions();

            if (wasRecurringLog) {

                showTransactionSuccessSnackbar({
                    title:
                        "Recurring transaction logged",
                    message:
                        "The transaction was saved and the recurring schedule was updated."
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

        } catch (error) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                editingTransactionId
                    ? "Save Changes"
                    : "+ Add Transaction";

            console.error(
                "Transaction save error:",
                error
            );

            alert(
                error?.message
                ||
                "Unable to save this transaction."
            );
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
        !transactionFilterTag
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


    if (
        transactions.length ===
        0
    ) {

        transactionFilterSummary.textContent =
            "No active transactions yet.";

        return;
    }


    if (
        filteredCount ===
        0
    ) {

        transactionFilterSummary.textContent =
            "No transactions match the current filters.";

        return;
    }


    transactionFilterSummary.textContent =
        filteredCount ===
            transactions.length
            ? `Showing ${visibleCount} of ${transactions.length} transactions.`
            : `Showing ${visibleCount} of ${filteredCount} matching transactions (${transactions.length} total).`;
}


function renderTransactions() {

    transactionList.innerHTML =
        "";

    populateTransactionFilterOptions();


    if (!transactions.length) {

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
            "No transactions yet."
        );

        return;
    }


    const filteredTransactions =
        getFilteredTransactions();


    if (!filteredTransactions.length) {

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
            "No transactions match your search or filters."
        );

        return;
    }


    const shouldLimit =
        !showAllTransactions &&
        filteredTransactions.length >
            TRANSACTION_PREVIEW_LIMIT;

    const visibleTransactions =
        shouldLimit
            ? filteredTransactions.slice(
                0,
                TRANSACTION_PREVIEW_LIMIT
            )
            : filteredTransactions;


    if (transactionViewAllButton) {

        if (
            filteredTransactions.length <=
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
                    : `View All (${filteredTransactions.length})`;
        }
    }


    updateTransactionFilterSummary(
        filteredTransactions.length,
        visibleTransactions.length
    );


    visibleTransactions.forEach(
        function (transaction) {

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
                `${getCategoryName(
                    transaction.category_id
                ) || "Uncategorized"} • ${
                    getAccountName(
                        transaction.account_id
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
                    transaction.transaction_date
                );


            left.appendChild(name);
            left.appendChild(category);
            left.appendChild(date);


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
                    function (tagName) {

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


            buttons.appendChild(
                editButton
            );

            buttons.appendChild(
                deleteButton
            );


            right.appendChild(
                amount
            );

            right.appendChild(
                buttons
            );


            row.appendChild(left);
            row.appendChild(right);


            transactionList.appendChild(
                row
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
// EDIT TRANSACTION
// ======================================================

function editTransaction(id) {

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
        "Cancel Edit";

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

    if (pendingDelete.receipt_path) {

        await deleteReceipt(
            pendingDelete.receipt_path
        );
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

        if (item.receipt_path) {

            await deleteReceipt(
                item.receipt_path
            );
        }
    }

    const {
        error: deleteError
    } =
        await supabase
            .from("transactions")
            .delete()
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
    }
}


transactionUndoButton
    ?.addEventListener(
        "click",
        undoPendingTransactionDelete
    );


// ======================================================
// RESET TRANSACTION FORM
// ======================================================

function resetTransactionForm() {

    editingTransactionId =
        null;

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

    submitButton.textContent =
        "+ Add Transaction";

    submitButton.disabled =
        false;

    cancelEditButton.textContent =
        "Cancel Edit";

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


    const totalOpeningBalance =
        accounts.reduce(
            function (
                total,
                account
            ) {

                return (
                    total +
                    Number(
                        account.opening_balance
                    )
                );
            },
            0
        );


    const totalBalance =
        totalOpeningBalance +
        totalIncome -
        totalExpenses;


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

function renderEmptyState(
    element,
    text
) {

    const empty =
        document.createElement(
            "div"
        );

    empty.className =
        "empty-state";

    empty.textContent =
        text;

    element.appendChild(
        empty
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

async function loadSavingsGoals() {

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

    if (!savingsGoals.length) {

        renderEmptyState(
            goalsList,
            "No savings goals yet."
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


function resetGoalForm() {

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

    saveGoalButton.textContent =
        "+ Add Goal";

    cancelGoalEditButton.style.display =
        "none";

    goalMessage.textContent =
        "";

    refreshGoalAccountOptions(
        ""
    );
}


function editSavingsGoal(
    goal
) {

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
        goalNameInput
    );
}


async function updateGoalStatus(
    goal,
    status
) {

    if (!goal) {
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


async function deleteSavingsGoal(
    goal
) {

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


goalForm
    ?.addEventListener(
        "submit",
        async function (event) {

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


            if (
                !name ||
                !Number.isFinite(
                    targetAmount
                ) ||
                targetAmount <= 0 ||
                !Number.isFinite(
                    currentAmount
                ) ||
                currentAmount < 0
            ) {

                goalMessage.textContent =
                    "Enter a valid goal name, target amount and saved amount.";

                return;
            }


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


            saveGoalButton.disabled =
                true;

            goalMessage.textContent =
                editingGoalId
                    ? "Saving changes..."
                    : "Adding goal...";


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


            saveGoalButton.disabled =
                false;


            if (result.error) {

                goalMessage.textContent =
                    result.error.message;

                return;
            }


            const wasEditing =
                editingGoalId !==
                null;


            resetGoalForm();

            await loadSavingsGoals();


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
                    `${formatDate(transaction.transaction_date)} • ${account} • ${category}`;


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

    if (
        string.includes(",") ||
        string.includes('"') ||
        string.includes("\n")
    ) {

        return `"${string.replaceAll('"', '""')}"`;
    }

    return string;
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
    manage: "Manage",
    more: "More"
};


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
                    "manage",
                    "recurring",
                    "goals",
                    "reports",
                    "insights"
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
            "My Finance";
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
            "My Finance is already installed on this device.";

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
            ? "Install My Finance on this device."
            : "Add My Finance to your Home Screen for faster access.";
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
                "My Finance installed",
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
                        "My Finance is already running as an installed app."
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

initializeAppNavigation();

