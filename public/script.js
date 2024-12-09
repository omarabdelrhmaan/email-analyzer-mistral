// public/script.js

document.getElementById("submitBtn").addEventListener("click", async () => {
  const userInput = document.getElementById("userInput").value.trim();
  const outputDiv = document.getElementById("output");
  const outputText = document.getElementById("outputText");
  const spinner = document.getElementById("spinner");

  if (!userInput) {
    outputText.textContent = "Please enter some text.";
    return;
  }

  // Check character limit if implemented
  if (userInput.length > MAX_INPUT_LENGTH) {
    outputText.textContent = `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  // Show spinner and clear previous output
  spinner.classList.remove("hidden");
  outputText.textContent = "";
  outputDiv.classList.add("loading");

  try {
    const apiUrl = "/api/agent"; // Relative path

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error occurred.");
    }

    const data = await response.json();
    outputText.textContent = data.response || JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error:", error);
    if (error.message.includes("Input exceeds")) {
      outputText.textContent = `Error: ${error.message}`;
    } else if (error.message.includes("API error")) {
      outputText.textContent = `Server Error: Please try again later.`;
    } else {
      outputText.textContent = `An unexpected error occurred. Please try again.`;
    }
  } finally {
    // Hide spinner and remove loading state
    spinner.classList.add("hidden");
    outputDiv.classList.remove("loading");
  }
});

// Submit on Enter key press
document
  .getElementById("userInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      // Submit on Enter without Shift
      event.preventDefault(); // Prevent adding a newline
      document.getElementById("submitBtn").click();
    }
  });

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});

// Auto-resize Textarea
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto"; // Reset height to calculate scrollHeight correctly
  textarea.style.height = textarea.scrollHeight + "px"; // Set to scrollHeight
}

const textarea = document.getElementById("userInput");
textarea.addEventListener("input", function () {
  autoResizeTextarea(this);
  updateCharCount(this.value.length);
});

// Initialize the textarea height on page load
window.addEventListener("load", function () {
  autoResizeTextarea(textarea);
  updateCharCount(textarea.value.length);
});

// Character Count Function
const charCount = document.getElementById("charCount");
const MAX_INPUT_LENGTH = 10000; // Define maximum characters

function updateCharCount(length) {
  charCount.textContent = `${length} character${length !== 1 ? "s" : ""}`;

  if (length > MAX_INPUT_LENGTH) {
    charCount.style.color = "red";
  } else {
    charCount.style.color = "#555";
  }
}
