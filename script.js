import { supabase } from "./supabase.js";


// ====================================
// AUTH ELEMENTS
// ====================================

const authSection =
    document.getElementById(
        "auth-section"
    );


const financeApp =
    document.getElementById(
        "finance-app"
    );


const authForm =
    document.getElementById(
        "auth-form"
    );


const registerButton =
    document.getElementById(
        "register-button"
    );


const logoutButton =
    document.getElementById(
        "logout-button"
    );


const authMessage =
    document.getElementById(
        "auth-message"
    );


const userEmail =
    document.getElementById(
        "user-email"
    );



// ====================================
// FINANCE ELEMENTS
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
// DEFAULT LOCAL DATA
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
// LOAD LOCAL STORAGE
// ====================================

const savedTransactions =
    localStorage.getItem(
        "transactions"
    );


let transactions;

let editingId = null;


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
// MIGRATE OLD TRANSACTIONS
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
// AUTH UI STATES
// ====================================

function showLoggedOutState() {

    authSection.style.display =
        "flex";

    financeApp.style.display =
        "none";

}



function showLoggedInState(user) {

    authSection.style.display =
        "none";

    financeApp.style.display =
        "block";


    userEmail.textContent =
        user.email || "Signed in";


    authMessage.textContent =
        "";

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


        showLoggedInState(
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


        const loginButton =
            document.getElementById(
                "login-button"
            );


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


        showLoggedInState(
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
            await supabase.auth
                .signOut();


        logoutButton.disabled =
            false;


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
// INITIAL AUTH SESSION
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

        showLoggedInState(
            data.session.user
        );

    } else {

        showLoggedOutState();

    }

}



// ====================================
// AUTH STATE LISTENER
// ====================================

supabase.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "Auth event:",
            event
        );


        if (session) {

            showLoggedInState(
                session.user
            );

        } else {

            showLoggedOutState();

        }

    }
);



// ====================================
// DASHBOARD CALCULATION
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


            // LEFT SIDE

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



            // RIGHT SIDE

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
// SAVE LOCAL STORAGE
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
// DELETE
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


    resetForm();

    saveTransactions();

    updateDashboard();

    renderTransactions();

}



// ====================================
// EDIT
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

function resetForm() {

    editingId = null;


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



// ====================================
// CANCEL EDIT
// ====================================

cancelEditButton.addEventListener(
    "click",
    function () {

        resetForm();

    }
);



// ====================================
// ADD / SAVE TRANSACTION
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



        // ADD NEW

        if (
            editingId === null
        ) {

            const newTransaction = {

                id: generateId(),

                description: description,

                category: category,

                amount: amount,

                date: date,

                type: type

            };


            transactions.push(
                newTransaction
            );

        }


        // UPDATE EXISTING

        else {

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

                resetForm();

                return;

            }


            transactions[
                transactionIndex
            ] = {

                id: editingId,

                description: description,

                category: category,

                amount: amount,

                date: date,

                type: type

            };

        }


        saveTransactions();

        updateDashboard();

        renderTransactions();

        resetForm();

    }
);



// ====================================
// FORMAT MONEY
// ====================================

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

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        );

}



// ====================================
// TODAY DATE
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
// UNIQUE ID
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