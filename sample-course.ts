// Sample course data for "Introduction to Web Development"

export const webDevCourse = {
  _id: "course_web_dev_101",
  title: "Introduction to Web Development",
  description:
    "Learn the fundamentals of web development including HTML, CSS, JavaScript, and responsive design principles. This course is perfect for beginners who want to start building their own websites from scratch.",
  category: ["Web Development", "Programming", "Frontend"],
  isAIGenerated: false,
  creator: "instructor_001",
  timelineVariations: [
    {
      months: 3,
      modules: ["module_html_basics", "module_css_fundamentals", "module_js_intro", "module_responsive_design"],
    },
  ],
  skillsTargeted: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Web Accessibility", "Version Control"],
  difficulty: "beginner",
  prerequisites: [],
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-04-10"),
}

export const webDevModules = [
  {
    _id: "module_html_basics",
    courseId: "course_web_dev_101",
    title: "HTML Fundamentals",
    description:
      "Learn the building blocks of web pages. This module covers HTML tags, document structure, semantic elements, and best practices for creating accessible web content.",
    order: 1,
    timelineMonths: 3,
    lessons: [
      { lessonId: "lesson_html_intro", order: 1 },
      { lessonId: "lesson_html_structure", order: 2 },
      { lessonId: "lesson_html_text", order: 3 },
      { lessonId: "lesson_html_links_images", order: 4 },
      { lessonId: "lesson_html_forms", order: 5 },
      { lessonId: "lesson_html_semantic", order: 6 },
    ],
    assessmentId: "assessment_html_basics",
    estimatedHours: 10,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    _id: "module_css_fundamentals",
    courseId: "course_web_dev_101",
    title: "CSS Styling",
    description:
      "Master the art of styling web pages. This module covers CSS selectors, properties, layout techniques, and modern styling approaches to create visually appealing websites.",
    order: 2,
    timelineMonths: 3,
    lessons: [
      { lessonId: "lesson_css_intro", order: 1 },
      { lessonId: "lesson_css_selectors", order: 2 },
      { lessonId: "lesson_css_box_model", order: 3 },
      { lessonId: "lesson_css_layout", order: 4 },
      { lessonId: "lesson_css_flexbox", order: 5 },
      { lessonId: "lesson_css_responsive", order: 6 },
    ],
    assessmentId: "assessment_css_fundamentals",
    estimatedHours: 12,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    _id: "module_js_intro",
    courseId: "course_web_dev_101",
    title: "JavaScript Basics",
    description:
      "Add interactivity to your websites. This module introduces JavaScript programming concepts, DOM manipulation, events, and basic programming logic for creating dynamic web experiences.",
    order: 3,
    timelineMonths: 3,
    lessons: [
      { lessonId: "lesson_js_intro", order: 1 },
      { lessonId: "lesson_js_variables", order: 2 },
      { lessonId: "lesson_js_functions", order: 3 },
      { lessonId: "lesson_js_dom", order: 4 },
      { lessonId: "lesson_js_events", order: 5 },
      { lessonId: "lesson_js_project", order: 6 },
    ],
    assessmentId: "assessment_js_intro",
    estimatedHours: 15,
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
  },
  {
    _id: "module_responsive_design",
    courseId: "course_web_dev_101",
    title: "Responsive Web Design",
    description:
      "Create websites that work on any device. This module covers responsive design principles, media queries, mobile-first approach, and testing techniques for multi-device compatibility.",
    order: 4,
    timelineMonths: 3,
    lessons: [
      { lessonId: "lesson_responsive_intro", order: 1 },
      { lessonId: "lesson_responsive_media_queries", order: 2 },
      { lessonId: "lesson_responsive_images", order: 3 },
      { lessonId: "lesson_responsive_frameworks", order: 4 },
      { lessonId: "lesson_responsive_testing", order: 5 },
      { lessonId: "lesson_responsive_project", order: 6 },
    ],
    assessmentId: "assessment_responsive_design",
    estimatedHours: 12,
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-15"),
  },
]

// Sample lessons for the HTML module
export const htmlLessons = [
  {
    _id: "lesson_html_intro",
    moduleId: "module_html_basics",
    title: "Introduction to HTML",
    contentType: "text",
    mediaUrls: [],
    estimatedMinutes: 20,
    content: `
      <div class="prose max-w-none">
        <h2>Welcome to HTML!</h2>
        <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page and consists of a series of elements that tell the browser how to display the content.</p>
        
        <h3>What You'll Learn</h3>
        <p>In this lesson, you'll learn:</p>
        <ul>
          <li>What HTML is and why it's important</li>
          <li>The history and evolution of HTML</li>
          <li>Basic concepts of markup languages</li>
          <li>How HTML works with CSS and JavaScript</li>
        </ul>
        
        <h3>What is HTML?</h3>
        <p>HTML is the language of the web. It's a markup language that web developers use to structure and describe the content of a webpage. HTML consists of a series of elements, which you use to enclose, or wrap, different parts of the content to make it appear a certain way, or act a certain way.</p>
        
        <p>The enclosing tags can make a word or image hyperlink to somewhere else, can italicize words, can make the font bigger or smaller, and so on.</p>
        
        <h3>A Brief History of HTML</h3>
        <p>HTML was created by Sir Tim Berners-Lee in late 1991 but was not released officially until 1995 with HTML 2.0. HTML 4.01 came in December 1999, and HTML5 was released in 2014.</p>
        
        <p>HTML5 is the latest version and introduces many new features like video, audio, and canvas elements, as well as integration capabilities with SVG content and better error handling.</p>
        
        <h3>How Websites Work</h3>
        <p>When you visit a website, your browser sends a request to a web server, which responds by sending back HTML, CSS, and JavaScript files. The browser then renders these files to display the webpage you see.</p>
        
        <div class="bg-light-gray p-4 rounded-md my-6">
          <h4 class="text-secondary font-medium mb-2">The Web Development Trinity</h4>
          <ul>
            <li><strong>HTML</strong>: Structure and content</li>
            <li><strong>CSS</strong>: Styling and layout</li>
            <li><strong>JavaScript</strong>: Interactivity and behavior</li>
          </ul>
        </div>
        
        <h3>Your First HTML Element</h3>
        <p>HTML elements are represented by tags. Tags are keywords surrounded by angle brackets like <code>&lt;tagname&gt;</code>. Most tags come in pairs like <code>&lt;p&gt;</code> and <code>&lt;/p&gt;</code>.</p>
        
        <p>Here's a simple HTML element:</p>
        
        <pre><code>&lt;p&gt;This is a paragraph.&lt;/p&gt;</code></pre>
        
        <p>In this example:</p>
        <ul>
          <li><code>&lt;p&gt;</code> is the opening tag</li>
          <li>"This is a paragraph" is the content</li>
          <li><code>&lt;/p&gt;</code> is the closing tag</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>HTML is the foundation of all web pages. Without HTML, you wouldn't be able to organize text or add images or videos to your web pages. HTML is the beginning of everything you need to know to create engaging web pages!</p>
        
        <div class="bg-primary/10 p-4 rounded-md my-6">
          <h4 class="text-primary font-medium mb-2">Coming Up Next</h4>
          <p>In the next lesson, we'll dive into HTML document structure and learn how to create a complete HTML page from scratch.</p>
        </div>
      </div>
    `,
    interactiveElements: [
      {
        type: "quiz",
        data: {
          questions: [
            {
              question: "What does HTML stand for?",
              type: "multiple-choice",
              options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Hyperlink and Text Markup Language",
                "Home Tool Markup Language",
              ],
              correctAnswer: "Hyper Text Markup Language",
              points: 5,
            },
            {
              question: "Which of the following is NOT part of the web development trinity?",
              type: "multiple-choice",
              options: ["HTML", "CSS", "JavaScript", "Python"],
              correctAnswer: "Python",
              points: 5,
            },
            {
              question: "What is the purpose of HTML?",
              type: "multiple-choice",
              options: [
                "To style web pages",
                "To add interactivity to web pages",
                "To structure and describe the content of web pages",
                "To handle server-side logic",
              ],
              correctAnswer: "To structure and describe the content of web pages",
              points: 5,
            },
          ],
        },
      },
    ],
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    _id: "lesson_html_structure",
    moduleId: "module_html_basics",
    title: "HTML Document Structure",
    contentType: "text",
    mediaUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    estimatedMinutes: 25,
    content: `
      <div class="prose max-w-none">
        <h2>HTML Document Structure</h2>
        <p>Every HTML document follows a basic structure that includes several key elements. Understanding this structure is essential for creating valid HTML pages.</p>
        
        <h3>The Basic Structure</h3>
        <p>A basic HTML document includes the following elements:</p>
        
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Document Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;!-- Content goes here --&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
        
        <p>Let's break down each part:</p>
        
        <h4>1. DOCTYPE Declaration</h4>
        <p>The <code>&lt;!DOCTYPE html&gt;</code> declaration tells the browser which version of HTML the page is using. For HTML5, this simple declaration is all you need.</p>
        
        <h4>2. HTML Element</h4>
        <p>The <code>&lt;html&gt;</code> element is the root element of an HTML page. The <code>lang</code> attribute specifies the language of the document, which helps with accessibility and search engine optimization.</p>
        
        <h4>3. Head Section</h4>
        <p>The <code>&lt;head&gt;</code> element contains meta-information about the document that isn't displayed on the page itself. This includes:</p>
        <ul>
          <li><code>&lt;meta charset="UTF-8"&gt;</code>: Specifies the character encoding</li>
          <li><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code>: Helps with responsive design</li>
          <li><code>&lt;title&gt;</code>: Sets the title that appears in the browser tab</li>
          <li>Links to CSS files, JavaScript files, and other resources</li>
        </ul>
        
        <h4>4. Body Section</h4>
        <p>The <code>&lt;body&gt;</code> element contains all the content that is displayed on the page, such as text, images, links, and other elements.</p>
        
        <div class="bg-light-gray p-4 rounded-md my-6">
          <h4 class="text-secondary font-medium mb-2">Important Note</h4>
          <p>HTML elements are nested within each other. This creates a hierarchical structure, often referred to as the DOM (Document Object Model).</p>
        </div>
        
        <h3>Comments in HTML</h3>
        <p>HTML comments are not displayed in the browser but can help document your code:</p>
        
        <pre><code>&lt;!-- This is a comment --&gt;</code></pre>
        
        <h3>Indentation and Formatting</h3>
        <p>While HTML doesn't require specific indentation, it's good practice to indent nested elements for better readability:</p>
        
        <pre><code>&lt;body&gt;
    &lt;header&gt;
        &lt;h1&gt;My Website&lt;/h1&gt;
    &lt;/header&gt;
    &lt;main&gt;
        &lt;p&gt;Welcome to my website!&lt;/p&gt;
    &lt;/main&gt;
&lt;/body&gt;</code></pre>
        
        <h3>Creating Your First Complete HTML Document</h3>
        <p>Let's create a simple HTML document with some basic content:</p>
        
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;My First Web Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;header&gt;
        &lt;h1&gt;Welcome to My Website&lt;/h1&gt;
    &lt;/header&gt;
    
    &lt;main&gt;
        &lt;section&gt;
            &lt;h2&gt;About Me&lt;/h2&gt;
            &lt;p&gt;Hello! I'm learning HTML.&lt;/p&gt;
        &lt;/section&gt;
        
        &lt;section&gt;
            &lt;h2&gt;My Hobbies&lt;/h2&gt;
            &lt;ul&gt;
                &lt;li&gt;Web Development&lt;/li&gt;
                &lt;li&gt;Reading&lt;/li&gt;
                &lt;li&gt;Hiking&lt;/li&gt;
            &lt;/ul&gt;
        &lt;/section&gt;
    &lt;/main&gt;
    
    &lt;footer&gt;
        &lt;p&gt;&copy; 2025 My Website. All rights reserved.&lt;/p&gt;
    &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
        
        <h3>Validating Your HTML</h3>
        <p>It's important to ensure your HTML is valid. You can use the <a href="https://validator.w3.org/" target="_blank">W3C Markup Validation Service</a> to check your HTML for errors.</p>
        
        <h3>Conclusion</h3>
        <p>Understanding the basic structure of an HTML document is the foundation for creating web pages. With this knowledge, you can start building more complex pages and adding content.</p>
        
        <div class="bg-primary/10 p-4 rounded-md my-6">
          <h4 class="text-primary font-medium mb-2">Coming Up Next</h4>
          <p>In the next lesson, we'll explore HTML text elements, including headings, paragraphs, and text formatting.</p>
        </div>
      </div>
    `,
    interactiveElements: [
      {
        type: "quiz",
        data: {
          questions: [
            {
              question: "What is the root element of an HTML document?",
              type: "multiple-choice",
              options: ["<body>", "<head>", "<html>", "<root>"],
              correctAnswer: "<html>",
              points: 5,
            },
            {
              question: "Which element contains information that is not displayed on the webpage?",
              type: "multiple-choice",
              options: ["<body>", "<head>", "<meta>", "<title>"],
              correctAnswer: "<head>",
              points: 5,
            },
            {
              question: "What does the DOCTYPE declaration do?",
              type: "multiple-choice",
              options: [
                "Defines the document type and version of HTML",
                "Creates a new HTML document",
                "Declares the document title",
                "Sets the language of the document",
              ],
              correctAnswer: "Defines the document type and version of HTML",
              points: 5,
            },
          ],
        },
      },
    ],
    createdAt: new Date("2025-01-16"),
    updatedAt: new Date("2025-01-16"),
  },
]

// Sample lessons for the CSS module
export const cssLessons = [
  {
    _id: "lesson_css_intro",
    moduleId: "module_css_fundamentals",
    title: "Introduction to CSS",
    contentType: "text",
    mediaUrls: [],
    estimatedMinutes: 25,
    content: `
      <div class="prose max-w-none">
        <h2>Welcome to CSS!</h2>
        <p>CSS (Cascading Style Sheets) is the language used to style and layout web pages. It works hand in hand with HTML to create visually appealing websites.</p>
        
        <h3>What You'll Learn</h3>
        <p>In this lesson, you'll learn:</p>
        <ul>
          <li>What CSS is and why it's important</li>
          <li>How CSS works with HTML</li>
          <li>Different ways to add CSS to your HTML</li>
          <li>Basic CSS syntax and terminology</li>
        </ul>
        
        <h3>What is CSS?</h3>
        <p>CSS stands for Cascading Style Sheets. It's a style sheet language used for describing the presentation of a document written in HTML. CSS describes how elements should be rendered on screen, on paper, in speech, or on other media.</p>
        
        <p>While HTML provides the structure and content of a web page, CSS provides the styling and layout. This separation of content (HTML) and presentation (CSS) is a fundamental principle of modern web development.</p>
        
        <h3>Why CSS is Important</h3>
        <p>CSS allows you to:</p>
        <ul>
          <li>Control the layout of multiple web pages all at once</li>
          <li>Apply different styles to different media types (screens, printers, etc.)</li>
          <li>Create responsive designs that work on various screen sizes</li>
          <li>Enhance the visual appeal and user experience of your websites</li>
        </ul>
        
        <h3>How CSS Works with HTML</h3>
        <p>CSS works by selecting HTML elements and applying styles to them. For example, you might want all paragraphs to have a specific font size, or all headings to be a certain color.</p>
        
        <div class="bg-light-gray p-4 rounded-md my-6">
          <h4 class="text-secondary font-medium mb-2">The Basic Pattern</h4>
          <p>CSS follows this pattern: <strong>selector { property: value; }</strong></p>
          <ul>
            <li><strong>Selector</strong>: Targets the HTML element(s) to style</li>
            <li><strong>Property</strong>: Specifies what aspect to style (e.g., color, font-size)</li>
            <li><strong>Value</strong>: Specifies the setting for the property</li>
          </ul>
        </div>
        
        <h3>Ways to Add CSS to HTML</h3>
        <p>There are three main ways to add CSS to your HTML:</p>
        
        <h4>1. Inline CSS</h4>
        <p>Inline CSS is applied directly to an HTML element using the <code>style</code> attribute:</p>
        
        <pre><code>&lt;p style="color: blue; font-size: 16px;"&gt;This is a blue paragraph.&lt;/p&gt;</code></pre>
        
        <h4>2. Internal CSS</h4>
        <p>Internal CSS is placed in the <code>&lt;head&gt;</code> section of an HTML document inside a <code>&lt;style&gt;</code> tag:</p>
        
        <pre><code>&lt;head&gt;
  &lt;style&gt;
    p {
      color: blue;
      font-size: 16px;
    }
  &lt;/style&gt;
&lt;/head&gt;</code></pre>
        
        <h4>3. External CSS</h4>
        <p>External CSS is placed in a separate file with a .css extension and linked to the HTML document:</p>
        
        <pre><code>&lt;head&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;</code></pre>
        
        <p>And in styles.css:</p>
        
        <pre><code>p {
  color: blue;
  font-size: 16px;
}</code></pre>
        
        <p>External CSS is generally the preferred method as it:</p>
        <ul>
          <li>Separates content from presentation</li>
          <li>Makes maintenance easier</li>
          <li>Allows you to apply the same styles to multiple pages</li>
          <li>Reduces file size and loading time when cached</li>
        </ul>
        
        <h3>Basic CSS Syntax</h3>
        <p>Let's look at a more complete example of CSS syntax:</p>
        
        <pre><code>/* This is a CSS comment */

/* Selector targeting all paragraphs */
p {
  color: #333;           /* Text color */
  font-size: 16px;       /* Font size */
  line-height: 1.5;      /* Line height */
  margin-bottom: 20px;   /* Space below the paragraph */
}

/* Selector targeting elements with class="highlight" */
.highlight {
  background-color: yellow;
  font-weight: bold;
}

/* Selector targeting the element with id="header" */
#header {
  background-color: #f0f0f0;
  padding: 20px;
  border-bottom: 1px solid #ccc;
}</code></pre>
        
        <h3>CSS Terminology</h3>
        <ul>
          <li><strong>Selectors</strong>: Patterns that match HTML elements (e.g., <code>p</code>, <code>.class</code>, <code>#id</code>)</li>
          <li><strong>Properties</strong>: Attributes you want to change (e.g., <code>color</code>, <code>font-size</code>)</li>
          <li><strong>Values</strong>: Settings for properties (e.g., <code>blue</code>, <code>16px</code>)</li>
          <li><strong>Declarations</strong>: Property-value pairs (e.g., <code>color: blue;</code>)</li>
          <li><strong>Declaration blocks</strong>: Groups of declarations enclosed in curly braces</li>
          <li><strong>Rule sets</strong>: Selectors combined with declaration blocks</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>CSS is a powerful language that allows you to transform the appearance of your HTML documents. By understanding the basics of CSS, you're taking an important step toward creating professional-looking websites.</p>
        
        <div class="bg-primary/10 p-4 rounded-md my-6">
          <h4 class="text-primary font-medium mb-2">Coming Up Next</h4>
          <p>In the next lesson, we'll dive deeper into CSS selectors and learn how to target specific elements with precision.</p>
        </div>
      </div>
    `,
    interactiveElements: [
      {
        type: "quiz",
        data: {
          questions: [
            {
              question: "What does CSS stand for?",
              type: "multiple-choice",
              options: [
                "Cascading Style Sheets",
                "Creative Style System",
                "Computer Style Sheets",
                "Colorful Style Sheets",
              ],
              correctAnswer: "Cascading Style Sheets",
              points: 5,
            },
            {
              question: "Which of the following is NOT a way to add CSS to HTML?",
              type: "multiple-choice",
              options: ["Inline CSS", "Internal CSS", "External CSS", "Imported CSS"],
              correctAnswer: "Imported CSS",
              points: 5,
            },
            {
              question: "What is the correct CSS syntax?",
              type: "multiple-choice",
              options: ["{body: color=black;}", "body {color: black;}", "body:color=black;", "{body;color:black;}"],
              correctAnswer: "body {color: black;}",
              points: 5,
            },
          ],
        },
      },
    ],
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
]

// Sample lessons for the JavaScript module
export const jsLessons = [
  {
    _id: "lesson_js_intro",
    moduleId: "module_js_intro",
    title: "Introduction to JavaScript",
    contentType: "text",
    mediaUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    estimatedMinutes: 30,
    content: `
      <div class="prose max-w-none">
        <h2>Welcome to JavaScript!</h2>
        <p>JavaScript is the programming language of the web. It allows you to add interactivity, dynamic content, and behavior to your websites.</p>
        
        <h3>What You'll Learn</h3>
        <p>In this lesson, you'll learn:</p>
        <ul>
          <li>What JavaScript is and why it's important</li>
          <li>How JavaScript works with HTML and CSS</li>
          <li>Basic JavaScript concepts and syntax</li>
          <li>How to add JavaScript to your web pages</li>
        </ul>
        
        <h3>What is JavaScript?</h3>
        <p>JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It was originally created to make web pages interactive and is now used for a wide variety of applications, including:</p>
        
        <ul>
          <li>Web development (client-side and server-side)</li>
          <li>Mobile app development</li>
          <li>Game development</li>
          <li>Desktop applications</li>
          <li>Internet of Things (IoT)</li>
        </ul>
        
        <p>JavaScript is a versatile language that allows developers to create dynamic content, control multimedia, animate images, and pretty much everything else.</p>
        
        <h3>The Role of JavaScript in Web Development</h3>
        <p>In web development, JavaScript works alongside HTML and CSS to create interactive web pages:</p>
        
        <div class="bg-light-gray p-4 rounded-md my-6">
          <h4 class="text-secondary font-medium mb-2">The Web Development Trinity</h4>
          <ul>
            <li><strong>HTML</strong>: Structure and content (the "nouns")</li>
            <li><strong>CSS</strong>: Styling and layout (the "adjectives")</li>
            <li><strong>JavaScript</strong>: Behavior and interactivity (the "verbs")</li>
          </ul>
        </div>
        
        <h3>Adding JavaScript to HTML</h3>
        <p>There are three main ways to add JavaScript to your HTML:</p>
        
        <h4>1. Inline JavaScript</h4>
        <p>Inline JavaScript is added directly to HTML elements using event attributes:</p>
        
        <pre><code>&lt;button onclick="alert('Hello, World!')"&gt;Click Me&lt;/button&gt;</code></pre>
        
        <h4>2. Internal JavaScript</h4>
        <p>Internal JavaScript is placed within <code>&lt;script&gt;</code> tags in the HTML document:</p>
        
        <pre><code>&lt;script&gt;
  function sayHello() {
    alert('Hello, World!');
  }
&lt;/script&gt;

&lt;button onclick="sayHello()"&gt;Click Me&lt;/button&gt;</code></pre>
        
        <h4>3. External JavaScript</h4>
        <p>External JavaScript is placed in a separate file with a .js extension and linked to the HTML document:</p>
        
        <pre><code>&lt;script src="script.js"&gt;&lt;/script&gt;</code></pre>
        
        <p>And in script.js:</p>
        
        <pre><code>function sayHello() {
  alert('Hello, World!');
}</code></pre>
        
        <p>External JavaScript is generally the preferred method as it:</p>
        <ul>
          <li>Separates behavior from content</li>
          <li>Makes maintenance easier</li>
          <li>Allows you to reuse the same code across multiple pages</li>
          <li>Improves page loading time when cached</li>
        </ul>
        
        <h3>Basic JavaScript Syntax</h3>
        <p>Let's look at some basic JavaScript syntax:</p>
        
        <h4>Variables and Data Types</h4>
        <pre><code>// Variables
let name = "John";  // String
let age = 30;       // Number
let isStudent = true;  // Boolean
let hobbies = ["reading", "coding", "hiking"];  // Array
let person = {      // Object
  firstName: "John",
  lastName: "Doe",
  age: 30
};</code></pre>
        
        <h4>Functions</h4>
        <pre><code>// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Function expression
const sayGoodbye = function(name) {
  return "Goodbye, " + name + "!";
};

// Arrow function (ES6)
const multiply = (a, b) => a * b;</code></pre>
        
        <h4>Conditional Statements</h4>
        <pre><code>// If statement
if (age >= 18) {
  console.log("You are an adult");
} else {
  console.log("You are a minor");
}

// Switch statement
switch (day) {
  case "Monday":
    console.log("Start of the work week");
    break;
  case "Friday":
    console.log("End of the work week");
    break;
  default:
    console.log("Another day");
}</code></pre>
        
        <h4>Loops</h4>
        <pre><code>// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// For...of loop (for arrays)
for (const hobby of hobbies) {
  console.log(hobby);
}

// For...in loop (for objects)
for (const key in person) {
  console.log(key + ": " + person[key]);
}</code></pre>
        
        <h3>Your First JavaScript Program</h3>
        <p>Let's create a simple JavaScript program that changes the text of an HTML element when a button is clicked:</p>
        
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;My First JavaScript Program&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1 id="heading"&gt;Hello, World!&lt;/h1&gt;
    &lt;button id="changeText"&gt;Change Text&lt;/button&gt;
    
    &lt;script&gt;
        // Get references to the HTML elements
        const heading = document.getElementById('heading');
        const button = document.getElementById('changeText');
        
        // Add a click event listener to the button
        button.addEventListener('click', function() {
            heading.textContent = 'Hello, JavaScript!';
            heading.style.color = 'blue';
        });
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
        
        <h3>JavaScript and the DOM</h3>
        <p>The Document Object Model (DOM) is a programming interface for HTML documents. It represents the page so that programs can change the document structure, style, and content. JavaScript is the primary language used to manipulate the DOM.</p>
        
        <p>Common DOM operations include:</p>
        <ul>
          <li>Selecting elements</li>
          <li>Changing element content</li>
          <li>Modifying element styles</li>
          <li>Adding or removing elements</li>
          <li>Responding to user events (clicks, key presses, etc.)</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>JavaScript is a powerful language that brings your web pages to life. By understanding the basics of JavaScript, you're taking an important step toward creating interactive and dynamic websites.</p>
        
        <div class="bg-primary/10 p-4 rounded-md my-6">
          <h4 class="text-primary font-medium mb-2">Coming Up Next</h4>
          <p>In the next lesson, we'll explore JavaScript variables and data types in more detail.</p>
        </div>
      </div>
    `,
    interactiveElements: [
      {
        type: "quiz",
        data: {
          questions: [
            {
              question: "What is the primary purpose of JavaScript in web development?",
              type: "multiple-choice",
              options: [
                "To structure web content",
                "To style web pages",
                "To add interactivity and behavior to web pages",
                "To manage server-side operations",
              ],
              correctAnswer: "To add interactivity and behavior to web pages",
              points: 5,
            },
            {
              question: "Which of the following is NOT a way to add JavaScript to an HTML document?",
              type: "multiple-choice",
              options: ["Inline JavaScript", "Internal JavaScript", "External JavaScript", "Imported JavaScript"],
              correctAnswer: "Imported JavaScript",
              points: 5,
            },
            {
              question: "What does DOM stand for?",
              type: "multiple-choice",
              options: [
                "Document Object Model",
                "Data Object Model",
                "Document Oriented Markup",
                "Dynamic Object Management",
              ],
              correctAnswer: "Document Object Model",
              points: 5,
            },
          ],
        },
      },
    ],
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
  },
]

// Sample lessons for the Responsive Design module
export const responsiveLessons = [
  {
    _id: "lesson_responsive_intro",
    moduleId: "module_responsive_design",
    title: "Introduction to Responsive Web Design",
    contentType: "text",
    mediaUrls: [],
    estimatedMinutes: 25,
    content: `
      <div class="prose max-w-none">
        <h2>Welcome to Responsive Web Design!</h2>
        <p>Responsive web design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes.</p>
        
        <h3>What You'll Learn</h3>
        <p>In this lesson, you'll learn:</p>
        <ul>
          <li>What responsive web design is and why it's important</li>
          <li>The core principles of responsive design</li>
          <li>The mobile-first approach</li>
          <li>Tools and techniques for creating responsive websites</li>
        </ul>
        
        <h3>What is Responsive Web Design?</h3>
        <p>Responsive web design (RWD) is a web design approach that creates dynamic changes to the appearance of a website, depending on the screen size and orientation of the device being used to view it.</p>
        
        <p>In the past, developers would create different versions of a website for different devices (desktop, tablet, mobile). With responsive design, a single website can adapt to any screen size, providing an optimal viewing experience.</p>
        
        <div class="bg-light-gray p-4 rounded-md my-6">
          <h4 class="text-secondary font-medium mb-2">Why Responsive Design Matters</h4>
          <ul>
            <li><strong>Mobile Usage</strong>: Over 50% of web traffic comes from mobile devices</li>
            <li><strong>User Experience</strong>: Provides a better experience across all devices</li>
            <li><strong>SEO</strong>: Google prioritizes mobile-friendly websites in search results</li>
            <li><strong>Maintenance</strong>: Easier to maintain one responsive site than multiple device-specific sites</li>
          </ul>
        </div>
        
        <h3>Core Principles of Responsive Design</h3>
        
        <h4>1. Fluid Grids</h4>
        <p>Instead of using fixed-width layouts (e.g., pixels), responsive design uses relative units like percentages. This allows the layout to flex and adapt to different screen sizes.</p>
        
        <pre><code>.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.column {
  width: 33.33%; /* One-third of the container */
  float: left;
  padding: 0 15px;
}</code></pre>
        
        <h4>2. Flexible Images</h4>
        <p>Images need to scale with the layout to avoid overflow or distortion on smaller screens.</p>
        
        <pre><code>img {
  max-width: 100%;
  height: auto;
}</code></pre>
        
        <h4>3. Media Queries</h4>
        <p>Media queries allow you to apply different CSS styles based on the characteristics of the device, most commonly the width of the browser.</p>
        
        <pre><code>/* Base styles for all devices */
body {
  font-size: 16px;
}

/* Styles for tablets */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  .column {
    width: 50%; /* Two columns instead of three */
  }
}

/* Styles for mobile phones */
@media (max-width: 480px) {
  body {
    font-size: 12px;
  }
  .column {
    width: 100%; /* Full width - stacked layout */
  }
}</code></pre>
        
        <h3>The Mobile-First Approach</h3>
        <p>Mobile-first is a design strategy that prioritizes designing for mobile devices first, then progressively enhancing the design for larger screens.</p>
        
        <h4>Benefits of Mobile-First Design:</h4>
        <ul>
          <li>Forces you to focus on essential content and functionality</li>
          <li>Ensures a good experience on the most constrained devices</li>
          <li>Often results in faster-loading websites</li>
          <li>Aligns with how CSS naturally works (progressive enhancement)</li>
        </ul>
        
        <p>In practice, mobile-first means writing your base CSS for mobile devices and then using media queries to enhance the design for larger screens:</p>
        
        <pre><code>/* Base styles for mobile */
.column {
  width: 100%;
}

/* Enhance for tablets */
@media (min-width: 768px) {
  .column {
    width: 50%;
  }
}

/* Enhance for desktops */
@media (min-width: 1024px) {
  .column {
    width: 33.33%;
  }
}</code></pre>
        
        <h3>Tools and Techniques for Responsive Design</h3>
        
        <h4>1. Viewport Meta Tag</h4>
        <p>The viewport meta tag tells the browser how to control the page's dimensions and scaling:</p>
        
        <pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code></pre>
        
        <h4>2. CSS Flexbox and Grid</h4>
        <p>Modern CSS layout techniques like Flexbox and Grid make it much easier to create responsive layouts:</p>
        
        <pre><code>/* Flexbox example */
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 300px; /* Grow, shrink, basis */
}

/* Grid example */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}</code></pre>
        
        <h4>3. Responsive Typography</h4>
        <p>Text should be readable on all devices without requiring zoom:</p>
        
        <pre><code>/* Using relative units */
body {
  font-size: 16px; /* Base font size */
}

h1 {
  font-size: 2em; /* 2 times the base font size */
}

/* Using viewport units */
h1 {
  font-size: 5vw; /* 5% of the viewport width */
}

/* Using clamp for responsive sizing with min/max limits */
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}</code></pre>
        
        <h4>4. Responsive Testing Tools</h4>
        <p>Various tools can help you test your responsive designs:</p>
        <ul>
          <li>Browser DevTools (Chrome, Firefox, etc.)</li>
          <li>Online services like Responsinator or BrowserStack</li>
          <li>Physical device testing</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Responsive web design is essential in today's multi-device world. By understanding and applying its principles, you can create websites that provide an optimal viewing experience across a wide range of devices.</p>
        
        <div class="bg-primary/10 p-4 rounded-md my-6">
          <h4 class="text-primary font-medium mb-2">Coming Up Next</h4>
          <p>In the next lesson, we'll dive deeper into media queries and learn how to use them effectively for responsive design.</p>
        </div>
      </div>
    `,
    interactiveElements: [
      {
        type: "quiz",
        data: {
          questions: [
            {
              question: "What is responsive web design?",
              type: "multiple-choice",
              options: [
                "Creating separate websites for different devices",
                "An approach that makes web pages render well on a variety of devices and screen sizes",
                "Designing websites exclusively for mobile devices",
                "Using JavaScript to detect device types",
              ],
              correctAnswer: "An approach that makes web pages render well on a variety of devices and screen sizes",
              points: 5,
            },
            {
              question: "Which of the following is NOT a core principle of responsive design?",
              type: "multiple-choice",
              options: ["Fluid grids", "Flexible images", "Media queries", "Fixed layouts"],
              correctAnswer: "Fixed layouts",
              points: 5,
            },
            {
              question: "What does the 'mobile-first' approach mean?",
              type: "multiple-choice",
              options: [
                "Creating a mobile app before a website",
                "Designing for mobile devices first, then progressively enhancing for larger screens",
                "Only supporting mobile devices",
                "Testing on mobile devices before desktop",
              ],
              correctAnswer: "Designing for mobile devices first, then progressively enhancing for larger screens",
              points: 5,
            },
          ],
        },
      },
    ],
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-15"),
  },
]

// Sample assessments
export const assessments = [
  {
    _id: "assessment_html_basics",
    moduleId: "module_html_basics",
    title: "HTML Fundamentals Assessment",
    description: "Test your knowledge of HTML basics, document structure, and semantic elements.",
    type: "quiz",
    questions: [
      {
        question: "What does HTML stand for?",
        type: "multiple-choice",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyperlink and Text Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
        points: 10,
      },
      {
        question: "Which HTML element is used to define the main heading of a document?",
        type: "multiple-choice",
        options: ["<heading>", "<h1>", "<head>", "<main>"],
        correctAnswer: "<h1>",
        points: 10,
      },
      {
        question: "Which tag is used to create a hyperlink?",
        type: "multiple-choice",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: "<a>",
        points: 10,
      },
      {
        question: "Which of the following is a semantic HTML element?",
        type: "multiple-choice",
        options: ["<div>", "<span>", "<article>", "<container>"],
        correctAnswer: "<article>",
        points: 10,
      },
      {
        question: "What is the correct HTML for creating a form?",
        type: "multiple-choice",
        options: ["<form>", "<input>", "<section form>", "<fieldset>"],
        correctAnswer: "<form>",
        points: 10,
      },
      {
        question: "True or False: HTML is a programming language.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 10,
      },
      {
        question: "True or False: The <meta> tag is placed inside the <body> element.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 10,
      },
      {
        question: "Explain the importance of semantic HTML and give three examples of semantic elements.",
        type: "open-ended",
        points: 30,
      },
    ],
    passingScore: 70,
    aiEvaluationParams: {
      rubric:
        "Evaluate based on understanding of HTML concepts, correct identification of semantic elements, and explanation of their importance for accessibility and SEO.",
      evaluationPrompt: "Evaluate this answer about semantic HTML. Consider accuracy, completeness, and clarity.",
    },
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    _id: "assessment_css_fundamentals",
    moduleId: "module_css_fundamentals",
    title: "CSS Styling Assessment",
    description: "Test your knowledge of CSS selectors, properties, and layout techniques.",
    type: "quiz",
    questions: [
      {
        question: "Which CSS property is used to change the text color?",
        type: "multiple-choice",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: "color",
        points: 10,
      },
      {
        question: "Which CSS selector selects all elements with the class 'example'?",
        type: "multiple-choice",
        options: ["#example", ".example", "example", "*example"],
        correctAnswer: ".example",
        points: 10,
      },
      {
        question: "Which property is used to create space between the border and content of an element?",
        type: "multiple-choice",
        options: ["margin", "padding", "spacing", "border-spacing"],
        correctAnswer: "padding",
        points: 10,
      },
      {
        question: "Which value of the 'display' property makes an element a block-level flex container?",
        type: "multiple-choice",
        options: ["inline", "block", "flex", "grid"],
        correctAnswer: "flex",
        points: 10,
      },
      {
        question: "Which CSS property is used to specify the stack order of an element?",
        type: "multiple-choice",
        options: ["z-index", "position", "stack-order", "layer"],
        correctAnswer: "z-index",
        points: 10,
      },
      {
        question:
          "True or False: The 'margin: 10px 20px;' declaration sets the top and bottom margins to 10px, and the left and right margins to 20px.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        points: 10,
      },
      {
        question: "True or False: In CSS, 'em' units are relative to the font-size of the parent element.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        points: 10,
      },
      {
        question: "Explain the CSS Box Model and how padding, border, and margin affect an element's dimensions.",
        type: "open-ended",
        points: 30,
      },
    ],
    passingScore: 70,
    aiEvaluationParams: {
      rubric:
        "Evaluate based on understanding of CSS concepts, correct explanation of the box model, and clarity of explanation.",
      evaluationPrompt: "Evaluate this answer about the CSS Box Model. Consider accuracy, completeness, and clarity.",
    },
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    _id: "assessment_js_intro",
    moduleId: "module_js_intro",
    title: "JavaScript Basics Assessment",
    description: "Test your knowledge of JavaScript fundamentals, variables, functions, and DOM manipulation.",
    type: "quiz",
    questions: [
      {
        question: "Which of the following is a correct way to declare a variable in JavaScript?",
        type: "multiple-choice",
        options: ["var name = 'John';", "variable name = 'John';", "v name = 'John';", "$name = 'John';"],
        correctAnswer: "var name = 'John';",
        points: 10,
      },
      {
        question: "Which method is used to add an element at the end of an array?",
        type: "multiple-choice",
        options: ["push()", "append()", "add()", "insert()"],
        correctAnswer: "push()",
        points: 10,
      },
      {
        question: "How do you select an element with the id 'demo' using JavaScript?",
        type: "multiple-choice",
        options: [
          "document.getElement('demo')",
          "document.getElementById('demo')",
          "document.querySelector('#demo')",
          "Both B and C",
        ],
        correctAnswer: "Both B and C",
        points: 10,
      },
      {
        question: "Which event occurs when a user clicks on an HTML element?",
        type: "multiple-choice",
        options: ["onmouseover", "onchange", "onclick", "onmouseclick"],
        correctAnswer: "onclick",
        points: 10,
      },
      {
        question: "What will the following code return: typeof []?",
        type: "multiple-choice",
        options: ["'array'", "'object'", "'undefined'", "'null'"],
        correctAnswer: "'object'",
        points: 10,
      },
      {
        question: "True or False: JavaScript is a case-sensitive language.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        points: 10,
      },
      {
        question: "True or False: The '===' operator checks for both value and type equality.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        points: 10,
      },
      {
        question:
          "Write a JavaScript function that takes an array of numbers and returns the sum of all numbers in the array.",
        type: "open-ended",
        points: 30,
      },
    ],
    passingScore: 70,
    aiEvaluationParams: {
      rubric:
        "Evaluate based on understanding of JavaScript concepts, correct implementation of the function, and code efficiency.",
      evaluationPrompt:
        "Evaluate this JavaScript function that sums an array of numbers. Consider accuracy, completeness, and efficiency.",
    },
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
  },
  {
    _id: "assessment_responsive_design",
    moduleId: "module_responsive_design",
    title: "Responsive Web Design Assessment",
    description: "Test your knowledge of responsive design principles, media queries, and mobile-first approach.",
    type: "quiz",
    questions: [
      {
        question: "What is the purpose of the viewport meta tag in responsive design?",
        type: "multiple-choice",
        options: [
          "To set the background color of the viewport",
          "To control the page's dimensions and scaling on different devices",
          "To hide content on mobile devices",
          "To enable JavaScript on mobile browsers",
        ],
        correctAnswer: "To control the page's dimensions and scaling on different devices",
        points: 10,
      },
      {
        question: "Which CSS property is used to make images responsive?",
        type: "multiple-choice",
        options: ["responsive-size: 100%;", "width: 100%;", "max-width: 100%;", "image-responsive: true;"],
        correctAnswer: "max-width: 100%;",
        points: 10,
      },
      {
        question: "Which of the following is a mobile-first media query?",
        type: "multiple-choice",
        options: [
          "@media (max-width: 768px) { ... }",
          "@media (min-width: 768px) { ... }",
          "@media screen and (width: 768px) { ... }",
          "@media mobile { ... }",
        ],
        correctAnswer: "@media (min-width: 768px) { ... }",
        points: 10,
      },
      {
        question: "Which CSS layout system is designed specifically for creating responsive grid layouts?",
        type: "multiple-choice",
        options: ["Flexbox", "Grid", "Float", "Position"],
        correctAnswer: "Grid",
        points: 10,
      },
      {
        question: "What is a breakpoint in responsive web design?",
        type: "multiple-choice",
        options: [
          "A point where the website stops working",
          "A specific viewport width where the layout changes",
          "A JavaScript error in the code",
          "The maximum width a website can have",
        ],
        correctAnswer: "A specific viewport width where the layout changes",
        points: 10,
      },
      {
        question: "True or False: Responsive design eliminates the need for a separate mobile website.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        points: 10,
      },
      {
        question:
          "True or False: The 'mobile-first' approach means designing for desktop first, then scaling down to mobile.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 10,
      },
      {
        question:
          "Explain the mobile-first approach to responsive design and discuss its advantages and potential challenges.",
        type: "open-ended",
        points: 30,
      },
    ],
    passingScore: 70,
    aiEvaluationParams: {
      rubric:
        "Evaluate based on understanding of responsive design concepts, correct explanation of mobile-first approach, and discussion of advantages and challenges.",
      evaluationPrompt:
        "Evaluate this answer about the mobile-first approach to responsive design. Consider accuracy, completeness, and clarity.",
    },
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-15"),
  },
]

// Sample progress data
export const progressData = {
  _id: "progress_user_course_web_dev",
  userId: "user_001",
  courseId: "course_web_dev_101",
  currentModule: "module_html_basics",
  currentLesson: "lesson_html_intro",
  completedLessons: ["lesson_html_intro"],
  assessmentResults: [],
  startDate: new Date("2025-04-01"),
  targetCompletionDate: new Date("2025-07-01"),
  completionPercentage: 5,
  lastAccessDate: new Date("2025-04-01"),
  createdAt: new Date("2025-04-01"),
  updatedAt: new Date("2025-04-01"),
}

// Function to seed the database with sample data
export async function seedDatabase(db) {
  try {
    // Insert course
    await db.collection("courses").insertOne(webDevCourse)

    // Insert modules
    await db.collection("modules").insertMany(webDevModules)

    // Insert lessons
    await db.collection("lessons").insertMany([...htmlLessons, ...cssLessons, ...jsLessons, ...responsiveLessons])

    // Insert assessments
    await db.collection("assessments").insertMany(assessments)

    // Insert progress data
    await db.collection("progress").insertOne(progressData)

    console.log("Database seeded successfully!")
    return true
  } catch (error) {
    console.error("Error seeding database:", error)
    return false
  }
}
