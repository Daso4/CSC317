
const displayElement = document.getElementById('display')

const numButtons = document.querySelectorAll('#grid .num')
const miscButtons = document.querySelectorAll('#grid .misc')
const opButtons = document.querySelectorAll('#grid .operation')

let firstOp = null;
let operator = null;
let waitSecondOp = false;
let hasTyped = false;

/* ==== 0-9 Button Mapping ==== */
numButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const clickedNumber = event.currentTarget.textContent.trim();
    numLogic(clickedNumber);
  });
});

/* ==== Operator Button Mapping (+,-,/,*) ==== */
opButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const symbol = event.currentTarget.textContent.trim();
    const currentValue = parseFloat(displayElement.textContent);

    opLogic(symbol, currentValue);
  });
});

/* ==== Miscellaneous Button Mapping (%,.,+/-) ==== */
miscButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const symbol = event.currentTarget.textContent.trim();

    miscLogic(symbol);
  });
});

/* ==== Keyboard Button Mapping ==== */
window.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key >= '0' && key <= '9') {
    numLogic(key);
  }
  if (key === '*' || key === '/' || key === '-' || key === '+' || key === 'x' || key === 'X' || key === 'Enter') {
    const shown = displayElement.textContent;
    const currentValue = parseFloat(shown);
    let symbol = key;

    if (key === '*' || key === 'x') {
      symbol = 'X';
    }
    if (key === 'Enter') {
      symbol = '=';
    }

    opLogic(symbol, currentValue);
  }
  if (key === 'Escape' || key === 'c' || key === 'C' || key === '.' || key === '%') {
    let symbol = key;

    if (key === 'Escape' || key === 'c') {
      symbol = 'C';
    }

    miscLogic(symbol);
  }

});

/* ==== 0-9 Button Logic ==== */
function numLogic(clickedNumber) {
  const shown = displayElement.textContent.trim();

  if (waitSecondOp) {
    displayElement.textContent = clickedNumber;
    waitSecondOp = false;
    hasTyped = true;
    return;
  }

  if (shown === '0') {
    displayElement.textContent = clickedNumber;
  } else {
    displayElement.textContent += clickedNumber;
  }
  hasTyped = true;
}

/* ==== Miscellaneous Logic ==== */
function miscLogic(symbol) {
  const shown = displayElement.textContent;

  if (symbol === 'C') {
    displayElement.textContent = '0';
    firstOp = null;
    operator = null;
    waitSecondOp = false;
    hasTyped = false;
    return;
  }

  if (symbol === '.') {
    if (waitSecondOp) {
      displayElement.textContent = '0.';
      waitSecondOp = false;
      hasTyped = true;
      return;
    }

    if (!displayElement.textContent.includes('.')) {
      displayElement.textContent += '.';
      hasTyped = true;
    }
    return;
  }

  if (symbol === '%') {
    displayElement.textContent = String(parseFloat(displayElement.textContent) / 100);
  }

  if (symbol === '+/-') {

    if (shown === '0' || shown === 'Error') {
      return;
    }
    if (shown.startsWith('-')) {
      displayElement.textContent = shown.slice(1);
    } else {
      displayElement.textContent = '-' + shown;
    }
    return;
  }
}

/* ==== Operation Logic (+, -, /, *) ==== */
function opLogic(symbol, currentValue) {

  const shownDisplay = displayElement.textContent.trim();

  if (symbol !== '=' && firstOp === null && !hasTyped && shownDisplay === '0') {
    return;
  }

  if (symbol === '=') {
    if (firstOp !== null && operator !== null && !waitSecondOp) {
      const result = math(firstOp, operator, currentValue);
      displayElement.textContent = String(result);
      firstOp = result;
      operator = null;
      waitSecondOp = true;
    }
    return;
  }
  if (firstOp === null) {
    firstOp = currentValue;
    operator = symbol;
    waitSecondOp = true;
  } else if (!waitSecondOp) {
    const result = math(firstOp, operator, currentValue);
    displayElement.textContent = String(result);
    firstOp = result;
    operator = symbol;
    waitSecondOp = true;
  } else {
    operator = symbol;
  }
}

/* ==== Calculations ==== */
function math(a, op, b) {
  if (op === '+') {
    return a + b;
  } if (op === '-') {
    return a - b;
  } if (op === 'X') {
    return a * b;
  } if (op === '/') {
    if (b === 0) {
      displayElement.textContent = 'Error';
      return 0;
    }
    return a / b;
  }
  return b;
}
