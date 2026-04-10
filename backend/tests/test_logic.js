const assert = require('assert');

// Simulate fine calculation logic from transactionController.js
function calculateFine(dueDateStr, returnDateStr) {
    const dueDate = new Date(dueDateStr);
    const returnDate = new Date(returnDateStr);

    if (returnDate > dueDate) {
        const diffTime = Math.abs(returnDate - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * 5;
    }
    return 0;
}

function resolveLoanPeriod(inputDays) {
    const allowed = [60, 90, 180];
    return allowed.includes(Number(inputDays)) ? Number(inputDays) : 90;
}

// Test cases
console.log('Running fine calculation tests...');

// Case 1: Returned on time
assert.strictEqual(calculateFine('2023-10-01', '2023-09-30'), 0);
assert.strictEqual(calculateFine('2023-10-01', '2023-10-01'), 0);

// Case 2: Returned 1 day late
assert.strictEqual(calculateFine('2023-10-01', '2023-10-02'), 5);

// Case 3: Returned 5 days late
assert.strictEqual(calculateFine('2023-10-01', '2023-10-06'), 25);

// Loan periods: only 60, 90, 180 are allowed
assert.strictEqual(resolveLoanPeriod(60), 60);
assert.strictEqual(resolveLoanPeriod(90), 90);
assert.strictEqual(resolveLoanPeriod(180), 180);
assert.strictEqual(resolveLoanPeriod(45), 90);

console.log('All fine calculation tests passed!');
