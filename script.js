import { supabase } from "./supabase.js";


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

const transactionSearchInput =
    document.getElementById("transaction-search");

const transactionFilterType =
    document.getElementById("transaction-filter-type");

const transactionFilterAccount =
    document.getElementById("transaction-filter-account");

const transactionFilterCategory =
    document.getElementById("transaction-filter-category");

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

    transactions =
        data || [];

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

    if (receiptMessage) {

        receiptMessage.textContent =
            editingReceiptPath
                ? "This new receipt will replace the saved receipt when you save changes."
                : "Receipt ready to upload when you save the transaction.";
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
                        );

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
                        );
            }


            if (result.error) {

                if (uploadedReceiptPath) {
                    await deleteReceipt(
                        uploadedReceiptPath
                    );
                }

                throw result.error;
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
        !transactionFilterCategory
    ) {
        return;
    }

    const selectedAccount =
        transactionFilterAccount.value ||
        "all";

    const selectedCategory =
        transactionFilterCategory.value ||
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

