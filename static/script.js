document.addEventListener("DOMContentLoaded", () => {
  const openColorPickerBtn = document.getElementById("open-color-picker");
  const closeModalBtn = document.getElementById("close-modal");
  const colorPickerModal = document.getElementById("color-picker-modal");
  const bgColorPicker = document.getElementById("bg-color-picker");
  const color1Picker = document.getElementById("color1");
  const color2Picker = document.getElementById("color2");
  const angleOutput = document.getElementById("angle-output");
  const app = document.querySelector(".app");

  // Button color pickers
  const btnBackgroundColorPicker =
    document.getElementById("btnBackgroundColor");
  const btnHoverBackgroundColorPicker = document.getElementById(
    "btnHoverBackgroundColor"
  );
  const btnTextColorPicker = document.getElementById("btnTextColor");
  const btnHoverTextColorPicker = document.getElementById("btnHoverTextColor");
  const buttons = document.querySelectorAll(".btn");

  // Circular knob elements
  const angleSlider = document.getElementById("angle-slider");
  const angleKnob = document.getElementById("angle-knob");

  // Variables for angle
  let angle = 135;

  // Default values
  const defaultValues = {
    bgColor: "#e3d7c1",
    color1: "#e3d7c1",
    color2: "#9eb395",
    btnBackgroundColor: "#3d3229",
    btnHoverBackgroundColor: "#000",
    btnTextColor: "#ffffff",
    btnHoverTextColor: "#ffffff",
    checkboxBackground: "#4caf50",
  };

  // Open color picker modal
  openColorPickerBtn.addEventListener("click", () => {
    colorPickerModal.style.display = "block";
  });

  // Close color picker modal
  closeModalBtn.addEventListener("click", () => {
    colorPickerModal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === colorPickerModal) {
      colorPickerModal.style.display = "none";
    }
  });

  // Change background color
  bgColorPicker.addEventListener("input", (event) => {
    app.style.background = event.target.value;
    document.documentElement.style.setProperty(
      "--bg-color",
      event.target.value
    );
  });

  // Update gradient on color pick
  const updateGradient = () => {
    const color1 = color1Picker.value;
    const color2 = color2Picker.value;
    app.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    document.documentElement.style.setProperty(
      "--gradient-color1",
      color1Picker.value
    );
    document.documentElement.style.setProperty(
      "--gradient-color2",
      color2Picker.value
    );
    document.documentElement.style.setProperty(
      "--gradient-angle",
      `${angle}deg`
    );
  };

  // Select all buttons with the class 'predefined-color'
  const colorButtons = document.querySelectorAll(".predefined-color");

  // Loop through each button and apply the background color from data-color
  colorButtons.forEach((button) => {
    const color = button.getAttribute("data-color");
    button.style.background = color;
  });

  // Event listeners for predefined color buttons
  const predefinedColorButtons = document.querySelectorAll(".predefined-color");
  predefinedColorButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selectedColor = event.target.getAttribute("data-color");
      app.style.background = selectedColor;
      document.documentElement.style.setProperty("--bg-color", selectedColor);
    });
  });

  // Event listeners for color inputs
  color1Picker.addEventListener("input", updateGradient);
  color2Picker.addEventListener("input", updateGradient);

  // Function to set button background, hover, and text colors
  const updateButtonStyles = () => {
    buttons.forEach((button) => {
      const isActive = button.classList.contains("active");
      const isDeactive = button.classList.contains("deactive");

      // Update button background color
      if (isActive) {
        button.style.backgroundColor = btnBackgroundColorPicker.value;
      } else if (isDeactive) {
        button.style.backgroundColor = `${btnBackgroundColorPicker.value}50`;
      } else {
        button.style.backgroundColor = btnBackgroundColorPicker.value;
      }

      // Update button text color
      button.style.color = btnTextColorPicker.value;

      // Hover styles
      button.onmouseover = () => {
        button.style.backgroundColor = btnHoverBackgroundColorPicker.value;
        button.style.color = btnHoverTextColorPicker.value;
      };
      button.onmouseout = () => {
        button.style.backgroundColor = isActive
          ? btnBackgroundColorPicker.value
          : isDeactive
          ? `${btnBackgroundColorPicker.value}50`
          : btnBackgroundColorPicker.value;
        button.style.color = btnTextColorPicker.value;
      };
      document.documentElement.style.setProperty(
        "--btn-bg-color",
        btnBackgroundColorPicker.value
      );
      document.documentElement.style.setProperty(
        "--btn-hover-bg-color",
        btnHoverBackgroundColorPicker.value
      );
      document.documentElement.style.setProperty(
        "--btn-text-color",
        btnTextColorPicker.value
      );
      document.documentElement.style.setProperty(
        "--btn-hover-text-color",
        btnHoverTextColorPicker.value
      );
    });
  };

  btnBackgroundColorPicker.addEventListener("input", updateButtonStyles);
  btnHoverBackgroundColorPicker.addEventListener("input", updateButtonStyles);
  btnTextColorPicker.addEventListener("input", updateButtonStyles);
  btnHoverTextColorPicker.addEventListener("input", updateButtonStyles);

  // Initialize button styles
  updateButtonStyles();

  // Function to reset all settings to default
  const resetToDefaults = () => {
    bgColorPicker.value = defaultValues.bgColor;
    color1Picker.value = defaultValues.color1;
    color2Picker.value = defaultValues.color2;
    btnBackgroundColorPicker.value = defaultValues.btnBackgroundColor;
    btnHoverBackgroundColorPicker.value = defaultValues.btnHoverBackgroundColor;
    btnTextColorPicker.value = defaultValues.btnTextColor;
    btnHoverTextColorPicker.value = defaultValues.btnHoverTextColor;

    // Reset app background and button styles
    app.style.background = defaultValues.bgColor;
    updateGradient();
    updateButtonStyles();

    // Reset checkbox styles
    document.documentElement.style.setProperty(
      "--bg-color",
      defaultValues.checkboxBackground
    );
  };

  // Event listener for reset button
  const resetButton = document.getElementById("reset-defaults");
  resetButton.addEventListener("click", resetToDefaults);

  // Function to calculate angle based on knob position
  const setKnobPosition = (angle) => {
    const radius = 40; // half of the slider size
    const radians = (angle - 90) * (Math.PI / 180); // Convert to radians
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    angleKnob.style.left = `${50 + x}px`; // Adjust left position
    angleKnob.style.top = `${50 + y}px`; // Adjust top position
    angleOutput.innerText = angle.toFixed(0); // Update angle display
    document.documentElement.style.setProperty("--knob-left", `${50 + x}px`);
    document.documentElement.style.setProperty("--knob-top", `${50 + y}px`);
    // Update gradient background live
    updateGradient();
  };

  // Function to calculate angle when knob is dragged
  const updateAngle = (event) => {
    const rect = angleSlider.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    angle = Math.atan2(y, x) * (180 / Math.PI) + 90; // Calculate angle
    angle = (angle + 360) % 360; // Normalize angle
    setKnobPosition(angle);
  };

  // Mouse events for angle selection
  angleKnob.addEventListener("mousedown", () => {
    document.addEventListener("mousemove", updateAngle);
  });

  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", updateAngle);
  });

  // Initialize knob position
  setKnobPosition(angle);

  // Function to fetch ingredients from db.json
  async function fetchIngredients() {
    try {
      const response = await fetch("db.json"); // Ensure this path is correct
      const data = await response.json(); // Parse JSON data

      const container = document.getElementById("ingredients-container");

      // Loop through each ingredient and create divs
      data[0].data.forEach((ingredient) => {
        const ingDiv = document.createElement("div");
        ingDiv.classList.add("ing-item");

        const label = document.createElement("label");
        label.classList.add("btn-checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        checkbox.addEventListener("change", () => {
          const checkedCheckboxes =
            document.querySelectorAll(".checkbox:checked");
          if (checkedCheckboxes.length > 10) {
            checkbox.checked = false;
            alert("You can only select up to 10 ingredients.");
          } else {
            updateSelectedCount();
          }
        });

        const img = document.createElement("img");
        img.src = "img/ing2.gif";
        img.alt = `Ingredient - ${ingredient.ING_Name}`;

        const para = document.createElement("p");
        para.textContent = ingredient.ING_Name;

        label.appendChild(checkbox);
        label.appendChild(img);
        label.appendChild(para);
        ingDiv.appendChild(label);

        container.appendChild(ingDiv);
      });
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  }

  // Call fetchIngredients when page loads
  fetchIngredients();

  // Function to update selected ingredients count
  function updateSelectedCount() {
    const checkboxes = document.querySelectorAll(".checkbox");
    const selectedCountElement = document.querySelector(".fi-top p span");
    let selectedCount = 0;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedCount++;
      }
    });

    selectedCountElement.textContent = `${selectedCount}/10`;
  }
});

// hide & show frames

// Toggle visibility of sections
const findCocktailBtn = document.getElementById("findCocktailBtn");
const addIngredientsBtn = document.getElementById("addIngredientsBtn");
const addCocktailBtn = document.getElementById("addCocktailBtn"); // Add this line
const findIngSection = document.querySelector(".find-ing");
const addIngSection = document.querySelector(".add-ing");
const addCocktailSection = document.querySelector(".add-cocktail"); // Add this line

// Function to show the "Find Cocktail" section
function showFindCocktail() {
  findIngSection.style.display = "block"; // Show Find Cocktail section
  addIngSection.style.display = "none"; // Hide Add Ingredients section
  addCocktailSection.style.display = "none"; // Hide Add Cocktail section
  findCocktailBtn.classList.add("active"); // Set Find Cocktail button active
  findCocktailBtn.classList.remove("deactive"); // Ensure it's not deactivated
  addIngredientsBtn.classList.remove("active"); // Remove active from Add Ingredients
  addIngredientsBtn.classList.add("deactive"); // Set Add Ingredients button deactivated
  addCocktailBtn.classList.remove("active"); // Remove active from Add Cocktail
  addCocktailBtn.classList.add("deactive"); // Set Add Cocktail button deactivated
  updateButtonStyles(); // Update button styles
}

// Function to show the "Add Ingredients" section
function showAddIngredients() {
  findIngSection.style.display = "none"; // Hide Find Cocktail section
  addIngSection.style.display = "block"; // Show Add Ingredients section
  addCocktailSection.style.display = "none"; // Hide Add Cocktail section
  addIngredientsBtn.classList.add("active"); // Set Add Ingredients button active
  addIngredientsBtn.classList.remove("deactive"); // Ensure it's not deactivated
  findCocktailBtn.classList.remove("active"); // Remove active from Find Cocktail
  findCocktailBtn.classList.add("deactive"); // Set Find Cocktail button deactivated
  addCocktailBtn.classList.remove("active"); // Remove active from Add Cocktail
  addCocktailBtn.classList.add("deactive"); // Set Add Cocktail button deactivated
  updateButtonStyles(); // Update button styles
}

// Function to show the "Add Cocktail" section
function showAddCocktail() {
  findIngSection.style.display = "none"; // Hide Find Cocktail section
  addIngSection.style.display = "none"; // Hide Add Ingredients section
  addCocktailSection.style.display = "block"; // Show Add Cocktail section
  addCocktailBtn.classList.add("active"); // Set Add Cocktail button active
  addCocktailBtn.classList.remove("deactive"); // Ensure it's not deactivated
  findCocktailBtn.classList.remove("active"); // Remove active from Find Cocktail
  findCocktailBtn.classList.add("deactive"); // Set Find Cocktail button deactivated
  addIngredientsBtn.classList.remove("active"); // Remove active from Add Ingredients
  addIngredientsBtn.classList.add("deactive"); // Set Add Ingredients button deactivated
  updateButtonStyles(); // Update button styles
}

// Add click event listeners to the buttons
findCocktailBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default anchor behavior
  showFindCocktail();
});

addIngredientsBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default anchor behavior
  showAddIngredients();
});

// Add click event listener for Add Cocktail button
addCocktailBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default anchor behavior
  showAddCocktail(); // Call the new function to show Add Cocktail
});
