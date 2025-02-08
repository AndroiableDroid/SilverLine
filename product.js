// Copyright (c) 2025 HawkFlit. All rights reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited.
// Proprietary and confidential
// Get the product code from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const subCategory = urlParams.get('subCategory');
const productCode = urlParams.get('productCode');

// Function to fetch and render product details
function fetchProductDetails() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      if (!category || !subCategory || !productCode) {
        document.getElementById('productDetailsContainer').innerHTML =
          '<p style="color: red;">Invalid URL parameters. Please provide valid category, subCategory, and productCode.</p>';
        return;
      }
      // Fetch the product details using category, subCategory, and productCode
      const product = data[category]?.[subCategory]?.find(item => item.productCode === productCode);
      
      if (!product) {
        document.getElementById('productDetailsContainer').innerHTML =
          `<p style="color: red;">Product with code "${productCode}" not found.</p>`;
        return;
      }

      // Display product details
      displayProductDetails(product);

      // Set dynamic title and meta description
      setDynamicTitleAndMeta(product);
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      document.getElementById('productDetailsContainer').innerHTML =
        '<p style="color: red;">Failed to fetch data. Please try again later.</p>';
    });
}

// Function to display the product details
function displayProductDetails(product) {
  const productDetailsContainer = document.getElementById('productDetailsContainer');

  const productHTML = `
    <div class="supremeContainer">
      <div class="mainContainer">
        <div class="container01">
          <div class="smallImageContainer">
            <img src="${product.image}" alt="Product Image" class="smallImage">
          </div>
          <div class="productSpecsContainer">
            <h1 class="productCode">${product.productCode}</h1>
            <p class="productFinish">Finish: <span>${product.finish}</span></p>
            <p class="productDescription">Description: <span>${product.description}</span></p>
            <a href="/contact-us.html" class="contactBtn">Enquire Now</a>
          </div>
        </div>
       
      </div>
    </div>
  `;

  // Inject the HTML into the product details container
  productDetailsContainer.innerHTML = productHTML;
}

// Function to set dynamic title and meta description
function setDynamicTitleAndMeta(product) {
  document.title = `${product.productCode} - Product Details`;
  const metaDesc = document.getElementById('dynamicMetaDesc');
  metaDesc.content = `${product.description} - Learn more about our ${product.finish} finish.`;
}

// Call the function to fetch and render the product details
fetchProductDetails();
