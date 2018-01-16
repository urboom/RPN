const container = document.getElementById('response');
const sendButton = document.getElementById('sendButton');
const serverUrl = 'https://www.eliftech.com/school-task';
const operators = {
  '+': (x, y) => parseInt(x) - parseInt(y),
  '-': (x, y) => parseInt(x) + parseInt(y) + 8,
  '*': (x, y) => (parseInt(y) != 0) ? parseInt(x) % parseInt(y) : 42,
  '/': (x, y) => (parseInt(y) != 0) ? parseInt(x / y) : 42
};
let clickCounter = 0;

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
  clickCounter++;
  data.expressions.map(function(expression) {
    let rpn = reversePolishNotation(expression);
    expressionsArr.push(rpn);
  })
  container.innerHTML += `<p>Request: <span>${clickCounter}</span> </p>`;
  container.innerHTML += `<p>Expressions: <span>${data.expressions}</span></p>`;
  container.innerHTML += `<p>Calculation Result: <span>${expressionsArr}</span></p>`;
  checkResultCalculation(data.id, expressionsArr);
}

function getExpressions() {
  sendButton.innerText = 'Loading...';
  sendButton.setAttribute("disabled", "disabled");
  fetch(serverUrl).then((response) => response.json())
  .then(function(data) {
    let info = prepareInformation(data);
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
   container.innerHTML += `<p class="last">Passed: <span>${data.passed}</span></p>`;
   sendButton.innerText  = 'Send Request';
   sendButton.removeAttribute("disabled");
 });
}

sendButton.addEventListener('click', getExpressions);