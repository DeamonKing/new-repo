// Ensure these variables are defined at the top
const buttons = document.querySelectorAll(".btn");
const btnBackgroundColorPicker = document.getElementById("btnBackgroundColor");
const btnHoverBackgroundColorPicker = document.getElementById(
  "btnHoverBackgroundColor"
);
const btnTextColorPicker = document.getElementById("btnTextColor");
const btnHoverTextColorPicker = document.getElementById("btnHoverTextColor");
const openColorPickerBtn = document.getElementById("open-color-picker");
const closeModalBtn = document.getElementById("close-modal");
const colorPickerModal = document.getElementById("color-picker-modal");
const bgColorPicker = document.getElementById("bg-color-picker");
const color1Picker = document.getElementById("color1");
const color2Picker = document.getElementById("color2");
const angleOutput = document.getElementById("angle-output");
const app = document.querySelector(".app");

// Function to set button background, hover, and text colors
function updateButtonStyles() {
  buttons.forEach((button) => {
    const isActive = button.classList.contains("active");
    const isDeactive = button.classList.contains("deactive");
    const backgroundColor = isActive
      ? btnBackgroundColorPicker.value
      : isDeactive
      ? `${btnBackgroundColorPicker.value}50`
      : btnBackgroundColorPicker.value;

    // Update button background color
    button.style.setProperty("background-color", backgroundColor);

    // Update button text color
    button.style.setProperty("color", btnTextColorPicker.value);

    // Hover styles
    button.addEventListener("mouseover", () => {
      button.style.setProperty(
        "background-color",
        btnHoverBackgroundColorPicker.value
      );
      button.style.setProperty("color", btnHoverTextColorPicker.value);
    });
    button.addEventListener("mouseout", () => {
      button.style.setProperty("background-color", backgroundColor);
      button.style.setProperty("color", btnTextColorPicker.value);
    });
  });

  // Update CSS variables
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
}

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
  document.documentElement.style.setProperty("--bg-color", event.target.value);
});

// Update gradient on color pick
const updateGradient = () => {
  const color1 = color1Picker.value;
  const color2 = color2Picker.value;
  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  app.style.background = gradient;
  document.documentElement.style.setProperty("--gradient-color1", color1);
  document.documentElement.style.setProperty("--gradient-color2", color2);
  document.documentElement.style.setProperty("--gradient-angle", `${angle}deg`);
};

// Event listeners for color inputs
color1Picker.addEventListener("input", updateGradient);
color2Picker.addEventListener("input", updateGradient);
btnBackgroundColorPicker.addEventListener("input", updateButtonStyles);
btnHoverBackgroundColorPicker.addEventListener("input", updateButtonStyles);
btnTextColorPicker.addEventListener("input", updateButtonStyles);
btnHoverTextColorPicker.addEventListener("input", updateButtonStyles);

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

const resetButton = document.getElementById("reset-defaults");
resetButton.addEventListener("click", resetToDefaults);

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



function handleTouchInput(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = angleSlider.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = touch.clientX - centerX;
    const y = touch.clientY - centerY;
    angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    angle = (angle + 360) % 360;
    setKnobPosition(angle);
    updateGradient();
}

// Add touch event listeners
angleKnob.addEventListener('touchstart', (e) => {
    e.preventDefault();
    angleSlider.addEventListener('touchmove', handleTouchInput);
});

document.addEventListener('touchend', () => {
    angleSlider.removeEventListener('touchmove', handleTouchInput);
});

// Replace existing mouse events with touch-friendly events
angleKnob.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', updateAngle);
    document.addEventListener('touchmove', handleTouchInput);
});

document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', updateAngle);
    document.removeEventListener('touchmove', handleTouchInput);
});

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

// Remove duplicate event listener
window.removeEventListener("click", (event) => {
  if (event.target === colorPickerModal) {
    colorPickerModal.style.display = "none";
  }
});
