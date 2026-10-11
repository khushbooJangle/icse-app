// Quiz question bank.
// Each question belongs to one chapter via chapterSlug (must match a slug in chapters.ts).
// Number of questions per chapter is NOT fixed - the quiz pages filter this flat array by chapterSlug,
// so you can add more questions to any chapter later just by appending objects here.
//
// Three question shapes (discriminated by `type`), matching the three real exam formats:
// - "mcq"   : classic multiple choice (Section A Q1 style), same as always.
// - "short" : a short subjective answer - expression evaluation, code tracing, rewriting
//             a loop, differentiating two terms (Section A Q2 style). Correct answers can
//             legitimately be phrased several ways, so this is SELF-MARKED: student writes
//             their own answer, reveals modelAnswer, then marks themselves right/wrong -
//             that self-mark still feeds saveQuizScore like any other question.
// - "code"  : a full type-along program (Section B style). Student types code in an editor,
//             app diffs typed lines against modelAnswer (normalized, order-independent per
//             line). >=80% of modelAnswer's non-blank lines matched = correct, auto-graded,
//             same scoring pipeline as an MCQ right/wrong answer (see progress.ts / saveQuizScore).

export type QuizQuestion =
  | {
      type: "mcq";
      chapterSlug: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      type: "short";
      chapterSlug: string;
      prompt: string;
      modelAnswer: string;
      explanation: string;
    }
  | {
      type: "code";
      chapterSlug: string;
      title: string;
      prompt: string;
      modelAnswer: string;
      explanation: string;
    };

export const QUIZZES: QuizQuestion[] = [
  // ---------- oop-intro ----------
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "What is a class in OOP?",
    options: [
      "A real object that exists in memory",
      "A blueprint/template used to create objects",
      "A type of loop",
      "A method that returns a value",
    ],
    correctIndex: 1,
    explanation:
      "A class is just a blueprint - like a cookie cutter. It doesn't exist as a real thing on its own until you use it to create an object.",
  },
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "Which of these is NOT one of the 4 pillars of OOP?",
    options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
    correctIndex: 2,
    explanation:
      "The 4 pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction. 'Compilation' is not an OOP concept - it's the process of converting code into machine-readable form.",
  },
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "'Hiding internal details and showing only essential features' describes which OOP pillar?",
    options: ["Inheritance", "Abstraction", "Polymorphism", "Encapsulation"],
    correctIndex: 1,
    explanation:
      "Abstraction means showing only what's necessary and hiding the complicated internal working - like driving a car without knowing how the engine works.",
  },
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "What is the 'state' of an object?",
    options: [
      "The methods it can perform",
      "The data/values it currently holds",
      "The class it belongs to",
      "The number of objects created",
    ],
    correctIndex: 1,
    explanation: "State refers to the data an object holds in its variables at any given moment.",
  },
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "In the cookie cutter analogy, what does the object represent?",
    options: ["The cutter itself", "The actual cookie", "The dough", "The oven"],
    correctIndex: 1,
    explanation:
      "The cutter is the class (the template), and each cookie you stamp out is an object - the real, individual thing created from that template.",
  },
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "The same method name behaving differently in different situations is called:",
    options: ["Encapsulation", "Abstraction", "Polymorphism", "Instantiation"],
    correctIndex: 2,
    explanation: "Polymorphism ('many forms') means the same method name can behave differently depending on context.",
  },
  {
    type: "mcq",
    chapterSlug: "oop-intro",
    question: "What does 'behaviour' refer to in OOP?",
    options: ["An object's variables", "What an object can do (its methods)", "The class name", "The object's memory address"],
    correctIndex: 1,
    explanation: "Behaviour = the actions/methods an object can perform, as opposed to state, which is its data.",
  },

  // ---------- java-intro ----------
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What does 'platform-independent' mean for Java?",
    options: [
      "Java only runs on Windows",
      "A Java program can run on almost any device without being rewritten",
      "Java programs cannot be compiled",
      "Java only works with BlueJ",
    ],
    correctIndex: 1,
    explanation: "Java compiles to bytecode, which any device's JVM can interpret - so the same program runs on Windows, Mac, Linux, etc. without changes.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What does the Java compiler convert source code into?",
    options: ["Machine code directly", "Bytecode", "A PDF file", "Plain English"],
    correctIndex: 1,
    explanation: "The compiler (javac) converts .java source code into bytecode (.class file), which the JVM then interprets.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What is the JVM's role?",
    options: [
      "It writes the source code for you",
      "It interprets bytecode so the program can actually run on a device",
      "It deletes unused variables",
      "It only works in BlueJ",
    ],
    correctIndex: 1,
    explanation: "The Java Virtual Machine (JVM) reads and executes the bytecode, which is what allows the same bytecode to run on different devices.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What is the difference between print() and println()?",
    options: [
      "They are identical",
      "println() moves to a new line after printing, print() stays on the same line",
      "print() only works with numbers",
      "println() cannot print text",
    ],
    correctIndex: 1,
    explanation: "System.out.println() adds a new line after output; System.out.print() keeps the cursor on the same line for the next output.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What symbol must end most Java statements?",
    options: ["A colon (:)", "A semicolon (;)", "A period (.)", "A comma (,)"],
    correctIndex: 1,
    explanation: "Java statements end with a semicolon - forgetting it is one of the most common beginner compile errors.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What does JVM stand for?",
    options: ["Java Virtual Mode", "Java Visible Machine", "Java Virtual Machine", "Java Verified Module"],
    correctIndex: 2,
    explanation: "JVM stands for Java Virtual Machine - it's the part that reads and runs the compiled bytecode on any device.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "Is Java case-sensitive?",
    options: ["No, never", "Yes - 'String' and 'string' are treated as different", "Only for numbers", "Only inside comments"],
    correctIndex: 1,
    explanation: "Java is case-sensitive, so keywords, identifiers, and class names must match case exactly.",
  },
  {
    type: "mcq",
    chapterSlug: "java-intro",
    question: "What is BlueJ?",
    options: [
      "A type of Java data type",
      "A beginner-friendly IDE for writing and visually running Java programs",
      "A Java keyword",
      "A wrapper class",
    ],
    correctIndex: 1,
    explanation: "BlueJ is an IDE designed for learning Java - it lets you create objects visually and call their methods without always writing a full main method.",
  },

  // ---------- data-types ----------
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "Which of these is a primitive data type?",
    options: ["String", "int", "Array", "Scanner"],
    correctIndex: 1,
    explanation: "int is a primitive data type. String and arrays are composite/reference types, and Scanner is a library class.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What is a 'literal'?",
    options: [
      "A variable name",
      "A fixed value written directly in the code, like 10 or 'A'",
      "A method name",
      "A type of loop",
    ],
    correctIndex: 1,
    explanation: "A literal is a fixed value written directly into the code, such as 10, 'A', true, or \"Hello\".",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "Which of these is a valid Java identifier?",
    options: ["2ndValue", "total_marks", "class", "my-variable"],
    correctIndex: 1,
    explanation: "total_marks is valid. Identifiers can't start with a digit (2ndValue), can't be a keyword (class), and can't contain a hyphen (my-variable).",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "Converting an int into a double automatically is an example of:",
    options: ["Explicit conversion", "Implicit conversion", "A syntax error", "Recursion"],
    correctIndex: 1,
    explanation: "This is implicit (automatic) conversion - going from a smaller type to a larger type happens safely without needing a typecast.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What happens when you explicitly typecast 9.99 to an int?",
    options: ["It becomes 10 (rounded)", "It becomes 9 (truncated, not rounded)", "It causes an error", "It becomes 0"],
    correctIndex: 1,
    explanation: "Explicit typecasting truncates - it simply cuts off the decimal part rather than rounding, so (int) 9.99 gives 9.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "Why does converting a double into an int require an EXPLICIT typecast?",
    options: [
      "Because Java forbids all conversions",
      "Because data could be lost (the decimal part), so Java requires you to do it on purpose",
      "Because double and int are the same size",
      "There is no reason, it's arbitrary",
    ],
    correctIndex: 1,
    explanation: "Going from a larger type to a smaller type risks losing data, so Java requires an explicit typecast to make sure you intended it.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "In the water analogy, what does explicit conversion (large to small type) represent?",
    options: [
      "Pouring a small cup into a big jug - fits easily",
      "Pouring a big jug into a small cup - some water may overflow and be lost",
      "An empty container",
      "Boiling water",
    ],
    correctIndex: 1,
    explanation: "Just like pouring a big jug into a small cup risks overflow, converting a larger data type into a smaller one risks losing data - so it must be done carefully (explicitly).",
  },

  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "How many bytes does a double occupy in Java?",
    options: ["4 bytes", "2 bytes", "8 bytes", "1 byte"],
    correctIndex: 2,
    explanation: "double occupies 8 bytes, the same as long. int and float occupy 4 bytes each; char and short occupy 2 bytes; byte occupies 1 byte.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "A double array holding {2.5, 4.5, 5.5, 6.4} occupies how many bytes in total?",
    options: ["16 bytes", "32 bytes", "8 bytes", "4 bytes"],
    correctIndex: 1,
    explanation: "There are 4 elements, and EVERY element in a double array takes 8 bytes each (even ones that look like whole numbers), so 4 x 8 = 32 bytes.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What does the escape sequence \\n do inside a String?",
    options: ["Prints a literal backslash", "Moves output to a new line", "Prints a tab space", "Ends the program"],
    correctIndex: 1,
    explanation: "\\n is the newline escape sequence - it moves anything printed after it to a new line.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "How would you print an actual double-quote character inside a String literal?",
    options: ["Just type \" normally", "Use the escape sequence \\\"", "It's not possible in Java", "Use \\n instead"],
    correctIndex: 1,
    explanation: "A plain \" would end the String early. \\\" escapes it so Java treats it as a literal quote character within the String.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What does System.out.println('Z' + 32); print?",
    options: ["'z'", "122", "'Z32'", "A compile error"],
    correctIndex: 1,
    explanation: "'Z' has an ASCII value of 90. Adding 32 gives 122, and since char arithmetic produces an int result, 122 (not a character) is printed.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What does 'A' + \"\" evaluate to?",
    options: ["65 (an int)", "\"A\" (a String)", "A compile error", "'A' unchanged as a char"],
    correctIndex: 1,
    explanation: "Because one side is a String (even an empty one), Java switches to String concatenation instead of ASCII arithmetic - the result is the String \"A\".",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What does 'd' + '*' + 'a' evaluate to (all three are char literals, no Strings involved)?",
    options: ["\"d*a\" as text", "An int - the sum of all three ASCII values", "A compile error", "'d'"],
    correctIndex: 1,
    explanation: "With no String anywhere in the expression, Java treats all three as numbers (their ASCII values) and adds them together, giving an int result.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "What is needed to turn the result of a char + int calculation back into a char?",
    options: [
      "Nothing, it's automatic",
      "An explicit typecast, e.g. (char)('A' + 1)",
      "It's impossible to convert back",
      "Use Character.toUpperCase()",
    ],
    correctIndex: 1,
    explanation: "char arithmetic returns an int. To get a character back, you must explicitly typecast it, e.g. (char) ('A' + 1) gives 'B'.",
  },

  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "How many bits does a char occupy in Java?",
    options: ["8 bits", "16 bits", "32 bits", "4 bits"],
    correctIndex: 1,
    explanation: "A char occupies 2 bytes, and since 1 byte = 8 bits, that's 2 x 8 = 16 bits.",
  },
  {
    type: "mcq",
    chapterSlug: "data-types",
    question: "A method can return how many values at a time?",
    options: ["As many as you want", "Exactly one", "Exactly two", "Zero, always"],
    correctIndex: 1,
    explanation: "A Java method can only return a single value. If multiple results are needed, you'd return an array or use a void method that prints/stores them separately.",
  },

  // ---------- operators ----------
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "What does the % operator do?",
    options: ["Divides two numbers", "Gives the remainder after division", "Multiplies two numbers", "Compares two numbers"],
    correctIndex: 1,
    explanation: "% is the modulus operator - it returns the remainder left over after dividing one number by another.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "What does the ternary operator look like?",
    options: [
      "if (condition) { } else { }",
      "condition ? valueIfTrue : valueIfFalse",
      "switch (condition) { }",
      "while (condition) { }",
    ],
    correctIndex: 1,
    explanation: "The ternary (conditional) operator is written as condition ? valueIfTrue : valueIfFalse - a one-line shortcut for simple if-else logic.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "What is the result of 'int x = (5 > 3) ? 10 : 20;'?",
    options: ["x = 10", "x = 20", "x = 5", "A compile error"],
    correctIndex: 0,
    explanation: "Since 5 > 3 is true, the ternary operator returns the first value, 10, so x becomes 10.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "What is the difference between ++x and x++?",
    options: [
      "There is no difference",
      "++x increases the value first then uses it; x++ uses the current value first then increases it",
      "++x only works with doubles",
      "x++ is not valid Java syntax",
    ],
    correctIndex: 1,
    explanation: "++x (pre-increment) increments before using the value; x++ (post-increment) uses the current value first, then increments afterward.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "Which operator category includes && , || , and ! ?",
    options: ["Arithmetic operators", "Relational operators", "Logical operators", "Assignment operators"],
    correctIndex: 2,
    explanation: "&& (AND), || (OR), and ! (NOT) are logical operators, used to combine or invert true/false conditions.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "In standard operator precedence, which happens first?",
    options: ["Addition before multiplication", "Multiplication/division before addition/subtraction", "They all happen at the same time", "Whichever is written first, left to right, regardless of type"],
    correctIndex: 1,
    explanation: "Just like in regular maths, multiplication and division are evaluated before addition and subtraction, unless parentheses change the order.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "What does 6 / 5 evaluate to in Java, if both 6 and 5 are int literals?",
    options: ["1.2", "1", "1.0", "A compile error"],
    correctIndex: 1,
    explanation: "When both operands are int, Java performs integer division and truncates the decimal - 6/5 gives 1, not 1.2. To get 1.2, at least one operand must be a double.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "In 'c = c + (x * d + e);', what is 'c' called?",
    options: ["A constant", "An accumulator", "A wrapper", "A ternary operator"],
    correctIndex: 1,
    explanation: "'c' appears on both sides of the assignment, building up its own running total - this pattern is called an accumulator.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "int a = 7, b = 8, c = 2; int x = a * b % (++c) + (++a) + (--b); What is x?",
    options: ["17", "20", "23", "15"],
    correctIndex: 0,
    explanation: "++c makes c=3 first, so a*b%c = 7*8%3 = 56%3 = 2. Then ++a makes a=8, and --b makes b=7. So x = 2 + 8 + 7 = 17.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "In the swap-without-a-third-variable trick using multiplication and division, what does the first line (x0 = x0 * x1;) do?",
    options: [
      "It immediately swaps the values",
      "It stores the product of both original values in x0, setting up the later steps to recover each original value",
      "It deletes x1",
      "It has no purpose",
    ],
    correctIndex: 1,
    explanation: "Storing the product lets the following division steps 'undo' the multiplication in a way that recovers each variable's original value into the other variable.",
  },
  {
    type: "mcq",
    chapterSlug: "operators",
    question: "In the road sign analogy, what does the ternary operator represent compared to if-else?",
    options: [
      "A longer, more detailed version of if-else",
      "A condensed, one-line version of a simple if-else decision",
      "A completely unrelated concept",
      "A type of loop",
    ],
    correctIndex: 1,
    explanation: "The ternary operator condenses a simple if-else decision into a single line, like a road sign showing two quick options instead of a full paragraph of instructions.",
  },

  // ---------- java-input ----------
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "Which class is most commonly used in ICSE Java programs to read keyboard input?",
    options: ["Scanner", "Math", "Character", "ArrayList"],
    correctIndex: 0,
    explanation: "The Scanner class, from java.util, is the standard beginner-friendly way to read input from the keyboard.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "What must you do before using the Scanner class?",
    options: [
      "Nothing, it's built in automatically",
      "Import it with 'import java.util.Scanner;'",
      "Create a new file",
      "Disable BlueJ",
    ],
    correctIndex: 1,
    explanation: "Scanner must be imported at the top of the program before it can be used: import java.util.Scanner;",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "Which Scanner method reads a whole number?",
    options: ["nextLine()", "next()", "nextInt()", "nextDouble()"],
    correctIndex: 2,
    explanation: "nextInt() reads an integer value typed by the user.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "Which Scanner method reads an entire line, including spaces?",
    options: ["next()", "nextLine()", "nextInt()", "nextDouble()"],
    correctIndex: 1,
    explanation: "nextLine() reads a full line of text including spaces, while next() stops reading at the first space.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "What is a classic bug when calling nextInt() immediately followed by nextLine()?",
    options: [
      "The program crashes immediately",
      "nextLine() picks up a leftover newline character and returns an empty string instead of waiting for input",
      "nextInt() stops working permanently",
      "There is no issue at all",
    ],
    correctIndex: 1,
    explanation: "nextInt() leaves behind a newline character in the input buffer, which the very next nextLine() call reads as an empty line - a well-known ICSE gotcha.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "In the waiter analogy, what does calling sc.nextInt() represent?",
    options: [
      "Asking the waiter for the entire menu",
      "Asking the waiter specifically for a whole number, like a table number",
      "Ignoring the waiter completely",
      "Closing the restaurant",
    ],
    correctIndex: 1,
    explanation: "Just like asking a waiter specifically for a table number, nextInt() specifically expects and returns a whole number from the input.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "Besides Scanner, which other class can be used (in an older style) to read input as text?",
    options: ["BufferedReader", "Math", "ArrayList", "StringBuffer"],
    correctIndex: 0,
    explanation: "BufferedReader is an older input method that reads text as Strings, which often then need manual parsing (e.g. Integer.parseInt()).",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "Missing a semicolon in a Java statement causes which type of error?",
    options: ["Logical error", "Syntax error", "Runtime error", "No error at all"],
    correctIndex: 1,
    explanation: "A missing semicolon breaks Java's grammar rules, so the compiler catches it before the program even runs - that makes it a syntax error.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "A program that runs with no errors but gives the wrong answer because of flawed logic has which type of error?",
    options: ["Syntax error", "Runtime error", "Logical error", "Import error"],
    correctIndex: 2,
    explanation: "Logical errors don't stop the program or show error messages - they just produce incorrect results because the logic itself is wrong.",
  },
  {
    type: "mcq",
    chapterSlug: "java-input",
    question: "Dividing by zero while the program is running is an example of which type of error?",
    options: ["Syntax error", "Runtime error", "Logical error", "Compile error"],
    correctIndex: 1,
    explanation: "The code is grammatically valid, but something goes wrong DURING execution - that makes it a runtime error.",
  },

  // ---------- classes-objects ----------
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "Which keyword is used to create a new object in Java?",
    options: ["create", "new", "object", "make"],
    correctIndex: 1,
    explanation: "The 'new' keyword allocates memory and creates an actual object from a class.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "How do you access an object's variable or method?",
    options: ["Using a colon (:)", "Using the dot (.) operator", "Using a hash (#)", "Using an arrow (->)"],
    correctIndex: 1,
    explanation: "In Java, you use the dot operator, e.g. s1.name or s1.displayDetails().",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "If you create two Student objects s1 and s2, and change s1's marks, what happens to s2's marks?",
    options: ["s2's marks also change", "s2's marks stay the same", "Both become 0", "A compile error occurs"],
    correctIndex: 1,
    explanation: "Each object has its own independent copy of instance variables - changing one object's data never affects another object.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "What do instance variables store?",
    options: ["The methods of a class", "The state/data of an object", "The class name", "Nothing, they're just labels"],
    correctIndex: 1,
    explanation: "Instance variables hold the data (state) that belongs to each individual object.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "How many objects can be created from a single class?",
    options: ["Only one", "Exactly two", "As many as needed", "Zero"],
    correctIndex: 2,
    explanation: "A class is reusable - you can create as many objects from it as your program needs.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "What happens if you forget to initialise a numeric instance variable in Java?",
    options: ["It causes a compile error", "It defaults to 0", "It defaults to null", "The program crashes at runtime"],
    correctIndex: 1,
    explanation: "Uninitialised numeric instance variables automatically default to 0 in Java (Strings default to null).",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "Using the car blueprint analogy, what do individual cars on the road represent?",
    options: ["Classes", "Objects", "Methods", "Constructors"],
    correctIndex: 1,
    explanation: "The blueprint is the class; each actual car built and driven on the road is an object created from that class.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "Which access specifier allows access ONLY within the same class?",
    options: ["public", "protected", "private", "static"],
    correctIndex: 2,
    explanation: "private restricts access to only the class it's declared in - like a personal diary nobody else can open, not even a subclass.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "A static (class) variable is best described as:",
    options: [
      "A separate copy for every object",
      "One single copy shared by all objects of the class",
      "A variable that only exists inside one method",
      "A variable that can never change",
    ],
    correctIndex: 1,
    explanation: "Static variables belong to the class itself, not to any individual object - there is only one shared copy no matter how many objects are created.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "Which access specifier allows access within the same class, same package, AND by subclasses?",
    options: ["public", "protected", "private", "final"],
    correctIndex: 1,
    explanation: "protected is broader than private but more restricted than public - it specifically allows subclasses to access the member too.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "Which of these is NOT an actual access specifier keyword in Java?",
    options: ["private", "protected", "package", "public"],
    correctIndex: 2,
    explanation: "The three real access specifier keywords are public, private, and protected. 'package' is not a keyword you write - leaving OFF a specifier entirely gives you the default (package-private) access level.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "What access level does a variable get if you write it with NO access specifier at all?",
    options: ["Automatically public", "Automatically private", "Default (package-private) - accessible within the same package only", "It causes a compile error"],
    correctIndex: 2,
    explanation: "Leaving off an access specifier gives the variable or method 'default' access - accessible only from classes in the same package.",
  },
  {
    type: "mcq",
    chapterSlug: "classes-objects",
    question: "Why can you call Math.sqrt(16) directly without first creating a Math object?",
    options: [
      "Math.sqrt() is a static method, which belongs to the class itself, not to an object",
      "Math is not a real class",
      "sqrt() is a keyword",
      "It's a special exception just for this one method",
    ],
    correctIndex: 0,
    explanation: "Static methods belong to the class itself, so they can be called directly using the class name, without ever creating an object first.",
  },

  // ---------- methods ----------
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "What is method overloading?",
    options: [
      "A method calling itself",
      "Multiple methods with the same name but different parameters",
      "A method with no return type",
      "Deleting unused methods",
    ],
    correctIndex: 1,
    explanation: "Overloading means the same method name is reused within a class, but with different parameter lists.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "A method declared with which keyword does NOT return any value?",
    options: ["int", "void", "double", "String"],
    correctIndex: 1,
    explanation: "'void' means the method performs a task but sends nothing back to the caller.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "Which of these is a valid overload of 'int add(int a, int b)'?",
    options: [
      "int add(int a, int b)",
      "int subtract(int a, int b)",
      "double add(double a, double b)",
      "void printSum()",
    ],
    correctIndex: 2,
    explanation: "Overloading requires the SAME method name ('add') with a DIFFERENT parameter list - here, double parameters instead of int.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "What must a value-returning method always include?",
    options: ["A loop", "A return statement matching its declared type", "At least 2 parameters", "The keyword void"],
    correctIndex: 1,
    explanation: "Any method that isn't void must return a value matching its declared return type.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "In the recipe analogy, what does calling a method represent?",
    options: ["Writing a new recipe from scratch every time", "Following an already-written recipe by name", "Throwing away the recipe", "Changing the recipe's ingredients permanently"],
    correctIndex: 1,
    explanation: "Just like saying 'let's make recipe #5' instead of rewriting the steps, calling a method reuses code that's already written.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "Can two overloaded methods have the exact same parameter types and count?",
    options: ["Yes, always", "No, they must differ in number or type of parameters", "Only if return type is different", "Only if names are different"],
    correctIndex: 1,
    explanation: "Overloaded methods must differ in their parameter list (number and/or type) - having a different return type alone is not enough.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "In a calculator program, having multiple methods all named calculate() for add/subtract/multiply is an example of which OOP concept?",
    options: ["Abstraction", "Inheritance", "Encapsulation", "Polymorphism"],
    correctIndex: 3,
    explanation: "Method overloading is a real-world example of polymorphism - the same method name (calculate) behaves differently depending on what's passed to it.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "What determines which overloaded method Java calls at a given time?",
    options: ["The order they were written in", "The values/types passed in when calling", "Random selection", "The method with the shortest name"],
    correctIndex: 1,
    explanation: "Java matches the arguments you pass (their number and type) against the available overloaded versions to pick the right one.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "In call by value, what happens to the original variable when the method changes its parameter?",
    options: [
      "The original variable also changes",
      "The original variable stays the same - only the copy inside the method changes",
      "Both the original and copy become 0",
      "It causes a compile error",
    ],
    correctIndex: 1,
    explanation: "Call by value passes a COPY of the value. Changing the copy inside the method never affects the original variable outside it.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "What is the 'base case' in a recursive method?",
    options: [
      "The first line of the method",
      "The condition that stops the method from calling itself further",
      "A syntax error",
      "The return type",
    ],
    correctIndex: 1,
    explanation: "The base case is the stopping condition - without it, a recursive method would call itself forever and crash with a StackOverflowError.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "A method that changes the value of a variable outside its own scope (like modifying an array passed to it) is called:",
    options: ["A pure method", "An impure method", "A static method", "An overloaded method"],
    correctIndex: 1,
    explanation: "An impure method has 'side effects' - it changes something beyond its own local scope. A pure method's output depends only on its input, with no side effects.",
  },
  {
    type: "mcq",
    chapterSlug: "methods",
    question: "Why are arrays affected differently than plain int/double variables when passed into a method?",
    options: [
      "Arrays are always empty inside methods",
      "Arrays are passed by reference (the actual object), while primitives are passed by value (a copy)",
      "Arrays cannot be passed into methods at all",
      "There is no difference",
    ],
    correctIndex: 1,
    explanation: "Primitives like int and double are passed by value (a copy), but arrays and objects are passed by reference, so changes made inside the method affect the original array.",
  },

  // ---------- constructors ----------
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "When does a constructor run?",
    options: ["Only when explicitly called", "Automatically when an object is created", "Only at the end of the program", "Never automatically"],
    correctIndex: 1,
    explanation: "A constructor runs automatically the instant an object is created using 'new'.",
  },
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "What return type does a constructor have?",
    options: ["void", "int", "No return type at all", "String"],
    correctIndex: 2,
    explanation: "Constructors never have any return type, not even void. Adding one turns it into a regular method.",
  },
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "What is the purpose of the 'this' keyword?",
    options: [
      "To create a new object",
      "To refer to the current object, especially when a parameter shares a name with an instance variable",
      "To exit a method early",
      "To declare a constant",
    ],
    correctIndex: 1,
    explanation: "'this' refers to the current object, helping distinguish an instance variable from a parameter of the same name.",
  },
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "A constructor's name must match:",
    options: ["The method it calls", "The class name exactly", "The parameter names", "Any name you like"],
    correctIndex: 1,
    explanation: "A constructor must have the exact same name as its class, including capitalisation.",
  },
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "What is a default constructor?",
    options: [
      "A constructor that takes parameters",
      "A constructor with no parameters, usually setting default values",
      "A constructor that can never be changed",
      "A method that deletes objects",
    ],
    correctIndex: 1,
    explanation: "A default constructor takes no parameters and typically assigns starting/default values to instance variables.",
  },
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "Can a class have more than one constructor?",
    options: ["No, only one is allowed", "Yes, through constructor overloading", "Only if it has no methods", "Only in the main class"],
    correctIndex: 1,
    explanation: "Just like methods, constructors can be overloaded - a class can have a default AND one or more parameterised constructors.",
  },
  {
    type: "mcq",
    chapterSlug: "constructors",
    question: "In 'this.balance = balance;', what does the left 'this.balance' refer to?",
    options: ["The parameter", "The instance variable of the current object", "A local variable", "A static variable"],
    correctIndex: 1,
    explanation: "'this.balance' always refers to the object's own instance variable, while plain 'balance' on the right refers to the parameter passed in.",
  },

  // ---------- library-classes ----------
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What does Math.sqrt(16) return?",
    options: ["4", "4.0", "16.0", "8.0"],
    correctIndex: 1,
    explanation: "Math methods return a double, so the square root of 16 is returned as 4.0, not the integer 4.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "Which Character method checks if a character is a number?",
    options: ["Character.isLetter()", "Character.isDigit()", "Character.isUpperCase()", "Character.toUpperCase()"],
    correctIndex: 1,
    explanation: "Character.isDigit(ch) returns true if the character is 0-9.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What does Integer.parseInt('42') do?",
    options: ["Converts the text '42' into the number 42", "Converts 42 into text", "Deletes the number 42", "Rounds 42 to the nearest 10"],
    correctIndex: 0,
    explanation: "parseInt() converts a String that looks like a number into an actual int value that can be used in calculations.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What does Math.ceil(4.2) return?",
    options: ["4.0", "5.0", "4", "5"],
    correctIndex: 1,
    explanation: "Math.ceil() always rounds UP to the next whole number, so 4.2 becomes 5.0.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "Why do we use library classes instead of writing our own logic every time?",
    options: [
      "They make the program slower",
      "They save time - like using a calculator instead of doing long division by hand",
      "They are required by Java syntax rules",
      "They only work with numbers",
    ],
    correctIndex: 1,
    explanation: "Library classes are pre-written and tested, so we reuse them instead of reinventing common logic every time.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What is autoboxing?",
    options: [
      "Converting a wrapper object back to a primitive",
      "Java automatically converting a primitive into its wrapper object",
      "Deleting unused variables",
      "Converting a String into a number",
    ],
    correctIndex: 1,
    explanation: "Autoboxing is the automatic conversion of a primitive (like int) into its wrapper object (like Integer) when needed.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "Which of these is a composite (reference) data type, NOT a primitive?",
    options: ["int", "boolean", "String", "char"],
    correctIndex: 2,
    explanation: "String is a composite/reference type built from characters. int, boolean, and char are all primitive data types.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What does Integer.parseInt('25') return?",
    options: ["The text '25'", "The number 25", "An error", "The number 2.5"],
    correctIndex: 1,
    explanation: "parseInt() converts a numeric-looking String into an actual int value that can be used in calculations.",
  },

  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "Which package do Character class methods belong to?",
    options: ["java.util", "java.lang", "java.io", "java.awt"],
    correctIndex: 1,
    explanation: "Character, along with String, Math, and the wrapper classes, lives in java.lang - which is automatically available without any import statement.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "Why does Scanner require an import statement but Math does not?",
    options: [
      "Scanner is broken without it",
      "Scanner belongs to java.util, which must be explicitly imported; Math belongs to java.lang, which is automatic",
      "Math is not a real class",
      "There is no real reason, it's arbitrary",
    ],
    correctIndex: 1,
    explanation: "Classes in java.lang (like Math, String, Character) are auto-available. Classes in other packages, like Scanner in java.util, must be imported explicitly.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What does Math.max(-7, Math.min(-5, -4)) evaluate to?",
    options: ["-4", "-5", "-7", "0"],
    correctIndex: 1,
    explanation: "Math.min(-5, -4) gives -5 first (the smaller value). Then Math.max(-7, -5) gives -5 (the larger of the two).",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "Which Math method finds the cube root of a number?",
    options: ["Math.sqrt()", "Math.pow()", "Math.cbrt()", "Math.abs()"],
    correctIndex: 2,
    explanation: "Math.cbrt(x) returns the cube root of x, while Math.sqrt(x) returns the square root.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What's the main difference between Integer.parseInt(\"25\") and Integer.valueOf(\"25\")?",
    options: [
      "There is no difference at all",
      "parseInt() returns a plain int, valueOf() returns an Integer object",
      "valueOf() only works with doubles",
      "parseInt() cannot convert Strings",
    ],
    correctIndex: 1,
    explanation: "parseInt() gives you back a primitive int, ready for maths. valueOf() gives back an Integer object instead.",
  },
  {
    type: "mcq",
    chapterSlug: "library-classes",
    question: "What does Character.isLetterOrDigit('#') return?",
    options: ["true", "false", "'#'", "An error"],
    correctIndex: 1,
    explanation: "'#' is neither a letter nor a digit - it's a special character - so isLetterOrDigit() returns false.",
  },

  // ---------- string-handling ----------
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "Which method correctly compares the CONTENT of two Strings?",
    options: ["==", ".equals()", ".length()", ".compareTo() only"],
    correctIndex: 1,
    explanation: "Use .equals() to compare the actual text content of two Strings. == compares memory references, not content.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "What does 'Hello'.charAt(0) return?",
    options: ["e", "H", "o", "An error, since indexing starts at 1"],
    correctIndex: 1,
    explanation: "String indexing starts at 0, so charAt(0) gives the very first character, 'H'.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "What does it mean for a String to be 'immutable'?",
    options: [
      "It can be changed anytime",
      "Its content can never be changed once created - methods return a NEW string instead",
      "It can only hold numbers",
      "It must always be uppercase",
    ],
    correctIndex: 1,
    explanation: "Once a String object is created, its content is permanent. Methods like toUpperCase() don't modify it - they return a brand new String.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "Which class should you use to efficiently build or repeatedly modify text inside a loop?",
    options: ["String", "StringBuffer", "Character", "Integer"],
    correctIndex: 1,
    explanation: "StringBuffer is mutable, so it can be modified directly without creating a new object each time - much more efficient inside loops.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "What does StringBuffer's append() method do?",
    options: [
      "Deletes the existing content",
      "Adds text to the end of the existing content, modifying it directly",
      "Reverses the content",
      "Creates a brand new String object",
    ],
    correctIndex: 1,
    explanation: "append() adds text directly onto the same StringBuffer object - no new object is created, unlike String concatenation.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "Why is String modification inside a loop generally slower than StringBuffer?",
    options: [
      "String methods don't exist",
      "Each String change creates a brand new object, while StringBuffer modifies the same object directly",
      "StringBuffer is not allowed in loops",
      "There is no real difference",
    ],
    correctIndex: 1,
    explanation: "Because String is immutable, every modification creates a new object - repeated in a loop, this wastes memory and time compared to StringBuffer's in-place changes.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "\"ACKNOWLEDGEMENT\".substring(3, __) is used to extract \"NOW\". What number goes in the blank?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    explanation: "N, O, W sit at indices 3, 4, 5. Since substring's end index is EXCLUSIVE, you need substring(3, 6) to include index 5 and stop before index 6.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "What does \"GRACIOUS\".substring(4) return (only one argument given)?",
    options: ["Just the character at index 4", "\"IOUS\" - from index 4 to the end of the string", "An error, since two arguments are required", "\"GRAC\""],
    correctIndex: 1,
    explanation: "The single-argument form of substring extracts everything from that index all the way to the end of the string.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "Which method checks whether a String finishes with a particular piece of text?",
    options: ["startsWith()", "endsWith()", "indexOf()", "trim()"],
    correctIndex: 1,
    explanation: "endsWith(text) returns true if the String finishes with that exact text. startsWith(text) checks the beginning instead.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "When does String.compareTo() return a NEGATIVE number?",
    options: [
      "When the two strings are exactly equal",
      "When the calling string comes BEFORE the other string alphabetically",
      "When the calling string comes AFTER the other string alphabetically",
      "compareTo() never returns a negative number",
    ],
    correctIndex: 1,
    explanation: "compareTo() returns negative when the calling string is alphabetically earlier, positive when it's later, and 0 when they're equal.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "What's the difference between indexOf() and lastIndexOf()?",
    options: [
      "There is no difference",
      "indexOf() finds the FIRST occurrence, lastIndexOf() finds the LAST occurrence",
      "lastIndexOf() only works on numbers",
      "indexOf() searches from the end of the String",
    ],
    correctIndex: 1,
    explanation: "indexOf() searches from the start and returns the position of the first match. lastIndexOf() searches from the end and returns the position of the last match.",
  },
  {
    type: "mcq",
    chapterSlug: "string-handling",
    question: "In the permanent ink vs pencil analogy, which one represents StringBuffer?",
    options: ["Permanent ink - cannot be changed", "Pencil and eraser - can be directly edited", "Neither", "Both equally"],
    correctIndex: 1,
    explanation: "StringBuffer is mutable, like writing in pencil - you can erase and edit directly. String is like permanent ink - you must start a fresh page (new object) to 'change' it.",
  },

  // ---------- conditionals ----------
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "What happens if you forget 'break' in a switch-case?",
    options: [
      "Nothing, it works the same",
      "Java throws a compile error",
      "Execution 'falls through' into the next case(s)",
      "Only the default case runs",
    ],
    correctIndex: 2,
    explanation: "Without 'break', Java keeps executing the following case blocks too, even if they don't match - this is called fall-through.",
  },
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "Which operator is used for comparison, not assignment?",
    options: ["=", "==", "+=", ":="],
    correctIndex: 1,
    explanation: "== compares two values. A single = assigns a value - mixing these up is a very common bug.",
  },
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "In an else-if ladder, what happens once a condition is found true?",
    options: [
      "All remaining conditions are still checked",
      "The matching block runs and the rest of the ladder is skipped",
      "The program restarts",
      "Nothing happens",
    ],
    correctIndex: 1,
    explanation: "Once a condition in the ladder is true, its block executes and the remaining else-if / else parts are skipped entirely.",
  },
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "When is switch-case usually preferred over an if-else ladder?",
    options: [
      "When comparing one variable against many fixed values",
      "When you need decimal comparisons",
      "When there is only one condition to check",
      "Never - if-else is always better",
    ],
    correctIndex: 0,
    explanation: "switch-case is cleaner when checking one variable against several exact fixed values, instead of a long chain of else-if statements.",
  },
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "What does a nested if mean?",
    options: [
      "An if statement with no condition",
      "An if statement placed inside another if statement",
      "Two separate unrelated if statements",
      "A loop inside a method",
    ],
    correctIndex: 1,
    explanation: "A nested if is simply an if statement written inside the body of another if statement, for checking a further condition.",
  },
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "Using the GPS analogy, what does a condition represent?",
    options: [
      "The destination address",
      "The check that decides which path/route to take",
      "The car itself",
      "The speed limit",
    ],
    correctIndex: 1,
    explanation: "Just like a GPS checks a condition (traffic ahead?) to choose a route, code checks a condition to choose which block to run.",
  },
  {
    type: "mcq",
    chapterSlug: "conditionals",
    question: "What is important to check carefully with boundary values like >= 75?",
    options: [
      "Whether the code compiles",
      "Whether the boundary number itself (75) is included or excluded",
      "The variable's data type only",
      "The method's return type",
    ],
    correctIndex: 1,
    explanation: "Always read carefully whether a boundary condition includes the exact value (>=) or excludes it (>) - a common source of off-by-one exam mistakes.",
  },

  // ---------- loops ----------
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "Which loop is guaranteed to run its body at least once?",
    options: ["for loop", "while loop", "do-while loop", "None of them"],
    correctIndex: 2,
    explanation: "do-while checks its condition AFTER running the body once, so the body always executes at least one time.",
  },
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "What causes an infinite loop?",
    options: [
      "Using a for loop instead of while",
      "Forgetting to update the loop variable so the condition never becomes false",
      "Declaring too many variables",
      "Using break inside the loop",
    ],
    correctIndex: 1,
    explanation: "If the loop variable is never updated, the condition never turns false, so the loop keeps running forever.",
  },
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "What does 'break' do inside a loop?",
    options: ["Skips to the next repetition", "Exits the loop completely", "Pauses the program", "Restarts the loop from the beginning"],
    correctIndex: 1,
    explanation: "break immediately stops and exits the loop entirely, regardless of the condition.",
  },
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "What does 'continue' do inside a loop?",
    options: ["Exits the loop completely", "Skips the rest of the current iteration and moves to the next one", "Stops the program", "Deletes the loop variable"],
    correctIndex: 1,
    explanation: "continue skips whatever code is left in the CURRENT repetition and jumps straight to the next one.",
  },
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "In the alarm clock analogy, what does the loop's condition represent?",
    options: ["The snooze button", "The repeating rule that keeps the action happening automatically", "The time zone", "The alarm sound"],
    correctIndex: 1,
    explanation: "Just like setting a repeating 7 AM alarm once, a loop's condition is set once and keeps the action repeating automatically.",
  },
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "How many nested loops are typically needed to print a 2D star pattern (like a triangle)?",
    options: ["None", "One", "Two", "Three"],
    correctIndex: 2,
    explanation: "One loop controls the rows, and a nested loop inside it controls how many stars/spaces print in each row.",
  },
  {
    type: "mcq",
    chapterSlug: "loops",
    question: "Which loop type is best when you already know the exact number of repetitions needed?",
    options: ["do-while", "while", "for", "None, they're all identical"],
    correctIndex: 2,
    explanation: "The for loop is ideal when the number of repetitions is known upfront, since it combines initialisation, condition, and update in one place.",
  },

  // ---------- arrays-1d ----------
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "What is the index of the FIRST element in an array?",
    options: ["1", "0", "-1", "It depends on the array"],
    correctIndex: 1,
    explanation: "Array indexing always starts at 0 in Java, just like the first locker in a row being locker[0].",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "What happens if you try to access arr[5] in an array of size 5?",
    options: [
      "It returns 0",
      "It throws ArrayIndexOutOfBoundsException",
      "It automatically resizes the array",
      "It returns the last element",
    ],
    correctIndex: 1,
    explanation: "An array of size 5 has valid indices 0 to 4 only. Accessing index 5 goes out of bounds and causes a runtime error.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "In bubble sort, what happens when two adjacent elements are out of order?",
    options: ["They are deleted", "They are swapped", "The loop stops", "They are both set to 0"],
    correctIndex: 1,
    explanation: "Bubble sort compares adjacent elements and swaps them if they're in the wrong order, repeating this pass until the array is sorted.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "Can the size of an array be changed after it's created?",
    options: ["Yes, anytime", "No, the size is fixed once created", "Only if it's empty", "Only for String arrays"],
    correctIndex: 1,
    explanation: "Once an array is created with a certain size, that size is permanently fixed - you cannot add or remove slots from it.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "What does linear search do?",
    options: [
      "Sorts the array first",
      "Checks each element one by one until it finds the target or reaches the end",
      "Only works on sorted arrays",
      "Deletes the array",
    ],
    correctIndex: 1,
    explanation: "Linear search simply goes through the array element by element, comparing each one to the target value.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "In the locker analogy, what does the locker number represent?",
    options: ["The value stored", "The array's name", "The index", "The array's data type"],
    correctIndex: 2,
    explanation: "Just as a locker number lets you find a specific locker, the index lets you access a specific element in the array.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "What loop condition correctly traverses an array of size n from start to end?",
    options: ["i = 1; i <= n; i++", "i = 0; i < n; i++", "i = 0; i <= n; i++", "i = n; i > 0; i++"],
    correctIndex: 1,
    explanation: "Since indices go from 0 to n-1, the correct loop is 'i = 0; i < n; i++' to visit every valid index exactly once.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-1d",
    question: "How do you correctly find the number of elements in an array called arr?",
    options: ["arr.length()", "arr.length", "arr.size()", "length(arr)"],
    correctIndex: 1,
    explanation: "For arrays, length is a property, not a method - it's written as arr.length with no parentheses. This is different from String, where length() IS a method with parentheses.",
  },

  // ---------- arrays-2d ----------
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "A 2D array is best described as:",
    options: ["An array with negative indices", "An array of arrays, with rows and columns", "A String only", "A single value"],
    correctIndex: 1,
    explanation: "A 2D array is essentially an array of arrays, giving it a grid-like structure of rows and columns.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "How many nested loops are needed to traverse a 2D array fully?",
    options: ["One", "Two", "Three", "None"],
    correctIndex: 1,
    explanation: "One loop moves through rows, and a nested loop inside it moves through the columns of each row.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "In matrix[i][i], what does this expression represent?",
    options: ["The first row only", "The last column only", "The diagonal elements", "An invalid expression"],
    correctIndex: 2,
    explanation: "When the row index equals the column index, you're accessing the diagonal elements of a square matrix.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "In the classroom seating analogy, what two pieces of information locate a specific student?",
    options: ["Name and age", "Row and column", "Height and weight", "Class and school"],
    correctIndex: 1,
    explanation: "Just like a seating chart needs a row number and a column/seat number, a 2D array needs both a row index and a column index.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "To add two matrices of the same size, what must you do?",
    options: [
      "Add corresponding elements at the same row and column position",
      "Multiply all elements together",
      "Only add the first row",
      "Convert them to 1D arrays first",
    ],
    correctIndex: 0,
    explanation: "Matrix addition works position by position - sum[i][j] = a[i][j] + b[i][j] for every row and column.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "What is a common mistake when working with 2D array loop variables?",
    options: [
      "Using i and j at all",
      "Mixing up which variable represents the row and which represents the column",
      "Declaring them as int",
      "Using them inside a loop",
    ],
    correctIndex: 1,
    explanation: "It's easy to accidentally swap row and column tracking - by convention, i tracks rows and j tracks columns.",
  },
  {
    type: "mcq",
    chapterSlug: "arrays-2d",
    question: "What real-life object is commonly used to explain 2D arrays?",
    options: ["A single locker", "A chessboard or seating chart", "A traffic light", "A calculator"],
    correctIndex: 1,
    explanation: "A chessboard or classroom seating chart naturally has rows and columns, making it a perfect analogy for 2D arrays.",
  },

  // ---------- encapsulation ----------
  {
    type: "mcq",
    chapterSlug: "encapsulation",
    question: "What is 'data hiding'?",
    options: [
      "Deleting data permanently",
      "Declaring variables private so they can't be accessed directly from outside the class",
      "Making all variables public for easy access",
      "Storing data in a separate file",
    ],
    correctIndex: 1,
    explanation: "Data hiding means marking instance variables as private, forcing outside code to go through safe public methods instead of touching the data directly.",
  },
  {
    type: "mcq",
    chapterSlug: "encapsulation",
    question: "What is the main benefit of using a 'setter' method with validation instead of direct public access?",
    options: [
      "It makes the code longer for no reason",
      "It lets the class reject or validate invalid data before accepting it",
      "It makes the variable public",
      "It removes the need for a constructor",
    ],
    correctIndex: 1,
    explanation: "A setter method can check the incoming value (e.g. reject a negative age) before updating the private variable - direct public access can't do this.",
  },
  {
    type: "mcq",
    chapterSlug: "encapsulation",
    question: "In the capsule medicine analogy, what does the outer shell represent?",
    options: [
      "The private data hidden inside",
      "The class's public methods that protect and control access to the data",
      "A bug in the program",
      "A static variable",
    ],
    correctIndex: 1,
    explanation: "Just like a capsule's shell protects and controls what's inside, a class's public methods protect and control access to its private data.",
  },
  {
    type: "mcq",
    chapterSlug: "encapsulation",
    question: "How long does a local variable's scope last?",
    options: [
      "For the entire lifetime of the program",
      "Only while the method or constructor it's declared in is running",
      "As long as the object exists",
      "Forever, even after the method ends",
    ],
    correctIndex: 1,
    explanation: "Local variables exist only during the execution of the method/constructor they're declared in, and are destroyed once it finishes.",
  },
  {
    type: "mcq",
    chapterSlug: "encapsulation",
    question: "Which best describes the relationship between abstraction and encapsulation?",
    options: [
      "They are exactly the same thing",
      "Abstraction hides complexity from the user; encapsulation bundles and protects data inside the class",
      "Encapsulation is only used in loops",
      "Abstraction only applies to arrays",
    ],
    correctIndex: 1,
    explanation: "They're related but different: abstraction is about hiding unnecessary detail from whoever USES the class, while encapsulation is about bundling and protecting the data itself.",
  },
  {
    type: "mcq",
    chapterSlug: "encapsulation",
    question: "Why might a class keep its instance variables private even within the same project?",
    options: [
      "To make the program run slower",
      "So the internal implementation can change later without breaking code that uses the class's public methods",
      "Because Java requires it for all variables",
      "It has no real benefit",
    ],
    correctIndex: 1,
    explanation: "As long as the public method signatures stay the same, the private internal details can be changed freely without affecting other code that depends on the class.",
  },

  // ---------- inheritance ----------
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "Which keyword creates an inheritance relationship in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctIndex: 1,
    explanation: "The 'extends' keyword is used for a class to inherit from another class, e.g. class Dog extends Animal.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "What is the key difference between overloading and overriding?",
    options: [
      "Overloading happens between parent-child classes, overriding within one class",
      "Overloading is same class/same name/different parameters; overriding is parent-child/same name/same parameters",
      "They mean exactly the same thing",
      "Overriding only works with constructors",
    ],
    correctIndex: 1,
    explanation: "Overloading = same class, same method name, different parameters. Overriding = parent-child classes, same method name AND same parameters.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "Where must super() be placed inside a child class's constructor?",
    options: ["Anywhere", "As the very first statement", "As the last statement", "It cannot be used in a constructor"],
    correctIndex: 1,
    explanation: "super() must be the first line in the child constructor - Java requires the parent to be set up before the child adds its own logic.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "Does Java support multiple inheritance through classes?",
    options: ["Yes, freely", "No, a class cannot extend two classes at once", "Only for abstract classes", "Only in the main method"],
    correctIndex: 1,
    explanation: "Java does not allow a class to extend more than one class. Multiple inheritance-like behaviour is achieved using interfaces instead.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "In hierarchical inheritance, how many parent classes does each child have, and how many children can one parent have?",
    options: ["One parent, one child only", "One parent, multiple children", "Multiple parents, one child", "Multiple parents, multiple children"],
    correctIndex: 1,
    explanation: "In hierarchical inheritance, one single parent class is extended by multiple different child classes.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "What does super.methodName() do?",
    options: [
      "Calls the child class's version of the method",
      "Calls the parent class's version of the method",
      "Deletes the method",
      "Creates a new method",
    ],
    correctIndex: 1,
    explanation: "super.methodName() explicitly calls the parent's version of a method, even if the child has overridden it.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "Grandparent -> Parent -> Child is an example of which type of inheritance?",
    options: ["Single", "Multilevel", "Hierarchical", "Multiple"],
    correctIndex: 1,
    explanation: "A chain of inheritance across more than two levels (grandparent to parent to child) is called multilevel inheritance.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "A class inheriting from more than one parent class at the same time is called:",
    options: ["Single inheritance", "Hierarchical inheritance", "Multiple inheritance", "No such type exists"],
    correctIndex: 2,
    explanation: "This is called multiple inheritance. Java does not allow it through classes (only through interfaces), but it's still a type you must know conceptually.",
  },
  {
    type: "mcq",
    chapterSlug: "inheritance",
    question: "What is hybrid inheritance?",
    options: [
      "Inheritance that only works with abstract classes",
      "A combination of two or more inheritance types mixed together in one design",
      "Another name for single inheritance",
      "Inheritance that doesn't use 'extends'",
    ],
    correctIndex: 1,
    explanation: "Hybrid inheritance combines multiple inheritance types (e.g. hierarchical + multilevel) together within the same class design.",
  },

  // ---------- data-structures ----------
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "A stack follows which principle?",
    options: ["FIFO - First In, First Out", "LIFO - Last In, First Out", "Random access", "Sorted order"],
    correctIndex: 1,
    explanation: "A stack is LIFO - the last element pushed in is the first one popped out, like a pile of plates.",
  },
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "A queue follows which principle?",
    options: ["LIFO - Last In, First Out", "FIFO - First In, First Out", "Random order", "Reverse order"],
    correctIndex: 1,
    explanation: "A queue is FIFO - the first element added is the first one removed, like a ticket counter line.",
  },
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "Which operation adds an element to a stack?",
    options: ["enqueue", "push", "dequeue", "peek"],
    correctIndex: 1,
    explanation: "push adds a new element to the top of a stack. pop removes from the top.",
  },
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "Which operation removes an element from a queue?",
    options: ["push", "pop", "dequeue", "peek"],
    correctIndex: 2,
    explanation: "dequeue removes an element from the front of a queue. enqueue adds an element to the rear.",
  },
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "What does 'peek' do?",
    options: [
      "Removes the top/front element",
      "Looks at the top/front element without removing it",
      "Empties the entire structure",
      "Adds a new element",
    ],
    correctIndex: 1,
    explanation: "peek lets you check what the top (stack) or front (queue) element is, without actually removing it.",
  },
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "Which real-life feature commonly uses a stack?",
    options: ["A printer queue", "The 'Undo' button in an app", "A ticket counter line", "A waiting room list"],
    correctIndex: 1,
    explanation: "Undo works like a stack - the most recent action (last in) is the first one undone (first out) - classic LIFO behaviour.",
  },
  {
    type: "mcq",
    chapterSlug: "data-structures",
    question: "Why should you check isEmpty() before calling pop() or dequeue()?",
    options: [
      "It's not necessary, Java handles it automatically",
      "To avoid errors from trying to remove an element that doesn't exist",
      "It makes the code run faster",
      "It's only needed for arrays, not stacks/queues",
    ],
    correctIndex: 1,
    explanation: "Trying to pop/dequeue from an empty structure causes an error - always check isEmpty() first as a safety check.",
  },

  // ---------- type-along code practice (added from cross-referencing extra reference books) ----------
  {
    type: "code",
    chapterSlug: "inheritance",
    title: "Electricity Bill (base class Elect -> derived class Bill)",
    prompt:
      "Class Elect has: String n; float units; and public void setvalue() which sets n=\"SOURABH\" and units=6879. Derive class Bill from Elect. Bill has a private double charge, and a method calc() that computes charge = 3.25 * units, then prints the name and the charge.",
    modelAnswer: `class Elect
{
  String n;
  float units;
  public void setvalue()
  {
    n = "SOURABH";
    units = 6879;
  }
}
class Bill extends Elect
{
  private double charge;
  public void calc()
  {
    charge = 3.25 * units;
    System.out.println("Name = " + n);
    System.out.println("Charge = " + charge);
  }
}`,
    explanation:
      "'extends' makes Bill a subclass of Elect, so it inherits n, units and setvalue() for free. Only the new behaviour (charge, calc()) needs to be written in Bill itself.",
  },
  {
    type: "code",
    chapterSlug: "inheritance",
    title: "Bank Account (base class Account -> derived class Calculate, using super)",
    prompt:
      "Class Account has protected long acno and protected double balance, a constructor Account(long a, double b) to initialise them, and methods withdraw(int w) and deposit(int d) that adjust balance. Derive class Calculate from Account with double r, t, si, amt. Calculate's constructor takes (long a, double b) and passes them up to Account's constructor using super. Method accept(double x, double y) sets r=x, t=y, amt=0. Method compute() finds si = (balance * r * t) / 100.0 and amt = si + balance.",
    modelAnswer: `class Account
{
  protected long acno;
  protected double balance;
  public Account(long a, double b)
  {
    acno = a;
    balance = b;
  }
  public void withdraw(int w)
  {
    balance -= w;
  }
  public void deposit(int d)
  {
    balance += d;
  }
}
class Calculate extends Account
{
  double r, t;
  double si, amt;
  public Calculate(long a, double b)
  {
    super(a, b);
  }
  public void accept(double x, double y)
  {
    r = x;
    t = y;
    amt = 0;
  }
  public void compute()
  {
    si = (balance * r * t) / 100.0;
    amt = si + balance;
  }
  public void display()
  {
    System.out.println("Account Number: " + acno);
    System.out.println("Balance: " + balance);
    System.out.println("Interest: " + si);
  }
}`,
    explanation:
      "super(a, b) calls Account's constructor from inside Calculate's constructor - it MUST be the first line. 'protected' lets acno and balance be used directly inside Calculate, unlike 'private' which would block that access.",
  },
  {
    type: "code",
    chapterSlug: "arrays-2d",
    title: "3x3 Matrix Row and Column Sums",
    prompt:
      "Define a class Matrix with a 3x3 int array m. Method getData() accepts all 9 numbers. Method rowsum() finds and prints the sum of each row. Method colsum() finds and prints the sum of each column.",
    modelAnswer: `import java.util.Scanner;
class Matrix
{
  int m[][] = new int[3][3];
  void getData()
  {
    Scanner sc = new Scanner(System.in);
    for (int i = 0; i < 3; i++)
    {
      for (int j = 0; j < 3; j++)
      {
        System.out.print("Enter matrix element :");
        m[i][j] = sc.nextInt();
      }
    }
  }
  void rowsum()
  {
    int i, j, sum;
    for (i = 0; i < 3; i++)
    {
      sum = 0;
      for (j = 0; j < 3; j++)
      {
        sum = sum + m[i][j];
      }
      System.out.println("Sum for row number " + (i + 1) + " : " + sum);
    }
  }
  void colsum()
  {
    int i, j, sum;
    for (i = 0; i < 3; i++)
    {
      sum = 0;
      for (j = 0; j < 3; j++)
      {
        sum = sum + m[j][i];
      }
      System.out.println("Sum for column number " + (i + 1) + " : " + sum);
    }
  }
  public static void main(String args[])
  {
    Matrix ob = new Matrix();
    ob.getData();
    ob.rowsum();
    ob.colsum();
  }
}`,
    explanation:
      "Row sum keeps the first index (i) fixed while looping the second (j) - that's one row. Column sum flips it - keeps the second index (i, reused as the fixed column) fixed while looping the first (j) across rows. Easy to mix these two up, so trace through a small example by hand first.",
  },
  {
    type: "code",
    chapterSlug: "loops",
    title: "Count Vowels and Consonants in 20 Letters",
    prompt:
      "Write a program to input a set of 20 letters. Convert each letter to uppercase. Find and display the number of vowels and the number of consonants present.",
    modelAnswer: `import java.util.Scanner;
class Dis_Letters
{
  public static void main(String args[])
  {
    Scanner in = new Scanner(System.in);
    System.out.println("Enter any 20 letters:");
    int vc = 0, cc = 0;
    char ch;
    for (int i = 0; i < 20; i++)
    {
      ch = in.next().charAt(0);
      ch = Character.toUpperCase(ch);
      if (ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U')
        vc++;
      else if (ch >= 'A' && ch <= 'Z')
        cc++;
    }
    System.out.println("Number of Vowels = " + vc);
    System.out.println("Number of Consonants = " + cc);
  }
}`,
    explanation:
      "Converting to uppercase FIRST means you only need to check 5 vowel letters instead of 10 (upper + lower). The else-if for consonants relies on the vowel check already running first - anything left that's still A-Z must be a consonant.",
  },
  {
    type: "code",
    chapterSlug: "data-types",
    title: "Compare Two Characters by ASCII Difference",
    prompt:
      "Input two characters from the keyboard. Find the difference (d) between their ASCII codes. If d=0, print both characters are same. If d<0, print the first character's ASCII value is less than the second. If d>0, print the second character's ASCII value is more than the first.",
    modelAnswer: `import java.util.Scanner;
class ASCIIDiff
{
  public static void main(String args[])
  {
    Scanner in = new Scanner(System.in);
    int d;
    char ch1, ch2;
    System.out.print("Enter first character: ");
    ch1 = in.next().charAt(0);
    System.out.print("Enter second character: ");
    ch2 = in.next().charAt(0);
    d = (int) ch1 - (int) ch2;
    if (d == 0)
      System.out.println("Both characters are same");
    else if (d < 0)
      System.out.println("ASCII value of first character is less than the second");
    else
      System.out.println("ASCII value of second character is more than the first");
  }
}`,
    explanation:
      "(int) ch1 converts the character to its ASCII number so it can be subtracted like a normal number - this is the same char-to-int typecast idea from the Data Types chapter, just used inside a comparison instead of a print statement.",
  },

  // ---------- short-answer practice (Section A Q2 style, self-marked) ----------
  {
    type: "short",
    chapterSlug: "operators",
    prompt: "Write a Java expression for: |a + b| / √(a² + b²)",
    modelAnswer: "Math.abs(a + b) / Math.sqrt(a * a + b * b)",
    explanation:
      "Math.abs() handles the |...| (absolute value), and Math.sqrt() handles the square root. Note a*a+b*b is how you write a² + b² in Java - there's no ^ power operator for this.",
  },
  {
    type: "short",
    chapterSlug: "operators",
    prompt: "Evaluate the value of x after this statement executes, given x = 4 initially:\nx += x++ * ++x % 2;",
    modelAnswer:
      "x stays 4. Step by step: x += x++ * ++x % 2 means x = x + (x++ * ++x % 2). Using the ORIGINAL x=4 for x++ (post-increment returns old value, x becomes 5), then ++x pre-increments that 5 to 6 and returns 6, so the expression becomes 4 + (4 * 6 % 2) = 4 + (24 % 2) = 4 + 0 = 4.",
    explanation:
      "This trips people up because x changes twice mid-expression (x++ then ++x) before the outer x += even applies. Always evaluate the right-hand side completely first, using each increment's own before/after value at the exact point it appears, then do the final assignment last.",
  },
  {
    type: "short",
    chapterSlug: "loops",
    prompt:
      "Rewrite the following using a for loop instead of do-while:\nx = 10; y = 20;\ndo {\n  x++;\n  y++;\n} while (x <= 20);\nSystem.out.println(x * y);",
    modelAnswer: "for (x = 10, y = 20; x <= 20; x++, y++);\nSystem.out.println(x * y);",
    explanation:
      "The do-while's body (x++, y++) becomes the for loop's update clause, and since there's nothing left to put in the loop body, the for loop ends with just a semicolon (empty body). A for loop can take two variables in its init/update sections separated by commas, same as this do-while had two counters.",
  },
  {
    type: "short",
    chapterSlug: "library-classes",
    prompt: "Differentiate between boxing and unboxing.",
    modelAnswer:
      "Boxing is converting a primitive data type into an object of its corresponding wrapper class (e.g. int 5 becomes Integer(5)). Unboxing is the reverse - converting a wrapper class object back into its primitive value (e.g. Integer(5) becomes int 5 again).",
    explanation:
      "Both happen automatically in modern Java (autoboxing/auto-unboxing) - you rarely have to do the conversion by hand, but you should be able to name which direction is which.",
  },
  {
    type: "short",
    chapterSlug: "string-handling",
    prompt:
      "This code was compiled and gave the error 'incompatible types - int cannot be converted to boolean'. Find the statement with the error, write the corrected statement, and give the output:\nString a = \"KING\", b = \"KINGDOM\";\nboolean x = a.compareTo(b);\nSystem.out.println(x);",
    modelAnswer:
      "Error is in: boolean x = a.compareTo(b); - compareTo() returns an int, not a boolean, so it can't be stored in a boolean variable.\nCorrected: int x = a.compareTo(b);\nOutput: -4",
    explanation:
      "compareTo() returns the ASCII difference between the first two characters where the strings differ - but if one string ends before any difference is found, it returns the difference in their lengths instead. That's the case here since 'KING' is a prefix of 'KINGDOM'.",
  },
];
