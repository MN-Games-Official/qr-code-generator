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

// Generate QR code with a logo in the middle
const generateQRCode = (url, size) => {
  const logoSize = size / 5; // Size of the logo relative to QR code size

  const qrcode = new QRCode("qrcode", {
    text: url,
    width: size,
    height: size,
    // Custom renderer to add logo
    renderers: [{
      render: (canvas, text, width, height) => {
        const qr = new QRCodeStyling({
          width: size,
          height: size,
          type: "svg",
          data: text,
          image: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1724544000&semt=ais_hybrid", // Replace with your logo URL
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 5,
            imageSize: logoSize
          }
        });

        qr.getRawData().then(rawData => {
          const qrImage = new Image();
          qrImage.src = `data:image/svg+xml;base64,${rawData}`;
          qrImage.onload = () => {
            const context = canvas.getContext("2d");
            context.drawImage(qrImage, 0, 0);
            context.drawImage(logo, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize);
          };
        });
      }
    }]
  });
};

// Clear QR code and save button
const clearUI = () => {
  qr.innerHTML = "";
  const saveBtn = document.getElementById("save-link");
  if (saveBtn) {
    saveBtn.remove();
  }
};

// Hide scanner
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
  link.classList =
    'bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5';
  link.innerHTML = "Save Image";

  link.href = saveUrl;
  link.download = "qrcode.png";

  document.getElementById("generated").appendChild(link);
};

hideSpinner();

form.addEventListener("submit", onGenerateSubmit);
