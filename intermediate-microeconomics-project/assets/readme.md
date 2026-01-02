# Instructions
## Files
1. answer.js: Within the exercise page there is a button "Answers", and this script controls it.
2. concepts.css: controls three types of pages, that is:
    - [Students page>Concepts](https://joshua-benjamin-miller.github.io/intermediate-microeconomics-project/week1/concepts.html)
    - [Students page>Exercise](https://joshua-benjamin-miller.github.io/intermediate-microeconomics-project/week1/exercise.html)
    - [Instructor pages>graphs](https://joshua-benjamin-miller.github.io/intermediate-microeconomics-project/Instructor-Page/Foundations-of-Consumer-Behavior.html)
2. desmos-loader.js: The relevant graph .html calls this piece of Javacript
      - line 4-5: gets the json associated with the .html. They must have the same name (prefix):
    ```
    filename = filename.replace(/\.html$/i, "");
    const jsonPath = `${filename}.json`;
    ```
      - line 8: goes to the <div> element of the html  gets the element 
    ```const elt = document.getElementById("calculator");```
      - line 15: it displays the (blank) desmos calculator at that position within the html element
    ```
      window.Calc = Desmos.GraphingCalculator(elt, {
        expressionsCollapsed: true,
        keypad:false
      });
    ```
      - line 21: get the JSON data and fill the blank calculator
   ```fetch(jsonPath)...```
      - or example in week1/4-axis-Cost-Benefit.html
    Line 48 has:  ```<div id="calculator"></div>```
    Line 76 has: ```<script src="../assets/desmos-loader.js"></script>``` which loads the javascript

6. export-desmons.js
7. graph.css
8. navbar-loader.js
9. navbar.html
10. navbarG-loader.js
11. navbarH-loader.js
12. navbarH.html
13. site.css

## Changing Files
1. To change navbar and make them consistent, three places need to be changed
  - navbar.html
  - navbarG-loader.js
  - navbarH.html.
