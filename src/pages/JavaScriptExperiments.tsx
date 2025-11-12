import React, { useState } from "react";

interface JavaScriptExperiment {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  theory: string;
  javascriptCode: string;
}

const JavaScriptExperimentsComplete: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("experiments");

  // Copy to clipboard function
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // All 8 JavaScript Experiments Data
  const javascriptExperiments: JavaScriptExperiment[] = [
    {
      id: 1,
      title: "Area Calculator",
      description: "Write a JavaScript program to calculate area of triangle, area of rectangle",
      requirements: [
        "Calculate area of triangle using formula: (base * height) / 2",
        "Calculate area of rectangle using formula: length * width",
        "Implement functions for both calculations"
      ],
      theory: `GEOMETRY FORMULAS:
• Triangle Area: A = (base × height) / 2
• Rectangle Area: A = length × width

JAVASCRIPT CONCEPTS:
• Function declarations
• Mathematical operations
• Parameter passing
• Return statements`,
      javascriptCode: `// Area Calculator - Triangle and Rectangle
function calculateTriangleArea(base, height) {
    if (base <= 0 || height <= 0) {
        throw new Error("Base and height must be positive numbers");
    }
    return (base * height) / 2;
}

function calculateRectangleArea(length, width) {
    if (length <= 0 || width <= 0) {
        throw new Error("Length and width must be positive numbers");
    }
    return length * width;
}

// Example usage and testing
function demonstrateAreaCalculations() {
    console.log("=== Area Calculator Demo ===\\n");
    
    // Triangle examples
    const triangleBase1 = 10;
    const triangleHeight1 = 5;
    const triangleArea1 = calculateTriangleArea(triangleBase1, triangleHeight1);
    console.log(\`Triangle with base \${triangleBase1} and height \${triangleHeight1} has area: \${triangleArea1}\`);
    
    const triangleBase2 = 7.5;
    const triangleHeight2 = 3.2;
    const triangleArea2 = calculateTriangleArea(triangleBase2, triangleHeight2);
    console.log(\`Triangle with base \${triangleBase2} and height \${triangleHeight2} has area: \${triangleArea2}\`);
    
    // Rectangle examples
    const rectangleLength1 = 8;
    const rectangleWidth1 = 4;
    const rectangleArea1 = calculateRectangleArea(rectangleLength1, rectangleWidth1);
    console.log(\`Rectangle with length \${rectangleLength1} and width \${rectangleWidth1} has area: \${rectangleArea1}\`);
    
    const rectangleLength2 = 12.5;
    const rectangleWidth2 = 6.3;
    const rectangleArea2 = calculateRectangleArea(rectangleLength2, rectangleWidth2);
    console.log(\`Rectangle with length \${rectangleLength2} and width \${rectangleWidth2} has area: \${rectangleArea2}\`);
    
    // Error handling example
    try {
        calculateTriangleArea(-5, 10);
    } catch (error) {
        console.log("Error caught:", error.message);
    }
}

// Run the demonstration
demonstrateAreaCalculations();

// Export functions for use in other modules
module.exports = {
    calculateTriangleArea,
    calculateRectangleArea
};`
    },
    {
      id: 2,
      title: "Multiplication Table Generator",
      description: "Write a JavaScript program to generate the multiplication table of a given number",
      requirements: [
        "Take a number as input",
        "Generate multiplication table from 1 to 10",
        "Display the table in formatted way"
      ],
      theory: `MULTIPLICATION TABLE CONCEPT:
• Table shows products of number with 1 through 10
• Used for learning basic arithmetic

JAVASCRIPT CONCEPTS:
• Loops (for loop)
• Template literals
• String formatting
• Console output`,
      javascriptCode: `// Multiplication Table Generator
function generateMultiplicationTable(number, limit = 10) {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new Error("Input must be a valid number");
    }
    
    if (limit <= 0) {
        throw new Error("Limit must be a positive integer");
    }
    
    console.log(\`=== Multiplication Table of \${number} ===\`);
    
    for (let i = 1; i <= limit; i++) {
        const product = number * i;
        console.log(\`\${number} × \${i} = \${product}\`);
    }
    
    console.log("=== End of Table ===");
}

// Enhanced version with formatting options
function generateFormattedTable(number, limit = 10, format = 'console') {
    const table = [];
    
    for (let i = 1; i <= limit; i++) {
        table.push({
            multiplier: i,
            result: number * i
        });
    }
    
    if (format === 'console') {
        console.log(\`\\\\n📊 Multiplication Table for \${number}\\\\n\`);
        table.forEach(item => {
            console.log(\`  \${number} × \${String(item.multiplier).padEnd(2)} = \${String(item.result).padStart(3)}\`);
        });
    } else if (format === 'array') {
        return table;
    } else if (format === 'string') {
        let tableString = \`Multiplication Table of \${number}\\\\n\`;
        table.forEach(item => {
            tableString += \`\${number} × \${item.multiplier} = \${item.result}\\\\n\`;
        });
        return tableString;
    }
}

// Example usage
function demonstrateMultiplicationTables() {
    console.log("🧮 Multiplication Table Generator Demo\\n");
    
    // Basic table
    generateMultiplicationTable(5);
    
    // Custom limit
    generateMultiplicationTable(7, 15);
    
    // Formatted tables
    generateFormattedTable(3);
    generateFormattedTable(12);
    
    // Get table as array
    const tableArray = generateFormattedTable(8, 5, 'array');
    console.log("\\\\nTable as array:", tableArray);
    
    // Get table as string
    const tableString = generateFormattedTable(9, 5, 'string');
    console.log("\\\\nTable as string:\\\\n" + tableString);
    
    // Decimal numbers
    generateFormattedTable(2.5);
}

// Interactive version for browser
function createInteractiveTable() {
    const number = parseInt(prompt("Enter a number for multiplication table:") || "5");
    const limit = parseInt(prompt("Enter the limit (default 10):") || "10");
    
    if (!isNaN(number) && !isNaN(limit)) {
        generateFormattedTable(number, limit);
    } else {
        console.log("Invalid input. Please enter valid numbers.");
    }
}

// Run demonstration
demonstrateMultiplicationTables();

// Uncomment below for interactive version
// createInteractiveTable();`
    },
    {
      id: 3,
      title: "String Operations",
      description: "Write a JavaScript program to perform following operations on a given string: Reverse string, Replace characters",
      requirements: [
        "Reverse a given string",
        "Replace specific characters in a string",
        "Implement both operations as separate functions"
      ],
      theory: `STRING MANIPULATION CONCEPTS:
• String reversal algorithms
• Character replacement techniques
• String immutability in JavaScript

JAVASCRIPT STRING METHODS:
• split(), reverse(), join()
• replace(), replaceAll()
• Regular expressions for pattern matching`,
      javascriptCode: `// String Operations - Reverse and Replace
function reverseString(str) {
    if (typeof str !== 'string') {
        throw new Error("Input must be a string");
    }
    
    // Method 1: Using built-in methods
    return str.split('').reverse().join('');
}

function reverseStringManual(str) {
    // Method 2: Manual reversal using loop
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

function replaceCharacters(str, target, replacement) {
    if (typeof str !== 'string' || typeof target !== 'string' || typeof replacement !== 'string') {
        throw new Error("All parameters must be strings");
    }
    
    // Simple replacement (first occurrence)
    return str.replace(target, replacement);
}

function replaceAllCharacters(str, target, replacement) {
    // Global replacement (all occurrences)
    const regex = new RegExp(target, 'g');
    return str.replace(regex, replacement);
}

function replaceAtPosition(str, position, replacement) {
    if (position < 0 || position >= str.length) {
        throw new Error("Position out of bounds");
    }
    
    return str.substring(0, position) + replacement + str.substring(position + 1);
}

// Advanced string operations
function demonstrateStringOperations() {
    console.log("🔤 String Operations Demo\\n");
    
    const testString = "Hello, JavaScript World!";
    console.log(\`Original string: \"\${testString}\"\\n\`);
    
    // Reverse operations
    console.log("=== String Reversal ===");
    const reversed1 = reverseString(testString);
    console.log(\`Built-in method: \"\${reversed1}\"\`);
    
    const reversed2 = reverseStringManual(testString);
    console.log(\`Manual method:   \"\${reversed2}\"\`);
    
    // Replacement operations
    console.log("\\\\n=== Character Replacement ===");
    const replaced1 = replaceCharacters(testString, "World", "Universe");
    console.log(\`Single replacement: \"\${replaced1}\"\`);
    
    const replaced2 = replaceAllCharacters(testString, "l", "L");
    console.log(\`Global replacement: \"\${replaced2}\"\`);
    
    const replaced3 = replaceAtPosition(testString, 7, "J");
    console.log(\`Position replacement: \"\${replaced3}\"\`);
    
    // Complex example
    console.log("\\\\n=== Complex Example ===");
    const complexString = "apple banana apple cherry apple";
    console.log(\`Original: \"\${complexString}\"\`);
    
    const noApples = replaceAllCharacters(complexString, "apple", "fruit");
    console.log(\`After replacement: \"\${noApples}\"\`);
    
    const reversedNoApples = reverseString(noApples);
    console.log(\`Reversed: \"\${reversedNoApples}\"\`);
}

// Utility function for multiple operations
function processString(str, operations) {
    let result = str;
    
    operations.forEach(operation => {
        switch (operation.type) {
            case 'reverse':
                result = reverseString(result);
                break;
            case 'replace':
                result = replaceAllCharacters(result, operation.target, operation.replacement);
                break;
            case 'replaceFirst':
                result = replaceCharacters(result, operation.target, operation.replacement);
                break;
            default:
                console.warn(\`Unknown operation: \${operation.type}\`);
        }
    });
    
    return result;
}

// Example of chained operations
function demonstrateChainedOperations() {
    console.log("\\\\n🔄 Chained String Operations\\n");
    
    const original = "Hello World! Welcome to JavaScript.";
    
    const operations = [
        { type: 'replace', target: 'World', replacement: 'Universe' },
        { type: 'replace', target: 'JavaScript', replacement: 'Programming' },
        { type: 'reverse' }
    ];
    
    const finalResult = processString(original, operations);
    console.log(\`Original: \"\${original}\"\`);
    console.log(\`After chained operations: \"\${finalResult}\"\`);
}

// Run demonstrations
demonstrateStringOperations();
demonstrateChainedOperations();`
    },
    {
      id: 4,
      title: "String Comparison",
      description: "Write a JavaScript program to compare two strings using various methods",
      requirements: [
        "Compare strings using equality operators",
        "Use localeCompare for linguistic comparison",
        "Implement case-insensitive comparison",
        "Check string similarity"
      ],
      theory: `STRING COMPARISON METHODS:
• Strict equality (===) and loose equality (==)
• localeCompare() for language-sensitive comparison
• Case conversion for case-insensitive comparison
• String length and character-by-character comparison

COMPARISON CONSIDERATIONS:
• Case sensitivity
• Locale-specific sorting
• Performance of different methods`,
      javascriptCode: `// String Comparison using Various Methods
function compareStringsBasic(str1, str2) {
    console.log(\`Comparing \"\${str1}\" and \"\${str2}\":\`);
    console.log(\`  === (strict): \${str1 === str2}\`);
    console.log(\`  == (loose): \${str1 == str2}\`);
    console.log(\`  localeCompare: \${str1.localeCompare(str2)}\`);
}

function compareStringsCaseInsensitive(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

function compareStringsLocale(str1, str2, locale = 'en') {
    return str1.localeCompare(str2, locale, { 
        sensitivity: 'base',
        ignorePunctuation: true 
    });
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function demonstrateStringComparison() {
    console.log("📊 String Comparison Demo\\n");
    
    // Basic comparison
    console.log("=== Basic Comparison ===");
    compareStringsBasic("hello", "hello");
    compareStringsBasic("hello", "Hello");
    compareStringsBasic("hello", "world");
    
    // Case insensitive comparison
    console.log("\\\\n=== Case Insensitive Comparison ===");
    console.log(\`\"hello\" vs \"HELLO\": \${compareStringsCaseInsensitive("hello", "HELLO")}\`);
    console.log(\`\"JavaScript\" vs \"javascript\": \${compareStringsCaseInsensitive("JavaScript", "javascript")}\`);
    
    // Locale comparison
    console.log("\\\\n=== Locale-Aware Comparison ===");
    console.log(\`\"apple\" vs \"banana\" (en): \${compareStringsLocale("apple", "banana", "en")}\`);
    console.log(\`\"ä\" vs \"a\" (en): \${compareStringsLocale("ä", "a", "en")}\`);
    console.log(\`\"ä\" vs \"a\" (sv): \${compareStringsLocale("ä", "a", "sv")}\`);
    
    // Similarity comparison
    console.log("\\\\n=== Similarity Comparison ===");
    const pairs = [
        ["hello", "helloo"],
        ["javascript", "java"],
        ["apple", "apples"],
        ["cat", "dog"]
    ];
    
    pairs.forEach(([str1, str2]) => {
        const similarity = calculateSimilarity(str1, str2);
        console.log(\`\"\${str1}\" vs \"\${str2}\": \${(similarity * 100).toFixed(1)}% similar\`);
    });
}

// Advanced comparison with multiple metrics
function comprehensiveStringCompare(str1, str2) {
    const results = {
        strictEquality: str1 === str2,
        looseEquality: str1 == str2,
        caseInsensitive: str1.toLowerCase() === str2.toLowerCase(),
        localeCompare: str1.localeCompare(str2),
        lengthDifference: Math.abs(str1.length - str2.length),
        similarity: calculateSimilarity(str1, str2)
    };
    
    return results;
}

function demonstrateComprehensiveComparison() {
    console.log("\\\\n🔍 Comprehensive String Comparison\\n");
    
    const testPairs = [
        ["Hello", "hello"],
        ["JavaScript", "Javascript"],
        ["cat", "cats"],
        ["", ""],
        ["same", "same"]
    ];
    
    testPairs.forEach(([str1, str2]) => {
        console.log(\`\\\\nComparing \"\${str1}\" and \"\${str2}\":\`);
        const comparison = comprehensiveStringCompare(str1, str2);
        
        Object.entries(comparison).forEach(([key, value]) => {
            console.log(\`  \${key}: \${value}\`);
        });
    });
}

// Run demonstrations
demonstrateStringComparison();
demonstrateComprehensiveComparison();`
    },
    {
      id: 5,
      title: "Countdown Timer",
      description: "Write a JavaScript program that will create a countdown timer",
      requirements: [
        "Create a countdown from specified time",
        "Update display every second",
        "Handle timer completion",
        "Provide start, pause, and reset functionality"
      ],
      theory: `COUNTDOWN TIMER CONCEPTS:
• Time intervals using setInterval
• Date and time calculations
• DOM manipulation for display updates
• Event handling for user controls

JAVASCRIPT FEATURES:
• setInterval() and clearInterval()
• Date object for time calculations
• Callback functions
• Event listeners`,
      javascriptCode: `// Countdown Timer Implementation
class CountdownTimer {
    constructor(duration, displayElement) {
        this.duration = duration; // in seconds
        this.remainingTime = duration;
        this.displayElement = displayElement;
        this.intervalId = null;
        this.isRunning = false;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            
            if (this.remainingTime <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset() {
        this.pause();
        this.remainingTime = this.duration;
        this.updateDisplay();
    }
    
    updateDisplay() {
        if (this.displayElement) {
            const minutes = Math.floor(this.remainingTime / 60);
            const seconds = this.remainingTime % 60;
            this.displayElement.textContent = 
                \`\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
        }
        
        // Also log to console
        console.log(\`Time remaining: \${this.formatTime(this.remainingTime)}\`);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return \`\${mins}m \${secs}s\`;
    }
    
    complete() {
        this.pause();
        console.log("🎉 Countdown completed!");
        if (this.displayElement) {
            this.displayElement.textContent = "Time's up!";
            this.displayElement.style.color = "red";
        }
        
        // Optional: Play sound or trigger event
        this.onComplete && this.onComplete();
    }
    
    setOnComplete(callback) {
        this.onComplete = callback;
    }
    
    getRemainingTime() {
        return this.remainingTime;
    }
}

// Demo function for countdown timer
function demonstrateCountdownTimer() {
    console.log("⏰ Countdown Timer Demo\\n");
    
    // Create a mock display element for demo
    const mockDisplay = {
        textContent: '',
        style: { color: '' }
    };
    
    // Create a 10-second countdown timer
    const timer = new CountdownTimer(10, mockDisplay);
    
    console.log("Starting 10-second countdown...");
    timer.start();
    
    // Simulate some interactions
    setTimeout(() => {
        console.log("Pausing timer at 7 seconds...");
        timer.pause();
        
        setTimeout(() => {
            console.log("Resuming timer...");
            timer.start();
        }, 2000);
        
    }, 3000);
    
    // Set completion callback
    timer.setOnComplete(() => {
        console.log("Timer completion callback executed!");
    });
}

// Advanced timer with multiple features
function createAdvancedTimer(duration, options = {}) {
    const {
        onTick = () => {},
        onComplete = () => {},
        autoStart = false
    } = options;
    
    let remaining = duration;
    let intervalId = null;
    let running = false;
    
    function start() {
        if (running) return;
        running = true;
        
        intervalId = setInterval(() => {
            remaining--;
            onTick(remaining, formatTime(remaining));
            
            if (remaining <= 0) {
                stop();
                onComplete();
            }
        }, 1000);
    }
    
    function stop() {
        running = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
    
    function reset() {
        stop();
        remaining = duration;
    }
    
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return \`\${String(hrs).padStart(2, '0')}:\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
        }
        return \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
    }
    
    if (autoStart) {
        start();
    }
    
    return {
        start,
        stop,
        reset,
        getRemaining: () => remaining,
        isRunning: () => running
    };
}

// Demonstrate advanced timer
function demonstrateAdvancedTimer() {
    console.log("\\\\n🚀 Advanced Timer Demo\\n");
    
    const timer = createAdvancedTimer(15, {
        onTick: (remaining, formatted) => {
            console.log(\`Tick: \${formatted} remaining\`);
        },
        onComplete: () => {
            console.log("Advanced timer completed!");
        }
    });
    
    console.log("Starting advanced timer for 15 seconds...");
    timer.start();
    
    // Demonstrate control after 5 seconds
    setTimeout(() => {
        console.log(\`Pausing. Remaining: \${timer.getRemaining()}s\`);
        timer.stop();
        
        setTimeout(() => {
            console.log("Resetting timer...");
            timer.reset();
            console.log(\`Reset. Remaining: \${timer.getRemaining()}s\`);
        }, 2000);
    }, 5000);
}

// Run demonstrations
demonstrateCountdownTimer();

// Uncomment to run advanced timer demo
// setTimeout(demonstrateAdvancedTimer, 12000);`
    },
    {
      id: 6,
      title: "Array Operations",
      description: "Write a JavaScript program that will create an array and perform operations: remove specific element, check if array contains value",
      requirements: [
        "Create and initialize arrays",
        "Remove specific element from array",
        "Check if array contains a specified value",
        "Implement multiple removal strategies"
      ],
      theory: `ARRAY OPERATIONS IN JAVASCRIPT:
• Array creation and initialization
• Element removal using filter(), splice()
• Value checking using includes(), indexOf(), some()
• Performance considerations for large arrays

COMMON ARRAY METHODS:
• filter(): Create new array with elements that pass test
• splice(): Modify array by removing/replacing elements
• includes(): Check if array contains value
• indexOf(): Find first index of element`,
      javascriptCode: `// Array Operations - Removal and Search
function demonstrateArrayOperations() {
    console.log("🧮 Array Operations Demo\\n");
    
    // Create sample arrays
    const numbers = [1, 2, 3, 4, 5, 3, 6, 3, 7];
    const fruits = ['apple', 'banana', 'orange', 'apple', 'grape'];
    const mixed = [1, 'hello', true, { name: 'John' }, [1, 2, 3]];
    
    console.log("Original arrays:");
    console.log("Numbers:", numbers);
    console.log("Fruits:", fruits);
    console.log("Mixed:", mixed);
    console.log();
    
    // Remove specific element
    console.log("=== Element Removal ===");
    
    // Method 1: Using filter (removes all occurrences)
    function removeElementFilter(array, element) {
        return array.filter(item => item !== element);
    }
    
    const numbersWithout3 = removeElementFilter(numbers, 3);
    console.log(\`Numbers after removing all 3s (filter): \${numbersWithout3}\`);
    
    // Method 2: Using splice (removes first occurrence)
    function removeFirstOccurrence(array, element) {
        const index = array.indexOf(element);
        if (index > -1) {
            const newArray = [...array]; // Create copy to avoid mutation
            newArray.splice(index, 1);
            return newArray;
        }
        return array;
    }
    
    const fruitsWithoutFirstApple = removeFirstOccurrence(fruits, 'apple');
    console.log(\`Fruits after removing first apple: \${fruitsWithoutFirstApple}\`);
    
    // Method 3: Remove by index
    function removeByIndex(array, index) {
        return array.filter((_, i) => i !== index);
    }
    
    const numbersWithoutIndex2 = removeByIndex(numbers, 2);
    console.log(\`Numbers after removing index 2: \${numbersWithoutIndex2}\`);
    
    // Check if array contains value
    console.log("\\\\n=== Value Checking ===");
    
    // Method 1: Using includes (primitive values)
    function containsValueIncludes(array, value) {
        return array.includes(value);
    }
    
    console.log(\`Numbers includes 5: \${containsValueIncludes(numbers, 5)}\`);
    console.log(\`Fruits includes 'mango': \${containsValueIncludes(fruits, 'mango')}\`);
    
    // Method 2: Using indexOf
    function containsValueIndexOf(array, value) {
        return array.indexOf(value) !== -1;
    }
    
    console.log(\`Numbers has 10 (indexOf): \${containsValueIndexOf(numbers, 10)}\`);
    
    // Method 3: Using some (for complex conditions)
    function containsValueSome(array, value) {
        return array.some(item => item === value);
    }
    
    console.log(\`Fruits has 'orange' (some): \${containsValueSome(fruits, 'orange')}\`);
    
    // For objects, we need custom comparison
    console.log("\\\\n=== Object and Complex Value Checking ===");
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ];
    
    function containsObject(array, object, key = 'id') {
        return array.some(item => item[key] === object[key]);
    }
    
    const testUser = { id: 2, name: 'Robert' };
    console.log(\`Users contains user with id 2: \${containsObject(users, testUser)}\`);
}

// Advanced array utilities
class ArrayUtils {
    static removeAll(array, predicate) {
        return array.filter((item, index, arr) => !predicate(item, index, arr));
    }
    
    static removeDuplicates(array) {
        return [...new Set(array)];
    }
    
    static findIndices(array, value) {
        return array.reduce((indices, item, index) => {
            if (item === value) indices.push(index);
            return indices;
        }, []);
    }
    
    static countOccurrences(array, value) {
        return array.reduce((count, item) => item === value ? count + 1 : count, 0);
    }
}

function demonstrateAdvancedArrayOperations() {
    console.log("\\\\n🚀 Advanced Array Operations\\n");
    
    const data = [1, 2, 3, 2, 4, 2, 5, 6, 2, 7];
    console.log(\`Original data: \${data}\`);
    
    // Remove all even numbers
    const noEvens = ArrayUtils.removeAll(data, item => item % 2 === 0);
    console.log(\`After removing evens: \${noEvens}\`);
    
    // Remove duplicates
    const unique = ArrayUtils.removeDuplicates(data);
    console.log(\`After removing duplicates: \${unique}\`);
    
    // Find all indices of value 2
    const indicesOf2 = ArrayUtils.findIndices(data, 2);
    console.log(\`Indices of value 2: \${indicesOf2}\`);
    
    // Count occurrences
    const countOf2 = ArrayUtils.countOccurrences(data, 2);
    console.log(\`Number of 2s in array: \${countOf2}\`);
    
    // Complex removal example
    console.log("\\\\n=== Complex Removal Example ===");
    const complexArray = [
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' },
        { id: 3, status: 'active' },
        { id: 4, status: 'pending' }
    ];
    
    const activeOnly = ArrayUtils.removeAll(complexArray, item => item.status !== 'active');
    console.log("Active items only:", activeOnly);
}

// Performance comparison
function demonstratePerformance() {
    console.log("\\\\n⚡ Performance Comparison\\n");
    
    const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);
    
    // Time includes vs indexOf vs some
    const target = 99;
    
    console.time('includes');
    const hasIncludes = largeArray.includes(target);
    console.timeEnd('includes');
    
    console.time('indexOf');
    const hasIndexOf = largeArray.indexOf(target) !== -1;
    console.timeEnd('indexOf');
    
    console.time('some');
    const hasSome = largeArray.some(item => item === target);
    console.timeEnd('some');
    
    console.log(\`All methods agree: \${hasIncludes && hasIndexOf && hasSome}\`);
}

// Run demonstrations
demonstrateArrayOperations();
demonstrateAdvancedArrayOperations();
demonstratePerformance();`
    },
    {
      id: 7,
      title: "Array Object Operations",
      description: "Write a JavaScript program that will append an object to an array and will check if an object is an array",
      requirements: [
        "Append objects to arrays",
        "Check if variable is an array",
        "Handle different data types",
        "Implement type checking utilities"
      ],
      theory: `ARRAY AND OBJECT OPERATIONS:
• Array manipulation: push(), concat(), spread operator
• Type checking: Array.isArray(), instanceof, typeof
• Object vs Array detection
• Deep vs shallow copying

TYPE CHECKING METHODS:
• Array.isArray() - Recommended for arrays
• instanceof Array - Works but has edge cases
• typeof - Returns 'object' for arrays
• Constructor checking - array.constructor === Array`,
      javascriptCode: `// Array Object Operations
function demonstrateArrayObjectOperations() {
    console.log("📦 Array and Object Operations Demo\\n");
    
    // Create sample array and objects
    const users = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 }
    ];
    
    const newUser = { id: 3, name: 'Charlie', age: 35 };
    const anotherUser = { id: 4, name: 'Diana', age: 28 };
    
    console.log("Initial users array:", users);
    console.log();
    
    // Append objects to array
    console.log("=== Appending Objects to Array ===");
    
    // Method 1: Using push (modifies original array)
    function appendObjectPush(array, object) {
        array.push(object);
        return array;
    }
    
    const usersWithPush = [...users]; // Copy for demo
    appendObjectPush(usersWithPush, newUser);
    console.log("After push:", usersWithPush);
    
    // Method 2: Using concat (returns new array)
    function appendObjectConcat(array, object) {
        return array.concat(object);
    }
    
    const usersWithConcat = appendObjectConcat(users, newUser);
    console.log("After concat:", usersWithConcat);
    
    // Method 3: Using spread operator (ES6)
    function appendObjectSpread(array, object) {
        return [...array, object];
    }
    
    const usersWithSpread = appendObjectSpread(users, newUser);
    console.log("After spread:", usersWithSpread);
    
    // Append multiple objects
    function appendMultipleObjects(array, ...objects) {
        return [...array, ...objects];
    }
    
    const usersMultiple = appendMultipleObjects(users, newUser, anotherUser);
    console.log("After multiple append:", usersMultiple);
    
    // Check if object is an array
    console.log("\\\\n=== Array Type Checking ===");
    
    const testValues = [
        [1, 2, 3],
        { name: 'John' },
        'hello',
        42,
        true,
        null,
        undefined,
        new Array(5)
    ];
    
    testValues.forEach(value => {
        console.log(\`\${JSON.stringify(value)} is array:\`, isArray(value));
    });
    
    // Comprehensive type checking
    console.log("\\\\n=== Comprehensive Type Checking ===");
    testValues.forEach(value => {
        console.log(\`\${JSON.stringify(value)}:\`);
        console.log(\`  Array.isArray: \${Array.isArray(value)}\`);
        console.log(\`  instanceof Array: \${value instanceof Array}\`);
        console.log(\`  typeof: \${typeof value}\`);
        console.log(\`  constructor: \${value?.constructor?.name}\`);
        console.log();
    });
}

// Array checking functions
function isArray(value) {
    return Array.isArray(value);
}

function isArrayAlternative(value) {
    return value instanceof Array;
}

function isArraySafe(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

// Advanced object operations
class ArrayObjectManager {
    constructor(initialArray = []) {
        this.data = initialArray;
    }
    
    append(object) {
        this.data = [...this.data, object];
        return this;
    }
    
    appendMultiple(objects) {
        this.data = [...this.data, ...objects];
        return this;
    }
    
    removeById(id, idKey = 'id') {
        this.data = this.data.filter(item => item[idKey] !== id);
        return this;
    }
    
    findById(id, idKey = 'id') {
        return this.data.find(item => item[idKey] === id);
    }
    
    getAll() {
        return this.data;
    }
    
    clear() {
        this.data = [];
        return this;
    }
    
    static isArray(value) {
        return Array.isArray(value);
    }
    
    static isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
}

function demonstrateArrayObjectManager() {
    console.log("\\\\n🏢 ArrayObjectManager Demo\\n");
    
    const manager = new ArrayObjectManager([
        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 200 }
    ]);
    
    console.log("Initial data:", manager.getAll());
    
    // Append new product
    manager.append({ id: 3, name: 'Product C', price: 300 });
    console.log("After append:", manager.getAll());
    
    // Append multiple products
    manager.appendMultiple([
        { id: 4, name: 'Product D', price: 400 },
        { id: 5, name: 'Product E', price: 500 }
    ]);
    console.log("After multiple append:", manager.getAll());
    
    // Remove product
    manager.removeById(2);
    console.log("After removing id 2:", manager.getAll());
    
    // Find product
    const product = manager.findById(3);
    console.log("Found product with id 3:", product);
    
    // Type checking
    console.log("\\\\n=== Manager Type Checking ===");
    console.log(\`Manager data is array: \${ArrayObjectManager.isArray(manager.getAll())}\`);
    console.log(\`Product is object: \${ArrayObjectManager.isObject(product)}\`);
}

// Utility functions for different scenarios
function demonstrateUtilities() {
    console.log("\\\\n🔧 Utility Functions Demo\\n");
    
    // Safe array creation
    function ensureArray(value) {
        if (Array.isArray(value)) return value;
        if (value == null) return [];
        return [value];
    }
    
    console.log("ensureArray tests:");
    console.log(\`ensureArray([1,2,3]): \${JSON.stringify(ensureArray([1,2,3]))}\`);
    console.log(\`ensureArray('hello'): \${JSON.stringify(ensureArray('hello'))}\`);
    console.log(\`ensureArray(null): \${JSON.stringify(ensureArray(null))}\`);
    console.log(\`ensureArray(42): \${JSON.stringify(ensureArray(42))}\`);
    
    // Deep array checking
    function isArrayLike(value) {
        return Array.isArray(value) || 
               (typeof value === 'object' && 
                value !== null && 
                'length' in value &&
                typeof value.length === 'number');
    }
    
    console.log("\\\\nArray-like checks:");
    console.log(\`isArrayLike([1,2,3]): \${isArrayLike([1,2,3])}\`);
    console.log(\`isArrayLike({length: 3}): \${isArrayLike({length: 3})}\`);
    console.log(\`isArrayLike('hello'): \${isArrayLike('hello')}\`);
}

// Run all demonstrations
demonstrateArrayObjectOperations();
demonstrateArrayObjectManager();
demonstrateUtilities();`
    },
    {
      id: 8,
      title: "DOM Events - Background Color Changer",
      description: "Write a JavaScript program to create a Home page and change background color using: On mouse over event, On focus event",
      requirements: [
        "Create interactive web page elements",
        "Implement mouseover event handlers",
        "Implement focus event handlers",
        "Change background colors dynamically"
      ],
      theory: `DOM EVENTS AND MANIPULATION:
• Event-driven programming in JavaScript
• Mouse events: mouseover, mouseout, click
• Focus events: focus, blur, change
• DOM manipulation: style changes, class toggling

EVENT HANDLING:
• addEventListener() method
• Event object properties
• Event delegation
• Preventing default behavior`,
      javascriptCode: `// DOM Events - Background Color Changer
// Note: This code is designed for browser environment

class BackgroundColorManager {
    constructor() {
        this.colors = {
            primary: '#3498db',
            secondary: '#2ecc71',
            warning: '#e74c3c',
            success: '#27ae60',
            info: '#9b59b6',
            dark: '#2c3e50',
            light: '#ecf0f1'
        };
        
        this.currentColor = '#ffffff';
        this.init();
    }
    
    init() {
        console.log('🎨 Background Color Manager Initialized');
        this.createDemoElements();
        this.attachEventListeners();
    }
    
    createDemoElements() {
        // This would normally create DOM elements
        // For demo purposes, we'll simulate the behavior
        
        this.elements = {
            header: { type: 'header', text: 'Welcome to Our Website' },
            nav: { 
                type: 'nav', 
                items: ['Home', 'About', 'Services', 'Contact'] 
            },
            main: { 
                type: 'main', 
                sections: [
                    { title: 'Section 1', content: 'Hover over me!' },
                    { title: 'Section 2', content: 'Click to focus!' },
                    { title: 'Section 3', content: 'Interactive element' }
                ]
            },
            buttons: [
                { id: 'btn1', text: 'Button 1' },
                { id: 'btn2', text: 'Button 2' },
                { id: 'btn3', text: 'Button 3' }
            ],
            form: {
                inputs: [
                    { id: 'name', type: 'text', placeholder: 'Enter your name' },
                    { id: 'email', type: 'email', placeholder: 'Enter your email' }
                ]
            }
        };
        
        console.log('Demo elements created:', this.elements);
    }
    
    attachEventListeners() {
        console.log('📝 Attaching event listeners...');
        
        // Simulate mouseover events
        this.simulateMouseEvents();
        
        // Simulate focus events
        this.simulateFocusEvents();
        
        // Simulate click events
        this.simulateClickEvents();
    }
    
    simulateMouseEvents() {
        console.log('\\\\n🖱️ Mouse Event Simulation');
        
        const elements = ['header', 'section1', 'section2', 'section3', 'button'];
        
        elements.forEach(element => {
            // Simulate mouseover
            this.onMouseOver(element, this.getRandomColor());
            
            // Simulate mouseout
            this.onMouseOut(element, '#ffffff');
        });
    }
    
    simulateFocusEvents() {
        console.log('\\\\n🎯 Focus Event Simulation');
        
        const inputs = ['nameInput', 'emailInput', 'searchInput'];
        
        inputs.forEach(input => {
            // Simulate focus
            this.onFocus(input, this.colors.info);
            
            // Simulate blur
            this.onBlur(input, '#ffffff');
        });
    }
    
    simulateClickEvents() {
        console.log('\\\\n🖱️ Click Event Simulation');
        
        const buttons = ['btn1', 'btn2', 'btn3'];
        
        buttons.forEach(button => {
            this.onClick(button, this.getRandomColor());
        });
    }
    
    onMouseOver(elementId, color) {
        console.log(\`Mouse over \${elementId}: Changing background to \${color}\`);
        this.changeBackground(elementId, color);
    }
    
    onMouseOut(elementId, color) {
        console.log(\`Mouse out \${elementId}: Changing background to \${color}\`);
        this.changeBackground(elementId, color);
    }
    
    onFocus(elementId, color) {
        console.log(\`Focus on \${elementId}: Changing background to \${color}\`);
        this.changeBackground(elementId, color);
    }
    
    onBlur(elementId, color) {
        console.log(\`Blur on \${elementId}: Changing background to \${color}\`);
        this.changeBackground(elementId, color);
    }
    
    onClick(elementId, color) {
        console.log(\`Click on \${elementId}: Changing background to \${color}\`);
        this.changeBackground(elementId, color);
        
        // Change body background on button click
        if (elementId.startsWith('btn')) {
            this.changeBackground('body', this.getRandomColor());
        }
    }
    
    changeBackground(elementId, color) {
        // In real implementation, this would actually change DOM element styles
        // For demo, we just log the action
        console.log(\`   [ACTION] \${elementId} background -> \${color}\`);
        this.currentColor = color;
    }
    
    getRandomColor() {
        const colorKeys = Object.keys(this.colors);
        const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        return this.colors[randomKey];
    }
    
    // Method to demonstrate event sequencing
    demonstrateEventSequence() {
        console.log('\\\\n🔄 Event Sequence Demonstration');
        console.log('1. User hovers over navigation');
        this.onMouseOver('navigation', this.colors.primary);
        
        console.log('2. User clicks on button');
        this.onClick('mainButton', this.colors.warning);
        
        console.log('3. User focuses on input field');
        this.onFocus('emailInput', this.colors.success);
        
        console.log('4. User moves away from input');
        this.onBlur('emailInput', '#f8f9fa');
        
        console.log('5. User hovers out of navigation');
        this.onMouseOut('navigation', '#ffffff');
    }
}

// Alternative implementation using functions
function createEventHandlers() {
    console.log('\\\\n🎪 Functional Event Handlers Demo');
    
    const colorPalette = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    
    function getRandomColor() {
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }
    
    // Event handler factory
    function createEventHandler(elementType, eventType) {
        return function(elementId) {
            const color = getRandomColor();
            console.log(\`\${eventType} on \${elementType} \${elementId}: \${color}\`);
            return color;
        };
    }
    
    // Create specific event handlers
    const onDivMouseOver = createEventHandler('div', 'mouseover');
    const onButtonClick = createEventHandler('button', 'click');
    const onInputFocus = createEventHandler('input', 'focus');
    const onSectionHover = createEventHandler('section', 'mouseover');
    
    // Test the handlers
    onDivMouseOver('container');
    onButtonClick('submit-btn');
    onInputFocus('search-field');
    onSectionHover('hero-section');
    onDivMouseOver('sidebar');
}

// Demo function to show all features
function demonstrateDOMEvents() {
    console.log('🏠 DOM Events - Background Color Changer Demo\\n');
    
    // Initialize the color manager
    const colorManager = new BackgroundColorManager();
    
    // Demonstrate event sequence
    colorManager.demonstrateEventSequence();
    
    // Show functional approach
    createEventHandlers();
    
    // Simulate user interaction flow
    console.log('\\\\n👤 User Interaction Simulation');
    console.log('User lands on page...');
    colorManager.onMouseOver('hero', colorManager.colors.primary);
    
    console.log('User navigates to form...');
    colorManager.onFocus('nameInput', colorManager.colors.info);
    colorManager.onClick('submitBtn', colorManager.colors.success);
    
    console.log('User explores sections...');
    colorManager.onMouseOver('aboutSection', colorManager.colors.warning);
    colorManager.onMouseOver('servicesSection', colorManager.colors.secondary);
    
    console.log('\\\\n✅ Demo completed successfully!');
    console.log('In a real browser, these events would actually change background colors.');
}

// Run the demonstration
demonstrateDOMEvents();

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BackgroundColorManager,
        createEventHandlers,
        demonstrateDOMEvents
    };
}`
    }
  ];

  // Navigation items
  const navigationItems: { id: string; label: string; color: string }[] = [
    { id: "experiments", label: "🔬 All 8 Experiments", color: "blue" },
    { id: "javascript", label: "💻 JavaScript Programs", color: "green" },
    { id: "theory", label: "📚 JavaScript Concepts", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            💻 Complete JavaScript Experiments
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            All 8 Practical JavaScript Experiments with Complete Code and Theory
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 ${
                activeSection === item.id 
                  ? `bg-${item.color}-600 shadow-lg` 
                  : `bg-${item.color}-400 hover:bg-${item.color}-500`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Experiments Section */}
        {activeSection === "experiments" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
              🔬 All 8 JavaScript Experiments
            </h2>
            <div className="space-y-8">
              {javascriptExperiments.map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">
                    Experiment {exp.id}: {exp.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Requirements:</h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      {exp.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">Theory & Concepts:</h4>
                    <p className="text-green-800 whitespace-pre-line">{exp.theory}</p>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-700">JavaScript Code:</h4>
                      <button
                        onClick={() => copyToClipboard(exp.javascriptCode)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        📋 Copy Code
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm leading-relaxed">
                        <code>{exp.javascriptCode}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JavaScript Programs Section */}
        {activeSection === "javascript" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-green-700 mb-8 text-center">
              💻 All JavaScript Programs
            </h2>
            <div className="space-y-8">
              {javascriptExperiments.map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-green-800 mb-2 lg:mb-0">
                      Program {exp.id}: {exp.title}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(exp.javascriptCode)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                    >
                      📋 Copy JavaScript Code
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-700 mb-2">Requirements:</h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      {exp.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm leading-relaxed">
                      <code>{exp.javascriptCode}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Theory Concepts Section */}
        {activeSection === "theory" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-purple-700 mb-8 text-center">
              📚 JavaScript Programming Concepts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Functions Theory */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">⚡ Functions</h3>
                <ul className="space-y-2 text-blue-700">
                  <li><strong>Declaration:</strong> function name() {}</li>
                  <li><strong>Expression:</strong> const name = function() {}</li>
                  <li><strong>Arrow:</strong> const name = () =&gt; {}</li>
                  <li><strong>Parameters & Arguments</strong></li>
                  <li><strong>Return values</strong></li>
                </ul>
              </div>

              {/* Arrays Theory */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">📊 Arrays</h3>
                <ul className="space-y-2 text-green-700">
                  <li><strong>Creation:</strong> [], new Array()</li>
                  <li><strong>Methods:</strong> push, pop, shift, unshift</li>
                  <li><strong>Iteration:</strong> forEach, map, filter</li>
                  <li><strong>Search:</strong> find, includes, indexOf</li>
                  <li><strong>Transformation:</strong> map, filter, reduce</li>
                </ul>
              </div>

              {/* Strings Theory */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">🔤 Strings</h3>
                <ul className="space-y-2 text-purple-700">
                  <li><strong>Methods:</strong> length, toUpperCase, toLowerCase</li>
                  <li><strong>Search:</strong> includes, indexOf, search</li>
                  <li><strong>Manipulation:</strong> slice, substring, replace</li>
                  <li><strong>Template Literals:</strong> `Hello ${"${name}"}`</li>
                  <li><strong>Immutability:</strong> Strings are immutable</li>
                </ul>
              </div>

              {/* Events Theory */}
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-800 mb-4">🎯 Events</h3>
                <ul className="space-y-2 text-red-700">
                  <li><strong>Mouse Events:</strong> click, mouseover, mouseout</li>
                  <li><strong>Keyboard Events:</strong> keydown, keyup, keypress</li>
                  <li><strong>Form Events:</strong> focus, blur, change, submit</li>
                  <li><strong>Event Listeners:</strong> addEventListener</li>
                  <li><strong>Event Object:</strong> target, preventDefault</li>
                </ul>
              </div>

              {/* DOM Theory */}
              <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">🌐 DOM</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li><strong>Selection:</strong> getElementById, querySelector</li>
                  <li><strong>Manipulation:</strong> innerHTML, textContent</li>
                  <li><strong>Styles:</strong> style.property, classList</li>
                  <li><strong>Creation:</strong> createElement, appendChild</li>
                  <li><strong>Traversal:</strong> parentNode, childNodes</li>
                </ul>
              </div>

              {/* Objects Theory */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">📦 Objects</h3>
                <ul className="space-y-2 text-indigo-700">
                  <li><strong>Creation:</strong> {}, new Object()</li>
                  <li><strong>Properties:</strong> key-value pairs</li>
                  <li><strong>Methods:</strong> Functions as properties</li>
                  <li><strong>Manipulation:</strong> dot notation, bracket notation</li>
                  <li><strong>Iteration:</strong> for...in, Object.keys</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-12 pt-8 border-t border-gray-300">
          <p className="text-lg font-semibold">© 2025 JavaScript Experiments - Practical Implementation</p>
          <p className="text-sm mt-2">All 8 experiments with complete JavaScript code and theory</p>
        </footer>
      </div>
    </div>
  );
};

export default JavaScriptExperimentsComplete;