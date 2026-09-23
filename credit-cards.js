import { supabase } from "./supabase.js";

function toMoneyNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function roundMoney(value) {
    return Math.round((toMoneyNumber(value) + Number.EPSILON) * 100) / 100;
}

function daysBetween(startDate, endDate) {
    if (!startDate || !endDate) return 0;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.round(
            (end.getTime() - start.getTime()) /
            (24 * 60 * 60 * 1000)
        )
    );
}

export function getCreditCardOutstanding(accountBalance) {
    return roundMoney(
        Math.max(0, -toMoneyNumber(accountBalance))
    );
}

export function getAvailableCredit(creditLimit, outstanding) {
    return roundMoney(
        Math.max(
            0,
            toMoneyNumber(creditLimit) -
            toMoneyNumber(outstanding)
        )
    );
}

export function getCreditUtilisation(creditLimit, outstanding) {
    const limit = toMoneyNumber(creditLimit);

    if (limit <= 0) return 0;

    return Math.max(
        0,
        (toMoneyNumber(outstanding) / limit) * 100
    );
}

export function getLatestCreditCardStatement(
    statements,
    creditCardId
) {
    return (Array.isArray(statements) ? statements : [])
        .filter(item => item.credit_card_id === creditCardId)
        .sort(
            (first, second) =>
                String(second.statement_date)
                    .localeCompare(String(first.statement_date))
        )[0] || null;
}

export function getLatestCreditCardReconciliation(
    reconciliations,
    creditCardId
) {
    return (Array.isArray(reconciliations) ? reconciliations : [])
        .filter(item => item.credit_card_id === creditCardId)
        .sort(
            (first, second) =>
                String(second.as_of_date)
                    .localeCompare(String(first.as_of_date))
                ||
                String(second.created_at || "")
                    .localeCompare(String(first.created_at || ""))
        )[0] || null;
}

export function getStatementPayments(
    transfers,
    accountId,
    statementDate,
    asOfDate = null
) {
    return roundMoney(
        (Array.isArray(transfers) ? transfers : [])
            .filter(
                transfer =>
                    !transfer.deleted_at &&
                    transfer.to_account_id === accountId &&
                    transfer.transfer_date >= statementDate &&
                    (
                        !asOfDate ||
                        transfer.transfer_date <= asOfDate
                    )
            )
            .reduce(
                (total, transfer) =>
                    total + toMoneyNumber(transfer.amount),
                0
            )
    );
}

export function getRemainingStatementDue(
    statement,
    paymentsSinceStatement = 0
) {
    if (!statement) return 0;

    const statementBalance =
        Math.max(
            0,
            toMoneyNumber(
                statement.statement_balance
            )
        );

    return roundMoney(
        Math.max(
            0,
            statementBalance -
            toMoneyNumber(paymentsSinceStatement)
        )
    );
}

export function estimateFinanceCharge({
    interestBearingBalance = 0,
    annualRate = 0,
    days = 0
}) {
    const balance = Math.max(
        0,
        toMoneyNumber(interestBearingBalance)
    );

    const rate = Math.max(
        0,
        toMoneyNumber(annualRate)
    );

    const dayCount = Math.max(
        0,
        Math.floor(toMoneyNumber(days))
    );

    if (!balance || !rate || !dayCount) {
        return 0;
    }

    return roundMoney(
        balance *
        (rate / 100) *
        (dayCount / 365)
    );
}

export function estimateMinimumPayment({
    projectedBalance = 0,
    percent = 0,
    floor = 0,
    extraAmount = 0
}) {
    const balance = Math.max(
        0,
        toMoneyNumber(projectedBalance)
    );

    if (!balance) return 0;

    const percentageAmount =
        balance *
        Math.max(0, toMoneyNumber(percent)) /
        100;

    const base =
        Math.max(
            percentageAmount,
            Math.max(0, toMoneyNumber(floor))
        );

    return roundMoney(
        Math.min(
            balance + Math.max(0, toMoneyNumber(extraAmount)),
            base + Math.max(0, toMoneyNumber(extraAmount))
        )
    );
}

export function projectCreditCard({
    currentOutstanding = 0,
    latestStatement = null,
    paymentsSinceStatement = 0,
    annualRate = 0,
    minimumPaymentPercent = 0,
    minimumPaymentFloor = 0,
    today = null,
    nextStatementDate = null
}) {
    const outstanding =
        Math.max(0, toMoneyNumber(currentOutstanding));

    const remainingStatementDue =
        getRemainingStatementDue(
            latestStatement,
            paymentsSinceStatement
        );

    const dueDate =
        latestStatement?.due_date || null;

    const interestStart =
        dueDate || today;

    const projectionEnd =
        nextStatementDate || today;

    const chargeDays =
        daysBetween(
            interestStart,
            projectionEnd
        );

    const estimatedFinanceCharge =
        remainingStatementDue > 0
            ? estimateFinanceCharge({
                interestBearingBalance:
                    Math.min(
                        outstanding,
                        remainingStatementDue
                    ),
                annualRate,
                days:
                    chargeDays
            })
            : 0;

    const projectedStatementBalance =
        roundMoney(
            outstanding +
            estimatedFinanceCharge
        );

    const estimatedMinimumPayment =
        estimateMinimumPayment({
            projectedBalance:
                projectedStatementBalance,
            percent:
                minimumPaymentPercent,
            floor:
                minimumPaymentFloor
        });

    return {
        remainingStatementDue,
        chargeDays,
        estimatedFinanceCharge,
        projectedStatementBalance,
        estimatedMinimumPayment
    };
}

export async function fetchCreditCards(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function fetchCreditCardStatements(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from("credit_card_statements")
        .select("*")
        .eq("user_id", userId)
        .order("statement_date", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function fetchCreditCardReconciliations(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from("credit_card_reconciliations")
        .select("*")
        .eq("user_id", userId)
        .order("as_of_date", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createCreditCardProfile({
    userId,
    cardName,
    issuer,
    lastFour,
    creditLimit,
    currentOutstanding,
    settlementAccountId,
    purchaseApr,
    cashAdvanceApr,
    minimumPaymentPercent,
    minimumPaymentFloor,
    lateFeePercent,
    lateFeeMin,
    lateFeeMax,
    interestFreeDays,
    statementDay
}) {
    let account = null;
    let paymentMethod = null;

    try {
        const accountResult = await supabase
            .from("accounts")
            .insert({
                user_id: userId,
                name: cardName,
                account_type: "credit_card",
                opening_balance:
                    -Math.abs(
                        toMoneyNumber(currentOutstanding)
                    )
            })
            .select("*")
            .single();

        if (accountResult.error) throw accountResult.error;
        account = accountResult.data;

        const paymentResult = await supabase
            .from("payment_methods")
            .insert({
                user_id: userId,
                name: cardName,
                method_type: "credit_card",
                system_key: null,
                is_active: true,
                sort_order: 80
            })
            .select("*")
            .single();

        if (paymentResult.error) throw paymentResult.error;
        paymentMethod = paymentResult.data;

        const cardResult = await supabase
            .from("credit_cards")
            .insert({
                user_id: userId,
                account_id: account.id,
                payment_method_id: paymentMethod.id,
                settlement_account_id:
                    settlementAccountId || null,
                card_name: cardName,
                issuer: issuer || null,
                last_four: lastFour || null,
                credit_limit: toMoneyNumber(creditLimit),
                purchase_apr: toMoneyNumber(purchaseApr),
                cash_advance_apr: toMoneyNumber(cashAdvanceApr),
                minimum_payment_percent:
                    toMoneyNumber(minimumPaymentPercent),
                minimum_payment_floor:
                    toMoneyNumber(minimumPaymentFloor),
                late_fee_percent:
                    toMoneyNumber(lateFeePercent),
                late_fee_min:
                    toMoneyNumber(lateFeeMin),
                late_fee_max:
                    toMoneyNumber(lateFeeMax),
                interest_free_days:
                    Math.max(
                        0,
                        Number.parseInt(
                            String(interestFreeDays || 0),
                            10
                        ) || 0
                    ),
                statement_day:
                    statementDay
                        ? Number.parseInt(
                            String(statementDay),
                            10
                        )
                        : null
            })
            .select("*")
            .single();

        if (cardResult.error) throw cardResult.error;

        return cardResult.data;

    } catch (error) {
        if (paymentMethod?.id) {
            await supabase
                .from("payment_methods")
                .delete()
                .eq("id", paymentMethod.id);
        }

        if (account?.id) {
            await supabase
                .from("accounts")
                .delete()
                .eq("id", account.id);
        }

        throw error;
    }
}

export async function updateCreditCardProfile(card, updates) {
    const payload = {
        card_name: updates.cardName,
        issuer: updates.issuer || null,
        last_four: updates.lastFour || null,
        credit_limit: toMoneyNumber(updates.creditLimit),
        settlement_account_id:
            updates.settlementAccountId || null,
        purchase_apr:
            toMoneyNumber(updates.purchaseApr),
        cash_advance_apr:
            toMoneyNumber(updates.cashAdvanceApr),
        minimum_payment_percent:
            toMoneyNumber(updates.minimumPaymentPercent),
        minimum_payment_floor:
            toMoneyNumber(updates.minimumPaymentFloor),
        late_fee_percent:
            toMoneyNumber(updates.lateFeePercent),
        late_fee_min:
            toMoneyNumber(updates.lateFeeMin),
        late_fee_max:
            toMoneyNumber(updates.lateFeeMax),
        interest_free_days:
            Math.max(
                0,
                Number.parseInt(
                    String(updates.interestFreeDays || 0),
                    10
                ) || 0
            ),
        statement_day:
            updates.statementDay
                ? Number.parseInt(
                    String(updates.statementDay),
                    10
                )
                : null
    };

    const { error } = await supabase
        .from("credit_cards")
        .update(payload)
        .eq("id", card.id);

    if (error) throw error;

    const accountResult = await supabase
        .from("accounts")
        .update({
            name: updates.cardName
        })
        .eq("id", card.account_id);

    if (accountResult.error) throw accountResult.error;

    const paymentResult = await supabase
        .from("payment_methods")
        .update({
            name: updates.cardName
        })
        .eq("id", card.payment_method_id);

    if (paymentResult.error) throw paymentResult.error;
}

export async function setCreditCardActive(card, isActive) {
    const results = await Promise.all([
        supabase
            .from("credit_cards")
            .update({ is_active: isActive })
            .eq("id", card.id),
        supabase
            .from("accounts")
            .update({ is_active: isActive })
            .eq("id", card.account_id),
        supabase
            .from("payment_methods")
            .update({ is_active: isActive })
            .eq("id", card.payment_method_id)
    ]);

    const failed = results.find(result => result.error);
    if (failed?.error) throw failed.error;
}

export async function saveCreditCardStatement({
    userId,
    creditCardId,
    statementDate,
    dueDate,
    statementBalance,
    amountDue,
    minimumPayment,
    financeCharge,
    instalmentDue,
    pastDueAmount,
    overLimitAmount,
    notes
}) {
    const { data, error } = await supabase
        .from("credit_card_statements")
        .upsert(
            {
                user_id: userId,
                credit_card_id: creditCardId,
                statement_date: statementDate,
                due_date: dueDate,
                statement_balance:
                    toMoneyNumber(statementBalance),
                amount_due:
                    amountDue === "" ||
                    amountDue === null ||
                    amountDue === undefined
                        ? null
                        : toMoneyNumber(amountDue),
                minimum_payment:
                    toMoneyNumber(minimumPayment),
                finance_charge:
                    toMoneyNumber(financeCharge),
                instalment_due:
                    toMoneyNumber(instalmentDue),
                past_due_amount:
                    toMoneyNumber(pastDueAmount),
                over_limit_amount:
                    toMoneyNumber(overLimitAmount),
                notes:
                    notes?.trim() || null
            },
            {
                onConflict:
                    "credit_card_id,statement_date"
            }
        )
        .select("*")
        .single();

    if (error) throw error;
    return data;
}

export async function saveCreditCardReconciliation({
    userId,
    creditCardId,
    asOfDate,
    bankOutstanding,
    notes
}) {
    const { data, error } = await supabase
        .from("credit_card_reconciliations")
        .insert({
            user_id: userId,
            credit_card_id: creditCardId,
            as_of_date: asOfDate,
            bank_outstanding:
                toMoneyNumber(bankOutstanding),
            notes:
                notes?.trim() || null
        })
        .select("*")
        .single();

    if (error) throw error;
    return data;
}
