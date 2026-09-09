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
                transactionDate
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

        submitButton.disabled =
            false;

        if (result.error) {

            console.error(
                result.error
            );

            alert(
                result.error.message
            );

            submitButton.textContent =
                editingTransactionId
                    ? "Save Changes"
                    : "+ Add Transaction";

            return;
        }

        resetTransactionForm();

        await loadTransactions();
    }
);


// ======================================================
// RENDER TRANSACTIONS
// ======================================================

function renderTransactions() {

    transactionList.innerHTML =
        "";

    if (!transactions.length) {

        renderEmptyState(
            transactionList,
            "No transactions yet."
        );

        return;
    }

    transactions.forEach(
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
// INITIAL LOAD
// ======================================================

dateInput.value =
    getTodayDate();

budgetMonthInput.value =
    getCurrentMonthValue();

initializeAuth();