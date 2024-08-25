const form = document.getElementById("generate-form");
const qr = document.getElementById("qrcode");

// Button submit
const onGenerateSubmit = (e) => {
  e.preventDefault();

  clearUI();

  const url = document.getElementById("url").value;
  const size = document.getElementById("size").value;

  // Validate url
  if (url === "") {
    alert("Please enter a URL");
  } else {
    showSpinner();
    // Show spinner for 1 sec
    setTimeout(() => {
      hideSpinner();
      generateQRCode(url, size);
      showScanner();
      // Generate the save button after the qr code image src is ready
      setTimeout(() => {
        // Get save url
        const saveUrl = qr.querySelector("canvas").toDataURL();
        // Create save button
        createSaveBtn(saveUrl);
      }, 50);
    }, 1000);
  }
};

// Generate QR code with branding
const generateQRCode = (url, size) => {
  const qrcode = new QRCode("qrcode", {
    text: url,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
    render: 'canvas'
  });

  // Wait for QR code to be generated and then overlay branding
  setTimeout(() => {
    const canvas = document.querySelector("#qrcode canvas");
    if (canvas) {
      const context = canvas.getContext("2d");
      const qrSize = canvas.width;
      const brandingSize = qrSize / 6; // Adjust size of branding text as needed

      // Draw branding text
      context.fillStyle = "#000000"; // Branding color
      context.font = `${brandingSize / 2}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      // Position the branding text in the center of the QR code
      context.fillText("IdlePOS", qrSize / 2, qrSize / 2);
    }
  }, 100);
};

// Clear QR code and save button
const clearUI = () => {
  qr.innerHTML = "";
  const saveBtn = document.getElementById("save-link");
  if (saveBtn) {
    saveBtn.remove();
  }
};

// Show scanner
const showScanner = () => {
  const scanner = document.getElementById("qrCodeContainer");
  scanner.style.display = "block";
};

// Show spinner
const showSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
};

// Hide spinner
const hideSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "none";
};

// Create save button to download QR code as image
const createSaveBtn = (saveUrl) => {
  const link = document.createElement("a");
  link.id = "save-link";
  link.classList = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5';
  link.innerHTML = "Save Image";

  link.href = saveUrl;
  link.download = "qrcode.png";

  document.getElementById("generated").appendChild(link);
};

hideSpinner();

form.addEventListener("submit", onGenerateSubmit);
