// ========================================
// Calculator Elements
// ========================================

const display = document.getElementById("display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const decimalButton = document.querySelector(".decimal");
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const equalsButton = document.getElementById("equals");


// ========================================
// Calculator State
// ========================================

let currentInput = "0";
let previousInput = "";
let currentOperator = null;
let shouldResetDisplay = false;


// ========================================
// Display
// ========================================

function updateDisplay() {
    display.value = currentInput;
}


// ========================================
// Number Input
// ========================================

numberButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const number = button.dataset.number;

        if (currentInput === "0" || shouldResetDisplay) {

            currentInput = number;
            shouldResetDisplay = false;

        } else {

            currentInput += number;

        }

        updateDisplay();

    });

});


// ========================================
// Decimal Input
// ========================================

decimalButton.addEventListener("click", function() {

    if (shouldResetDisplay) {

        currentInput = "0.";
        shouldResetDisplay = false;

    } else if (!currentInput.includes(".")) {

        currentInput += ".";

    }

    updateDisplay();

});


// ========================================
// Operators
// ========================================

operatorButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const operator = button.dataset.operator;

        // Change the pending operator
        if (shouldResetDisplay) {

            currentOperator = operator;
            return;

        }

        // Calculate the previous operation
        if (currentOperator !== null) {

            calculateResult();

        }

        previousInput = currentInput;
        currentOperator = operator;
        shouldResetDisplay = true;

    });

});


// ========================================
// Calculate Result
// ========================================

function calculateResult() {

    // Prevent incomplete calculations
    if (
        previousInput === "" ||
        currentOperator === null ||
        shouldResetDisplay
    ) {
        return;
    }

    const previous = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    // Validate numbers
    if (Number.isNaN(previous) || Number.isNaN(current)) {
        return;
    }

    let result;

    switch (currentOperator) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {

                currentInput = "Error: Cannot divide by 0";

                updateDisplay();

                previousInput = "";
                currentOperator = null;
                shouldResetDisplay = true;

                return;
            }

            result = previous / current;
            break;

        default:
            return;
    }

    // Handle floating-point precision
    if (Number.isInteger(result)) {

        currentInput = String(result);

    } else {

        currentInput = String(
            parseFloat(result.toFixed(10))
        );

    }

    previousInput = "";
    currentOperator = null;
    shouldResetDisplay = true;

    updateDisplay();

}


// ========================================
// Clear
// ========================================

clearButton.addEventListener("click", function() {

    currentInput = "0";
    previousInput = "";
    currentOperator = null;
    shouldResetDisplay = false;

    updateDisplay();

});


// ========================================
// Delete / Backspace
// ========================================

deleteButton.addEventListener("click", function() {

    // Recover from an error
    if (currentInput.startsWith("Error")) {

        currentInput = "0";
        previousInput = "";
        currentOperator = null;
        shouldResetDisplay = false;

    }

    // Remove completed result
    else if (shouldResetDisplay) {

        currentInput = "0";
        shouldResetDisplay = false;

    }

    // Remove last character
    else if (currentInput.length > 1) {

        currentInput = currentInput.slice(0, -1);

    }

    // Prevent an empty display
    else {

        currentInput = "0";

    }

    updateDisplay();

});


// ========================================
// Equals
// ========================================

equalsButton.addEventListener("click", function() {

    calculateResult();

});


// ========================================
// Initialize Calculator
// ========================================

updateDisplay();

// ========================================
// Keyboard Support
// ========================================

document.addEventListener("keydown", function(event) {

    const key = event.key;

    // Numbers
    if (key >= "0" && key <= "9") {

        document
            .querySelector(`[data-number="${key}"]`)
            .click();

    }

    // Decimal point
    else if (key === ".") {

        decimalButton.click();

    }

    // Operators
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        const operatorButton = document.querySelector(
            `[data-operator="${key}"]`
        );

        if (operatorButton) {
            operatorButton.click();
        }

    }

    // Equals
    else if (key === "Enter" || key === "=") {

        equalsButton.click();

    }

    // Backspace
    else if (key === "Backspace") {

        deleteButton.click();

    }

    // Escape = Clear
    else if (key === "Escape") {

        clearButton.click();

    }

});
