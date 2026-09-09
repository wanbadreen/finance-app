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
// TRANSACTION ELEMENTS
// ====================================

const transactionForm =
    document.getElementById(
        "transaction-form"
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

let editingAccountId = null;

let editingId = null;


// ====================================
// DEFAULT LOCAL TRANSACTIONS
// Temporary until Supabase transaction
// migration is completed.
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


// ====================================
// LOAD LOCAL TRANSACTIONS
// ====================================

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
            "Failed to load transactions:",
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
// MIGRATE OLD LOCAL TRANSACTIONS
// ====================================

let dataChanged = false;


transactions =
    transactions.map(
        function (transaction) {

            if (!transaction.id) {

                dataChanged = true;

                return {
                    ...transaction,
                    id: generateId()
                };

            }

            return transaction;

        }
    );


if (dataChanged) {

    saveTransactions();

}


// ====================================
// AUTH UI STATE
// ====================================

function showLoggedOutState() {

    currentUser = null;

    accounts = [];

    authSection.style.display =
        "flex";

    financeApp.style.display =
        "none";

}


async function showLoggedInState(user) {

    currentUser = user;

    authSection.style.display =
        "none";

    financeApp.style.display =
        "block";

    userEmail.textContent =
        user.email || "Signed in";

    authMessage.textContent =
        "";

    await loadAccounts();

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

                email: email,

                password: password,

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


        if (
            !email ||
            !password
        ) {

            authMessage.textContent =
                "Enter your email and password.";

            return;

        }


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

                    email: email,

                    password: password

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

        logoutButton.disabled =
            true;


        const {
            error
        } =
            await supabase.auth.signOut();


        logoutButton.disabled =
            false;


        if (error) {

            alert(
                error.message
            );

            return;

        }


        resetAccountForm();

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


// ====================================
// AUTH STATE CHANGE
// ====================================

supabase.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "Auth event:",
            event
        );


        if (session) {

            currentUser =
                session.user;

        } else {

            currentUser =
                null;

        }

    }
);


// ====================================
// LOAD ACCOUNTS
// ====================================

async function loadAccounts() {

    if (!currentUser) {

        return;

    }


    accountMessage.textContent =
        "Loading accounts...";


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

        console.error(
            "Load accounts error:",
            error
        );


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


// ====================================
// RENDER ACCOUNTS
// ====================================

function renderAccounts() {

    accountList.innerHTML =
        "";


    if (
        accounts.length === 0
    ) {

        const emptyState =
            document.createElement(
                "div"
            );


        emptyState.className =
            "empty-state";


        emptyState.textContent =
            "No accounts yet.";


        accountList.appendChild(
            emptyState
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
                "account-card";


            if (!account.is_active) {

                card.classList.add(
                    "inactive"
                );

            }


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "account-info";


            const name =
                document.createElement(
                    "p"
                );


            name.className =
                "account-name";


            name.textContent =
                account.name;


            const type =
                document.createElement(
                    "p"
                );


            type.className =
                "account-type";


            type.textContent =
                formatAccountType(
                    account.account_type
                );


            if (!account.is_active) {

                type.textContent +=
                    " • Inactive";

            }


            info.appendChild(
                name
            );


            info.appendChild(
                type
            );


            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "account-actions";


            const balance =
                document.createElement(
                    "p"
                );


            balance.className =
                "account-balance";


            balance.textContent =
                formatMoney(
                    account.opening_balance
                );


            const buttons =
                document.createElement(
                    "div"
                );


            buttons.className =
                "account-buttons";


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.className =
                "account-edit-button";


            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function () {

                    editAccount(
                        account.id
                    );

                }
            );


            const statusButton =
                document.createElement(
                    "button"
                );


            statusButton.type =
                "button";


            statusButton.className =
                "account-status-button";


            statusButton.textContent =
                account.is_active
                    ? "Deactivate"
                    : "Activate";


            statusButton.addEventListener(
                "click",
                function () {

                    toggleAccountStatus(
                        account.id
                    );

                }
            );


            buttons.appendChild(
                editButton
            );


            buttons.appendChild(
                statusButton
            );


            actions.appendChild(
                balance
            );


            actions.appendChild(
                buttons
            );


            card.appendChild(
                info
            );


            card.appendChild(
                actions
            );


            accountList.appendChild(
                card
            );

        }
    );

}


// ====================================
// ADD / UPDATE ACCOUNT
// ====================================

accountForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!currentUser) {

            return;

        }


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

            accountMessage.textContent =
                "Enter valid account details.";

            return;

        }


        saveAccountButton.disabled =
            true;


        accountMessage.textContent =
            "Saving account...";


        if (
            editingAccountId === null
        ) {

            const {
                error
            } =
                await supabase
                    .from("accounts")
                    .insert({

                        user_id:
                            currentUser.id,

                        name:
                            name,

                        account_type:
                            accountType,

                        opening_balance:
                            openingBalance

                    });


            if (error) {

                saveAccountButton.disabled =
                    false;


                accountMessage.textContent =
                    error.message;


                return;

            }

        } else {

            const {
                error
            } =
                await supabase
                    .from("accounts")
                    .update({

                        name:
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


            if (error) {

                saveAccountButton.disabled =
                    false;


                accountMessage.textContent =
                    error.message;


                return;

            }

        }


        saveAccountButton.disabled =
            false;


        resetAccountForm();


        await loadAccounts();

    }
);


// ====================================
// EDIT ACCOUNT
// ====================================

function editAccount(id) {

    const account =
        accounts.find(
            function (account) {

                return (
                    account.id === id
                );

            }
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
        account.id;


    accountFormTitle.textContent =
        "Edit Account";


    saveAccountButton.textContent =
        "Save Changes";


    cancelAccountEditButton.style.display =
        "block";


    accountForm.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ====================================
// ACCOUNT STATUS
// ====================================

async function toggleAccountStatus(id) {

    const account =
        accounts.find(
            function (account) {

                return (
                    account.id === id
                );

            }
        );


    if (!account) {

        return;

    }


    const newStatus =
        !account.is_active;


    const {
        error
    } =
        await supabase
            .from("accounts")
            .update({

                is_active:
                    newStatus

            })
            .eq(
                "id",
                account.id
            );


    if (error) {

        alert(
            error.message
        );

        return;

    }


    await loadAccounts();

}


// ====================================
// RESET ACCOUNT FORM
// ====================================

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


    accountMessage.textContent =
        "";

}


cancelAccountEditButton.addEventListener(
    "click",
    function () {

        resetAccountForm();

    }
);


// ====================================
// FORMAT ACCOUNT TYPE
// ====================================

function formatAccountType(type) {

    const labels = {

        bank:
            "Bank",

        cash:
            "Cash",

        e_wallet:
            "E-Wallet",

        savings:
            "Savings",

        other:
            "Other"

    };


    return (
        labels[type] ||
        type
    );

}


// ====================================
// DASHBOARD
// ====================================

function updateDashboard() {

    let totalIncome = 0;

    let totalExpenses = 0;


    for (
        const transaction
        of transactions
    ) {

        if (
            transaction.type ===
            "income"
        ) {

            totalIncome +=
                Number(
                    transaction.amount
                );

        }


        if (
            transaction.type ===
            "expense"
        ) {

            totalExpenses +=
                Number(
                    transaction.amount
                );

        }

    }


    const balance =
        totalIncome -
        totalExpenses;


    document
        .getElementById(
            "balance"
        )
        .textContent =
        formatMoney(
            balance
        );


    document
        .getElementById(
            "income"
        )
        .textContent =
        formatMoney(
            totalIncome
        );


    document
        .getElementById(
            "expenses"
        )
        .textContent =
        formatMoney(
            totalExpenses
        );

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


    if (
        transactions.length === 0
    ) {

        const emptyState =
            document.createElement(
                "div"
            );


        emptyState.className =
            "empty-state";


        emptyState.textContent =
            "No transactions yet.";


        transactionList.appendChild(
            emptyState
        );


        return;

    }


    transactions.forEach(
        function (transaction) {

            const transactionElement =
                document.createElement(
                    "div"
                );


            transactionElement.className =
                "transaction";


            const transactionInfo =
                document.createElement(
                    "div"
                );


            transactionInfo.className =
                "transaction-info";


            const transactionName =
                document.createElement(
                    "p"
                );


            transactionName.className =
                "transaction-name";


            transactionName.textContent =
                transaction.description;


            const transactionCategory =
                document.createElement(
                    "p"
                );


            transactionCategory.className =
                "transaction-category";


            transactionCategory.textContent =
                transaction.category;


            const transactionDate =
                document.createElement(
                    "p"
                );


            transactionDate.className =
                "transaction-date";


            transactionDate.textContent =
                formatDate(
                    transaction.date
                );


            transactionInfo.appendChild(
                transactionName
            );


            transactionInfo.appendChild(
                transactionCategory
            );


            transactionInfo.appendChild(
                transactionDate
            );


            const transactionActions =
                document.createElement(
                    "div"
                );


            transactionActions.className =
                "transaction-actions";


            const transactionAmount =
                document.createElement(
                    "p"
                );


            transactionAmount.className =
                `transaction-amount ${transaction.type}`;


            const sign =
                transaction.type ===
                "income"
                    ? "+"
                    : "-";


            transactionAmount.textContent =
                sign +
                formatMoney(
                    transaction.amount
                );


            const actionButtons =
                document.createElement(
                    "div"
                );


            actionButtons.className =
                "action-buttons";


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.className =
                "edit-button";


            editButton.textContent =
                "Edit";


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "delete-button";


            deleteButton.textContent =
                "Delete";


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


            actionButtons.appendChild(
                editButton
            );


            actionButtons.appendChild(
                deleteButton
            );


            transactionActions.appendChild(
                transactionAmount
            );


            transactionActions.appendChild(
                actionButtons
            );


            transactionElement.appendChild(
                transactionInfo
            );


            transactionElement.appendChild(
                transactionActions
            );


            transactionList.appendChild(
                transactionElement
            );

        }
    );

}


// ====================================
// SAVE LOCAL TRANSACTIONS
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
// DELETE LOCAL TRANSACTION
// ====================================

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            function (transaction) {

                return (
                    transaction.id === id
                );

            }
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


    transactions =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.id !== id
                );

            }
        );


    resetTransactionForm();

    saveTransactions();

    updateDashboard();

    renderTransactions();

}


// ====================================
// EDIT LOCAL TRANSACTION
// ====================================

function editTransaction(id) {

    const transaction =
        transactions.find(
            function (transaction) {

                return (
                    transaction.id === id
                );

            }
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
            "category"
        )
        .value =
        transaction.category;


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
        transaction.date || "";


    document
        .getElementById(
            "type"
        )
        .value =
        transaction.type;


    editingId =
        transaction.id;


    formTitle.textContent =
        "Edit Transaction";


    submitButton.textContent =
        "Save Changes";


    cancelEditButton.style.display =
        "block";


    transactionForm.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ====================================
// RESET TRANSACTION FORM
// ====================================

function resetTransactionForm() {

    editingId =
        null;


    transactionForm.reset();


    formTitle.textContent =
        "Add Transaction";


    submitButton.textContent =
        "+ Add Transaction";


    cancelEditButton.style.display =
        "none";


    dateInput.value =
        getTodayDate();

}


cancelEditButton.addEventListener(
    "click",
    function () {

        resetTransactionForm();

    }
);


// ====================================
// ADD / UPDATE LOCAL TRANSACTION
// ====================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            document
                .getElementById(
                    "description"
                )
                .value
                .trim();


        const category =
            document
                .getElementById(
                    "category"
                )
                .value
                .trim();


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


        const type =
            document
                .getElementById(
                    "type"
                )
                .value;


        if (
            !description ||
            !category ||
            !date ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter valid transaction details."
            );

            return;

        }


        if (
            editingId === null
        ) {

            const newTransaction = {

                id:
                    generateId(),

                description:
                    description,

                category:
                    category,

                amount:
                    amount,

                date:
                    date,

                type:
                    type

            };


            transactions.push(
                newTransaction
            );

        } else {

            const transactionIndex =
                transactions.findIndex(
                    function (transaction) {

                        return (
                            transaction.id ===
                            editingId
                        );

                    }
                );


            if (
                transactionIndex === -1
            ) {

                alert(
                    "Transaction could not be found."
                );


                resetTransactionForm();


                return;

            }


            transactions[
                transactionIndex
            ] = {

                id:
                    editingId,

                description:
                    description,

                category:
                    category,

                amount:
                    amount,

                date:
                    date,

                type:
                    type

            };

        }


        saveTransactions();

        updateDashboard();

        renderTransactions();

        resetTransactionForm();

    }
);


// ====================================
// FORMAT MONEY
// ====================================

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


// ====================================
// FORMAT DATE
// ====================================

function formatDate(date) {

    if (!date) {

        return "No date";

    }


    const dateObject =
        new Date(
            date +
            "T00:00:00"
        );


    return dateObject
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


// ====================================
// TODAY
// ====================================

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


    return (
        `${year}-${month}-${day}`
    );

}


// ====================================
// UNIQUE LOCAL ID
// ====================================

function generateId() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            "function"
    ) {

        return (
            window.crypto.randomUUID()
        );

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

initializeAuth();