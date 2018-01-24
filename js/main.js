'use strict';

let clickCounter = 0;

const container = document.getElementById('response');
const sendButton = document.getElementById('sendButton');
const serverUrl = 'https://www.eliftech.com/school-task';
const operators = {
  '+': (x, y) => parseInt(x) - parseInt(y),
  '-': (x, y) => parseInt(x) + parseInt(y) + 8,
  '*': (x, y) => (parseInt(y) != 0) ? ((x % y) + y) % y : 42,
  '/': (x, y) => (parseInt(y) != 0) ? Math.floor(x / y) : 42
};

function reversePolishNotation(array) {
  let stack = [];
  for (let i = 0; i < array.length; i++) {
      let expression = array[i].split(' ');
      for (let j = 0; j < expression.length; j++) {
          if (isNumeric(expression[j])) {
            stack.push(Number(expression[j]));             
          } else {
            let y = stack.pop();
            let x = stack.pop();
            stack.push(operators[expression[j]](x, y))
          }
      }
  }
  return stack;
}

function isNumeric(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

function prepareInformation(data) {
  let rpn = reversePolishNotation(data.expressions);
  clickCounter++;
  textView('request', {'serverExpressions' : data.expressions, 'calculateResult' : rpn});
  checkResultCalculation(data.id, rpn);
}

function getExpressions() {
  buttonView('disabled', 'Loading...');
  fetch(serverUrl).then((response) => response.json())
  .then(function(data) {
    prepareInformation(data);
  }).catch(function(error) {
    console.log(error);
  });
}

function checkResultCalculation(id, results) {
  let requestInfo = { "id": id, "results": results }
  fetch(serverUrl, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestInfo)
  })
  .then(response => response.json())
  .then(function(data) {
   textView('response', data.passed);
   buttonView('enabled', 'Send Request');
 });
}

function buttonView(state, text) {
  sendButton.innerText = text;
  switch(state) {
    case 'disabled':  
      sendButton.setAttribute("disabled", "disabled");
      break;
    case 'enabled':
      sendButton.removeAttribute("disabled");
      break;
  }
}

function textView(state, information) {
  switch(state) {
    case 'request':  
      container.innerHTML += `<p>Request: <span>${clickCounter}</span></p> 
      <p>Expressions: <span>${information.serverExpressions}</span></p>
      <p>Calculation Result: <span>${information.calculateResult}</span></p>`;
      break;
    case 'response':
      container.innerHTML += `<p class="last">Passed: <span>${information}</span></p>`;
      break;
  }
}

sendButton.addEventListener('click', getExpressions);
