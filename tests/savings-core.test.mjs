import test from "node:test";
import assert from "node:assert/strict";

import {
    getAvailableCash,
    getGoalReserveBalance,
    getGoalTransferBalance,
    getReservedSavingsTotal
} from "../savings-core.mjs";

const movements = [
    { goal_id: "g1", method: "reserve", direction: "add", amount: 500, account_id: "bank" },
    { goal_id: "g1", method: "reserve", direction: "withdraw", amount: 100, account_id: "bank" },
    { goal_id: "g2", method: "reserve", direction: "add", amount: 50, account_id: "wallet" },
    { goal_id: "g1", method: "transfer", direction: "add", amount: 300, from_account_id: "bank", to_account_id: "save" },
    { goal_id: "g1", method: "transfer", direction: "withdraw", amount: 80, from_account_id: "save", to_account_id: "bank" }
];

test("reserved savings nets add and withdrawal movements", () => {
    assert.equal(getReservedSavingsTotal(movements), 450);
    assert.equal(getReservedSavingsTotal(movements, "bank"), 400);
    assert.equal(getGoalReserveBalance(movements, "g1", "bank"), 400);
});

test("tracked transfer balance is scoped to goal and savings account", () => {
    assert.equal(getGoalTransferBalance(movements, "g1", "save"), 220);
});

test("available cash excludes savings accounts and reserved allocations", () => {
    const accounts = [
        { id: "bank", account_type: "bank" },
        { id: "wallet", account_type: "e_wallet" },
        { id: "save", account_type: "savings" },
        { id: "card", account_type: "credit_card" }
    ];
    const balances = { bank: 2500, wallet: 500, save: 1200, card: -200 };

    assert.equal(
        getAvailableCash(accounts, id => balances[id], movements),
        2550
    );
});
