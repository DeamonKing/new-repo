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
});

let activeMenu = "findCocktail"; // Default active menu

// Toggle visibility of sections
const findCocktailBtn = document.getElementById("findCocktailBtn");
const addIngredientsBtn = document.getElementById("addIngredientsBtn");
const addCocktailBtn = document.getElementById("addCocktailBtn");
const allCocktailsBtn = document.getElementById("allCocktailsBtn");
const cotailInfoBtn = document.getElementById("cotailInfo"); // New button
const findIngSection = document.querySelector(".find-ing");
const addIngSection = document.querySelector(".add-ing");
const addCocktailSection = document.querySelector(".add-cocktail");
const allCocktailSection = document.querySelector(".all-cocktail");
const cocktailDetailsSection = document.querySelector(".cocktail-details"); // New section for cocktail details
const assignPipelineBtn = document.getElementById("assignPipeline");
const selectPipelineSection = document.querySelector(".select-pipeline");

// Function to show the "Find Cocktail" section
function showFindCocktail() {
  findIngSection.style.display = "block";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "none"; // Hide Cocktail Details section
  selectPipelineSection.style.display = "none";
  findCocktailBtn.classList.add("active");
  findCocktailBtn.classList.remove("deactive");
  addIngredientsBtn.classList.remove("active");
  addIngredientsBtn.classList.add("deactive");
  addCocktailBtn.classList.remove("active");
  addCocktailBtn.classList.add("deactive");
  assignPipelineBtn.classList.remove("active");
  assignPipelineBtn.classList.add("deactive");
  allCocktailsBtn.classList.remove("active");
  allCocktailsBtn.classList.add("deactive");
  cotailInfoBtn.classList.remove("active"); // Remove active from Cocktail Info
  cotailInfoBtn.classList.add("deactive");
  updateButtonStyles();
}

// Function to show the "Add Ingredients" section
function showAddIngredients() {
  findIngSection.style.display = "none";
  addIngSection.style.display = "block";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "none";
  selectPipelineSection.style.display = "none";
  addIngredientsBtn.classList.add("active");
  addIngredientsBtn.classList.remove("deactive");
  findCocktailBtn.classList.remove("active");
  findCocktailBtn.classList.add("deactive");
  addCocktailBtn.classList.remove("active");
  addCocktailBtn.classList.add("deactive");
  assignPipelineBtn.classList.remove("active");
  assignPipelineBtn.classList.add("deactive");
  allCocktailsBtn.classList.remove("active");
  allCocktailsBtn.classList.add("deactive");
  cotailInfoBtn.classList.remove("active");
  cotailInfoBtn.classList.add("deactive");
  updateButtonStyles();
  fetchIngredientsID();
}

// Function to show the "Add Cocktail" section
function showAddCocktail() {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "block";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "none";
  selectPipelineSection.style.display = "none";
  addCocktailBtn.classList.add("active");
  addCocktailBtn.classList.remove("deactive");
  findCocktailBtn.classList.remove("active");
  findCocktailBtn.classList.add("deactive");
  addIngredientsBtn.classList.remove("active");
  addIngredientsBtn.classList.add("deactive");
  assignPipelineBtn.classList.remove("active");
  assignPipelineBtn.classList.add("deactive");
  allCocktailsBtn.classList.remove("active");
  allCocktailsBtn.classList.add("deactive");
  cotailInfoBtn.classList.remove("active");
  cotailInfoBtn.classList.add("deactive");
  updateButtonStyles();
}

// Function to show the "All Cocktails" section
function showAllCocktails() {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "block"; // Show All Cocktails section
  cocktailDetailsSection.style.display = "none";
  selectPipelineSection.style.display = "none";
  allCocktailsBtn.classList.add("active");
  allCocktailsBtn.classList.remove("deactive");
  findCocktailBtn.classList.remove("active");
  findCocktailBtn.classList.add("deactive");
  addIngredientsBtn.classList.remove("active");
  addIngredientsBtn.classList.add("deactive");
  addCocktailBtn.classList.remove("active");
  addCocktailBtn.classList.add("deactive");
  assignPipelineBtn.classList.remove("active");
  assignPipelineBtn.classList.add("deactive");
  cotailInfoBtn.classList.remove("active");
  cotailInfoBtn.classList.add("deactive");
  updateButtonStyles();
}

// Function to show the "Cocktail Details" section
function showCocktailDetails() {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "block"; // Show Cocktail Details section
  selectPipelineSection.style.display = "none";
  cotailInfoBtn.classList.add("active");
  cotailInfoBtn.classList.remove("deactive");
  findCocktailBtn.classList.remove("active");
  findCocktailBtn.classList.add("deactive");
  addIngredientsBtn.classList.remove("active");
  addIngredientsBtn.classList.add("deactive");
  addCocktailBtn.classList.remove("active");
  addCocktailBtn.classList.add("deactive");
  assignPipelineBtn.classList.remove("active");
  assignPipelineBtn.classList.add("deactive");
  allCocktailsBtn.classList.remove("active");
  allCocktailsBtn.classList.add("deactive");
  updateButtonStyles();
}

// Function to show the "Assign Pipeline" section
function showAssignPipeline() {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "none";
  selectPipelineSection.style.display = "block"; // Show Assign Pipeline section
  assignPipelineBtn.classList.add("active");
  assignPipelineBtn.classList.remove("deactive");
  findCocktailBtn.classList.remove("active");
  findCocktailBtn.classList.add("deactive");
  addIngredientsBtn.classList.remove("active");
  addIngredientsBtn.classList.add("deactive");
  addCocktailBtn.classList.remove("active");
  addCocktailBtn.classList.add("deactive");
  allCocktailsBtn.classList.remove("active");
  allCocktailsBtn.classList.add("deactive");
  cotailInfoBtn.classList.remove("active");
  cotailInfoBtn.classList.add("deactive");
  updateButtonStyles();
}

// Add click event listeners to the buttons
findCocktailBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showFindCocktail();
});

addIngredientsBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showAddIngredients();
});

addCocktailBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showAddCocktail();
});

allCocktailsBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showAllCocktails(); // Show All Cocktails section
});

cotailInfoBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showCocktailDetails(); // Show Cocktail Details section
});

assignPipelineBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showAssignPipeline();
});

document
  .getElementById("add-new-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showAddIngredients();
  });

document.addEventListener("DOMContentLoaded", () => {
  // Check which menu should be active
  if (activeMenu === "addIngredients") {
    showAddIngredients();
  } else if (activeMenu === "addCocktail") {
    showAddCocktail();
  } else if (activeMenu === "allCocktails") {
    showAllCocktails(); // Default to All Cocktails
  } else if (activeMenu === "cocktailDetails") {
    showCocktailDetails(); // Default to Cocktail Details
  } else {
    showFindCocktail(); // Default
  }
});

document
  .getElementById("add-new-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showAddIngredients();
  });

document.addEventListener("DOMContentLoaded", () => {
  // Check which menu should be active
  if (activeMenu === "addIngredients") {
    showAddIngredients();
  } else if (activeMenu === "addCocktail") {
    showAddCocktail();
  } else if (activeMenu === "allCocktails") {
    showAllCocktails(); // Default to All Cocktails
  } else {
    showFindCocktail(); // Default
  }
});

document
  .getElementById("ingredient-image")
  .addEventListener("change", (event) => {
    event.preventDefault(); // Prevent default form submission
  });

// Function to handle focus-in and focus-out events
function checkFocus(event) {
  const inputs = document.querySelectorAll("input, textarea");
  let isAnyFieldFocused = false;

  // Check if the current target (focused element) is an input or textarea
  if (event.type === "focus") {
    isAnyFieldFocused = true;
  }

  // Send POST request based on focus event type
  if (isAnyFieldFocused) {
    fetch("/focus-in", {
      method: "POST",
    })
      .then((response) => response.text())
      .then((data) => console.log(data));
  } else {
    fetch("/focus-out", {
      method: "POST",
    })
      .then((response) => response.text())
      .then((data) => console.log(data));
  }
}

// Add event listeners for focus and blur events directly on input fields
document.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("focus", checkFocus);
  input.addEventListener("blur", checkFocus);
});

// Function to fetch existing ingredients and set up the form
async function fetchIngredientsID() {
  try {
    const response = await fetch("db.json");
    const data = await response.json();
    const ingredients = data[0].data;

    // Get the last ingredient ID and generate the new ID
    const lastId =
      ingredients.length > 0
        ? parseInt(ingredients[ingredients.length - 1].ING_ID)
        : 0;
    const newId = lastId + 1; // Calculate the new ID

    // Set the new ID as text content of the span
    document.getElementById("ingredient-id").textContent = newId; // Set new ID as text
  } catch (error) {
    console.error("Error fetching ingredients:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-button");
  fetchIngredientsID();

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const ingredientId = document.getElementById("ingredient-id").textContent; // Get the ID from the span
    const ingredientName = document.getElementById("ingredient-name").value;
    const ingredientType = document.getElementById("ingredient-type").value;
    const ingredientImageInput = document.getElementById("ingredient-image");
    const ingredientImage = ingredientImageInput.files[0]; // Get the selected image file

    // Initialize an array to collect error messages
    let errorMessages = [];

    // Validate inputs
    if (!ingredientId) {
      errorMessages.push("Ingredient ID is required.");
    }
    if (!ingredientName) {
      errorMessages.push("Ingredient Name is required.");
    }
    if (!ingredientType) {
      errorMessages.push("Ingredient Type is required.");
    }
    if (!ingredientImage) {
      errorMessages.push("Ingredient Image is required.");
    }

    // If there are error messages, alert the user and return
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n")); // Display all error messages in an alert
      return;
    }

    // Read the image file and convert it to a Base64 string
    const reader = new FileReader();
    reader.readAsDataURL(ingredientImage); // Convert image to Base64
    reader.onload = async () => {
      const newIngredient = {
        ING_ID: ingredientId,
        ING_Name: ingredientName,
        ING_Type: ingredientType,
        ING_IMG: reader.result, // Base64 string of the image
      };

      // Append new ingredient to db.json
      try {
        const response = await fetch("/addIngredient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newIngredient),
        });

        if (response.ok) {
          alert("Ingredient added successfully!");
          await fetchIngredients(); // Refresh the ingredient list after adding
          resetIngredientForm(); // Clear the form fields
          await fetchIngredientsID(); // Fetch new ID for the next ingredient
        } else {
          const errorText = await response.text();
          alert("Failed to add the ingredient. Server response: " + errorText);
        }
      } catch (error) {
        console.error("Error adding ingredient:", error);
        alert(
          "An error occurred while adding the ingredient: " + error.message
        );
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading image file:", error);
      alert("An error occurred while reading the image file: " + error.message);
    };
  });

  // Function to reset the ingredient form fields
  function resetIngredientForm() {
    document.getElementById("ingredient-name").value = ""; // Clear the ingredient name
    document.getElementById("ingredient-type").value = "Liquid"; // Reset to default type
    document.getElementById("ingredient-image").value = ""; // Clear the image input
    document.getElementById("image-name").textContent = ""; // Clear the displayed image name
  }

  // Function to display the selected image name
  function displayImageName() {
    const ingredientImageInput = document.getElementById("ingredient-image");
    const imageName = ingredientImageInput.files[0]
      ? ingredientImageInput.files[0].name
      : "";
    document.getElementById("image-name").textContent = imageName; // Display the image name
  }
});

let ingredientsData = []; // Global variable to store ingredients data

async function fetchIngredients(searchTerm = "") {
  try {
    const response = await fetch("db.json"); // Ensure this path is correct
    const data = await response.json(); // Parse JSON data
    ingredientsData = data[0].data; // Store the data globally

    const container = document.getElementById("ingredients-container");
    container.innerHTML = ""; // Clear existing ingredients

    // Loop through each ingredient and create divs
    data[0].data.forEach((ingredient) => {
      const ingredientName = ingredient.ING_Name.toLowerCase(); // Convert to lower case for case-insensitive comparison

      // Check if searchTerm is empty or if the ingredient name includes the search term
      if (
        searchTerm === "" ||
        ingredientName.includes(searchTerm.toLowerCase())
      ) {
        const ingDiv = document.createElement("div");
        ingDiv.classList.add("ing-item");

        const label = document.createElement("label");
        label.classList.add("btn-checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        // Add event listener to update selected count when checkbox changes
        checkbox.addEventListener("change", updateSelectedCount);

        // Create the ingredient image
        const imgSrc =
          ingredient.ING_IMG && ingredient.ING_IMG.trim() !== ""
            ? ingredient.ING_IMG
            : "img/ing2.gif";
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `Ingredient - ${ingredient.ING_Name}`;

        const para = document.createElement("p");
        para.textContent = ingredient.ING_Name;

        label.appendChild(checkbox);
        label.appendChild(img);
        label.appendChild(para);
        ingDiv.appendChild(label);
        container.appendChild(ingDiv);
      }
    });

    // Call updateSelectedCount to initialize the count
    updateSelectedCount();
  } catch (error) {
    console.error(`Error fetching ingredients: ${error.message}`); // Log error to server
  }
}

// Function to update the selected ingredients count
function updateSelectedCount() {
  const checkboxes = document.querySelectorAll(".checkbox");
  const selectedCountElement = document.querySelector(".fi-top p span");
  let selectedCount = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedCount++;
    }
  });

  selectedCountElement.textContent = `${selectedCount}/10`; // Update displayed count
}

document.addEventListener("DOMContentLoaded", () => {
  fetchIngredients(); // Load all ingredients initially
});

document.addEventListener("DOMContentLoaded", () => {
  // Function to handle input changes in the search box
  function handleSearchInput() {
    const searchInput = document.getElementById("ingredient-search").value; // Get the input value
    fetchIngredients(searchInput); // Fetch ingredients based on the search input

    // Log the search term to the Python server
    console.error(`Search term: ${searchInput}`);
  }

  // Add event listener to the search input
  document
    .getElementById("ingredient-search")
    .addEventListener("input", handleSearchInput);
});

async function fetchIngredientsTypes() {
  try {
    const response = await fetch("db.json");
    const data = await response.json();
    const types = new Set(); // Use a Set to avoid duplicates

    // Loop through each ingredient to collect types
    data[0].data.forEach((ingredient) => {
      types.add(ingredient.ING_Type);
    });

    // Create filter buttons based on the types
    const filterContainer = document.getElementById("ing-filterfind");
    types.forEach((type) => {
      const button = document.createElement("a");
      button.className = "btn deactive";
      button.setAttribute("data-type", type);
      button.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter
      filterContainer.appendChild(button);

      // Add click event to filter by type
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const selectedType = button.getAttribute("data-type");
        filterIngredientsByType(selectedType);
      });
    });
  } catch (error) {
    console.error("Error fetching ingredient types:", error);
  }
}

function filterIngredientsByType(type) {
  const checkboxes = document.querySelectorAll(".checkbox");
  const selectedCountElement = document.querySelector(".fi-top p span");
  let selectedCount = 0;

  checkboxes.forEach((checkbox, index) => {
    const ingredientType = ingredientsData[index].ING_Type; // Assuming you have a global ingredientsData array
    const ingredientItem = checkbox.closest(".ing-item");

    // Show all ingredients if 'all' is selected, otherwise filter by type
    if (type === "all" || ingredientType === type) {
      ingredientItem.style.display = "flex";
    } else {
      ingredientItem.style.display = "none";
    }

    if (checkbox.checked) {
      selectedCount++;
    }
  });

  selectedCountElement.textContent = `${selectedCount}/10`; // Update displayed count
}

// Call fetchIngredientsTypes when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchIngredients(); // Load all ingredients initially
  fetchIngredientsTypes(); // Fetch ingredient types for filtering
});

document.querySelectorAll(".ing-filter a").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    const selectedType = button.getAttribute("data-type");

    // Remove active class from all buttons and add it to the clicked button
    document
      .querySelectorAll(".ing-filter a")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Call filter function with the selected type
    filterIngredientsByType(selectedType);
  });
});
