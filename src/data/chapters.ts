// All study notes live here as plain data.
// A "section" is one block on the chapter page. It can be:
//   - plain text     -> { heading, content }
//   - an analogy     -> { heading, content, isAnalogy: true }  (rendered in a highlighted box)
//   - a bullet list   -> { heading, bullets: [...] }
//   - a code block    -> { heading, code: `...` }
// Mix and match freely. To add a chapter: append an object to CHAPTERS below.
//
// isBonus: true marks a chapter as extra/not on the official ICSE Class 10
// Computer Applications syllabus. Bonus chapters still show up in Study and
// can be marked done, but they should be EXCLUDED from the study/quiz
// progress percentage calculation in progress.ts - see APP_PLAN.md.
// Currently only "data-structures" (Stack & Queue) is bonus - that topic
// belongs to ISC Class 11/12 Computer Science, not the Class 10 board exam.

export type Section = {
  heading: string;
  content?: string;
  bullets?: string[];
  code?: string;
  isAnalogy?: boolean;
};

export type Chapter = {
  slug: string;
  title: string;
  emoji: string;
  estimatedMinutes: number;
  isBonus?: boolean;
  sections: Section[];
};

export const CHAPTERS: Chapter[] = [
  {
    slug: "oop-intro",
    title: "Introduction to OOP",
    emoji: "🧩",
    estimatedMinutes: 8,
    sections: [
      {
        heading: "What is OOP?",
        content:
          "OOP stands for Object Oriented Programming. Instead of writing one long list of instructions, we organise our program around 'objects' - things that have both data (information about them) and behaviour (things they can do). Think about a real classroom: every student has data (name, age, marks) and behaviour (they can study, submit homework, answer questions). OOP lets us model our code the same way real things work.",
      },
      {
        heading: "The Big Analogy",
        content:
          "A class is a cookie cutter. An object is the actual cookie. You can use one cookie cutter (class) to stamp out hundreds of cookies (objects) - they're all the same shape (same properties and abilities), but each one can have its own toppings (its own data, like a different name or different marks).",
        isAnalogy: true,
      },
      {
        heading: "The 4 Pillars of OOP",
        bullets: [
          "Encapsulation - wrapping data and the methods that work on that data into one single unit (a class), and hiding the internal details from outside",
          "Inheritance - a new class can reuse the properties and methods of an existing class, like a child inheriting traits from a parent",
          "Polymorphism - the same method name can behave differently depending on the situation (poly = many, morph = forms)",
          "Data Abstraction - showing only the essential features and hiding the complicated internal working (like driving a car without knowing how the engine works). Abstraction is about WHAT is shown; Encapsulation is about HOW it's bundled and protected - they're closely related but not identical",
        ],
      },
      {
        heading: "Procedure Oriented vs Object Oriented",
        bullets: [
          "Procedure-oriented programming (like plain C) focuses on a sequence of steps/functions - data and functions are separate",
          "Object-oriented programming bundles data and the functions that act on it together, inside objects",
        ],
      },
      {
        heading: "Key Terms to Remember",
        bullets: [
          "Class = the blueprint/template - it does not exist as a real thing by itself",
          "Object = an actual instance created from a class - this is the real thing",
          "State = the data an object holds (its variables)",
          "Behaviour = what an object can do (its methods)",
        ],
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Thinking a class itself holds real data - it doesn't, it's only a template. Data only exists once you create an object from it",
          "Mixing up 'class' and 'object' in exam answers - always double check which word the question is asking about",
          "Confusing Abstraction with Encapsulation - abstraction hides complexity from the USER, encapsulation protects data by bundling it inside the class",
        ],
      },
    ],
  },

  {
    slug: "java-intro",
    title: "Introduction to Java",
    emoji: "☕",
    estimatedMinutes: 8,
    sections: [
      {
        heading: "What is Java?",
        content:
          "Java is a programming language that is 'platform-independent' - a Java program can run on almost any device (Windows, Mac, Linux, mobile) without being rewritten. It does this using a two-step process: a compiler first converts your source code (.java file) into 'bytecode' (.class file), and then the Java Virtual Machine (JVM) on any device interprets that bytecode to actually run the program.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Bytecode is like a universal instruction sheet translated into a neutral language that any country's local translator can read aloud in their own tongue. You (the programmer) write the instructions once in Java. The compiler translates it into this universal 'bytecode' language. Then, no matter which device (country) runs it, that device's own JVM (local translator) reads the bytecode and carries out the instructions in a way that device understands. This is why Java is called 'Write Once, Run Anywhere'.",
        isAnalogy: true,
      },
      {
        heading: "Compiler vs Interpreter",
        bullets: [
          "Compiler - translates the entire program into bytecode at once, before running it (this is what javac does to your .java file)",
          "Interpreter - reads and executes the bytecode line by line while the program runs (this is what the JVM does)",
          "Java actually uses BOTH - compiled to bytecode first, then that bytecode is interpreted by the JVM",
          "JVM stands for Java Virtual Machine - it's the 'local translator' in the bytecode analogy above",
        ],
      },
      {
        heading: "Java Programming Using BlueJ",
        content:
          "BlueJ is a simple, beginner-friendly IDE (a program used to write and run other programs) designed for learning Java. Unlike more complex IDEs, BlueJ lets you visually create objects from a class and directly call their methods by clicking, without always needing to write a full 'main' method yourself - which makes it great for understanding how objects and classes actually work.",
      },
      {
        heading: "Basic Elements of Java Programs",
        bullets: [
          "Keywords - reserved words with special meaning (e.g. class, int, if, void) - cannot be used as variable names",
          "Identifiers - the names YOU choose for classes, variables, and methods",
          "Comments - notes for humans that Java ignores: // for a single line, /* ... */ for multiple lines",
          "Every statement in Java ends with a semicolon (;)",
          "Curly braces { } group together a block of code, like the body of a class or method",
        ],
      },
      {
        heading: "Output Statements",
        bullets: [
          "System.out.println(value) - prints the value AND moves to a new line afterwards",
          "System.out.print(value) - prints the value but stays on the SAME line for the next output",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `public class Main {
    public static void main(String[] args) {
        // This is a comment - Java ignores this line
        System.out.println("Hello, World!"); // prints and moves to a new line
        System.out.print("No new line here... ");
        System.out.print("so this continues on the same line");
    }
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Forgetting the semicolon (;) at the end of a statement - one of the most common beginner errors",
          "Java is case-sensitive - 'String' and 'string' are completely different; keywords like 'class' must be lowercase",
          "Confusing print() (stays on the same line) with println() (moves to a new line)",
          "Using a keyword (like 'class' or 'int') as a variable name - this causes a compile error",
        ],
      },
    ],
  },

  {
    slug: "data-types",
    title: "Values and Data Types",
    emoji: "🔢",
    estimatedMinutes: 9,
    sections: [
      {
        heading: "What is a Data Type?",
        content:
          "A data type tells Java what KIND of value a variable can hold, how much memory to set aside for it, and what operations are allowed on it. For example, you can do maths on an 'int', but not on a 'boolean' (true/false).",
      },
      {
        heading: "Primitive Data Types",
        bullets: [
          "int - whole numbers (e.g. 25, -10)",
          "double / float - decimal numbers (e.g. 3.14)",
          "char - a single character, written in single quotes (e.g. 'A')",
          "boolean - only true or false",
          "long - very large whole numbers",
          "byte / short - smaller whole numbers, used to save memory",
        ],
      },
      {
        heading: "Literals and Identifiers",
        bullets: [
          "Literal - a fixed value written directly in your code, e.g. 10, 'A', true, \"Hello\"",
          "Identifier - the name YOU give to a variable, method, or class, e.g. totalMarks, studentName",
          "Identifier rules: must start with a letter, underscore, or $ (not a digit); cannot use a Java keyword; case-sensitive (age and Age are different)",
        ],
      },
      {
        heading: "Memory Size of Data Types",
        content:
          "Every data type takes up a fixed amount of memory, measured in bytes. This matters for exam questions that ask how much total memory an array or variable occupies.",
      },
      {
        heading: "Bytes Per Data Type",
        bullets: [
          "byte - 1 byte",
          "char - 2 bytes",
          "short - 2 bytes",
          "int - 4 bytes",
          "float - 4 bytes",
          "long - 8 bytes",
          "double - 8 bytes",
          "1 byte = 8 bits, so a char (2 bytes) is 16 bits, and an int (4 bytes) is 32 bits",
          "For an array: total memory = (bytes per element) x (number of elements). A mixed-declaration double array like {2.5, 4.5, 5.5, 6.4} - where one value looks like a whole number - still stores EVERY element as a double (8 bytes each)",
        ],
      },
      {
        heading: "Escape Sequences",
        content:
          "An escape sequence is a special two-character code starting with a backslash (\\) that represents a character which would otherwise be tricky or impossible to type directly into a String - like a new line, a tab, or a quotation mark that would otherwise end the String early.",
      },
      {
        heading: "Escape Sequence Analogy",
        content:
          "The backslash is like a 'costume' worn by a character so it can sneak past a rule. Normally a double-quote (\") ends a String immediately - but wrapping it as \\\" tells Java 'this is just a character, not the end of the String', letting it pass through safely.",
        isAnalogy: true,
      },
      {
        heading: "Common Escape Sequences",
        bullets: [
          "\\n - moves to a new line",
          "\\t - inserts a tab space",
          "\\\" - prints an actual double-quote character inside a String",
          "\\\\ - prints an actual backslash character",
          "\\' - prints an actual single-quote character",
        ],
      },
      {
        heading: "Char Arithmetic - Using ASCII Values",
        content:
          "Every character in Java has a corresponding number behind the scenes, called its ASCII value (e.g. 'A' is 65, 'Z' is 90). Because of this, you can actually do arithmetic directly on a char - Java converts it to its ASCII number to perform the calculation, and the RESULT becomes an int, not a char.",
      },
      {
        heading: "Char Arithmetic Analogy",
        content:
          "Think of each letter as secretly wearing a name tag with a number on it (its ASCII code). When you 'add' to a letter, Java doesn't touch the letter itself - it just does maths on the number written on the tag, and hands you back that number.",
        isAnalogy: true,
      },
      {
        heading: "Important: char + int vs char + String",
        content:
          "This is a very easy trap to fall into. If BOTH sides of a '+' are char/int/numbers, Java does ASCII arithmetic and gives back a number. But if EITHER side is a String, Java switches to joining text together (concatenation) instead - the char just gets converted to its printed symbol, not its ASCII number.",
      },
      {
        heading: "Comparing the Two Behaviours",
        code: `System.out.println('A' + 1);        // 66  (int arithmetic: 65 + 1)
System.out.println('A' + "");       // A   (String concatenation - "" makes it a String context)
System.out.println("Grade: " + 'A'); // Grade: A  (concatenation, because "Grade: " is a String)
System.out.println('d' + '*' + 'a'); // an int - all three are chars, so this is pure ASCII arithmetic
System.out.println("d" + "*" + "a"); // d*a - all three are Strings, so this is concatenation`,
      },
      {
        heading: "Type Conversion",
        content:
          "Sometimes you need to convert a value from one data type to another. Java allows this in two ways: implicit conversion, which happens automatically, and explicit conversion (also called typecasting), which you must write yourself.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Implicit conversion is like pouring a small cup of water into a bigger jug - it just fits, automatically, with nothing lost. This happens when converting a SMALLER type into a LARGER one (like int into double). Explicit conversion is like pouring a big jug of water into a small cup - you have to do it carefully and on purpose, and some water might overflow and be lost. This happens when converting a LARGER type into a SMALLER one (like double into int), and you must manually typecast it.",
        isAnalogy: true,
      },
      {
        heading: "Key Points to Remember",
        bullets: [
          "Implicit (automatic) conversion - smaller type to larger type, e.g. int to double - safe, no data lost",
          "Explicit conversion (typecasting) - larger type to smaller type, e.g. double to int - written as (int) someDoubleValue",
          "Explicit conversion does NOT round the number - it simply cuts off (truncates) the decimal part",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `int wholeNumber = 10;
double decimalNumber = wholeNumber; // implicit - int fits into double automatically
System.out.println(decimalNumber);  // 10.0

double price = 9.99;
int roundedDown = (int) price;      // explicit - must typecast manually
System.out.println(roundedDown);    // 9, NOT 10 - the decimal part is simply cut off

// Char arithmetic - uses the ASCII value behind the scenes
System.out.println('Z' + 32);       // 122 (an int) - 'Z' is 90, so 90 + 32 = 122
char nextLetter = (char) ('A' + 1); // must typecast back to char to get 'B'
System.out.println(nextLetter);     // B

// Escape sequences
System.out.println("She said, \\"Hello!\\"");  // She said, "Hello!"
System.out.println("Line1\\nLine2");           // prints on two separate lines`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Assuming explicit typecasting rounds the number - it actually truncates (chops off) the decimal part completely, it does not round",
          "Trying to fit a larger type into a smaller type WITHOUT an explicit typecast - Java gives a compile error, since data could be lost",
          "Using a Java keyword or starting an identifier with a digit - both cause compile errors",
          "Forgetting that char + int gives back an int (the ASCII sum), NOT a char - you must explicitly typecast back to char if you want a letter result",
          "Writing a literal double-quote inside a String without escaping it as \\\" - this breaks the String and causes a compile error",
        ],
      },
    ],
  },

  {
    slug: "operators",
    title: "Operators in Java",
    emoji: "➗",
    estimatedMinutes: 9,
    sections: [
      {
        heading: "What is an Operator?",
        content:
          "An operator is a symbol that tells Java to perform a specific operation on one or more values (called operands) - like adding two numbers, or comparing whether one value is greater than another.",
      },
      {
        heading: "Types of Operators",
        bullets: [
          "Arithmetic - + - * / % (addition, subtraction, multiplication, division, modulus/remainder)",
          "Relational - == != < > <= >= (used to compare two values, result is always true or false)",
          "Logical - && (AND) || (OR) ! (NOT) - combine multiple true/false conditions",
          "Assignment - = += -= *= /= (assigns or updates a variable's value)",
          "Unary - operates on a single value, e.g. ++ (increment), -- (decrement), - (negation)",
        ],
      },
      {
        heading: "The Ternary (Conditional) Operator",
        content:
          "The ternary operator is a shortcut for a simple if-else statement, written in a single line: condition ? valueIfTrue : valueIfFalse. If the condition is true, the expression takes the first value; if false, it takes the second.",
      },
      {
        heading: "Ternary Operator Analogy",
        content:
          "A full if-else block is like reading a whole paragraph of instructions to make a simple decision. The ternary operator is like a road sign with just two arrows and one quick question printed on it - same decision, condensed into one glance instead of a paragraph.",
        isAnalogy: true,
      },
      {
        heading: "Quick Java Example",
        code: `int a = 10, b = 20;

// Ternary operator - finds the greater number in one line
int greater = (a > b) ? a : b;
System.out.println(greater); // 20

// Same logic using regular if-else, for comparison
int greater2;
if (a > b) {
    greater2 = a;
} else {
    greater2 = b;
}`,
      },
      {
        heading: "Increment/Decrement - Pre vs Post",
        bullets: [
          "++x (pre-increment) - increases x FIRST, then uses the new value",
          "x++ (post-increment) - uses the CURRENT value first, then increases x afterwards",
          "Same rule applies to -- (decrement)",
        ],
      },
      {
        heading: "Working Through a Compound Expression",
        content:
          "Exam questions often combine several increments/decrements in one line. Work through them ONE operator at a time, left to right, applying the pre/post rule to each piece before combining.",
      },
      {
        heading: "Worked Example",
        code: `int a = 7, b = 8, c = 2;
int x = a * b % (++c) + (++a) + (--b);

// Step by step:
// ++c runs first: c becomes 3, and 3 is used
// a * b % 3  ->  7 * 8 % 3  ->  56 % 3  ->  2
// ++a: a becomes 8, and 8 is used
// --b: b becomes 7, and 7 is used
// x = 2 + 8 + 7 = 17`,
      },
      {
        heading: "Integer Division Truncates",
        content:
          "When BOTH operands in a division are int (whole numbers), Java performs integer division - the result is always a whole number, with the decimal part simply thrown away (not rounded). This is different from array/String indexing truncation, but the same 'cut off, don't round' idea applies. To get a decimal answer, at least ONE operand must be a double.",
      },
      {
        heading: "Integer Division Example",
        code: `System.out.println(6 / 5);     // 1, NOT 1.2 - both operands are int
System.out.println(6.0 / 5);   // 1.2 - one operand is now a double
System.out.println(Math.pow(36, 6 / 5)); // 6/5 becomes 1 first, so this is Math.pow(36, 1) = 36.0`,
      },
      {
        heading: "The 'Accumulator' Variable",
        content:
          "An accumulator is a variable that appears on BOTH sides of an assignment, building up a running total step by step - like sum = sum + x; inside a loop. In an expression like c = c + (x * d + e);, 'c' is the accumulator, since it keeps adding to its own previous value.",
      },
      {
        heading: "Swapping Two Values Without a Third Variable",
        content:
          "Normally, swapping two variables needs a temporary third variable to hold one value while you overwrite it. There's a trick to do it with only the two original variables, using arithmetic that 'undoes' itself.",
      },
      {
        heading: "Swap Trick Example",
        code: `int x0 = 4, x1 = 8;

x0 = x0 * x1;   // x0 now holds the product of both original values
x1 = x0 / x1;   // dividing by the OLD x1 recovers the OLD x0 -> x1 becomes 4
x0 = x0 / x1;   // dividing by the NEW x1 (4) recovers the OLD x1 -> x0 becomes 8
// x0 is now 8, x1 is now 4 - swapped, with no third variable used`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Confusing = (assignment) with == (comparison) - a very common exam slip",
          "Mixing up pre-increment (++x) and post-increment (x++) - they give different results when used inside an expression, not just on their own line",
          "Forgetting operator precedence - multiplication/division happen before addition/subtraction unless parentheses say otherwise, just like in maths",
          "Forgetting that int / int always truncates to a whole number - a very common source of unexpected '0' or '1' answers",
        ],
      },
    ],
  },

  {
    slug: "classes-objects",
    title: "Classes & Objects",
    emoji: "🏗️",
    estimatedMinutes: 12,
    sections: [
      {
        heading: "What is a Class in Java?",
        content:
          "A class is defined using the keyword 'class'. Inside it, we write instance variables (the data every object of this class will have) and methods (the actions every object can perform). Nothing happens just by writing a class - it only becomes 'real' when you create an object from it using the 'new' keyword.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Think of a class as a car company's design blueprint for a model - say, the 'Tata Nexon' blueprint. Every actual Nexon built from that blueprint (every object) has the same features (four wheels, an engine, headlights), but each one can be a different colour or have a different registration number. The blueprint itself never drives on the road - only the actual cars do.",
        isAnalogy: true,
      },
      {
        heading: "Key Points to Remember",
        bullets: [
          "Instance variables store the data/state of an object - each object gets its own copy",
          "You create an object using the 'new' keyword: Student s1 = new Student();",
          "You access an object's variables and methods using the dot (.) operator: s1.name, s1.displayDetails()",
          "One class can be used to create as many objects as you want",
          "Each object's data is independent - changing s1's marks does not affect s2's marks",
        ],
      },
      {
        heading: "Access Specifiers - Who Can See What",
        content:
          "Access specifiers control which parts of your program can 'see' or use a class's variables and methods. Think of it like room access in a house: some rooms are open to any guest, some are family-only, and some are just for you.",
      },
      {
        heading: "The Access Specifier Analogy",
        content:
          "public is like your living room - anyone who visits the house can enter. private is like your personal diary - only you (the same class) can access it, nobody else, not even your own family (subclasses). protected is like a family locker - your own household AND your children (subclasses) can access it, but outside visitors cannot.",
        isAnalogy: true,
      },
      {
        heading: "The Three Access Specifiers",
        bullets: [
          "public - accessible from anywhere, any class",
          "private - accessible ONLY within the same class (this is how data hiding/encapsulation is actually implemented)",
          "protected - accessible within the same class, the same package, AND by subclasses (used with inheritance)",
        ],
      },
      {
        heading: "The 4th, Unwritten Access Level",
        content:
          "There's actually a 4th access level, called 'default' or 'package-private' - but it has no keyword of its own. If you write a variable or method with NO access specifier at all, it automatically gets this default level, which allows access only from within the same package. Note: 'package' itself is not something you type as a specifier - the three actual keywords are public, private, and protected.",
      },
      {
        heading: "Types of Variables - Know the Difference",
        bullets: [
          "Instance variables - declared inside a class but outside any method; each object gets its OWN separate copy (e.g. every Student object has its own 'marks')",
          "Class variables (static variables) - declared with the 'static' keyword; SHARED by every object of the class - there is only ONE copy no matter how many objects exist",
          "Local variables - declared inside a method or constructor; they only exist while that method is running, and are destroyed once it finishes",
        ],
      },
      {
        heading: "Static Variable Analogy",
        content:
          "Think of a static variable like a school's total student count displayed on a notice board. Every student (object) shares and sees the SAME number - if one more student is admitted, the board updates for everyone at once. Compare that to an instance variable like each student's own roll number, which is different for every student.",
        isAnalogy: true,
      },
      {
        heading: "Static Methods Too, Not Just Variables",
        content:
          "The 'static' keyword can also be applied to a METHOD, not just a variable. A static method belongs to the class itself, not to any individual object - which means you can call it directly using the class name (e.g. Math.sqrt(16)), without ever creating an object first. This is exactly why library class methods like Math.sqrt() can be called without writing 'new Math()' first.",
      },
      {
        heading: "Quick Java Example",
        code: `class Student {
    String name;          // instance variable - unique per object
    int age;               // instance variable
    static int totalStudents = 0;  // class/static variable - shared by all objects

    Student(String name, int age) {
        this.name = name;
        this.age = age;
        totalStudents++;   // increments the ONE shared copy
    }

    void displayDetails() {
        int bonusMarks = 5; // local variable - only exists inside this method
        System.out.println("Name: " + name + ", Age: " + age);
        System.out.println("Total students so far: " + totalStudents);
    }
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Forgetting the 'new' keyword when creating an object - without it, Java won't allocate memory for your object",
          "Forgetting to initialise variables before using them - uninitialised numeric variables default to 0, Strings default to null",
          "Confusing instance variables (separate copy per object) with static variables (one shared copy for the whole class)",
          "Marking everything 'public' out of habit - proper encapsulation usually means variables are 'private' with public methods to access them safely",
        ],
      },
    ],
  },

  {
    slug: "methods",
    title: "User Defined Methods",
    emoji: "⚙️",
    estimatedMinutes: 13,
    sections: [
      {
        heading: "What is a Method?",
        content:
          "A method is a named block of code that performs a specific task. Instead of writing the same steps again and again, you write them once inside a method and then just 'call' the method by name whenever you need that task done.",
      },
      {
        heading: "The Big Analogy",
        content:
          "A method is like a recipe in a cookbook. The recipe (method body) lists all the steps to make a dish. You don't rewrite the recipe every time you want to cook - you just say 'let's make recipe #5' (call the method) and follow the steps that are already written down.",
        isAnalogy: true,
      },
      {
        heading: "Types of Methods",
        bullets: [
          "void methods - perform a task but don't send any value back (e.g. printing something)",
          "value-returning methods - perform a task AND return a result using the 'return' keyword (must match the declared return type)",
          "methods can also take parameters - extra information passed in when the method is called",
          "A method can only return ONE value at a time - if you need multiple results back, you'd return an array, or use void and print/store them separately",
        ],
      },
      {
        heading: "Method Overloading",
        content:
          "Overloading means having multiple methods with the SAME name but DIFFERENT parameters (different number or different types of parameters) within the same class. Java figures out which one to run based on what you pass in. This is actually a real-world example of Polymorphism (one of the 4 OOP pillars from the first chapter) - the same method name behaves differently depending on what's passed to it.",
      },
      {
        heading: "Another Analogy",
        content:
          "Think of the word 'cut' - 'cut paper with scissors' and 'cut hair with clippers' are both called 'cutting', but the tool and technique are different depending on what you're cutting. That's overloading - same action name, different way of doing it based on what's given to it.",
        isAnalogy: true,
      },
      {
        heading: "Call by Value vs Call by Reference",
        bullets: [
          "Call by Value - a COPY of the variable's value is passed to the method. Changes made inside the method do NOT affect the original variable (this is how primitive types like int, double, char are passed in Java)",
          "Call by Reference - the actual memory address/object is passed. Changes made inside the method DO affect the original object (this is how arrays and objects behave in Java)",
        ],
      },
      {
        heading: "Call by Value Analogy",
        content:
          "Call by value is like giving someone a PHOTOCOPY of your notes - they can scribble all over the photocopy, but your original notes stay untouched. Call by reference is like giving someone the actual original notebook - if they scribble on it, your original notes change too, because there's only one real copy.",
        isAnalogy: true,
      },
      {
        heading: "Pure vs Impure Methods",
        bullets: [
          "Pure method - does not change the value of variables passed to it (via call by value), and its output only depends on its input - safer and more predictable",
          "Impure method - changes the value of variables outside its own scope (e.g. modifies an array passed to it, or updates a static/instance variable) - has 'side effects'",
        ],
      },
      {
        heading: "Recursion",
        content:
          "Recursion is when a method calls ITSELF to solve a smaller version of the same problem, until it reaches a 'base case' that stops the calling. A classic example is calculating a factorial: factorial(5) calls factorial(4), which calls factorial(3), and so on down to factorial(1), which is the base case that stops the chain.",
      },
      {
        heading: "Recursion Analogy",
        content:
          "Recursion is like Russian nesting dolls (matryoshka). To find the smallest doll, you open the big doll to find a slightly smaller one inside, then open that one, and so on - each step is the SAME action (open the doll) applied to a smaller version, until you reach the tiniest doll that doesn't open any further (the base case).",
        isAnalogy: true,
      },
      {
        heading: "Quick Java Example - Overloading",
        code: `class Calculator {
    // Overloaded method - same name "add", different parameters
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}`,
      },
      {
        heading: "Quick Java Example - Recursion (Factorial)",
        code: `int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1; // base case - stops the recursion
    }
    return n * factorial(n - 1); // calls itself with a smaller value
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Don't confuse overloading (same class, same name, different parameters) with overriding (parent-child classes, same signature) - overriding is covered in the Inheritance chapter",
          "Forgetting to write a 'return' statement in a value-returning method - this causes a compile error",
          "Forgetting the base case in a recursive method - without one, the method calls itself forever and crashes with a StackOverflowError",
          "Assuming an array passed into a method won't change after the method runs - arrays ARE passed by reference, so changes inside the method DO stick",
        ],
      },
    ],
  },

  {
    slug: "java-input",
    title: "Input in Java",
    emoji: "⌨️",
    estimatedMinutes: 9,
    sections: [
      {
        heading: "Why Do We Need Input?",
        content:
          "So far, values in our programs have been hardcoded directly in the code (e.g. int marks = 85;). But real programs need to work with whatever the USER types in while the program is running - like asking for their name or their exam score. This is called taking input.",
      },
      {
        heading: "Ways to Take Input in Java",
        bullets: [
          "Scanner class - the most common and beginner-friendly way to read input from the keyboard",
          "BufferedReader class - an older method that reads input as text (String), which then often needs manual conversion",
          "Function arguments - passing values directly into a method when it's called",
          "Command line arguments - values typed in when the program itself is launched (less commonly used in BlueJ)",
        ],
      },
      {
        heading: "The Scanner Class",
        content:
          "The Scanner class is Java's built-in tool for reading input typed by the user. You must first import it (import java.util.Scanner;) and create a Scanner object connected to the keyboard (Scanner sc = new Scanner(System.in);). Then you call the right method depending on what type of value you expect.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Scanner is like a waiter taking your order at a restaurant. You tell the waiter what you want (type something on the keyboard), and the waiter 'listens' and brings back exactly what was asked for, in the right format - nextInt() is like asking for 'just the table number' (a whole number), while nextLine() is like asking for 'the whole sentence you'd like to say' (a full line of text).",
        isAnalogy: true,
      },
      {
        heading: "Common Scanner Methods",
        bullets: [
          "sc.nextInt() - reads a whole number",
          "sc.nextDouble() - reads a decimal number",
          "sc.next() - reads a single word (stops at the next space)",
          "sc.nextLine() - reads an entire line of text, including spaces",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Enter your name: ");
        String name = sc.nextLine();

        System.out.println("Enter your marks: ");
        int marks = sc.nextInt();

        System.out.println(name + " scored " + marks + " marks.");
    }
}`,
      },
      {
        heading: "Types of Errors",
        content:
          "When something goes wrong in a program, it falls into one of three categories. Knowing which type helps you find and fix the problem faster.",
      },
      {
        heading: "The Three Error Types",
        bullets: [
          "Syntax error - breaks Java's grammar rules, caught by the compiler before the program even runs (e.g. a missing semicolon, a missing closing brace)",
          "Runtime error - the code is grammatically correct but something goes wrong WHILE running (e.g. dividing by zero, accessing an array index that doesn't exist)",
          "Logical error - the program runs completely fine with no error messages, but produces the WRONG result because the logic itself is flawed (e.g. using + instead of - by mistake)",
        ],
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Forgetting to 'import java.util.Scanner;' at the top of the program - without it, Java doesn't recognise the Scanner class",
          "The classic ICSE gotcha: calling nextInt() and then nextLine() right after - nextInt() leaves a leftover newline character behind, which nextLine() immediately picks up as an empty string instead of waiting for real input",
          "Using next() instead of nextLine() when you actually need a full sentence with spaces - next() stops reading at the first space",
          "A missing semicolon is a SYNTAX error (caught before running), not a logical or runtime error - a common exam mix-up",
        ],
      },
    ],
  },

  {
    slug: "constructors",
    title: "Constructors",
    emoji: "🔧",
    estimatedMinutes: 9,
    sections: [
      {
        heading: "What is a Constructor?",
        content:
          "A constructor is a special method that runs automatically the moment an object is created with 'new'. It has the exact same name as the class, and it never has a return type - not even 'void'. Its main job is to set up the object's initial data.",
      },
      {
        heading: "The Big Analogy",
        content:
          "A constructor is like a hotel room being prepared the instant a guest checks in - the bed is made, towels are placed, lights are switched on - all automatically, without the guest having to ask. In the same way, a constructor automatically sets up an object's data the moment it is created, without you having to call it separately.",
        isAnalogy: true,
      },
      {
        heading: "Types of Constructors",
        bullets: [
          "Default constructor - takes no parameters, usually sets default starting values",
          "Parameterised constructor - takes parameters so you can set custom starting values right when the object is created",
          "Constructor overloading - a class can have more than one constructor, just like overloaded methods, as long as their parameter lists are different",
        ],
      },
      {
        heading: "The 'this' Keyword",
        content:
          "Sometimes a constructor's parameter has the exact same name as the instance variable (e.g. both are called 'age'). Java gets confused about which 'age' you mean. The 'this' keyword means 'this current object', so 'this.age' always refers to the instance variable, and plain 'age' refers to the parameter.",
      },
      {
        heading: "Quick Java Example",
        code: `class BankAccount {
    String holderName;
    double balance;

    // Default constructor
    BankAccount() {
        holderName = "Unknown";
        balance = 0.0;
    }

    // Parameterised constructor
    BankAccount(String holderName, double balance) {
        this.holderName = holderName; // this.holderName = instance variable
        this.balance = balance;       // balance = the parameter
    }

    void showBalance() {
        System.out.println(holderName + "'s balance: " + balance);
    }
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Adding a return type to a constructor by mistake - the moment you add 'void' or any return type, Java treats it as a regular method, not a constructor",
          "Forgetting 'this.' when the parameter name matches the instance variable name - without it, you'd just be reassigning the parameter to itself",
          "The constructor name must match the class name exactly, including capitalisation",
        ],
      },
    ],
  },

  {
    slug: "library-classes",
    title: "Library Classes (Wrapper, Math, Character)",
    emoji: "📚",
    estimatedMinutes: 12,
    sections: [
      {
        heading: "What are Library Classes?",
        content:
          "Java comes with hundreds of ready-made classes that other programmers (Java's creators) have already written for common tasks - like doing maths or checking characters. Instead of writing this logic yourself every time, you just use the built-in method.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Using a library class is like using a calculator instead of doing long division by hand every single time. Someone already built the calculator (the library class) - you just press the right buttons (call the right method) and get your answer.",
        isAnalogy: true,
      },
      {
        heading: "Primitive vs Composite Data Types",
        bullets: [
          "Primitive data types - the basic building blocks: int, double, char, boolean, long, float, byte, short. They store a single simple value directly",
          "Composite (reference) data types - built from primitives or objects, like arrays, Strings, and classes. They store a reference/address pointing to where the actual data lives",
        ],
      },
      {
        heading: "Wrapper Classes",
        content:
          "Wrapper classes 'wrap' a primitive data type inside an object, so it can be treated as an object where needed (e.g. Integer wraps int, Double wraps double, Character wraps char, Boolean wraps boolean). They're also very useful for converting text into numbers: Integer.parseInt('25') turns the text '25' into the actual number 25. A close relative, Integer.valueOf('25'), does something similar but returns an Integer OBJECT instead of a plain int - parseInt() is what you want when you just need the number to do maths with.",
      },
      {
        heading: "Wrapper Class Analogy",
        content:
          "A wrapper class is like a gift box around a simple item. The int value 5 by itself is just a plain number, but Integer wraps it in a 'box' (an object) so it can be used in places that need an object, like collections. You can always unwrap the box to get the plain value back.",
        isAnalogy: true,
      },
      {
        heading: "Autoboxing and Unboxing",
        bullets: [
          "Autoboxing - Java automatically converts a primitive into its wrapper object when needed, e.g. Integer num = 10; (10 is automatically 'boxed' into an Integer object)",
          "Unboxing - Java automatically converts a wrapper object back into its primitive value when needed, e.g. int x = num; (the Integer object is automatically 'unboxed' back to a plain int)",
        ],
      },
      {
        heading: "Which Package Do These Belong To?",
        content:
          "Every built-in class lives inside a 'package' - a folder-like grouping of related classes. This matters because some packages are automatically available, while others must be explicitly imported before you can use them.",
      },
      {
        heading: "Package Analogy",
        content:
          "java.lang is like the tools already sitting on your desk - you can pick them up and use them instantly, no need to ask (no import needed). java.util is like tools kept in a supply cupboard down the hall - you must go fetch them first (write an import statement) before you can use them.",
        isAnalogy: true,
      },
      {
        heading: "Common Classes and Their Packages",
        bullets: [
          "java.lang (no import needed - always available automatically): String, Math, Character, Integer, Double, and other wrapper classes",
          "java.util (needs 'import java.util.X;' at the top of the program): Scanner, ArrayList",
        ],
      },
      {
        heading: "Math Class - Common Methods",
        bullets: [
          "Math.pow(base, exponent) - raises a number to a power",
          "Math.sqrt(x) - square root",
          "Math.cbrt(x) - cube root",
          "Math.abs(x) - absolute (always positive) value",
          "Math.ceil(x) - rounds UP to the nearest whole number",
          "Math.floor(x) - rounds DOWN to the nearest whole number",
          "Math.round(x) - rounds to the nearest whole number (standard rounding)",
          "Math.max(a, b) / Math.min(a, b) - returns the larger/smaller of two values (can be nested, e.g. Math.max(-7, Math.min(-5, -4)))",
        ],
      },
      {
        heading: "Character Class - Common Methods",
        bullets: [
          "Character.isDigit(ch) - true if it's a number 0-9",
          "Character.isLetter(ch) - true if it's an alphabet letter",
          "Character.isLetterOrDigit(ch) - true if it's EITHER a letter or a digit (false for spaces, symbols, punctuation)",
          "Character.isUpperCase(ch) / isLowerCase(ch) - checks the case",
          "Character.toUpperCase(ch) / toLowerCase(ch) - converts case",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `// Wrapper classes and conversion
String input = "25";
int num = Integer.parseInt(input);   // text -> number
System.out.println(num + 5);          // 30

// Autoboxing / unboxing
Integer boxedNum = 10;    // autoboxing: int -> Integer
int plainNum = boxedNum;  // unboxing: Integer -> int

// Math and Character
System.out.println(Math.pow(2, 3));          // 8.0
System.out.println(Math.sqrt(16));           // 4.0
System.out.println(Character.isDigit('7'));  // true`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Forgetting that Math methods return a 'double' even if the answer looks like a whole number (e.g. Math.pow(2,3) gives 8.0, not 8)",
          "Mixing up autoboxing (primitive to wrapper) with unboxing (wrapper to primitive) - remember the direction each name suggests",
          "Trying to use parseInt() on text that isn't actually a valid number - this throws an error at runtime",
        ],
      },
    ],
  },

  {
    slug: "string-handling",
    title: "String Handling",
    emoji: "🔤",
    estimatedMinutes: 12,
    sections: [
      {
        heading: "What is String Handling?",
        content:
          "Java treats text as objects using the String class. Since text (like names, sentences, or messages) is so commonly used, Java gives us a large set of ready-made methods to search, extract, compare, and modify strings without writing that logic from scratch.",
      },
      {
        heading: "An Important Fact About Strings",
        content:
          "In Java, a String object is IMMUTABLE - once created, its content can never be changed. Methods like toUpperCase() or replace() don't change the original string; they create and return a brand NEW string with the change applied.",
      },
      {
        heading: "String Class - Common Methods",
        bullets: [
          "length() - number of characters in the string",
          "charAt(index) - the character at a given position (counting starts from 0!)",
          "substring(start, end) - extracts characters from 'start' up to (but NOT including) 'end' - the end index is exclusive",
          "substring(start) - the single-argument version - extracts from 'start' all the way to the END of the string",
          "indexOf(char/string) - position where something FIRST appears, or -1 if not found",
          "lastIndexOf(char/string) - position where something LAST appears (searches from the end)",
          "toUpperCase() / toLowerCase() - returns a NEW string in that case",
          "equals(otherString) - checks if two strings have the same content (use this, NOT ==)",
          "compareTo(otherString) - compares alphabetically: returns 0 if equal, a NEGATIVE number if the calling string comes before the other alphabetically, a POSITIVE number if it comes after",
          "startsWith(text) / endsWith(text) - checks if the string begins or ends with the given text, returns true/false",
          "replace(old, new) - returns a new string with characters/text swapped",
          "trim() - removes extra spaces from the start and end",
          "concat(otherString) - joins two strings together (same as using +)",
        ],
      },
      {
        heading: "What is StringBuffer?",
        content:
          "Unlike String, a StringBuffer object IS mutable - its content can be changed directly without creating a new object every time. This makes StringBuffer much more efficient when you need to build or modify text repeatedly, like inside a loop.",
      },
      {
        heading: "String vs StringBuffer Analogy",
        content:
          "A String is like writing with permanent ink on paper - once written, you can't erase it; to 'change' it, you throw the page away and write a fresh one. A StringBuffer is like writing with a pencil and eraser - you can directly edit, insert, or erase parts of the same page without starting over.",
        isAnalogy: true,
      },
      {
        heading: "StringBuffer - Common Methods",
        bullets: [
          "append(text) - adds text to the end of the existing content, directly modifying it",
          "insert(index, text) - inserts text at a specific position",
          "delete(start, end) - removes characters between two positions",
          "reverse() - reverses the entire content in place",
          "replace(start, end, text) - replaces a portion of the content",
        ],
      },
      {
        heading: "String vs StringBuffer - Key Differences",
        bullets: [
          "String is immutable (cannot be changed after creation); StringBuffer is mutable (can be changed directly)",
          "Modifying a String repeatedly (e.g. in a loop) creates many new objects, which is slower; StringBuffer modifies the same object, which is faster for repeated changes",
          "Use String for text that won't change much; use StringBuffer when you're building or editing text a lot, like inside a loop",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `String name = "Khushboo";
System.out.println(name.length());          // 8
System.out.println(name.charAt(0));          // K
System.out.println(name.toUpperCase());      // KHUSHBOO (name itself is unchanged)

String word = "ACKNOWLEDGEMENT";
System.out.println(word.substring(3, 6));    // NOW - chars at index 3,4,5 (6 is excluded)
System.out.println(word.substring(3));       // NOWLEDGEMENT - index 3 all the way to the end

String s = "GRACIOUS".substring(4);          // "IOUS"
System.out.println("GLAMOROUS".endsWith(s)); // false - GLAMOROUS ends in "OUS", not "IOUS"

StringBuffer sb = new StringBuffer("Hello");
sb.append(" World");   // sb is now "Hello World" - same object, modified directly
sb.reverse();          // sb is now "dlroW olleH"
System.out.println(sb);`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Using == to compare String content - this compares memory addresses, not the actual text. Always use .equals()",
          "Thinking name.toUpperCase() changes 'name' itself - it doesn't, since String is immutable; you must store the result: name = name.toUpperCase();",
          "Using String instead of StringBuffer inside a loop that builds up long text - this is inefficient and can slow programs down noticeably",
          "Forgetting that charAt() and substring() both count positions starting from 0, not 1",
          "Forgetting that substring(start, end)'s end index is EXCLUSIVE - a very common off-by-one mistake",
        ],
      },
    ],
  },

  {
    slug: "conditionals",
    title: "Conditional Statements",
    emoji: "🚦",
    estimatedMinutes: 9,
    sections: [
      {
        heading: "What are Conditional Statements?",
        content:
          "Conditional statements let your program make decisions - 'if this is true, do this; otherwise do that.' Without conditions, a program would always do the exact same thing no matter what the input is.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Think of a GPS navigation app at a fork in the road. It checks a condition (is there traffic on route A?) and decides which path to take. If yes, it re-routes you through path B. Your code does the exact same thing with 'if' and 'else' - check a condition, then choose a path.",
        isAnalogy: true,
      },
      {
        heading: "Key Forms to Know",
        bullets: [
          "if - runs a block only if the condition is true",
          "if-else - runs one block if true, a different block if false",
          "else-if ladder - checks multiple conditions in order, top to bottom, and stops at the first true one",
          "nested if - an if statement inside another if statement",
          "switch-case - compares one variable against many possible fixed values, useful when if-else ladders get too long",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `int marks = 78;

if (marks >= 90) {
    System.out.println("Grade A+");
} else if (marks >= 75) {
    System.out.println("Grade A");
} else if (marks >= 60) {
    System.out.println("Grade B");
} else {
    System.out.println("Needs Improvement");
}`,
      },
      {
        heading: "switch-case Example",
        code: `int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Invalid day");
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Forgetting 'break' in a switch-case - without it, Java keeps running the NEXT cases too (called 'fall-through')",
          "Using a single = (assignment) instead of == (comparison) inside a condition - this is a very common exam slip",
          "Not carefully checking boundary values (e.g. is 75 included in 'marks >= 75' or should it be > 75?) - read the question wording carefully",
        ],
      },
    ],
  },

  {
    slug: "loops",
    title: "Iterative Statements (Loops)",
    emoji: "🔁",
    estimatedMinutes: 10,
    sections: [
      {
        heading: "What are Loops?",
        content:
          "Loops let you repeat a block of code multiple times without physically writing it out again and again. You set a condition once, and the loop keeps running the code until that condition becomes false.",
      },
      {
        heading: "The Big Analogy",
        content:
          "A loop is like a daily alarm clock set for 7 AM. You don't set a new alarm every single day - you set the repeating condition once ('every day at 7 AM') and it keeps happening automatically until you turn it off. That's exactly how a loop's condition works.",
        isAnalogy: true,
      },
      {
        heading: "The Three Loop Types",
        bullets: [
          "for loop - best when you know exactly how many times to repeat (has initialisation, condition, and update all in one line)",
          "while loop - checks the condition FIRST, then runs the body - good when you're not sure how many repeats are needed",
          "do-while loop - runs the body FIRST, then checks the condition - guarantees the code runs at least once, even if the condition is false",
        ],
      },
      {
        heading: "break vs continue",
        bullets: [
          "break - immediately exits the loop completely",
          "continue - skips just the current repetition and jumps to the next one",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `// for loop - multiplication table of 5
for (int i = 1; i <= 10; i++) {
    System.out.println(5 + " x " + i + " = " + (5 * i));
}

// while loop - sum of digits of a number
int num = 1234, sum = 0;
while (num > 0) {
    sum = sum + num % 10;
    num = num / 10;
}
System.out.println("Sum of digits: " + sum);`,
      },
      {
        heading: "A Real-Life Nested Loop",
        content:
          "A clock is a perfect real-life example of a nested loop. The minute hand completes a full loop of 60 positions - that's the INNER loop. Only once the minute hand finishes all 60 positions does the hour hand move forward by one - that's the OUTER loop, repeating 12 times. This is exactly how nested loops behave: the inner loop fully finishes before the outer loop moves to its next step.",
        isAnalogy: true,
      },
      {
        heading: "Nested Loops for Patterns",
        code: `// prints a right triangle of stars
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Forgetting to update the loop variable - this creates an infinite loop that never stops",
          "Off-by-one errors - accidentally looping one time too many or too few (check <= vs < carefully)",
          "Choosing while when do-while is needed (or vice versa) - remember, do-while always runs at least once",
        ],
      },
    ],
  },

  {
    slug: "arrays-1d",
    title: "Arrays - Single Dimensional",
    emoji: "🗄️",
    estimatedMinutes: 11,
    sections: [
      {
        heading: "What is an Array?",
        content:
          "An array is a single container that holds multiple values of the SAME type, all stored under one variable name. Instead of creating marks1, marks2, marks3... separately, you create one array called 'marks' that holds all of them together.",
      },
      {
        heading: "The Big Analogy",
        content:
          "An array is like a row of school lockers in a corridor. Each locker has a number (called an 'index'), and numbering always starts from 0, not 1. So the first locker is locker[0], the second is locker[1], and so on. You can open any locker directly if you know its number.",
        isAnalogy: true,
      },
      {
        heading: "Key Points to Remember",
        bullets: [
          "Arrays are declared with a fixed size that cannot change once created",
          "Indexing always starts at 0, so an array of size 5 has valid indices 0, 1, 2, 3, 4",
          "You traverse (visit every element of) an array using a for loop",
          "Common operations: finding sum, average, maximum, minimum, searching, and sorting",
        ],
      },
      {
        heading: "Quick Java Example - Bubble Sort",
        code: `int[] marks = {45, 89, 23, 67, 12};

// Bubble sort - ascending order
for (int i = 0; i < marks.length - 1; i++) {
    for (int j = 0; j < marks.length - 1 - i; j++) {
        if (marks[j] > marks[j + 1]) {
            int temp = marks[j];
            marks[j] = marks[j + 1];
            marks[j + 1] = temp;
        }
    }
}

for (int i = 0; i < marks.length; i++) {
    System.out.println(marks[i]);
}`,
      },
      {
        heading: "Linear Search Example",
        code: `int[] arr = {10, 25, 30, 45, 60};
int key = 30;
boolean found = false;

for (int i = 0; i < arr.length; i++) {
    if (arr[i] == key) {
        System.out.println("Found at index: " + i);
        found = true;
        break;
    }
}
if (!found) {
    System.out.println("Not found");
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Trying to access an index that doesn't exist (e.g. arr[5] in a 5-element array) - this crashes with ArrayIndexOutOfBoundsException, since valid indices are 0 to 4",
          "Forgetting that an array's size is fixed forever once it's created - you can't add a 6th element to a 5-element array",
          "Mixing up bubble sort's comparison direction for ascending vs descending order",
          "Writing arr.length() with parentheses - for arrays, length is a PROPERTY, not a method, so it's just arr.length (no brackets). This is the opposite of String, where length() IS a method with parentheses - a classic mix-up",
        ],
      },
    ],
  },

  {
    slug: "arrays-2d",
    title: "Arrays - Double Dimensional",
    emoji: "🎯",
    estimatedMinutes: 11,
    sections: [
      {
        heading: "What is a 2D Array?",
        content:
          "A 2D array is basically an array of arrays - it has rows AND columns, like a grid or table. It's used to store data that naturally has two dimensions, like a seating chart, a chessboard, or a matrix of numbers.",
      },
      {
        heading: "The Big Analogy",
        content:
          "A 2D array is like a classroom seating plan. To find a specific student, you need TWO pieces of information: which row they're in, and which column (seat number) in that row. In code, this is arr[row][column] - both numbers together pinpoint exactly one seat.",
        isAnalogy: true,
      },
      {
        heading: "Key Points to Remember",
        bullets: [
          "Declared as: int[][] matrix = new int[rows][columns];",
          "Traversing a 2D array needs TWO nested loops - the outer loop moves through rows, the inner loop moves through columns",
          "Common operations: sum of all elements, sum of diagonal elements, transpose (flipping rows and columns), adding two matrices",
        ],
      },
      {
        heading: "Quick Java Example - Sum of Two Matrices",
        code: `int[][] a = {{1, 2}, {3, 4}};
int[][] b = {{5, 6}, {7, 8}};
int[][] sum = new int[2][2];

for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        sum[i][j] = a[i][j] + b[i][j];
    }
}

for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        System.out.print(sum[i][j] + " ");
    }
    System.out.println();
}`,
      },
      {
        heading: "Diagonal Sum Example",
        code: `int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
int diagonalSum = 0;

for (int i = 0; i < 3; i++) {
    diagonalSum = diagonalSum + matrix[i][i]; // row index = column index
}
System.out.println("Diagonal Sum: " + diagonalSum);`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Mixing up which loop variable is the row and which is the column - by convention, 'i' is usually rows and 'j' is usually columns",
          "Forgetting that the diagonal of a square matrix always has row index equal to column index (matrix[i][i])",
          "Trying to add or multiply matrices of incompatible sizes",
        ],
      },
    ],
  },

  {
    slug: "encapsulation",
    title: "Encapsulation & Data Hiding",
    emoji: "🔒",
    estimatedMinutes: 8,
    sections: [
      {
        heading: "What is Encapsulation?",
        content:
          "Encapsulation means bundling an object's data (variables) and the methods that work on that data together inside one class, and controlling access to that data from outside. It's one of the 4 pillars of OOP introduced earlier - this chapter goes deeper into how it's actually achieved in Java.",
      },
      {
        heading: "The Big Analogy",
        content:
          "A capsule medicine hides its actual contents (the powder/liquid medicine) inside a protective outer shell. You interact with the capsule as a whole, not the raw ingredients directly. Similarly, encapsulation hides an object's raw data inside the class, and you interact with it only through safe, controlled methods.",
        isAnalogy: true,
      },
      {
        heading: "What is Data Hiding?",
        content:
          "Data hiding is the technique used to achieve encapsulation - it means declaring instance variables as 'private' so they cannot be accessed directly from outside the class. Instead, the class provides public methods (often called getters and setters) to safely read or change that data, allowing the class to validate or control how its data is used.",
      },
      {
        heading: "Why Bother Hiding Data?",
        bullets: [
          "Prevents other parts of the program from setting invalid data directly (e.g. a negative age)",
          "The class can validate data before accepting it, inside a setter method",
          "Internal implementation can change later without breaking code outside the class, as long as the public methods stay the same",
        ],
      },
      {
        heading: "Scope of Variables - A Quick Recap",
        content:
          "'Scope' means the part of the program where a variable is visible and usable. Local variables (inside a method) exist only during that method's execution. Instance variables exist as long as the object exists. Static/class variables exist for the entire lifetime of the program, shared across all objects.",
      },
      {
        heading: "Quick Java Example",
        code: `class BankAccount {
    private double balance; // hidden - cannot be accessed directly from outside

    public double getBalance() { // "getter" - safe read access
        return balance;
    }

    public void deposit(double amount) { // "setter"-style method with validation
        if (amount > 0) {
            balance = balance + amount;
        } else {
            System.out.println("Invalid deposit amount");
        }
    }
}

// Outside the class:
// account.balance = -500;      // NOT allowed - balance is private
// account.deposit(-500);       // allowed, but safely rejected inside the method`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Declaring instance variables as 'public' out of convenience - this defeats the purpose of encapsulation and data hiding",
          "Thinking encapsulation just means 'writing a class' - it specifically means hiding data and exposing controlled access through methods",
          "Confusing encapsulation (bundling + protecting data) with abstraction (hiding complexity from the user) - they work together but mean different things",
        ],
      },
    ],
  },

  {
    slug: "inheritance",
    title: "Inheritance",
    emoji: "👨‍👩‍👧",
    estimatedMinutes: 13,
    sections: [
      {
        heading: "What is Inheritance?",
        content:
          "Inheritance lets one class (called the child/subclass) acquire the properties and methods of another class (called the parent/superclass). This means you don't have to rewrite code that already exists in the parent class - you just extend it and add what's new.",
      },
      {
        heading: "The Big Analogy",
        content:
          "Think about inheriting features from your parents - maybe you got your father's height or your mother's eye colour. You didn't have to 'build' those features yourself, you inherited them automatically. On top of that, you ALSO have your own unique traits that neither parent has. A subclass works exactly the same way with a parent class.",
        isAnalogy: true,
      },
      {
        heading: "Key Syntax",
        bullets: [
          "'extends' keyword creates the parent-child relationship: class Dog extends Animal",
          "super() calls the parent class's constructor - it must be the very first line inside the child's constructor",
          "super.methodName() calls the parent class's version of a method, even if the child has overridden it",
        ],
      },
      {
        heading: "Overloading vs Overriding (Important for Exams!)",
        bullets: [
          "Overloading: SAME class, SAME method name, DIFFERENT parameters",
          "Overriding: parent AND child class, SAME method name, SAME parameters (the child provides its own version of a method already defined in the parent)",
        ],
      },
      {
        heading: "Types of Inheritance - All 5, Know the Difference",
        bullets: [
          "Single - one child inherits from exactly one parent",
          "Multilevel - a chain: grandparent -> parent -> child, across more than two levels",
          "Hierarchical - one single parent, with MULTIPLE children each inheriting from it separately",
          "Multiple - one child inheriting from more than one parent class at the same time. Java does NOT allow this through classes (a class cannot extend two classes) - it's only achieved using interfaces",
          "Hybrid - a combination of two or more of the above types mixed together in one design",
        ],
      },
      {
        heading: "Quick Java Example",
        code: `class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void makeSound() {
        System.out.println(name + " makes a sound");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name); // calls Animal's constructor - must be the first line
    }

    // Overriding - same method name and signature as parent
    void makeSound() {
        System.out.println(name + " barks");
    }
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Confusing overloading with overriding - this is one of the most commonly tested distinctions in the exam",
          "Forgetting that super() must be the FIRST statement in a constructor - Java gives an error otherwise",
          "Assuming Java supports multiple inheritance through classes - it doesn't; only interfaces allow this, even though 'multiple inheritance' is still a type you must know conceptually",
          "Mixing up hierarchical (one parent, many children) with multilevel (a chain across generations) - draw it out if unsure",
        ],
      },
    ],
  },

  {
    slug: "data-structures",
    title: "Data Structures (Stack & Queue)",
    emoji: "📦",
    estimatedMinutes: 10,
    isBonus: true,
    sections: [
      {
        heading: "Bonus Chapter - Not on the ICSE Class 10 Syllabus",
        content:
          "Stack and Queue are NOT part of the official ICSE Class 10 Computer Applications board exam syllabus - this topic normally comes up later in ISC Class 11/12 Computer Science. It's included here purely as bonus knowledge, since understanding these ideas builds a strong foundation and they come up constantly in real programming. Feel free to explore this chapter for interest, but it won't be tested in the board exam.",
      },
      {
        heading: "What are Data Structures?",
        content:
          "A data structure is simply a way of organising data so that certain operations (adding, removing, accessing) happen in a specific, controlled order. Stacks and queues are two of the simplest and most useful data structures.",
      },
      {
        heading: "The Big Analogy - Stack",
        content:
          "A stack works like a pile of plates in a kitchen cupboard. You can only add a new plate to the TOP of the pile, and you can only remove the plate from the TOP too. The last plate you placed is the first one you'll pick up again. This is called LIFO - Last In, First Out.",
        isAnalogy: true,
      },
      {
        heading: "The Big Analogy - Queue",
        content:
          "A queue works like a line at a movie ticket counter. The first person to join the line is the first person to get served and leave. New people join at the BACK of the line, and people leave from the FRONT. This is called FIFO - First In, First Out.",
        isAnalogy: true,
      },
      {
        heading: "Stack Operations",
        bullets: [
          "push - adds an element to the top",
          "pop - removes and returns the top element",
          "peek - looks at the top element without removing it",
          "isEmpty - checks if the stack has no elements",
        ],
      },
      {
        heading: "Queue Operations",
        bullets: [
          "enqueue - adds an element to the back (rear)",
          "dequeue - removes an element from the front",
          "front - the element about to be removed next",
          "rear - the last element added",
        ],
      },
      {
        heading: "Real-Life Uses",
        bullets: [
          "Stack - the 'Undo' button in apps (last action done is the first one undone), browser back button",
          "Queue - printer waiting for multiple print jobs, customers waiting at a counter",
        ],
      },
      {
        heading: "Quick Java Example - Simple Array Stack",
        code: `class Stack {
    int[] arr = new int[5];
    int top = -1; // -1 means empty

    void push(int value) {
        if (top == arr.length - 1) {
            System.out.println("Stack is full");
        } else {
            top++;
            arr[top] = value;
        }
    }

    int pop() {
        if (top == -1) {
            System.out.println("Stack is empty");
            return -1;
        }
        int value = arr[top];
        top--;
        return value;
    }
}`,
      },
      {
        heading: "Common Mistakes to Avoid",
        bullets: [
          "Mixing up which end each structure adds/removes from - stack works from ONE end only (top), queue works from TWO different ends (front and rear)",
          "Forgetting to check isEmpty before popping or dequeuing - this causes an error if the structure has nothing left",
          "Confusing stack (LIFO) and queue (FIFO) order when explaining real-life examples in the exam",
        ],
      },
    ],
  },
];
