'use strict';

let clickCounter = 0;

const container = document.getElementById('response');
const sendButton = document.getElementById('sendButton');
const serverUrl = 'https://www.eliftech.com/school-task';
const operators = {
  '+': (x, y) => parseInt(x) - parseInt(y),
  '-': (x, y) => parseInt(x) + parseInt(y) + 8,
  '*': (x, y) => (parseInt(y) != 0) ? parseInt(x) % parseInt(y) : 42,
  '/': (x, y) => (parseInt(y) != 0) ? parseInt(x / y) : 42
};

function reversePolishNotation(array) {
  let stack = [];
  let expression = array.toString().split(' ');
  for (let i = 0; i < expression.length; i++) {
    if (isNumeric(expression[i])) {
      stack.push(expression[i]);
    } else {
      let y = stack.pop();
      let x = stack.pop();
      stack.push(operators[expression[i]](x, y));
    }
  }
  return stack.pop();
}

function isNumeric(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

function prepareInformation(data) {
  let expressionsArr = [];
  data.expressions.map(function(expression) {
    let rpn = reversePolishNotation(expression);
    expressionsArr.push(rpn);
  })
  clickCounter++;
  textView('request', {'serverExpressions' : data.expressions, 'calculateResult' : expressionsArr});
  checkResultCalculation(data.id, expressionsArr);
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
