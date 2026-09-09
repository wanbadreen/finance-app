import { supabase } from "./supabase.js";


// ====================================
// AUTH ELEMENTS
// ====================================

const authSection =
    document.getElementById("auth-section");

const financeApp =
    document.getElementById("finance-app");

const authForm =
    document.getElementById("auth-form");

const registerButton =
    document.getElementById("register-button");

const loginButton =
    document.getElementById("login-button");

const logoutButton =
    document.getElementById("logout-button");

const authMessage =
    document.getElementById("auth-message");

const userEmail =
    document.getElementById("user-email");


// ====================================
// ACCOUNT ELEMENTS
// ====================================

const accountForm =
    document.getElementById("account-form");

const accountList =
    document.getElementById("account-list");

const accountFormTitle =
    document.getElementById(
        "account-form-title"
    );

const saveAccountButton =
    document.getElementById(
        "save-account-button"
    );

const cancelAccountEditButton =
    document.getElementById(
        "cancel-account-edit-button"
    );

const accountMessage =
    document.getElementById(
        "account-message"
    );


// ====================================
// CATEGORY ELEMENTS
// ====================================

const categoryForm =
    document.getElementById(
        "category-form"
    );

const categoryList =
    document.getElementById(
        "category-list"
    );

const categoryFormTitle =
    document.getElementById(
        "category-form-title"
    );

const saveCategoryButton =
    document.getElementById(
        "save-category-button"
    );

const cancelCategoryEditButton =
    document.getElementById(
        "cancel-category-edit-button"
    );

const categoryMessage =
    document.getElementById(
        "category-message"
    );


// ====================================
// INCOME SOURCE ELEMENTS
// ====================================

const incomeSourceForm =
    document.getElementById(
        "income-source-form"
    );

const incomeSourceList =
    document.getElementById(
        "income-source-list"
    );

const incomeSourceFormTitle =
    document.getElementById(
        "income-source-form-title"
    );

const saveIncomeSourceButton =
    document.getElementById(
        "save-income-source-button"
    );

const cancelIncomeSourceEditButton =
    document.getElementById(
        "cancel-income-source-edit-button"
    );

const incomeSourceMessage =
    document.getElementById(
        "income-source-message"
    );


// ====================================
// TRANSACTION ELEMENTS
// ====================================

const transactionForm =
    document.getElementById(
        "transaction-form"
    );

const transactionAccountSelect =
    document.getElementById(
        "transaction-account"
    );

const transactionTypeSelect =
    document.getElementById(
        "type"
    );

const transactionCategorySelect =
    document.getElementById(
        "transaction-category"
    );

const customCategoryGroup =
    document.getElementById(
        "custom-category-group"
    );

const customCategoryInput =
    document.getElementById(
        "custom-category-name"
    );

const incomeSourceGroup =
    document.getElementById(
        "income-source-group"
    );

const transactionIncomeSourceSelect =
    document.getElementById(
        "transaction-income-source"
    );

const customIncomeSourceGroup =
    document.getElementById(
        "custom-income-source-group"
    );

const customIncomeSourceInput =
    document.getElementById(
        "custom-income-source-name"
    );

const cancelEditButton =
    document.getElementById(
        "cancel-edit-button"
    );

const submitButton =
    document.getElementById(
        "submit-button"
    );

const formTitle =
    document.getElementById(
        "form-title"
    );

const dateInput =
    document.getElementById(
        "date"
    );


// ====================================
// APP STATE
// ====================================

let currentUser = null;

let accounts = [];

let categories = [];

let incomeSources = [];

let editingAccountId = null;

let editingCategoryId = null;

let editingIncomeSourceId = null;

let editingTransactionId = null;


// ====================================
// STARTER DATA
// ====================================

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


// ====================================
// TEMPORARY LOCAL TRANSACTIONS
// ====================================

const defaultTransactions = [

    {
        id: generateId(),

        description: "Salary",

        category: "Income",

        amount: 2750,

        type: "income",

        date: "2026-09-01"
    },

    {
        id: generateId(),

        description: "Grab",

        category: "Side Income",

        amount: 1200,

        type: "income",

        date: "2026-09-07"
    },

    {
        id: generateId(),

        description: "Petrol",

        category: "Transportation",

        amount: 50,

        type: "expense",

        date: "2026-09-08"
    },

    {
        id: generateId(),

        description: "Nasi Kandar",

        category: "Food & Dining",

        amount: 18,

        type: "expense",

        date: "2026-09-08"
    }

];


const savedTransactions =
    localStorage.getItem(
        "transactions"
    );


let transactions;


if (savedTransactions) {

    try {

        transactions =
            JSON.parse(
                savedTransactions
            );

    } catch (error) {

        console.error(
            "Failed to read local transactions:",
            error
        );

        transactions =
            defaultTransactions;

        saveTransactions();

    }

} else {

    transactions =
        defaultTransactions;

    saveTransactions();

}


// ====================================
// MIGRATE OLD LOCAL DATA
// ====================================

let localDataChanged = false;


transactions =
    transactions.map(
        function (transaction) {

            if (!transaction.id) {

                localDataChanged =
                    true;

                return {

                    ...transaction,

                    id: generateId()

                };

            }

            return transaction;

        }
    );


if (localDataChanged) {

    saveTransactions();

}


// ====================================
// AUTH UI
// ====================================

function showLoggedOutState() {

    currentUser = null;

    accounts = [];

    categories = [];

    incomeSources = [];

    authSection.style.display =
        "flex";

    financeApp.style.display =
        "none";

}


async function showLoggedInState(user) {

    currentUser =
        user;

    authSection.style.display =
        "none";

    financeApp.style.display =
        "block";

    userEmail.textContent =
        user.email ||
        "Signed in";

    authMessage.textContent =
        "";


    await loadAccounts();

    await loadCategories();

    await loadIncomeSources();

    await seedStarterData();


    refreshTransactionDropdowns();

    renderTransactions();

}


// ====================================
// REGISTER
// ====================================

registerButton.addEventListener(
    "click",
    async function () {

        const email =
            document
                .getElementById(
                    "auth-email"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "auth-password"
                )
                .value;


        if (
            !email ||
            password.length < 6
        ) {

            authMessage.textContent =
                "Enter a valid email and a password of at least 6 characters.";

            return;

        }


        registerButton.disabled =
            true;


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


        registerButton.disabled =
            false;


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


// ====================================
// LOGIN
// ====================================

authForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "auth-email"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "auth-password"
                )
                .value;


        loginButton.disabled =
            true;


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


        loginButton.disabled =
            false;


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


// ====================================
// LOGOUT
// ====================================

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


// ====================================
// INITIAL AUTH
// ====================================

async function initializeAuth() {

    const {
        data,
        error
    } =
        await supabase.auth
            .getSession();


    if (error) {

        console.error(
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


// ====================================
// ACCOUNTS
// ====================================

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

        return;

    }


    accounts =
        data || [];


    accountMessage.textContent =
        "";


    renderAccounts();

}


function renderAccounts() {

    accountList.innerHTML =
        "";


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


            left.appendChild(
                name
            );


            left.appendChild(
                meta
            );


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
                    account.opening_balance
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


            right.appendChild(
                balance
            );


            right.appendChild(
                buttons
            );


            card.appendChild(
                left
            );


            card.appendChild(
                right
            );


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


        const name =
            document
                .getElementById(
                    "account-name"
                )
                .value
                .trim();


        const accountType =
            document
                .getElementById(
                    "account-type"
                )
                .value;


        const openingBalance =
            parseFloat(
                document
                    .getElementById(
                        "opening-balance"
                    )
                    .value
            );


        if (
            !name ||
            Number.isNaN(
                openingBalance
            )
        ) {

            return;

        }


        let queryResult;


        if (
            editingAccountId === null
        ) {

            queryResult =
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

            queryResult =
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


        if (queryResult.error) {

            accountMessage.textContent =
                queryResult.error.message;

            return;

        }


        resetAccountForm();

        await loadAccounts();

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
        .getElementById(
            "account-name"
        )
        .value =
        account.name;


    document
        .getElementById(
            "account-type"
        )
        .value =
        account.account_type;


    document
        .getElementById(
            "opening-balance"
        )
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
        .getElementById(
            "opening-balance"
        )
        .value =
        "0";


    accountFormTitle.textContent =
        "Add Account";


    saveAccountButton.textContent =
        "+ Add Account";


    cancelAccountEditButton.style.display =
        "none";

}


cancelAccountEditButton
    .addEventListener(
        "click",
        resetAccountForm
    );


// ====================================
// CATEGORIES
// ====================================

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
                .getElementById(
                    "category-name"
                )
                .value
                .trim();


        const type =
            document
                .getElementById(
                    "category-type"
                )
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

        refreshTransactionDropdowns();

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
        .getElementById(
            "category-name"
        )
        .value =
        category.name;


    document
        .getElementById(
            "category-type"
        )
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

    refreshTransactionDropdowns();

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

}


cancelCategoryEditButton
    .addEventListener(
        "click",
        resetCategoryForm
    );


// ====================================
// INCOME SOURCES
// ====================================

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
                .getElementById(
                    "income-source-name"
                )
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
        .getElementById(
            "income-source-name"
        )
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

}


cancelIncomeSourceEditButton
    .addEventListener(
        "click",
        resetIncomeSourceForm
    );


// ====================================
// STARTER DATA
// ====================================

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

            changed =
                true;

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

            changed =
                true;

        }

    }


    if (changed) {

        await loadCategories();

        await loadIncomeSources();

    }

}


// ====================================
// TRANSACTION DROPDOWNS
// ====================================

function refreshTransactionDropdowns(
    transaction = null
) {

    populateAccountSelect(
        transaction?.accountId || ""
    );


    populateCategorySelect(
        transaction?.categoryId || ""
    );


    updateIncomeSourceVisibility(
        transaction?.incomeSourceId || ""
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


    const activeAccounts =
        accounts.filter(
            account =>
                account.is_active
        );


    activeAccounts.forEach(
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

                category.is_active &&

                (
                    category.type ===
                        transactionType ||

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
                source.is_active
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


transactionTypeSelect.addEventListener(
    "change",
    function () {

        populateCategorySelect();

        updateIncomeSourceVisibility();

        customCategoryGroup.style.display =
            "none";

    }
);


transactionCategorySelect
    .addEventListener(
        "change",
        function () {

            customCategoryGroup.style.display =

                transactionCategorySelect.value ===
                "__other__"

                    ? "block"

                    : "none";

        }
    );


transactionIncomeSourceSelect
    .addEventListener(
        "change",
        function () {

            customIncomeSourceGroup.style.display =

                transactionIncomeSourceSelect.value ===
                "__other__"

                    ? "block"

                    : "none";

        }
    );


// ====================================
// TRANSACTION SUBMIT
// Still LocalStorage
// ====================================

transactionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const description =
            document
                .getElementById(
                    "description"
                )
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
                    .getElementById(
                        "amount"
                    )
                    .value
            );


        const date =
            document
                .getElementById(
                    "date"
                )
                .value;


        const notes =
            document
                .getElementById(
                    "notes"
                )
                .value
                .trim();


        if (
            !description ||
            !accountId ||
            !categoryId ||
            !date ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please complete all required transaction fields."
            );

            return;

        }


        if (
            categoryId ===
            "__other__"
        ) {

            const newCategory =
                await createCategoryFromTransaction(
                    type
                );


            if (!newCategory) {
                return;
            }


            categoryId =
                newCategory.id;

        }


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

                const newSource =
                    await createIncomeSourceFromTransaction();


                if (!newSource) {
                    return;
                }


                incomeSourceId =
                    newSource.id;

            }

        }


        const transactionData = {

            id:
                editingTransactionId ||
                generateId(),

            description,

            accountId,

            categoryId,

            incomeSourceId,

            amount,

            type,

            date,

            notes

        };


        if (
            editingTransactionId === null
        ) {

            transactions.push(
                transactionData
            );

        } else {

            const index =
                transactions.findIndex(

                    transaction =>
                        transaction.id ===
                        editingTransactionId

                );


            if (index >= 0) {

                transactions[index] =
                    transactionData;

            }

        }


        saveTransactions();

        updateDashboard();

        renderTransactions();

        resetTransactionForm();

    }
);


// ====================================
// CUSTOM CATEGORY FROM TRANSACTION
// ====================================

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
                name.toLowerCase() &&

                (
                    category.type ===
                    type ||

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


    return data;

}


// ====================================
// CUSTOM INCOME SOURCE
// ====================================

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


// ====================================
// RENDER TRANSACTIONS
// ====================================

function renderTransactions() {

    const transactionList =
        document.getElementById(
            "transaction-list"
        );


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


            const categoryName =
                getCategoryName(
                    transaction.categoryId
                ) ||

                transaction.category ||

                "Uncategorized";


            const accountName =
                getAccountName(
                    transaction.accountId
                ) ||

                "No account";


            category.textContent =
                `${categoryName} • ${accountName}`;


            const date =
                document.createElement(
                    "p"
                );


            date.className =
                "transaction-date";


            date.textContent =
                formatDate(
                    transaction.date
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
                        transaction.incomeSourceId
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


            row.appendChild(
                left
            );


            row.appendChild(
                right
            );


            transactionList.appendChild(
                row
            );

        }
    );

}


// ====================================
// EDIT TRANSACTION
// ====================================

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
        .getElementById(
            "description"
        )
        .value =
        transaction.description;


    document
        .getElementById(
            "amount"
        )
        .value =
        transaction.amount;


    document
        .getElementById(
            "date"
        )
        .value =
        transaction.date;


    document
        .getElementById(
            "notes"
        )
        .value =
        transaction.notes || "";


    transactionTypeSelect.value =
        transaction.type;


    refreshTransactionDropdowns(
        transaction
    );


    editingTransactionId =
        id;


    formTitle.textContent =
        "Edit Transaction";


    submitButton.textContent =
        "Save Changes";


    cancelEditButton.style.display =
        "block";


    transactionForm.scrollIntoView({

        behavior:
            "smooth"

    });

}


// ====================================
// DELETE TRANSACTION
// ====================================

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    if (
        !confirm(
            `Delete "${transaction.description}"?`
        )
    ) {

        return;

    }


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );


    saveTransactions();

    updateDashboard();

    renderTransactions();

    resetTransactionForm();

}


// ====================================
// RESET TRANSACTION
// ====================================

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


// ====================================
// DASHBOARD
// ====================================

function updateDashboard() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    Number(
                        transaction.amount
                    );

            } else {

                expenses +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    document
        .getElementById(
            "income"
        )
        .textContent =
        formatMoney(income);


    document
        .getElementById(
            "expenses"
        )
        .textContent =
        formatMoney(expenses);


    document
        .getElementById(
            "balance"
        )
        .textContent =
        formatMoney(
            income -
            expenses
        );

}


// ====================================
// LOCAL STORAGE
// ====================================

function saveTransactions() {

    localStorage.setItem(

        "transactions",

        JSON.stringify(
            transactions
        )

    );

}


// ====================================
// HELPERS
// ====================================

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


    const actions =
        document.createElement(
            "div"
        );


    actions.appendChild(
        createManagementButtons(
            onEdit,
            onToggle,
            active
        )
    );


    card.appendChild(left);

    card.appendChild(actions);


    return card;

}


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


    edit.addEventListener(
        "click",
        onEdit
    );


    const status =
        createTextButton(

            active
                ? "Deactivate"
                : "Activate",

            "status-button"

        );


    status.addEventListener(
        "click",
        onToggle
    );


    buttons.appendChild(edit);

    buttons.appendChild(status);


    return buttons;

}


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

            style:
                "currency",

            currency:
                "MYR"

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
        date +
        "T00:00:00"
    )
        .toLocaleDateString(

            "en-MY",

            {

                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"

            }

        );

}


function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const day =
        String(
            today.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return `${year}-${month}-${day}`;

}


function generateId() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            "function"
    ) {

        return window.crypto
            .randomUUID();

    }


    return (

        Date.now()
            .toString(36)

        +

        "-"

        +

        Math.random()
            .toString(36)
            .slice(2)

    );

}


// ====================================
// INITIAL LOAD
// ====================================

updateDashboard();

renderTransactions();

dateInput.value =
    getTodayDate();

refreshTransactionDropdowns();

initializeAuth();