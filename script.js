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

const transactionList =
    document.getElementById("transaction-list");

const deletedTransactionList =
    document.getElementById("deleted-transaction-list");

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

let editingAccountId = null;
let editingCategoryId = null;
let editingIncomeSourceId = null;
let editingTransactionId = null;
let editingBudgetId = null;

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

    await loadTransactions();

    await loadDeletedTransactions();

    setDefaultBudgetMonth();

    await loadBudgets();

    refreshTransactionDropdowns();
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
                        "http://localhost:5173"
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

                    account.is_active
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
                    "delete-button"
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
            document
                .getElementById("description")
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
                    nextReceiptPath
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


            submitButton.disabled =
                false;

            resetTransactionForm();

            await loadTransactions();

            if (tagSyncWarning) {
                alert(
                    tagSyncWarning
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
                    "delete-button"
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
                    "restore-button"
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

    document
        .getElementById("description")
        .value =
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

    cancelEditButton.style.display =
        "block";

    transactionForm.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"
    });
}


// ======================================================
// SOFT DELETE TRANSACTION
// ======================================================

async function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );

    if (!transaction) {
        return;
    }

    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );

    if (!confirmed) {
        return;
    }

    const {
        error
    } =
        await supabase
            .from("transactions")
            .update({

                deleted_at:
                    new Date()
                        .toISOString()
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

    resetTransactionForm();

    await loadTransactions();

    await loadDeletedTransactions();
}


// ======================================================
// RESTORE
// ======================================================

async function restoreTransaction(id) {

    const {
        error
    } =
        await supabase
            .from("transactions")
            .update({
                deleted_at: null
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

    await loadTransactions();

    await loadDeletedTransactions();
}


// ======================================================
// RESET TRANSACTION FORM
// ======================================================

function resetTransactionForm() {

    editingTransactionId =
        null;

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
    onToggle
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
            active
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
    active
) {

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "management-buttons";


    const edit =
        createTextButton(
            "Edit",
            "edit-button"
        );


    const status =
        createTextButton(
            active
                ? "Deactivate"
                : "Activate",

            "status-button"
        );


    edit.addEventListener(
        "click",
        onEdit
    );

    status.addEventListener(
        "click",
        onToggle
    );


    buttons.appendChild(edit);
    buttons.appendChild(status);


    return buttons;
}


// ======================================================
// BUTTON HELPER
// ======================================================

function createTextButton(
    text,
    className
) {

    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        className;

    button.textContent =
        text;

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
                    "manage"
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

initializeAuth();

initializeAppNavigation();

