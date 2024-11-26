let expression = "";
let displayExpression = "";

// Button Press
function press(value) {
  if (value === "(" && /\d$/.test(expression)) {
    expression += "*" + value;
    displayExpression += "*" + value;
  } else if (["sqr", "sqrt", "sin", "cos", "tan"].includes(value)) {
    expression += value;
    displayExpression += value + "(";
  } else {
    expression += value;
    displayExpression += value;
  }
  document.getElementById("display").value = displayExpression;
}

// Clear Display
function clearDisplay() {
  expression = "";
  displayExpression = "";
  document.getElementById("display").value = displayExpression;
}

// Calculate the Result
function calculate() {
  try {
    const result = evaluateExpression(expression);
    document.getElementById("display").value = result;
    expression = result.toString();
    displayExpression = result.toString();
  } catch (error) {
    document.getElementById("display").value = error.message || "Error";
  }
}

// Evaluate Expression
function evaluateExpression(expr) {
  while (expr.includes("(")) {
    const startIdx = expr.lastIndexOf("(");
    const endIdx = expr.indexOf(")", startIdx);

    if (endIdx === -1) throw new Error("Mismatched Parentheses");

    const innerExpr = expr.substring(startIdx + 1, endIdx);
    const innerResult = evaluateSimpleExpression(innerExpr);
    expr = expr.substring(0, startIdx) + innerResult + expr.substring(endIdx + 1);
  }
  return evaluateSimpleExpression(expr);
}

// Evaluate Simple Expression
function evaluateSimpleExpression(expr) {
  // Handle trigonometric functions and sqr/sqrt with logical calculations
  expr = expr.replace(/(sin|cos|tan|sqrt|sqr)\s*\(([^)]+)\)/g, (match, func, arg) => {
    const value = parseFloat(evaluateSimpleExpression(arg)); // Evaluate inner expression
    const radians = degreesToRadians(value);
    switch (func) {
      case "sin":
        return Math.sin(radians).toFixed(5);
      case "cos":
        return Math.cos(radians).toFixed(5);
      case "tan":
        if (Math.cos(radians) === 0) throw new Error("Undefined tan value");
        return Math.tan(radians).toFixed(5);
      case "sqrt":
        if (value < 0) throw new Error("Invalid input for sqrt");
        return Math.sqrt(value).toFixed(5);
      case "sqr":
        return Math.pow(value, 2).toFixed(5);
      default:
        throw new Error(`Unknown function: ${func}`);
    }
  });

  // Handle multiplication and division
  expr = expr.replace(/(-?\d+\.?\d*)\s*([*/])\s*(-?\d+\.?\d*)/g, (match, p1, operator, p2) => {
    const num1 = parseFloat(p1);
    const num2 = parseFloat(p2);
    if (operator === "*") return num1 * num2;
    if (operator === "/") {
      if (num2 === 0) throw new Error("Division by Zero");
      return num1 / num2;
    }
  });

  // Handle addition and subtraction
  expr = expr.replace(/(-?\d+\.?\d*)\s*([+-])\s*(-?\d+\.?\d*)/g, (match, p1, operator, p2) => {
    const num1 = parseFloat(p1);
    const num2 = parseFloat(p2);
    return operator === "+" ? num1 + num2 : num1 - num2;
  });

  return parseFloat(expr);
}

// Convert Degrees to Radians
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Validate Expression
function isInvalidExpression(expr) {
  if (/[+\-*/]{2,}/.test(expr)) return true;
  const openCount = (expr.match(/\(/g) || []).length;
  const closeCount = (expr.match(/\)/g) || []).length;
  if (openCount !== closeCount) return true;
  return false;
}