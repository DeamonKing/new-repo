
document.addEventListener("DOMContentLoaded", () => {
  // Load all ingredients initially
  fetchIngredients(); 
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

  // Set up event listeners for buttons
  document.getElementById("add-new-btn").addEventListener("click", function (event) {
    event.preventDefault();
    showAddIngredients();
  });

  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
  }
  function handleSearchInput() {
    const searchInput = document.getElementById("ingredient-search").value;
    fetchIngredients(searchInput);
  }

  // Set up event listener for search input
  document
    .getElementById("ingredient-search")
    .addEventListener("input", debounce(handleSearchInput, 300));

  // Fetch ingredients ID when the DOM is loaded
  fetchIngredientsID();
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


document.getElementById("serial-out-button").addEventListener("click", () => {
    const assignedPipes = {};
    const ingredientDivs = document.querySelectorAll(".selected-ingredients-container > div");
    let errorMessages = []; // Array to collect error messages

    ingredientDivs.forEach(div => {
        const ingredientName = div.querySelector("span").textContent;
        const selectedPipe = div.querySelector("select").value;

        // Check if a pipe has been assigned
        if (!selectedPipe) {
            errorMessages.push(`Please assign a pipeline for ${ingredientName}.`);
        } else {
            assignedPipes[ingredientName] = selectedPipe; // Store the assigned pipe for each ingredient
        }
    });

    // Display error messages if any
    if (errorMessages.length > 0) {
        alert(errorMessages.join("\n")); // Display all error messages in an alert
        return; // Prevent further processing if there are errors
    }

    // Show loading page
    showLoadingPage();

    // Send the assigned pipes to the Python server
    sendPipesToPython(assignedPipes);
});

// Function to send assigned pipelines to the Python script
function sendPipesToPython(assignedPipes) {
    fetch("/send-pipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assignedPipes),
    })
    .then(response => response.text())
    .then(data => {
        // Check for 'OK' response
        if (data.trim() === 'OK') {
            console.log("Received OK from Python. Continuing...");
            // Hide loading page
            hideLoadingPage();
        }
    })
    .catch(error => {
        console.error("Error sending data to Python:", error);
        // Hide loading page in case of error
        hideLoadingPage();
    });
}

// Function to show the loading page
function showLoadingPage() {
    const loadingPage = document.getElementById("loading-page");
    loadingPage.style.display = "block"; // Show loading page
}

// Function to hide the loading page
function hideLoadingPage() {
    const loadingPage = document.getElementById("loading-page");
    loadingPage.style.display = "none"; // Hide loading page
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



document
  .getElementById("add-new-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showAddIngredients();
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
      })
      .then((response) => {
        console.log("Response received:", response);
        return response;
      })
      .catch((error) => {
        console.error("Error sending request:", error);
      });

      if (response.ok) {
        alert("Ingredient added successfully!");
        console.log("Refreshing ingredient list after adding...");
        await fetchIngredients(); // Refresh the ingredient list after adding
        console.log("Clearing form fields...");
        resetIngredientForm(); // Clear the form fields
        console.log("Fetching new ID for the next ingredient...");
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

// Function to update the selected count
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll(".checkbox");
    const selectedCountElement = document.querySelector(".fi-top p span");
    let selectedCount = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedCount++;
        }
    });

    // Check if the selected count exceeds 10
    if (selectedCount > 10) {
        // Deselect the latest checked checkbox
        const lastCheckedCheckbox = Array.from(checkboxes).reverse().find(checkbox => checkbox.checked);
        if (lastCheckedCheckbox) {
            lastCheckedCheckbox.checked = false; // Deselect the checkbox
            selectedCount--; // Decrement the selected count since we deselected a checkbox
            alert("You can only select up to 10 ingredients."); // Optional alert
        }
    }

    // Update displayed count
    selectedCountElement.textContent = `${selectedCount}/10`; // Update displayed count
}

// Add event listener to checkboxes to update the count and enforce limit
document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
        // Update the count and enforce the limit
        updateSelectedCount();
    });
});

// Initial call to set the count display
updateSelectedCount();

document.addEventListener("DOMContentLoaded", () => {
  // Function to handle input changes in the search box
  function handleSearchInput() {
    const searchInput = document.getElementById("ingredient-search").value; // Get the input value
    fetchIngredients(searchInput); // Fetch ingredients based on the search input

    // Log the search term to the Python server
    console.log(`Search term: ${searchInput}`);
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


// Function to filter ingredients by type
function filterIngredientsByType(type) {
  const checkboxes = document.querySelectorAll(".checkbox");
  const selectedCountElement = document.querySelector(".fi-top p span");
  let selectedCount = 0;

  checkboxes.forEach((checkbox, index) => {
      const ingredientItem = checkbox.closest(".ing-item");
      const ingredientType = ingredientsData[index].ING_Type; // Assuming you have a global ingredientsData array

      // Show all ingredients if 'all' is selected, otherwise filter by type
      if (type === "all" || ingredientType.toLowerCase() === type.toLowerCase()) {
          ingredientItem.style.display = "flex"; // Show the ingredient item
      } else {
          ingredientItem.style.display = "none"; // Hide the ingredient item
      }

      if (checkbox.checked) {
          selectedCount++;
      }
  });

  selectedCountElement.textContent = `${selectedCount}/10`; // Update displayed count
}

// Add event listeners to filter buttons
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

document.getElementById("back-button").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default button behavior
  console.log("Back button clicked");
  showFindCocktail(); // Call the function to show the Find Cocktail section
  console.log("Find Cocktail section displayed");
});

document.getElementById("back-button3").addEventListener("click", (event) => {
event.preventDefault(); // Prevent default button behavior
console.log("Back button 3 clicked");
showFindCocktail(); // Call the function to show the Find Cocktail section
console.log("Cocktail Details section displayed");
});

document.getElementById("back-button1").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default button behavior
  console.log("Back button 1 clicked");
  showFindCocktail(); // Call the function to show the Find Cocktail section
  console.log("Find Cocktail section displayed");
});

let selectedPipelines = {}; // Global object to keep track of selected pipelines

function showAssignPipeline() {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "none";
  selectPipelineSection.style.display = "block"; // Show Assign Pipeline section

  // Get the selected ingredients container
  const selectedIngredientsContainer = document.querySelector(".selected-ingredients-container");

  // Clear previous entries
  selectedIngredientsContainer.innerHTML = "";

  // Get selected ingredients
  const selectedIngredients = Array.from(document.querySelectorAll(".checkbox:checked"))
      .map(checkbox => {
          const ingredientItem = checkbox.closest(".ing-item");
          return ingredientItem.querySelector("p").textContent; // Get the ingredient name
      });

  // Populate the selected ingredients container
  selectedIngredients.forEach(ingredient => {
      const ingredientDiv = document.createElement("div");
      ingredientDiv.style.display = "flex"; // Flexbox for layout
      ingredientDiv.style.alignItems = "center"; // Center items vertically
      ingredientDiv.style.justifyContent = "space-between"; // Space between ingredient name and dropdown

      // Create a label for the ingredient
      const ingredientLabel = document.createElement("span");
      ingredientLabel.textContent = ingredient; // Display the ingredient name

      // Create a dropdown for assigning a pipe
      const pipeSelect = document.createElement("select");
      pipeSelect.innerHTML = `
          <option value="">Select Pipe</option>
          <option value="Pipe 1">Pipe 1</option>
          <option value="Pipe 2">Pipe 2</option>
          <option value="Pipe 3">Pipe 3</option>
          <option value="Pipe 4">Pipe 4</option>
          <option value="Pipe 5">Pipe 5</option>
          <option value="Pipe 6">Pipe 6</option>
          <option value="Pipe 7">Pipe 7</option>
          <option value="Pipe 8">Pipe 8</option>
          <option value="Pipe 9">Pipe 9</option>
          <option value="Pipe 10">Pipe 10</option>
          <option value="Pipe 11">Pipe 11</option>
          <option value="Pipe 12">Pipe 12</option>
      `;

      // Append the label and dropdown to the ingredient div
      ingredientDiv.appendChild(ingredientLabel);
      ingredientDiv.appendChild(pipeSelect);
      selectedIngredientsContainer.appendChild(ingredientDiv);

      // Add event listener to track selected pipelines
      pipeSelect.addEventListener("change", (event) => {
          const selectedPipe = event.target.value;

          // If a pipe is selected, add it to the selectedPipelines object
          if (selectedPipe) {
              selectedPipelines[ingredient] = selectedPipe;
          } else {
              // If no pipe is selected, remove it from the selectedPipelines object
              delete selectedPipelines[ingredient];
          }

          // Update dropdowns to disable already selected pipelines
          updatePipelineDropdowns();
      });
  });

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
  updateButtonStyles();
}

// Function to update the pipeline dropdowns based on selected pipelines
function updatePipelineDropdowns() {
const dropdowns = document.querySelectorAll(".selected-ingredients-container select");

// Clear options in all dropdowns and store selected values
const selectedPipelines = Array.from(dropdowns)
    .map(dropdown => dropdown.value)
    .filter(value => value); // Filter out empty values

dropdowns.forEach(dropdown => {
    const currentSelection = dropdown.value;

    // Clear all options except the current selection
    Array.from(dropdown.querySelectorAll('option')).forEach(option => {
        if (option.value) {
            option.hidden = selectedPipelines.includes(option.value) && option.value !== currentSelection;
        }
    });
});
}


// Assuming this is within the DOMContentLoaded event listener
document.getElementById("clear-all-button").addEventListener("click", () => {
  // Select all checkboxes in the find cocktail section
  const checkboxes = document.querySelectorAll(".find-ing .checkbox");

  // Loop through each checkbox and uncheck it
  checkboxes.forEach(checkbox => {
      checkbox.checked = false; // Uncheck the checkbox
  });

  // Update the selected count display
  updateSelectedCount(); // Call the function to update the displayed count
});

// Add event listener for the "Clear All" button in the Assign Pipeline section
document.getElementById("clear-all-buttonpipe").addEventListener("click", () => {
  // Select all dropdowns in the selected ingredients container
  const dropdowns = document.querySelectorAll(".selected-ingredients-container select");

  // Loop through each dropdown and reset its value
  dropdowns.forEach(dropdown => {
      dropdown.value = ""; // Reset the dropdown to the default option
  });

  // Clear the selected pipelines object
  selectedPipelines = {}; // Reset the selected pipelines tracking

  // Optionally, you can also update the dropdowns to reflect the cleared state
  updatePipelineDropdowns(); // Call the function to update dropdowns
});

// Function to display the selected image name
function displayImageName() {
  // Get the file input element
  const fileInput = document.getElementById("ingredient-image"); // or "product-image" based on your context
  const imageNameDisplay = document.getElementById("image-name"); // The span where you want to display the image name

  // Check if a file is selected
  if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name; // Get the name of the selected file
      // Display the file name in the span with a message
  } else {
      imageNameDisplay.textContent = ""; // Clear the display if no file is selected
  }
}

// Function to show the "All Cocktails" section
async function showAllCocktails() {
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

// Fetch and display cocktails
await fetchCocktails();
}

// Function to fetch and display cocktails from products.json
async function fetchCocktails() {
try {
    const response = await fetch("products.json"); // Fetch the products data
    const cocktails = await response.json(); // Parse the JSON data

    const cocktailListContainer = document.querySelector(".cocktail-list"); // Select the cocktail list container
    cocktailListContainer.innerHTML = ""; // Clear existing content

    // Loop through each cocktail and create HTML elements
    cocktails.forEach(cocktail => {
        const cocktailItem = document.createElement("div");
        cocktailItem.classList.add("cl-item");
        cocktailItem.id = `cocktail-${cocktail.PID}`; // Set the ID for each cocktail item

        cocktailItem.innerHTML = `
            <img src="${cocktail.PImage}" alt="${cocktail.PName}" />
            <p>${cocktail.PName}</p>
        `;

        // Append the cocktail item to the cocktail list container
        cocktailListContainer.appendChild(cocktailItem);

        // Add click event to show cocktail details
        cocktailItem.addEventListener("click", () => {
            wshowCocktailDetails(cocktail);
        });
    });
} catch (error) {
    console.error("Error fetching cocktails:", error); // Log any errors
}
}

async function wshowCocktailDetails(cocktail) {
findIngSection.style.display = "none";
addIngSection.style.display = "none";
addCocktailSection.style.display = "none";
allCocktailSection.style.display = "none";
cocktailDetailsSection.style.display = "block"; // Show Cocktail Details section
selectPipelineSection.style.display = "none";

// Update the cocktail image and name
const cocktailImage = document.getElementById("cocktail-image");
const cocktailName = document.getElementById("cocktail-name");
const cocktailDescription = document.getElementById("cocktail-description");
const cocktailIngredientsContainer = document.getElementById("cocktail-ingredients-container");
const howToMake = document.getElementById("htm");

cocktailImage.src = cocktail.PImage; // Set the image source
cocktailName.textContent = cocktail.PName; // Set the cocktail name
cocktailDescription.textContent = cocktail.PDesc; // Set the description
howToMake.innerHTML = cocktail.PHtm; // Use innerHTML if PHtm contains HTML// Clear previous ingredients
cocktailIngredientsContainer.innerHTML = "";

// Fetch all ingredients data
const ingredientsData = await fetchIngredientsData();

cocktail.PIng.forEach(ingredient => {
    const ingredientId = ingredient.ING_ID;
    const ingredientDetail = ingredientsData.find(ing => ing.ING_ID === String(ingredientId));    
    console.log("Ingredient ID:", ingredientId);
    console.log("Ingredient Detail Found:", ingredientDetail);
    if (ingredientDetail) { // Check if ingredientDetail is found
        const ingredientItem = document.createElement("div");
        ingredientItem.classList.add("ing-item");
        ingredientItem.innerHTML = `
            <label class="btn-checkbox">
                <img src="img/ing2.gif" alt="Ingredient - ${ingredientDetail.ING_Name}" />
                <p>${ingredientDetail.ING_Name}</p>
            </label>
        `;
        cocktailIngredientsContainer.appendChild(ingredientItem);
    } else {
        console.warn(`Ingredient with ID ${ingredientId} not found in ingredients data.`);
    }
});

howToMake.textContent = cocktail.PHtm; // Set the how to make instructions
console.log("Cocktail Ingredients IDs:", cocktail.PIng);
console.log("How to Make Instructions:", howToMake.innerHTML); // Log the instructions
}

// Function to fetch all ingredients from db.json
async function fetchIngredientsData() {
const response = await fetch('db.json');
const data = await response.json();
return data[0].data; // Access the 'data' array within the first object
}