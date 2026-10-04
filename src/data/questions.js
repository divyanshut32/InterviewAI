export const QUESTION_BANK = {
  JavaScript: [
    { question: "What is the difference between let, const, and var?", hint: "Explain scope, redeclaration, and reassignment.", expected: "let and const are block scoped; var is function scoped. const cannot be reassigned." },
    { question: "What is event delegation in JavaScript?", hint: "Think about event bubbling and parent elements.", expected: "Event delegation attaches one listener to a parent and handles events from its descendants." },
    { question: "Explain the difference between == and ===.", hint: "Consider type coercion.", expected: "== allows type coercion while === checks value and type without coercion." },
    { question: "What is a Promise in JavaScript?", hint: "Explain asynchronous operations.", expected: "A Promise represents the eventual completion or failure of an asynchronous operation." },
    { question: "What is the DOM and how do you manipulate it?", hint: "Think about the browser's document tree.", expected: "DOM is the object representation of a page that JavaScript can read and modify." },
    { question: "What are closures in JavaScript?", hint: "Think about functions remembering their outer scope.", expected: "A closure lets a function retain access to variables from its lexical outer scope." },
    { question: "What is the difference between map(), filter(), and reduce()?", hint: "Compare their returned values and common uses.", expected: "map transforms, filter selects, and reduce combines values into an accumulated result." },
    { question: "How does async/await work?", hint: "Relate it to Promises.", expected: "async functions return Promises and await pauses execution until a Promise settles." }
  ],
  React: [
    { question: "What is a React component?", hint: "Think reusable UI building blocks.", expected: "A component is a reusable piece of UI that accepts inputs and returns React elements." },
    { question: "What is the difference between props and state?", hint: "Who controls each one?", expected: "Props are inputs passed by a parent; state is data managed by the component." },
    { question: "What is useEffect used for?", hint: "Think side effects.", expected: "useEffect handles side effects such as fetching data, subscriptions, and synchronization." },
    { question: "Why are keys important when rendering lists?", hint: "Think reconciliation.", expected: "Keys help React identify which list items changed, were added, or removed." },
    { question: "What is the Virtual DOM?", hint: "Compare it with direct DOM updates.", expected: "It is a lightweight representation React uses to efficiently determine UI updates." },
    { question: "What is conditional rendering in React?", hint: "How can UI depend on state?", expected: "It means rendering different elements based on a condition." },
    { question: "What is lifting state up?", hint: "Think shared state between siblings.", expected: "Move shared state to the closest common parent and pass it down through props." },
    { question: "What is a controlled component?", hint: "Think form input state.", expected: "A controlled input gets its value from React state and updates through event handlers." }
  ],
  Java: [
    { question: "What are the four pillars of OOP?", hint: "Name and briefly explain them.", expected: "Encapsulation, inheritance, polymorphism, and abstraction." },
    { question: "What is the difference between JDK, JRE, and JVM?", hint: "Think development, runtime, and execution.", expected: "JDK develops Java apps, JRE runs them, and JVM executes bytecode." },
    { question: "What is method overloading?", hint: "Same method name, different signature.", expected: "Defining multiple methods with the same name but different parameter lists." },
    { question: "What is exception handling in Java?", hint: "Think try, catch, finally.", expected: "It manages runtime errors using mechanisms such as try, catch, finally, and throw." },
    { question: "ArrayList vs LinkedList?", hint: "Compare access and insertion.", expected: "ArrayList provides fast indexed access; LinkedList can be efficient for insertions/removals at known nodes." },
    { question: "What is an interface in Java?", hint: "Think abstraction and contracts.", expected: "An interface defines a contract that implementing classes agree to fulfill." },
    { question: "What is inheritance?", hint: "Think parent and child classes.", expected: "Inheritance lets a class acquire properties and behavior from another class." },
    { question: "What is garbage collection?", hint: "Who manages unused objects?", expected: "The JVM automatically reclaims memory occupied by objects that are no longer reachable." }
  ],
  Python: [
    { question: "What are lists and tuples in Python?", hint: "Compare mutability.", expected: "Both are ordered collections; lists are mutable while tuples are immutable." },
    { question: "What is a dictionary in Python?", hint: "Think key-value pairs.", expected: "A dictionary stores key-value mappings and provides fast average lookup by key." },
    { question: "What is a list comprehension?", hint: "Compact way to create lists.", expected: "A concise syntax for creating lists from an iterable with optional filtering." },
    { question: "What is the difference between == and is?", hint: "Value vs identity.", expected: "== compares values while is checks object identity." },
    { question: "What are *args and **kwargs?", hint: "Variable number of arguments.", expected: "*args collects positional arguments and **kwargs collects keyword arguments." },
    { question: "What is exception handling in Python?", hint: "Think try and except.", expected: "Python handles runtime errors with try, except, else, and finally blocks." },
    { question: "What is a virtual environment?", hint: "Think isolated dependencies.", expected: "It isolates a project's Python interpreter and packages from other projects." },
    { question: "What is a lambda function?", hint: "Small anonymous function.", expected: "A lambda is an anonymous function expression typically used for short operations." }
  ]
};