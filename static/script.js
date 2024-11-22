// Constants
const MAX_INGREDIENTS = 10;
const DEBOUNCE_DELAY = 300;

// State management
let ingredientsData = [];
let selectedIngredients = [];
let activeMenu = "findCocktail";

// Global variable for cocktail ingredients
let selectedCocktailIngredients = [];
let selectedingforcocktail = [];

let extraIngredients = []; // Global array to hold extra ingredients

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupCocktailIngredientHandlers();
  fetchIngredientsForCocktail(); // Load cocktail ingredients
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

function checkActiveMenu() {
  // Show the appropriate section based on activeMenu
  if (activeMenu === "addIngredients") {
    showAddIngredients();
  } else if (activeMenu === "addCocktail") {
    showAddCocktail();
  } else if (activeMenu === "allCocktails") {
    showAllCocktails();
  } else if (activeMenu === "cocktailDetails") {
    showCocktailDetails();
  } else {
    showFindCocktail(); // Default
  }
}

function initializeApp() {
  fetchIngredients();
  setupEventListeners();
  checkActiveMenu();
}

function setupCocktailIngredientHandlers() {
  // Setup search functionality for cocktail ingredients
  const cocktailSearch = document.getElementById("cocktail-ingredient-search");
  if (cocktailSearch) {
    cocktailSearch.addEventListener("input", debounce(() => {
      const searchInput = cocktailSearch.value;
      fetchIngredientsForCocktail(searchInput);
    }, DEBOUNCE_DELAY));
  }

  // Setup filter functionality for cocktail ingredients
  document.querySelectorAll("#ing-filter-cocktail a").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedType = button.getAttribute("data-type");
      
      // Update active/deactive classes
      document.querySelectorAll("#ing-filter-cocktail a").forEach((btn) => {
        if (btn === button) {
          btn.classList.add("active");
          btn.classList.remove("deactive");
        } else {
          btn.classList.remove("active");
          btn.classList.add("deactive");
        }
      });
      updateButtonStyles();

      filterCocktailIngredientsByType(selectedType);
    });
  });
}


async function getNextProductId() {
  try {
      const response = await fetch('products.json');
      const products = await response.json();
      
      // Find the highest current ID
      const highestId = products.reduce((max, product) => {
          const productId = parseInt(product.PID); // Changed from product.id to product.PID
          return productId > max ? productId : max;
      }, 0);
      
      // Return the next available ID
      const nextId = highestId + 1;
      
      // Update the input field with the next ID
      const productIdInput = document.getElementById('product-id');
      if (productIdInput) {
          productIdInput.value = nextId; // Changed from value to textContent
      }
      
      return nextId;
  } catch (error) {
      console.error('Error getting next product ID:', error);
      return null;
  }
}

// Call getNextProductId when the page loads
document.addEventListener('DOMContentLoaded', () => {
  getNextProductId();
});


async function fetchIngredientsForCocktail(searchTerm = "") {
  try {
      const ingredients = await fetchIngredientsData();

      // Sort ingredients alphabetically by name
      ingredients.sort((a, b) => a.ING_Name.localeCompare(b.ING_Name));

      const container = document.getElementById("cocktail-ingredients-container1");
      container.innerHTML = ""; // Clear existing ingredients

      // Clear previous selections when fetching new ingredients
      selectedingforcocktail = [];

      ingredients.forEach((ingredient) => {
          if (searchTerm === "" || ingredient.ING_Name.toLowerCase().includes(searchTerm.toLowerCase())) {
              const ingDiv = document.createElement("div");
              ingDiv.classList.add("ing-item");

              const label = document.createElement("label");
              label.classList.add("btn-checkbox");

              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.classList.add("checkbox");
              checkbox.dataset.ingredientId = ingredient.ING_ID;
              checkbox.dataset.ingredientName = ingredient.ING_Name;

              // Check if this ingredient is already selected
              if (selectedCocktailIngredients.some(ing => ing.ING_Name === ingredient.ING_Name)) {
                  checkbox.checked = true; // Set checkbox to checked if selected
                  selectedingforcocktail.push(ingredient.ING_Name); // Add to selectedingforcocktail
                  console.log(`Ingredient ${ingredient.ING_Name} is already selected.`);
              }

              checkbox.addEventListener("change", (event) => {
                  handleCocktailIngredientSelection(event, ingredient);
                  // Update selectedingforcocktail array
                  if (event.target.checked) {
                      if (!selectedingforcocktail.includes(ingredient.ING_Name)) {
                          selectedingforcocktail.push(ingredient.ING_Name);
                      }
                  } else {
                      selectedingforcocktail = selectedingforcocktail.filter(name => name !== ingredient.ING_Name);
                  }
                  const counterElement = document.getElementById("cicount");
                  counterElement.textContent = `${selectedingforcocktail.length}/10`;
              });

              const img = document.createElement("img");
              img.src = ingredient.ING_IMG || "img/ing2.gif";
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
  } catch (error) {
      console.error("Error fetching ingredients for cocktail:", error);
  }
}

function handleCocktailIngredientSelection(event, ingredient) {
    if (event.target.checked) {
        if (selectedCocktailIngredients.length < MAX_INGREDIENTS) {
            selectedCocktailIngredients.push({
                ING_ID: ingredient.ING_ID,
                ING_Name: ingredient.ING_Name
            });
            console.log('Added ingredient to selectedCocktailIngredients:', ingredient.ING_Name);
        } else {
            event.target.checked = false; // Uncheck if max ingredients reached
            alert(`You can only select up to ${MAX_INGREDIENTS} ingredients.`);
            console.log('Max ingredients limit reached.');
        }
    } else {
        selectedCocktailIngredients = selectedCocktailIngredients.filter(ing => ing.ING_ID !== ingredient.ING_ID);
        console.log('Removed ingredient from selectedCocktailIngredients:', ingredient.ING_Name);
    }
}

function filterCocktailIngredientsByType(type) {
    const ingredients = document.querySelectorAll("#cocktail-ingredients-container1 .ing-item");
    ingredients.forEach((item) => {
        if (type === "all") {
            item.style.display = "flex";
        } else {
            const ingredientName = item.querySelector("p").textContent;
            const ingredient = ingredientsData.find(ing => ing.ING_Name === ingredientName);
            if (ingredient && ingredient.ING_Type.toLowerCase() === type.toLowerCase()) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        }
    });
}

function setupEventListeners() {
  // Ingredient filter buttons
  document.querySelectorAll(".ing-filter a").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
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

async function ShowProductsFunc() {
  const cocktails = await fetchCocktails();
  
  // Filter cocktails to find those whose ingredients match all selected ingredients
  const filteredCocktails = cocktails.filter(cocktail => {
    const cocktailIngredients = cocktail.PIng.map(ingredient => ingredient.ING_Name);
    // Check if all cocktail ingredients are included in the selected ingredients
    return cocktailIngredients.every(cocktailIngredient => selectedIngredients.includes(cocktailIngredient));
  });

  if (selectedIngredients.length === 0) {
    showCustomAlert('No ingredients selected. Please select at least one ingredient.');
    return;
  }

  // If no cocktails match the selected ingredients, show an alert
  if (filteredCocktails.length === 0) {
    showCustomAlert('No cocktails found that match all selected ingredients. Please try a different combination.');
    return; // Exit the function
  }

  // Determine extra selected ingredients that do not match any cocktails
  const cocktailIngredientNames = new Set(filteredCocktails.flatMap(cocktail => cocktail.PIng.map(ingredient => ingredient.ING_Name)));
  const extraSelectedIngredients = selectedIngredients.filter(ingredient => !cocktailIngredientNames.has(ingredient));

  // Update the global extraIngredients array
  extraIngredients = extraSelectedIngredients; // Store the extra ingredients in the global array

  // Create a new element to display extra selected ingredients
  const extraSelectedIngredientsContainer = document.getElementById("extra-selected-ingredients");
  extraSelectedIngredientsContainer.innerHTML = ""; // Clear previous contents

  if (extraSelectedIngredients.length > 0) {
    extraSelectedIngredientsContainer.innerHTML = `<h3>Extra Selected Ingredients:</h3><p>${extraSelectedIngredients.join(', ')}</p>`;
  } else {
    extraSelectedIngredientsContainer.innerHTML = ""; // Clear if no extra ingredients
  }

  console.log(filteredCocktails);
  console.log(selectedIngredients);

  displayCocktails(filteredCocktails);
}

document.getElementById("showProducts").addEventListener("click", async () => {
    ShowProductsFunc();
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
}; // Close setupEventListeners

// activeMenu is already declared at the top of the file

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
  
  // Load cocktail ingredients when showing add cocktail section
  fetchIngredientsForCocktail();
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
        showCustomAlert(errorMessages.join("\n")); // Display all error messages in an showCustomAlert
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
    .then(response => {
        if (response.ok) {
            return response.text(); // Get the response text if the response is OK
        } else {
            // If the response is not OK, throw an error with the status
            return response.text().then(errorText => {
                throw new Error(errorText); // Throw the error text from the server
            });
        }
    })
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
        // Hide loading page
        hideLoadingPage();

        // Display the error message on the loading page
        displayErrorMessage(error.message);
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

// Function to display error message on the loading page
function displayErrorMessage(message) {
    const loadingPage = document.getElementById("loading-page");
    loadingPage.innerHTML = `<h1>Error</h1><p>${message}</p><button id="cancel-button">Cancel</button>`;
    loadingPage.style.display = "block"; // Ensure the loading page is visible

    // Add event listener for cancel button
    document.getElementById("cancel-button").addEventListener("click", () => {
        hideLoadingPage(); // Hide loading page when canceled
    });
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

const elementsToTrack = [
  'ingredient-search',
  'cocktail-ingredient-search',
  'ingredient-name', 
  'product-name',    
  'product-description',
  'how-to-make'
];

let lastFocusState = false;

let lastActiveElement = null;

function checkFocus(event) {
  // Only handle focus events for specific elements that need server notification
  const targetId = event.target.id;
  
  if (!elementsToTrack.includes(targetId)) {
    return; // Don't process focus events for other input fields
  }

  // For blur events, check if we're switching to another tracked input
  if (event.type === "blur") {
    // Use setTimeout to check after the new element receives focus
    setTimeout(() => {
      const newActiveElement = document.activeElement;
      if (!elementsToTrack.includes(newActiveElement.id)) {
        updateFocusState(false);
      }
    }, 0);
  } else if (event.type === "focus") {
    updateFocusState(true);
  }
}

function updateFocusState(isFocused) {
  if (lastFocusState === isFocused) return; // Avoid duplicate requests
  
  lastFocusState = isFocused;
  if (isFocused) {
    fetch("/focus-in", {
      method: "POST",
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Focus event error:', error));
  } else {
    // Only send focus-out if we're not focused on any tracked input
    const activeElement = document.activeElement;
    if (!elementsToTrack.includes(activeElement.id)) {
      fetch("/focus-out", {
        method: "POST",
      })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error('Focus event error:', error));
    }
  }
}

function pollFocusState() {
  const activeElement = document.activeElement;
  const isFocused = elementsToTrack.includes(activeElement.id);
  if (isFocused !== lastFocusState) {
    updateFocusState(isFocused);
  }
}

// Add event listeners to all relevant input fields
const searchInputs = document.querySelectorAll("#ingredient-search, #cocktail-ingredient-search, #ingredient-name, #product-name, #product-desc, #how-to-make");
searchInputs.forEach((input) => {
  input.addEventListener("focus", checkFocus);
  input.addEventListener("blur", checkFocus);
});

// Start polling focus state every 200ms
setInterval(pollFocusState, 200);

// Function to fetch existing ingredients and set up the form
async function fetchIngredientsID() {
try {
  const response = await fetch("db.json");
  const data = await response.json();
  const ingredients = data;

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
    
    // Show loading screen
    document.getElementById("loading-page").style.display = "block";

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

    // If there are error messages, showCustomAlert the user and return
    if (errorMessages.length > 0) {
      showCustomAlert(errorMessages.join("\n")); // Display all error messages in an showCustomAlert
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
          // Wait for image processing to complete
          await waitForImageProcessing();
          
          // Hide loading screen
          document.getElementById("loading-page").style.display = "none";
          
          showCustomAlert("Ingredient added successfully!");
          console.log("Refreshing ingredient list after adding...");
          await fetchIngredients(); // Refresh the ingredient list after adding
          console.log("Clearing form fields...");
          resetIngredientForm(); // Clear the form fields
          console.log("Fetching new ID for the next ingredient...");
          await fetchIngredientsID(); // Fetch new ID for the next ingredient
          document.getElementById("ingredient-name").focus();
        } else {
          const errorText = await response.text();
          showCustomAlert("Failed to add the ingredient. Server response: " + errorText);
        }
      } catch (error) {
        console.error("Error adding ingredient:", error);
        showCustomAlert(
          "An error occurred while adding the ingredient: " + error.message
        );
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading image file:", error);
      showCustomAlert("An error occurred while reading the image file: " + error.message);
    };
  });

  // Function to reset the ingredient form fields
  function resetIngredientForm() {
    document.getElementById("ingredient-name").value = ""; // Clear the ingredient name
    document.getElementById("ingredient-type").value = "Liquid"; // Reset to default type
    document.getElementById("ingredient-image").value = ""; // Clear the image input
    document.getElementById("image-name").textContent = ""; // Clear the displayed image name
  }
  function resetIngredientForm() {
    enableForms(); // Enable inputs before resetting
    document.getElementById("ingredient-name").value = ""; // Clear the ingredient name
    document.getElementById("ingredient-type").value = "Liquid"; // Reset to default type
    document.getElementById("ingredient-image").value = ""; // Clear the image input
    document.getElementById("image-name").textContent = ""; // Clear the displayed image name
  }
  
  
});

enableForms();

function enableForms() {
  const inputs = document.querySelectorAll('input, textarea, select'); // Select all input fields
  inputs.forEach(input => {
      input.disabled = false; // Enable each input field
  });
}

async function fetchIngredients(searchTerm = "") {
    try {
        const response = await fetch("db.json");
        const data = await response.json();
        ingredientsData = data;

        // Sort ingredients alphabetically by name
        ingredientsData.sort((a, b) => a.ING_Name.localeCompare(b.ING_Name));

        const container = document.getElementById("ingredients-container");
        container.innerHTML = ""; // Clear existing ingredients

        // Loop through each ingredient and create divs
        ingredientsData.forEach((ingredient) => {
            const ingredientName = ingredient.ING_Name.toLowerCase();

            // Check if searchTerm is empty or if the ingredient name includes the search term
            if (searchTerm === "" || ingredientName.includes(searchTerm.toLowerCase())) {
                const ingDiv = document.createElement("div");
                ingDiv.classList.add("ing-item");

                const label = document.createElement("label");
                label.classList.add("btn-checkbox");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("checkbox");

                // Check if this ingredient was previously selected
                if (selectedIngredients.includes(ingredient.ING_Name)) {
                    checkbox.checked = true; // Keep it checked
                }

                // Add event listener to handle checkbox changes
                checkbox.addEventListener("change", (event) => {
                    const ingredientName = ingredient.ING_Name;
                    if (event.target.checked) {
                        // If checked, add to selectedIngredients
                    } else {
                        // If unchecked, remove from selectedIngredients
                        selectedIngredients = selectedIngredients.filter(name => name !== ingredientName);
                    }
                    updateSelectedCount(); // Update the selected count
                });

                const imgSrc = ingredient.ING_IMG && ingredient.ING_IMG.trim() !== "" ? ingredient.ING_IMG : "img/ing2.gif";
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

        updateSelectedCount(); // Update the selected count
    } catch (error) {
        console.error(`Error fetching ingredients: ${error.message}`);
    }
}


// Function to handle checkbox changes
function handleCheckboxChange(event) {
    const ingredientName = event.target.closest(".ing-item").querySelector("p").textContent;

    if (event.target.checked) {
        // If the checkbox is checked, check if we can add it
        if (selectedIngredients.length < 10) {
            selectedIngredients.push(ingredientName);
            console.log(selectedIngredients);
        } else {
            event.target.checked = false; // Uncheck the checkbox
            console.log(selectedIngredients);
            showCustomAlert("You can only select up to 10 ingredients."); // showCustomAlert the user
        }
    } else {
        // If the checkbox is unchecked, remove it from the selectedIngredients array
        selectedIngredients = selectedIngredients.filter(name => name !== ingredientName);
    }

    // Update the count display based on selectedIngredients
    updateSelectedCount();
}

// Function to update the selected count
function updateSelectedCount() {
    const selectedCount = selectedIngredients.length; // Get count from selectedIngredients array
    const selectedCountElement = document.querySelector(".fi-top p span");

    // Update displayed count
    selectedCountElement.textContent = `${Math.min(selectedCount, 10)}/10`; // Display count, max 10
}

// Add event delegation to the ingredients container
document.addEventListener("DOMContentLoaded", () => {
    const ingredientsContainer = document.querySelector('.ing-grid');

    ingredientsContainer.addEventListener('change', (event) => {
        if (event.target.matches('.checkbox')) {
            handleCheckboxChange(event);
        }
    });
});

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
    data.forEach((ingredient) => {
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

  // Loop through all checkboxes (ingredients)
  checkboxes.forEach((checkbox, index) => {
      const ingredientItem = checkbox.closest(".ing-item");

      // Check if the index is within the bounds of ingredientsData
      if (index < ingredientsData.length) {
          const ingredientType = ingredientsData[index].ING_Type; // Get the ingredient type

          // Show all ingredients if 'all' is selected, otherwise filter by type
          if (type === "all" || ingredientType.toLowerCase() === type.toLowerCase()) {
              ingredientItem.style.display = "flex"; // Show the ingredient item
          } else {
              ingredientItem.style.display = "none"; // Hide the ingredient item
          }
      } else {
          // If the index is out of bounds, simply hide the item
          ingredientItem.style.display = "none"; // Hide the ingredient item
      }
  });

  // Update button states to reflect the active filter
  document.querySelectorAll(".ing-filter a").forEach((btn) => {
      btn.classList.remove("active"); // Remove active class from all buttons
      btn.classList.add("deactive"); // Add deactive class to all buttons
      updateButtonStyles()
  });

  // Set the active class on the selected type button
  const activeButton = document.querySelector(`.ing-filter a[data-type="${type}"]`);
  if (activeButton) {
      activeButton.classList.add("active"); // Add active class to the clicked button
      activeButton.classList.remove("deactive"); // Remove deactive class from the clicked button
      updateButtonStyles()
    }
}

// Add event listeners to filter buttons
document.querySelectorAll(".ing-filter a").forEach((button) => {
  button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const selectedType = button.getAttribute("data-type");
      // Call filter function with the selected type
      filterIngredientsByType(selectedType);

      // Remove active class from all buttons and add it to the clicked button
      document
          .querySelectorAll(".ing-filter a")
          .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      
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
  showAllCocktails(); // Call the function to show the Find Cocktail section
  console.log("Find Cocktail section displayed");
});

let selectedPipelines = {}; // Global object to keep track of selected pipelines

function showAssignPipeline(cocktail) {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "none";
  selectPipelineSection.style.display = "block"; // Show Assign Pipeline section

  const selectedIngredientsContainer = document.querySelector(".selected-ingredients-container");
  selectedIngredientsContainer.innerHTML = ""; // Clear previous entries

  // Combine cocktail ingredients and extra ingredients
  const combinedIngredients = cocktail.PIng.concat(extraIngredients.map(ing => ({ ING_Name: ing })));

  // Populate the selected ingredients container with the combined ingredients
  combinedIngredients.forEach(ingredient => {
      const ingredientDiv = document.createElement("div");
      ingredientDiv.style.display = "flex"; // Flexbox for layout
      ingredientDiv.style.alignItems = "center"; // Center items vertically
      ingredientDiv.style.justifyContent = "space-between"; // Space between ingredient name and dropdown

      // Create a label for the ingredient
      const ingredientLabel = document.createElement("span");
      ingredientLabel.textContent = ingredient.ING_Name; // Display the ingredient name

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
              selectedPipelines[ingredient.ING_Name] = selectedPipe; // Use ingredient name as key
          } else {
              // If no pipe is selected, remove it from the selectedPipelines object
              delete selectedPipelines[ingredient.ING_Name];
          }

          // Update dropdowns to disable already selected pipelines
          updatePipelineDropdowns();
      });
  });

  // Update button states
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

document.getElementById("clear-all-button").addEventListener("click", () => {
  // Clear all selected checkboxes
  const checkboxes = document.querySelectorAll(".checkbox");
  checkboxes.forEach(checkbox => {
      checkbox.checked = false; // Uncheck each checkbox
  });

  selectedIngredients = []; // Clear the global selected ingredients array
  updateSelectedCount(); // Update the displayed count
});

// Add event listener for the "Clear All" button in the Assign Pipeline section
document.getElementById("clear-all-buttonpipe").addEventListener("click", () => {
  // Select all dropdowns in the selected ingredients container
  const dropdowns = document.querySelectorAll(".selected-ingredients-container select");
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

async function showAllCocktails(selectedIngredients = []) {
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

    // Fetch cocktails
    const cocktails = await fetchCocktails();
        // Display all cocktails if no ingredients are selected
    displayCocktails(cocktails);
}


// Function to fetch cocktails from products.json
async function fetchCocktails() {
  try {
      const response = await fetch("products.json");
      const cocktails = await response.json();
      return cocktails; // Return the fetched cocktails
  } catch (error) {
      console.error("Error fetching cocktails:", error);
      return []; // Return an empty array on error
  }
}

// Function to display cocktails in the UI
function displayCocktails(cocktails) {
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
  const cocktailListContainer = document.querySelector(".cocktail-list");
  cocktailListContainer.innerHTML = ""; // Clear existing content

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
          wshowCocktailDetails(cocktail); // Show details of the clicked cocktail
      });
  });
}

async function wshowCocktailDetails(cocktail) {
  findIngSection.style.display = "none";
  addIngSection.style.display = "none";
  addCocktailSection.style.display = "none";
  allCocktailSection.style.display = "none";
  cocktailDetailsSection.style.display = "block"; // Show Cocktail Details section

  // Update the cocktail image and name
  const cocktailImage = document.getElementById("cocktail-image");
  const cocktailName = document.getElementById("cocktail-name");
  const cocktailDescription = document.getElementById("cocktail-description");
  const cocktailIngredientsContainer = document.getElementById("cocktail-ingredients-container");
  const cocktailHtm = document.getElementById("htm")
  cocktailImage.src = cocktail.PImage; // Set the image source
  cocktailName.textContent = cocktail.PName; // Set the cocktail name
  cocktailDescription.textContent = cocktail.PDesc
  cocktailHtm.textContent = cocktail.PHtm
  const htmTitle = document.getElementById("htm-title");
  

  // Clear previous ingredients
  cocktailIngredientsContainer.innerHTML = "";

  // Populate the ingredients
  cocktail.PIng.forEach(ingredient => {
      const ingredientItem = document.createElement("div");
      ingredientItem.classList.add("ing-item");
      ingredientItem.innerHTML = `
          <label class="btn-checkbox">
              <img src="img/ing2.gif" alt="Ingredient - ${ingredient.ING_Name}" />
              <p>${ingredient.ING_Name}</p>
          </label>
      `;
      cocktailIngredientsContainer.appendChild(ingredientItem);
  });

  if (cocktail.PHtm && cocktail.PHtm.trim() !== "") {
    cocktailHtm.textContent = cocktail.PHtm;
    htmTitle.style.display = "block";
    cocktailHtm.style.display = "block";
  } else {
    htmTitle.style.display = "none";
    cocktailHtm.style.display = "none";
  }

  // Add event listener for the Start Making button
  document.getElementById("assignPipeline").onclick = () => {
      showAssignPipeline(cocktail); // Pass the cocktail to the Assign Pipeline section
  };
}

// Function to fetch all ingredients from db.json
async function fetchIngredientsData() {
const response = await fetch('db.json');
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
if (!Array.isArray(data)) {
    throw new Error('Invalid data structure in db.json');
}
return data;
}

// Function to fetch existing cocktails and get the next PID
async function fetchNextCocktailId() {
    try {
        const response = await fetch("products.json");
        const cocktails = await response.json();
        const lastId = cocktails.length > 0 ? 
            Math.max(...cocktails.map(cocktail => parseInt(cocktail.PID))) : 0;
        return lastId + 1;
    } catch (error) {
        console.error("Error fetching cocktails:", error);
        return 1;
    }
}

// Function to handle cocktail form submission
document.addEventListener("DOMContentLoaded", () => {
    const cocktailSubmitButton = document.getElementById("add-cocktail-button");
    if (cocktailSubmitButton) {
        cocktailSubmitButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const cocktailId = document.getElementById("product-id").value;
            const cocktailName = document.getElementById("product-name").value;
            const cocktailType = document.getElementById("product-type").value;
            const cocktailDesc = document.getElementById("product-description").value;
            const cocktailHtm = document.getElementById("how-to-make").value;
            const cocktailImageInput = document.getElementById("product-image");
            const cocktailImage = cocktailImageInput.files[0];

            // Validate inputs
            let errorMessages = [];
            if (!cocktailId) errorMessages.push("Cocktail ID is required.");
            if (!cocktailName) errorMessages.push("Cocktail Name is required.");
            if (!cocktailType) errorMessages.push("Cocktail Type is required.");
            if (!cocktailDesc) errorMessages.push("Description is required.");
            if (!cocktailHtm) errorMessages.push("How to make instructions are required.");
            if (!cocktailImage) errorMessages.push("Cocktail Image is required.");
            if (selectedCocktailIngredients.length === 0) errorMessages.push("At least one ingredient is required.");

            if (errorMessages.length > 0) {
                showCustomAlert(errorMessages.join("\n"));
                return;
            }

            // Read the image file and convert it to Base64
            const reader = new FileReader();
            reader.readAsDataURL(cocktailImage);
            reader.onload = async () => {
                const newCocktail = {
                    PID: parseInt(cocktailId),
                    PName: cocktailName,
                    PImage: reader.result,
                    PCat: cocktailType,
                    PDesc: cocktailDesc,
                    PHtm: cocktailHtm,
                    PIng: selectedCocktailIngredients
                };
                
                console.log('Submitting cocktail with ingredients:', selectedCocktailIngredients);

                try {
                    const response = await fetch("/addCocktail", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newCocktail),
                    });

                    if (response.ok) {
                        // Wait for image processing to complete
                        await waitForImageProcessing();
                        
                        // Hide loading screen
                        document.getElementById("loading-page").style.display = "none";
                        
                        showCustomAlert("Cocktail added successfully!");
                        // Reset form and fetch new ID
                        resetCocktailForm();
                        await updateNextCocktailId(); // Update the ID first
                        await fetchNextCocktailId(); // Refresh the ID again to ensure accuracy
                        // Clear selected ingredients
                        clearaddcocktailform();
                    } else {
                        const errorText = await response.text();
                        showCustomAlert("Failed to add the cocktail. Server response: " + errorText);
                    }
                } catch (error) {
                    console.error("Error adding cocktail:", error);
                    showCustomAlert("An error occurred while adding the cocktail: " + error.message);
                }
            };
            await updateNextCocktailId();

            reader.onerror = (error) => {
                console.error("Error reading image file:", error);
                showCustomAlert("An error occurred while reading the image file: " + error.message);
            };
        });
    }
});

function clearaddcocktailform() {
  resetCocktailForm();
  updateNextCocktailId(); // Update the ID first
  fetchNextCocktailId(); // Refresh the ID again to ensure accuracy

  // Clear selected ingredients
  selectedCocktailIngredients = [];
  const counterElement = document.querySelector(".cocktail-fi-top .searchbar p span");
  counterElement.textContent = "0/10";
  document.querySelectorAll('#cocktail-ingredients-container1 input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
enableForms();
}

document.getElementById("clear-all-add-cocktail").addEventListener("click", () => {
  clearaddcocktailform();
});



function resetCocktailForm() {
  document.getElementById("product-type").value = "Cocktail";
  document.getElementById("product-description").value = "";
  document.getElementById("how-to-make").value = "";
  document.getElementById("product-image").value = "";
  document.getElementById("product-name").value = "";
  
  // Enable the inputs
  enableForms(); 
  
  // Focus on the first input field
  document.getElementById("product-name").focus(); // Adjust to your first input ID
}

// Function to update the next cocktail ID
async function updateNextCocktailId() {
    const nextId = await fetchNextCocktailId();
    const productIdInput = document.getElementById("product-id");
    if (productIdInput) {
        productIdInput.value = nextId;
    }
}

async function waitForImageProcessing() {
    const maxAttempts = 30; // Maximum number of attempts (30 * 500ms = 15 seconds max)
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        try {
            const response = await fetch('processing_complete');
            if (response.ok) {
                // Delete the flag file after successful check
                await fetch('/delete_processing_flag', { method: 'POST' });
                return true;
            }
        } catch (error) {
            console.log('Waiting for image processing to complete...');
        }
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before next attempt
        attempts++;
    }
    
    console.warn('Image processing timed out');
    return false;
}

function showCustomAlert(title, message) {
  document.getElementById('alert-title').textContent = title; // Set the title
  document.getElementById('alert-message').textContent = message; // Set the message
  document.getElementById('custom-alert').style.display = 'block'; // Show the alert
}


// Close the alert when the OK button is clicked
document.getElementById('alert-ok').onclick = function() {
  document.getElementById('custom-alert').style.display = 'none'; // Hide the alert
};