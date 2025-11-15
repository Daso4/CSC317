
    const displayElement = document.getElementById('display')

    const numButtons = document.querySelectorAll('#grid .num')
    const miscButtons = document.querySelectorAll('#grid .misc')
    const opButtons = document.querySelectorAll('#grid .operation')

    let firstOp = null;
    let operator = null;
    let waitSecondOp = false;

    numButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const clickedNumber = event.currentTarget.textContent.trim();
            numLogic(clickedNumber);
        });
    });

    opButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const symbol = event.currentTarget.textContent.trim();
            const currentValue = parseFloat(displayElement.textContent);

            opLogic(symbol, currentValue);
        });
    });
    miscButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const symbol = event.currentTarget.textContent.trim();

            miscLogic(symbol);
        });
    });

    window.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key>='0' && key <= '9'){
            numLogic(key);
        }
        if (key === '*' || key === '/' || key === '-' || key === '+' || key === 'x' || key === 'X' || key === 'Enter') {
            const shown = displayElement.textContent;
            const currentValue = parseFloat(shown);
            let symbol = key;

            if (key  === '*' || key === 'x' ){
                symbol = 'X';
            }
            if (key === 'Enter'){
                symbol = '=';
            }

            opLogic(symbol, currentValue);
        }
        if (key === 'Escape' || key === 'c' || key === 'C' || key === 'Enter' || key === '.' || key ==='%'){
            let symbol = key;

            if (key  === 'Escape' || key === 'c' ){
                symbol = 'C';
            }
            
            miscLogic(symbol);
        }

    });


    function numLogic(clickedNumber){
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
    }

    function miscLogic(symbol){
        const shown = displayElement.textContent;
        
        if (symbol === 'C'){
            displayElement.textContent = '0';
            firstOp = null;
            operator = null;
            waitSecondOp = false;
            return;
        }

        if (symbol === '.'){
            if(waitSecondOp){
                displayElement.textContent = '0.';
                waitSecondOp = false;
                return;
            }

            if (!displayElement.textContent.includes('.')){
                displayElement.textContent += '.';
            }
            return;
        }

        if (symbol === '%'){
            displayElement.textContent = String(parseFloat(displayElement.textContent) / 100);
        }

        if(symbol === '+/-'){

            if(shown === '0' || shown === 'Error'){
                return;
            }
            if (shown.startsWith('-')) {
                displayElement.textContent = shown.slice(1);
            }else{
                displayElement.textContent = '-' + shown;
            }
            return;
        }
    }

    function opLogic(symbol, currentValue){

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
    }

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
