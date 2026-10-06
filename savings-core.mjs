export function getReservedSavingsTotal(movements, accountId = null) {
    return (Array.isArray(movements) ? movements : [])
        .filter(item =>
            item?.method === "reserve"
            && (!accountId || item.account_id === accountId)
        )
        .reduce((total, item) => {
            const amount = Number(item.amount) || 0;
            return total + (item.direction === "withdraw" ? -amount : amount);
        }, 0);
}

export function getGoalReserveBalance(movements, goalId, accountId) {
    return getReservedSavingsTotal(
        (Array.isArray(movements) ? movements : [])
            .filter(item => item?.goal_id === goalId),
        accountId
    );
}

export function getGoalTransferBalance(movements, goalId, savingsAccountId) {
    return (Array.isArray(movements) ? movements : [])
        .filter(item =>
            item?.goal_id === goalId
            && item?.method === "transfer"
        )
        .reduce((total, item) => {
            const amount = Number(item.amount) || 0;

            if (item.direction === "add" && item.to_account_id === savingsAccountId) {
                return total + amount;
            }

            if (item.direction === "withdraw" && item.from_account_id === savingsAccountId) {
                return total - amount;
            }

            return total;
        }, 0);
}

export function getAvailableCash(accounts, calculateBalance, movements) {
    const grossSpendable = (Array.isArray(accounts) ? accounts : [])
        .filter(account =>
            account?.account_type !== "credit_card"
            && account?.account_type !== "savings"
        )
        .reduce(
            (total, account) => total + Number(calculateBalance(account.id) || 0),
            0
        );

    const reserved = getReservedSavingsTotal(movements);

    return grossSpendable - reserved;
}
