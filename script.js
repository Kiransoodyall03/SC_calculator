let expression = '';

// Button Press
function press(value) {
  if (value === '(' && /\d$/.test(expression)) {
    expression += '*' + value;
  } else {
    expression += value;
  }
  document.getElementById('display').value = expression;
}

// Clear Display
function clearDisplay() {
  expression = '';
  document.getElementById('display').value = expression;
}
function calculate() {
  try {
    if (isInvalidExpression(expression)) {
      throw new Error("Invalid Expression");
    }
    const result = evaluateExpression(expression);
    document.getElementById('display').value = result;
    expression = result.toString();
  } catch (error) {
    document.getElementById('display').value = error.message || 'Error';
  }
}

function evaluateExpression(expr) {
  while (expr.includes('(')) {
    const startIdx = expr.lastIndexOf('(');
    const endIdx = expr.indexOf(')', startIdx);

    if (endIdx === -1) throw new Error("Mismatched Parentheses");

    const innerExpr = expr.substring(startIdx + 1, endIdx);
    const innerResult = evaluateSimpleExpression(innerExpr);
    expr = expr.substring(0, startIdx) + innerResult + expr.substring(endIdx + 1);
  }
  return evaluateSimpleExpression(expr);
}
// Evaluate Simple Expression
function evaluateSimpleExpression(expr) {
  // Debug original expression
  console.log("Evaluating Expression:", expr);

  // Handle trigonometric functions with degrees
  expr = expr.replace(/(sin|cos|tan)\s*\(([^)]+)\)/g, (match, func, arg) => {
    const value = parseFloat(evaluateSimpleExpression(arg)); // Evaluate inner expression
    console.log(`Function: ${func}, Argument (Degrees): ${value}`);
    if (isNaN(value)) throw new Error(`Invalid argument for ${func}`);
    const radians = degreesToRadians(value); // Convert degrees to radians
    console.log(`Function: ${func}, Argument (Radians): ${radians}`);
    switch (func) {
      case 'sin': return Math.sin(radians);
      case 'cos': return Math.cos(radians);
      case 'tan': 
        if (Math.cos(radians) === 0) throw new Error("Undefined tan value");
        return Math.tan(radians);
      default: throw new Error(`Unknown function: ${func}`);
    }
  });

  // Debug intermediate expression
  console.log("After Trig Functions:", expr);

  // Handle multiplication and division
  expr = expr.replace(/(-?\d+\.?\d*)\s*([*/])\s*(-?\d+\.?\d*)/g, (match, p1, operator, p2) => {
    const num1 = parseFloat(p1);
    const num2 = parseFloat(p2);
    if (operator === '*') return num1 * num2;
    if (operator === '/') {
      if (num2 === 0) throw new Error("Division by Zero");
      return num1 / num2;
    }
  });

  // Debug after multiplication/division
  console.log("After Mul/Div:", expr);

  // Handle addition and subtraction
  expr = expr.replace(/(-?\d+\.?\d*)\s*([+-])\s*(-?\d+\.?\d*)/g, (match, p1, operator, p2) => {
    const num1 = parseFloat(p1);
    const num2 = parseFloat(p2);
    return operator === '+' ? num1 + num2 : num1 - num2;
  });

  // Debug final result
  console.log("After Add/Sub:", expr);

  return parseFloat(expr);
}


function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Validate Expression
function isInvalidExpression(expr) {
  if (/[^0-9+\-*/().\sincostansqrt]/.test(expr)) return true;
  if (/[+\-*/]{2,}/.test(expr)) return true;
  const openCount = (expr.match(/\(/g) || []).length;
  const closeCount = (expr.match(/\)/g) || []).length;
  if (openCount !== closeCount) return true;
  return false;
}