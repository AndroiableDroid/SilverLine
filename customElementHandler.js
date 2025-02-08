// Copyright (c) 2025 HawkFlit. All rights reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited.
// Proprietary and confidential
const root = "/";
const templatePath = root + "templates/";
class SpecialHeader extends HTMLElement {
  async connectedCallback() {
    const response = await fetch(templatePath + "header.html"); // Path to the external header file
    const html = await response.text();
    this.innerHTML = html;
    // Dispatch a custom event to signal that the header is loaded
    this.dispatchEvent(new CustomEvent("headerLoaded", { bubbles: true }));
  }
}

class HomeGallery extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `<div class="d-grid home-gallery-container"></div>`;

    const response = await fetch(root + 'home-grid-images.json');
    const imageData = await response.json();
    // Select the gallery container from the loaded template
    const galleryContainer = this.querySelector(".home-gallery-container");

    // Render the gallery dynamically
    imageData.forEach((item, index) => {
      // Create the wrapper as an anchor tag
      const imgWrapper = document.createElement("a");
      imgWrapper.className = `img-wrapper img-container img-${index + 1}-wrapper`;
      imgWrapper.href = item.link; // Use the link from the data
      imgWrapper.target = ""; // Open the link in a new tab (optional)

      // Create image element
      const imgElement = document.createElement("img");
      imgElement.className = `img-${index + 1}`;
      imgElement.src = item.src;
      imgElement.alt = item.alt;

      // Create hover text
      const hoverText = document.createElement("div");
      hoverText.className = "hover-text";
      hoverText.textContent = item.hoverText;

      // Apply specific styles if provided
      if (item.fontSize) hoverText.style.fontSize = item.fontSize;
      if (item.fontWeight) hoverText.style.fontWeight = item.fontWeight;

      // Append the image and hover text to the anchor tag (now the wrapper)
      imgWrapper.appendChild(imgElement);
      imgWrapper.appendChild(hoverText);

      // Append the wrapper to the gallery container
      galleryContainer.appendChild(imgWrapper);
    });
  }
}


class SpecialFooter extends HTMLElement {
  async connectedCallback() {
    const response = await fetch(templatePath + "footer.html"); // Path to the external header file
    const html = await response.text();
    this.innerHTML = html;
  }
}

// Register the custom element
customElements.define("special-header", SpecialHeader);
customElements.define("home-center-grid", HomeGallery);
customElements.define("special-footer", SpecialFooter);
