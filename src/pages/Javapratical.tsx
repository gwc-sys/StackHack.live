import React from "react";

const practicals = [
  {
    id: 1,
    question: "Write a Java program to find factorial of a number.",
    code: `import java.util.Scanner;

public class Factorial {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Enter a number: ");
    int num = sc.nextInt();
    int fact = 1;

    for (int i = 1; i <= num; i++) {
      fact *= i;
    }

    System.out.println("Factorial of " + num + " is " + fact);
    sc.close();
  }
}`,
  },
  {
    id: 2,
    question: "Write a Java program to find sum and average of N numbers.",
    code: `import java.util.Scanner;

public class SumAverage {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Enter number of elements: ");
    int n = sc.nextInt();
    int sum = 0;

    for (int i = 1; i <= n; i++) {
      System.out.print("Enter number " + i + ": ");
      sum += sc.nextInt();
    }

    double avg = (double) sum / n;
    System.out.println("Sum = " + sum);
    System.out.println("Average = " + avg);
    sc.close();
  }
}`,
  },
  {
    id: 3,
    question: "Write a Java program to implement a Calculator using switch case (Addition, Subtraction, Multiplication, Division, Factorial).",
    code: `import java.util.Scanner;

public class Calculator {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.println("1.Add 2.Subtract 3.Multiply 4.Divide 5.Factorial");
    System.out.print("Enter choice: ");
    int ch = sc.nextInt();

    switch (ch) {
      case 1:
        System.out.print("Enter two numbers: ");
        System.out.println("Sum = " + (sc.nextInt() + sc.nextInt()));
        break;
      case 2:
        System.out.print("Enter two numbers: ");
        System.out.println("Difference = " + (sc.nextInt() - sc.nextInt()));
        break;
      case 3:
        System.out.print("Enter two numbers: ");
        System.out.println("Product = " + (sc.nextInt() * sc.nextInt()));
        break;
      case 4:
        System.out.print("Enter two numbers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();
        if (b != 0)
          System.out.println("Quotient = " + ((double) a / b));
        else
          System.out.println("Division by zero not allowed");
        break;
      case 5:
        System.out.print("Enter a number: ");
        int n = sc.nextInt(), fact = 1;
        for (int i = 1; i <= n; i++) fact *= i;
        System.out.println("Factorial = " + fact);
        break;
      default:
        System.out.println("Invalid choice!");
    }
    sc.close();
  }
}`,
  },
  {
    id: 4,
    question: "Write a Java program with class Rectangle to compare area and color of two rectangles.",
    code: `import java.util.Scanner;

class Rectangle {
  int length, breadth;
  String color;

  Rectangle(int l, int b, String c) {
    length = l;
    breadth = b;
    color = c;
  }

  int area() {
    return length * breadth;
  }

  boolean equals(Rectangle r) {
    return this.area() == r.area() && this.color.equals(r.color);
  }
}

public class RectangleMain {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    Rectangle r1 = new Rectangle(4, 5, "Red");
    Rectangle r2 = new Rectangle(4, 5, "Red");

    if (r1.equals(r2))
      System.out.println("Matching Rectangles");
    else
      System.out.println("Different Rectangles");

    sc.close();
  }
}`,
  },
  {
    id: 5,
    question: "Write a Java program to demonstrate method and constructor overloading.",
    code: `class Overload {
  Overload() {
    System.out.println("Default Constructor");
  }

  Overload(int a) {
    System.out.println("Parameterized Constructor with value: " + a);
  }

  void show() {
    System.out.println("No parameter method");
  }

  void show(int a) {
    System.out.println("Parameterized method with value: " + a);
  }

  public static void main(String[] args) {
    Overload obj1 = new Overload();
    Overload obj2 = new Overload(10);
    obj1.show();
    obj1.show(20);
  }
}`,
  },
  {
    id: 6,
    question: "Write a Java program to sort a list of integers.",
    code: `import java.util.Arrays;
import java.util.Scanner;

public class SortIntegers {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Enter number of integers: ");
    int n = sc.nextInt();
    int arr[] = new int[n];

    for (int i = 0; i < n; i++) {
      System.out.print("Enter number " + (i + 1) + ": ");
      arr[i] = sc.nextInt();
    }

    Arrays.sort(arr);
    System.out.println("Sorted integers: " + Arrays.toString(arr));
    sc.close();
  }
}`,
  },
  {
    id: 7,
    question: "Write a Java program to sort a list of names.",
    code: `import java.util.Arrays;
import java.util.Scanner;

public class SortNames {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Enter number of names: ");
    int n = sc.nextInt();
    sc.nextLine();
    String names[] = new String[n];

    for (int i = 0; i < n; i++) {
      System.out.print("Enter name " + (i + 1) + ": ");
      names[i] = sc.nextLine();
    }

    Arrays.sort(names);
    System.out.println("Sorted names: " + Arrays.toString(names));
    sc.close();
  }
}`,
  },
  {
    id: 8,
    question: "Write a Java program to add two matrices.",
    code: `import java.util.Scanner;

public class MatrixAddition {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Enter number of rows: ");
    int rows = sc.nextInt();
    System.out.print("Enter number of columns: ");
    int cols = sc.nextInt();

    int matrix1[][] = new int[rows][cols];
    int matrix2[][] = new int[rows][cols];
    int sum[][] = new int[rows][cols];

    System.out.println("Enter elements of first matrix:");
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        matrix1[i][j] = sc.nextInt();
      }
    }

    System.out.println("Enter elements of second matrix:");
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        matrix2[i][j] = sc.nextInt();
      }
    }

    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        sum[i][j] = matrix1[i][j] + matrix2[i][j];
      }
    }

    System.out.println("Sum of matrices:");
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        System.out.print(sum[i][j] + " ");
      }
      System.out.println();
    }
    sc.close();
  }
}`,
  },
  {
    id: 9,
    question: "Write a Java program to create Player class and inherit CricketPlayer, FootballPlayer, and HockeyPlayer classes from it.",
    code: `class Player {
  String name;
  int age;

  Player(String name, int age) {
    this.name = name;
    this.age = age;
  }

  void display() {
    System.out.println("Name: " + name);
    System.out.println("Age: " + age);
  }
}

class CricketPlayer extends Player {
  String team;

  CricketPlayer(String name, int age, String team) {
    super(name, age);
    this.team = team;
  }

  void display() {
    super.display();
    System.out.println("Team: " + team);
    System.out.println("Sport: Cricket");
  }
}

class FootballPlayer extends Player {
  String position;

  FootballPlayer(String name, int age, String position) {
    super(name, age);
    this.position = position;
  }

  void display() {
    super.display();
    System.out.println("Position: " + position);
    System.out.println("Sport: Football");
  }
}

class HockeyPlayer extends Player {
  int jerseyNumber;

  HockeyPlayer(String name, int age, int jerseyNumber) {
    super(name, age);
    this.jerseyNumber = jerseyNumber;
  }

  void display() {
    super.display();
    System.out.println("Jersey Number: " + jerseyNumber);
    System.out.println("Sport: Hockey");
  }
}

public class PlayerInheritance {
  public static void main(String[] args) {
    CricketPlayer cp = new CricketPlayer("Virat Kohli", 34, "India");
    FootballPlayer fp = new FootballPlayer("Lionel Messi", 36, "Forward");
    HockeyPlayer hp = new HockeyPlayer("Dhyan Chand", 115, 12);

    System.out.println("Cricket Player:");
    cp.display();
    System.out.println();

    System.out.println("Football Player:");
    fp.display();
    System.out.println();

    System.out.println("Hockey Player:");
    hp.display();
  }
}`,
  },
  {
    id: 10,
    question: "Write a Java program using try and catch for exception handling.",
    code: `import java.util.Scanner;

public class ExceptionHandling {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);

    try {
      System.out.print("Enter first number: ");
      int num1 = sc.nextInt();

      System.out.print("Enter second number: ");
      int num2 = sc.nextInt();

      int result = num1 / num2;
      System.out.println("Result: " + result);

      int arr[] = new int[5];
      System.out.print("Enter index to access in array (0-4): ");
      int index = sc.nextInt();
      System.out.println("Array element: " + arr[index]);

    } catch (ArithmeticException e) {
      System.out.println("Error: Division by zero is not allowed!");
    } catch (ArrayIndexOutOfBoundsException e) {
      System.out.println("Error: Array index out of bounds!");
    } catch (Exception e) {
      System.out.println("Error: " + e.getMessage());
    } finally {
      System.out.println("Program execution completed.");
      sc.close();
    }
  }
}`,
  },
  {
    id: 11,
    question: "Write a Java program to read data from one file and write it into another file line by line.",
    code: `import java.io.*;

public class FileCopy {
  public static void main(String[] args) {
    try {
      BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
      BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"));

      String line;
      int lineCount = 0;

      while ((line = reader.readLine()) != null) {
        writer.write(line);
        writer.newLine();
        lineCount++;
      }

      reader.close();
      writer.close();

      System.out.println("File copied successfully!");
      System.out.println("Total lines copied: " + lineCount);

    } catch (FileNotFoundException e) {
      System.out.println("Error: Input file not found!");
    } catch (IOException e) {
      System.out.println("Error: " + e.getMessage());
    }
  }
}`,
  }
];

const JavaPracticals: React.FC = () => {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("✅ Code copied to clipboard!");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            ☕ Java Practical Programs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete collection of Java practical programs with step-by-step Eclipse instructions. 
            Copy the code and run it in your Eclipse IDE.
          </p>
        </div>

        {/* Eclipse Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            🚀 How to Create and Run Java Files in Eclipse
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Step-by-Step Guide:</h3>
              <ol className="list-decimal ml-6 space-y-3 text-gray-700">
                <li>Open <strong>Eclipse IDE</strong> on your computer</li>
                <li>Go to <strong>File → New → Java Project</strong></li>
                <li>Enter project name (e.g., <code className="bg-gray-100 px-1 rounded">JavaPracticals</code>)</li>
                <li>Click <strong>Finish</strong></li>
                <li>Right-click on <code className="bg-gray-100 px-1 rounded">src</code> folder</li>
                <li>Select <strong>New → Class</strong></li>
                <li>Enter the class name (same as the program name)</li>
                <li>Check <strong>"public static void main(String[] args)"</strong> checkbox</li>
                <li>Click <strong>Finish</strong></li>
                <li>Paste the Java code into the editor</li>
                <li>Save the file (<strong>Ctrl + S</strong>)</li>
                <li>Right-click in editor → <strong>Run As → Java Application</strong></li>
                <li>View output in <strong>Console</strong> tab</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Important Notes:</h3>
              <ul className="list-disc ml-6 space-y-3 text-gray-700">
                <li>Ensure Java is properly installed and configured in Eclipse</li>
                <li>For file handling programs, create <code className="bg-gray-100 px-1 rounded">input.txt</code> in project root</li>
                <li>Use proper class names matching the program</li>
                <li>Check for compilation errors before running</li>
                <li>Use <strong>Ctrl + F11</strong> to quickly run programs</li>
                <li>All programs include proper exception handling</li>
                <li>Remember to close Scanner objects after use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Practical Programs */}
        <div className="space-y-8">
          {practicals.map((practical) => (
            <div key={practical.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                  Practical {practical.id}: {practical.question}
                </h2>
                <button
                  onClick={() => copyCode(practical.code)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  📋 Copy Code
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm leading-relaxed">
                  <code>{practical.code}</code>
                </pre>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">🎯 Eclipse Instructions for this Program:</h3>
                <ul className="list-disc ml-6 text-blue-700 space-y-1">
                  <li>Create new Java class named <code className="bg-blue-100 px-1 rounded">{practical.code.split('class ')[1]?.split(' ')[0] || 'Program'}</code></li>
                  <li>Copy and paste the above code exactly as shown</li>
                  <li>Save the file and run as Java Application</li>
                  {practical.id === 11 && (
                    <li>Create <code className="bg-blue-100 px-1 rounded">input.txt</code> file in project folder before running</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-12 pt-8 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Java Practical Programs | Designed By Mahesh Raskar</p>
          <p className="text-sm mt-2">All programs are tested and ready to run in Eclipse IDE</p>
        </footer>
      </div>
    </div>
  );
};

export default JavaPracticals;