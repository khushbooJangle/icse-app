// Flashcards for the Revision section.
// Only chapters the student has marked "done" in Study show up here.
// Each card is deliberately short - the goal is a quick memory jog (spaced repetition),
// not a re-read of the full chapter notes.

export type RevisionCard = {
  chapterSlug: string;
  emoji: string;
  triggerPoints: string[];
  keyAnalogy: string;
};

export const REVISION_CARDS: RevisionCard[] = [
  {
    chapterSlug: "oop-intro",
    emoji: "🧩",
    triggerPoints: [
      "Class = blueprint, Object = real thing made from it",
      "4 pillars: Encapsulation, Inheritance, Polymorphism, Abstraction",
      "State = data an object holds, Behaviour = what it can do",
      "A class alone doesn't exist for real - only objects do",
    ],
    keyAnalogy:
      "🍪 A class is the cookie cutter. Every cookie you stamp out is an object - same shape, different toppings.",
  },
  {
    chapterSlug: "java-intro",
    emoji: "☕",
    triggerPoints: [
      "Compiler converts .java to bytecode | JVM interprets bytecode to run it",
      "'Write Once, Run Anywhere' = platform independence",
      "println() = new line after | print() = stays on same line",
      "Java is case-sensitive, every statement ends with a semicolon",
    ],
    keyAnalogy:
      "📜 Bytecode is a universal instruction sheet - any device's own JVM (local translator) can read and run it, no matter the country (OS).",
  },
  {
    chapterSlug: "data-types",
    emoji: "🔢",
    triggerPoints: [
      "Literal = fixed value in code | Identifier = name you choose",
      "Implicit conversion = automatic, small type to large type, safe",
      "Explicit conversion (typecast) = manual, large type to small type, may lose data",
      "Typecasting TRUNCATES the decimal, it does NOT round",
      "Bytes: byte=1, char/short=2, int/float=4, long/double=8 - array memory = bytes-per-element x count",
      "int / int ALWAYS truncates (6/5 = 1, not 1.2) - need at least one double for a decimal result",
      "char + int = int result (via ASCII value) - typecast back to (char) if you want a letter",
      "BUT char + String = concatenation (text), not ASCII math - the presence of a String changes everything",
      "Escape sequences: \\n = new line, \\t = tab, \\\" = literal quote, \\\\ = literal backslash",
    ],
    keyAnalogy:
      "🥤 Implicit = pouring a small cup into a big jug (fits easily). Explicit = pouring a big jug into a small cup (careful, may overflow).",
  },
  {
    chapterSlug: "operators",
    emoji: "➗",
    triggerPoints: [
      "Arithmetic, Relational, Logical, Assignment, Unary - know all 5 categories",
      "Ternary: condition ? valueIfTrue : valueIfFalse",
      "++x = increment first, then use | x++ = use first, then increment",
      "Multiplication/division happen before addition/subtraction (like normal maths)",
    ],
    keyAnalogy:
      "🪧 The ternary operator is a road sign with two arrows - same decision as if-else, condensed into one glance instead of a paragraph.",
  },
  {
    chapterSlug: "classes-objects",
    emoji: "🏗️",
    triggerPoints: [
      "Use 'new' to actually create an object",
      "Dot (.) operator accesses variables/methods: s1.name",
      "Each object's data is independent of every other object",
      "public = anyone | private = same class only | protected = class + subclasses",
      "Instance variable = own copy per object | Static variable = one shared copy | Local = inside a method only",
      "Static METHODS work the same way - belong to the class, callable via ClassName.method() with no object needed (e.g. Math.sqrt())",
    ],
    keyAnalogy:
      "🚗 A class is a car blueprint. Every car built from it (object) can be a different colour, but they all share the same design.",
  },
  {
    chapterSlug: "methods",
    emoji: "⚙️",
    triggerPoints: [
      "void = returns nothing, other types = must return a matching value",
      "Overloading = same name, different parameters, same class",
      "Call by value = copy passed, original safe | Call by reference = actual object passed, original changes (arrays/objects)",
      "Pure method = no side effects | Impure method = changes something outside itself",
      "Recursion = method calls itself, needs a base case to stop",
      "Method overloading is actually a real example of Polymorphism (one method name, many behaviours)",
    ],
    keyAnalogy:
      "🍳 A method is a recipe. You don't rewrite the steps each time - you just call the recipe by name.",
  },
  {
    chapterSlug: "java-input",
    emoji: "⌨️",
    triggerPoints: [
      "import java.util.Scanner; then Scanner sc = new Scanner(System.in);",
      "nextInt() = whole number | nextDouble() = decimal | next() = one word | nextLine() = full line",
      "Classic bug: nextInt() then nextLine() - the nextLine() grabs a leftover empty newline",
      "BufferedReader = older method, reads text only, needs manual parsing",
      "3 error types: Syntax (caught before running, e.g. missing ;) | Runtime (crashes while running, e.g. divide by 0) | Logical (runs fine, wrong answer)",
    ],
    keyAnalogy:
      "🍽️ Scanner is a waiter taking your order - nextInt() asks for just a number (table number), nextLine() asks for the full sentence.",
  },
  {
    chapterSlug: "constructors",
    emoji: "🔧",
    triggerPoints: [
      "Runs automatically when an object is created with 'new'",
      "Same name as class, NO return type ever",
      "'this.variable' = the object's own variable vs plain 'variable' = the parameter",
      "Can be overloaded, just like methods (default + parameterised)",
    ],
    keyAnalogy:
      "🏨 A constructor is like a hotel room prepping itself the moment a guest checks in - automatic setup, no extra command needed.",
  },
  {
    chapterSlug: "library-classes",
    emoji: "📚",
    triggerPoints: [
      "Primitive types (int, double, char...) vs Composite/reference types (String, arrays, objects)",
      "Wrapper class 'boxes' a primitive so it can act like an object (int -> Integer)",
      "Autoboxing = primitive to wrapper (automatic) | Unboxing = wrapper to primitive (automatic)",
      "Math.pow/sqrt/abs/ceil/floor/round/max/min - all return double (except max/min match input type)",
      "Character.isDigit / isLetter / isUpperCase for single characters",
      "java.lang (String, Math, Character, wrappers) = automatic, no import | java.util (Scanner) = needs import",
    ],
    keyAnalogy:
      "🎁 A wrapper class is a gift box around a plain value - int 5 becomes Integer(5), so it can be used wherever an object is needed.",
  },
  {
    chapterSlug: "string-handling",
    emoji: "🔤",
    triggerPoints: [
      "String is IMMUTABLE - can't be changed, methods return a NEW string",
      "Use .equals() for String content, NEVER ==",
      "charAt(), length(), substring(), indexOf() - all String basics",
      "StringBuffer IS mutable - append(), insert(), delete(), reverse() modify it directly",
      "Use StringBuffer instead of String inside loops that build up text - much faster",
      "substring(3,6) - end index EXCLUSIVE | substring(3) alone - goes to the end of the string",
      "compareTo() - negative if calling string comes first alphabetically, positive if it comes after",
    ],
    keyAnalogy:
      "🖊️ String is permanent ink - to 'change' it, you write a fresh page. StringBuffer is pencil and eraser - edit the same page directly.",
  },
  {
    chapterSlug: "conditionals",
    emoji: "🚦",
    triggerPoints: [
      "if / if-else / else-if ladder / nested if / switch-case",
      "== compares, = assigns - don't mix them up",
      "switch-case NEEDS 'break' or it falls through to the next case",
      "Watch boundary values carefully: >= vs >",
    ],
    keyAnalogy:
      "🗺️ A condition is a GPS deciding which route to take based on traffic - check the condition, then pick a path.",
  },
  {
    chapterSlug: "loops",
    emoji: "🔁",
    triggerPoints: [
      "for = known repeat count, while = check first, do-while = run once then check",
      "do-while ALWAYS runs at least once",
      "break = exit loop completely, continue = skip to next repetition",
      "Forgetting to update the loop variable = infinite loop",
    ],
    keyAnalogy:
      "⏰ A loop is a daily alarm - set the repeating condition once, it keeps happening automatically until told to stop.",
  },
  {
    chapterSlug: "arrays-1d",
    emoji: "🗄️",
    triggerPoints: [
      "Indexing starts at 0, not 1",
      "Array size is FIXED once created",
      "Bubble sort = compare adjacent pairs, swap if out of order, repeat",
      "Linear search checks elements one by one until found",
      "arr.length = property, NO parentheses (unlike String's length() which IS a method)",
    ],
    keyAnalogy:
      "🔑 An array is a row of lockers, numbered from 0. The locker number is the index.",
  },
  {
    chapterSlug: "arrays-2d",
    emoji: "🎯",
    triggerPoints: [
      "Array of arrays = rows and columns, accessed as arr[row][col]",
      "Needs TWO nested loops to traverse fully",
      "Diagonal elements: row index = column index → matrix[i][i]",
      "Matrix addition: add elements at matching row/column positions",
    ],
    keyAnalogy:
      "🪑 A 2D array is a classroom seating chart - you need BOTH a row number and a seat number to find one student.",
  },
  {
    chapterSlug: "encapsulation",
    emoji: "🔒",
    triggerPoints: [
      "Data hiding = make variables private, expose safe public methods (getters/setters) instead",
      "Setters can validate data before accepting it (e.g. reject negative age)",
      "Local variable scope = only inside its method | Instance = lifetime of the object | Static = lifetime of the program",
      "Encapsulation = bundle + protect data | Abstraction = hide complexity from the user (related, not identical)",
    ],
    keyAnalogy:
      "💊 Encapsulation is a medicine capsule - the shell (public methods) protects and controls access to what's inside (private data).",
  },
  {
    chapterSlug: "inheritance",
    emoji: "👨‍👩‍👧",
    triggerPoints: [
      "'extends' = child inherits from parent",
      "super() must be the FIRST line in child's constructor",
      "Overloading = same class, diff parameters | Overriding = parent-child, same signature",
      "5 types: Single, Multilevel, Hierarchical, Multiple, Hybrid",
      "Java: no multiple inheritance through classes (only via interfaces) - but still know it conceptually",
    ],
    keyAnalogy:
      "👶 Inheritance is like inheriting your parent's traits - you get their features automatically, plus your own unique ones on top.",
  },
  {
    chapterSlug: "data-structures",
    emoji: "📦",
    triggerPoints: [
      "Bonus topic - not on the ICSE Class 10 board syllabus, just good to know",
      "Stack = LIFO (last in, first out) - push/pop from the TOP only",
      "Queue = FIFO (first in, first out) - enqueue at rear, dequeue from front",
      "Always check isEmpty() before removing an element",
      "Stack → Undo button | Queue → printer/ticket line",
    ],
    keyAnalogy:
      "🍽️ Stack = a pile of plates (top plate first). Queue = a ticket line (first person first served).",
  },
];
