import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {

  state = [];
  displayResult: string = '';
  history = [];
  

  constructor() {}

  setResult(result: string) {
    let resultString = this.getHistoryString(this.history);

    let historyEl = document.getElementsByClassName('history-items');
    if (historyEl && historyEl.length) {
      historyEl[0].innerHTML = resultString;
    }
    
    this.displayResult = result;
    this.setResultScroll();
  }

  setState(newState: any[]) {
    this.state = newState;
  }

  addInState(item: any) {
    this.state.push(item);
  }

  popFromState() {
    this.state.pop();
  }

  setResultScroll() {
    let scrollEl = document.getElementsByClassName('displayResult');
    if (scrollEl && scrollEl.length) {
      scrollEl[0].scrollTo(0, scrollEl[0].scrollHeight);
    }
  }

  onMouseDown(className: string, input: any) {
    this.activateBtn(className);
    this.handleInput(input);
  }

  onMouseUp(className: string) {
    if (!['btn-div', 'btn-mul', 'btn-plus', 'btn-min'].includes(className)) {
      this.deActivateBtn(className);
    }
  }

  handleInput(input: any) {
    // if AC
    // if +/-
    // if %
    // if =
    // if .
    // if operator

    if (input === 'AC') {
      this.setState([]);
      this.history = [];
      this.setResult('');
      this.highlightActiveOperator(this.state);
      return;
    }

    if (input === 'C') {
      this.removeLastNumber(this.state);
      this.highlightActiveOperator(this.state);
      return;
    }

    if (input === '%') {
      this.applyPercentage();
      return;
    }

    this.addInState(input);

    this.checkOperatorChange(input, this.state);
    this.performOperation(this.state);
    let currentOperand: any = this.getCurrentOperand(this.state);

    if (currentOperand === 'Error') {
      this.setResult('Error');
      this.setState([]);
    } else {
      this.setResult(currentOperand);
    }

    this.highlightActiveOperator(this.state);

  }


  activateBtn(className: string) {

    let activeClass = '';
    if (this.isGreyBtn(className)) {
      activeClass = 'active-grey';
    }

    if (this.isOrangeBtn(className)) {
      activeClass = 'active-orange';
    }

    if (!this.isGreyBtn(className) && !this.isOrangeBtn(className)) {
      activeClass = 'active-black';
    }

    let btnEl = document.getElementsByClassName(className);
    if (btnEl && btnEl.length) {
      btnEl[0].classList.add(activeClass);
    }
  }


  deActivateBtn(className: string) {

    let activeClass = '';
    let animation = '';
    if (this.isGreyBtn(className)) {
      activeClass = 'active-grey';
      animation = 'clickEffectOnGrey 1s';
    }

    if (this.isOrangeBtn(className)) {
      activeClass = 'active-orange';
      animation = 'clickEffectOnOrange 1s';
    }

    if (!this.isGreyBtn(className) && !this.isOrangeBtn(className)) {
      activeClass = 'active-black';
      animation = 'clickEffectOnBlack 1s';
    }

    let btnEl = document.getElementsByClassName(className);
    btnEl[0].classList.remove(activeClass);
    btnEl[0]['style'].animation = animation;

    setTimeout(() => {
      if (btnEl && btnEl.length) {
        btnEl[0]['style'].animation = '';
      }
    }, 1000)
  }


  highlightActiveOperator(state: any[]) {
    let operators = [];
    state.forEach((itm, index) => {
      if (index !== 0 && (this.isOperator(itm) && itm !== '=')) {
        operators.push(itm);
      }
    });

    ['btn-div', 'btn-mul', 'btn-plus', 'btn-min'].forEach(classNam => {
      let btnEl = document.getElementsByClassName(classNam);
      if (btnEl && btnEl.length) {
        btnEl[0].classList.remove('active-orange');
      }
    })

    if (operators.length) {
      let className = '';
      if (operators[0] === '+') {
        className = 'btn-plus';
      } else if (operators[0] === '-') {
        className = 'btn-min';
      } else if (operators[0] === '*') {
        className = 'btn-mul';
      } else if (operators[0] === '/') {
        className = 'btn-div';
      }
      this.activateBtn(className);
    }
  }


  isGreyBtn(className: string) {
    return ['btn-ac', 'btn-plus-minus', 'btn-percent'].includes(className);
  }

  isOrangeBtn(className: string) {
    return ['btn-div', 'btn-mul', 'btn-plus', 'btn-min', 'btn-equal'].includes(className);
  }

  isNumber(input: any) {
    return !isNaN(input);
  }

  isOperator(input: any) {
    return ['+', '-', '/', '*'].includes(input);
  }
  
  getOperationResult(operand1: number, operator: string, operand2: number) {
    switch(operator) {

      case '+':
        return operand1 + operand2;

      case '-':
        return operand1 - operand2;

      case '/':
        return operand1 / operand2;

      case '*':
        return operand1 * operand2;
    }
  }

  checkOperatorChange(operator: any, state: any[]) {
    // if last 2 are both operators then keep last operator only
    if (state.length >= 2 
      && this.isOperator(state[state.length - 1])
      && this.isOperator(state[state.length - 2])) {
        this.popFromState();
        this.popFromState();
        this.addInState(operator);
      }
  }

  // if second operator is entered then perform operation and update state.
  performOperation(state: any[]) {
    let operators = [];
    state.forEach((itm, index) => {
      if (index !== 0 && (this.isOperator(itm) || itm === '=')) {
        operators.push(itm);
      }
    });
    
    if (operators.length > 1) {

      let operands = [];
      let result = 0;

      this.popFromState();
      
      if (state[0] === '-') {
        // first negative operand handling
        state[0] = 0;
        operands = state.join('').split(operators[0]);
        operands[0] = '-' + operands[0];
      } else {
        operands = state.join('').split(operators[0]);
      }
      
      result = this.getOperationResult(Number(operands[0]), operators[0], Number(operands[1]));

      this.history.push('=');
      this.history.push(Number(operands[0]));
      this.history.push(operators[0]);
      this.history.push(Number(operands[1]));

      if ([NaN, Infinity].includes(result)) {
        this.setState(['Error']);
      } else {
        result = this.getRoundedResult(result);
        let newState: any = result.toString().split('');
        newState = newState.map(itm => {
          return isNaN(itm) ? itm : Number(itm)
        });
        if (operators[1] !== '=') {
          newState.push(operators[1]);
        }

        this.setState(newState);
      }
      

      console.log(state);
    } else {
      if (state[state.length - 1] === '=') {
        this.popFromState();
      }
    }
    
  }


  applyPercentage() {
    this.handleInput('/');
    this.handleInput(1);
    this.handleInput(0);
    this.handleInput(0);
    this.handleInput('=');
  }


  removeLastNumber(state: any[]) {
    this.popFromState();
    let currentOperand: any = this.getCurrentOperand(this.state);
    this.setResult(currentOperand);
  }


  getCurrentOperand(stat: any[]): string {
    
    let result = '';
    let prefix = '';

    let state = JSON.parse(JSON.stringify(stat));

    if (state[0] === '-') {
      state.shift();
      prefix = '-';
    }
    
    if (state.indexOf('+') !== -1) {
      let operands = state.join('').split('+');
      result = operands[1].length ? operands[1] : prefix + operands[0];
    }else if (state.indexOf('-') !== -1) {
      let operands = state.join('').split('-');
      result = operands[1].length ? operands[1] : prefix + operands[0];
    } else if (state.indexOf('*') !== -1) {
      let operands = state.join('').split('*');
      result = operands[1].length ? operands[1] : prefix + operands[0];
    } else if (state.indexOf('/') !== -1) {
      let operands = state.join('').split('/');
      result = operands[1].length ? operands[1] : prefix + operands[0];
    } else {
      result = prefix + state.join('');
    }


    
    // this.setResult(result);
    console.log(this.state);
    return result;
  }


  getRoundedResult(result: number) {
    let roundedResult = result;
    if (typeof result === 'number' && result.toString().indexOf('.') !== -1) {
      let parts = result.toString().split('.');
      if (parts.length > 1 && parts[1].length > 8) {
        roundedResult = Number(result.toFixed(8).toString());
      }
    }
    return roundedResult;
  }

  getHistoryString(history: any[]) {
    let historyString = '';
    if (history.length) {
      history.forEach(itm => {
        historyString = historyString +  "<div style='font-size:5vw'>" + itm + "</div>";
      })
    }
    historyString = historyString +  "<div style='font-size:5vw;color:black;'>----------</div>";
    return historyString;
  }


}
