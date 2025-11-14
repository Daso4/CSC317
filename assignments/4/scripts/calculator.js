
const displayElement = document.getElementById('display')

const numButtons = document.querySelectorAll('#grid .num')
const miscButtons = document.querySelectorAll('#grid .misc')
const opButtons = document.querySelectorAll('#grid .operation')

    numButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const clickedNumber = event.currentTarget.textContent.trim();

            if (waitSecondOp) {
                displayElement.textContent = clickedNumber; // start fresh for 2nd operand
                waitSecondOp = false;
                return;
            }

            if (displayElement.textContent === '0'){
                displayElement.textContent = clickedNumber;
            } else {
                displayElement.textContent += clickedNumber;
            }
        });
    });

    
    let firstOp = null;
    let operator = null;
    let waitSecondOp = false;

    opButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const symbol = event.currentTarget.textContent.trim();
            const currentValue = parseFloat(displayElement.textContent);

            if (symbol === '='){
                if(firstOp !== null && operator !== null && !waitSecondOp){
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
            }else if(!waitSecondOp){
                const result = math(firstOp, operator, currentValue);
                displayElement.textContent = String(result);
                firstOp = result;
                operator = symbol;
                waitSecondOp = true;
            }else{
                operator = symbol;
            }
        });
    });

    function math(a, op, b){
        if(op === '+'){
            return a + b;
        }if(op === '-'){
            return a - b;
        }if(op === 'X'){
            return a * b;
        }if(op === '/'){
            if(b === 0){
                displayElement.textContent = 'Error';
                return 0;
            }
            return a / b;
        }
        return b;
    }
