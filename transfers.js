import { supabase } from "./supabase.js";


export function getTransferAccountDelta(
    transfers,
    accountId
) {

    return (
        Array.isArray(transfers)
            ? transfers
            : []
    ).reduce(
        function (
            total,
            transfer
        ) {

            const amount =
                Number(
                    transfer?.amount
                ) || 0;

            if (
                transfer?.from_account_id ===
                accountId
            ) {
                return total - amount;
            }

            if (
                transfer?.to_account_id ===
                accountId
            ) {
                return total + amount;
            }

            return total;
        },
        0
    );
}


function validateTransferDraft({
    fromAccountId,
    toAccountId,
    amount,
    transferDate,
    description
}) {

    if (
        !fromAccountId ||
        !toAccountId
    ) {
        throw new Error(
            "Choose both the source and destination accounts."
        );
    }

    if (
        fromAccountId ===
        toAccountId
    ) {
        throw new Error(
            "Source and destination accounts must be different."
        );
    }

    const numericAmount =
        Number(amount);

    if (
        !Number.isFinite(
            numericAmount
        ) ||
        numericAmount <= 0
    ) {
        throw new Error(
            "Transfer amount must be greater than zero."
        );
    }

    if (!transferDate) {
        throw new Error(
            "Choose a transfer date."
        );
    }

    if (
        !String(
            description ||
            ""
        ).trim()
    ) {
        throw new Error(
            "Enter a transfer description."
        );
    }

    return numericAmount;
}


export async function fetchAccountTransfers(
    userId
) {

    const {
        data,
        error
    } =
        await supabase
            .from(
                "account_transfers"
            )
            .select("*")
            .eq(
                "user_id",
                userId
            )
            .is(
                "deleted_at",
                null
            )
            .order(
                "transfer_date",
                {
                    ascending:
                        false
                }
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );

    if (error) {
        throw error;
    }

    return data || [];
}


export async function saveAccountTransfer({
    id = null,
    userId,
    fromAccountId,
    toAccountId,
    amount,
    transferDate,
    description,
    notes = ""
}) {

    const numericAmount =
        validateTransferDraft({
            fromAccountId,
            toAccountId,
            amount,
            transferDate,
            description
        });

    const payload = {
        user_id:
            userId,

        from_account_id:
            fromAccountId,

        to_account_id:
            toAccountId,

        amount:
            numericAmount,

        transfer_date:
            transferDate,

        description:
            String(
                description
            ).trim(),

        notes:
            String(
                notes ||
                ""
            ).trim() ||
            null
    };

    const query =
        id
            ? supabase
                .from(
                    "account_transfers"
                )
                .update(
                    payload
                )
                .eq(
                    "id",
                    id
                )
            : supabase
                .from(
                    "account_transfers"
                )
                .insert(
                    payload
                );

    const {
        data,
        error
    } =
        await query
            .select("*")
            .single();

    if (error) {
        throw error;
    }

    return data;
}


export async function softDeleteAccountTransfer(
    id
) {

    const {
        error
    } =
        await supabase
            .from(
                "account_transfers"
            )
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
        throw error;
    }
}


export async function restoreAccountTransfer(
    id
) {

    const {
        error
    } =
        await supabase
            .from(
                "account_transfers"
            )
            .update({
                deleted_at:
                    null
            })
            .eq(
                "id",
                id
            );

    if (error) {
        throw error;
    }
}


export async function finalizeDeletedAccountTransfer(
    id
) {

    const {
        error
    } =
        await supabase
            .from(
                "account_transfers"
            )
            .delete()
            .eq(
                "id",
                id
            )
            .not(
                "deleted_at",
                "is",
                null
            );

    if (error) {
        throw error;
    }
}


export async function cleanupDeletedAccountTransfers(
    userId
) {

    const {
        error
    } =
        await supabase
            .from(
                "account_transfers"
            )
            .delete()
            .eq(
                "user_id",
                userId
            )
            .not(
                "deleted_at",
                "is",
                null
            );

    if (error) {
        throw error;
    }
}
