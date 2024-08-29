// <!DOCTYPE html>
<html>
<body>

{/* <!-- Page heading --> */}
<h1>Arrow Function</h1>

{/* <!-- Descriptive paragraph about the 'this' keyword --> */}
<p>The <strong>this</strong> keyword represents the Header object.</p>

{/* <!-- Button for triggering the color change --> */}
<button id="btn">Click Me!</button>

{/* <!-- Placeholder text to explain what 'this' represents --> */}
<p><strong>this</strong> represents:</p>

{/* <!-- Placeholder paragraph where the result will be displayed --> */}
<p id="demo"></p>

<script>
  {/* // Define a class named 'Header' */}
  class Header {
    constructor() {
      // Initialize a property 'color' with the value "Red"
      this.color = "Red";
    }

    // Arrow function to change the color (or perform some action)
    changeColor = () => {
      // Display the string representation of the 'this' context in the demo paragraph
      document.getElementById("demo").innerHTML += this;
    }
  }

  // Create an instance of the Header class
  const myheader = new Header();

  // When the window finishes loading, call the changeColor method
  window.addEventListener("load", myheader.changeColor);

  // When the button is clicked, call the changeColor method
  document.getElementById("btn").addEventListener("click", myheader.changeColor);

</script>

</body>
</html>
