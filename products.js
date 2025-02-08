// Copyright (c) 2025 HawkFlit. All rights reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited.
// Proprietary and confidential
// Get URL parameters for category and subCategory
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category'); // e.g., 'furniture'
const subCategory = urlParams.get('subCategory'); // e.g., 'center-tables'

// Function to set the page title and meta description
function setSEOTags(category, subCategory) {
  const title = document.querySelector('title');
  const metaDescription = document.querySelector('meta[name="description"]');

  if (category && subCategory) {
    title.innerText = `${capitalizeFirstLetter(subCategory)} in ${capitalizeFirstLetter(category)} - Our Products`;
    metaDescription.setAttribute('content', `Explore our range of ${subCategory} in the ${category} category. Find the best products that suit your needs.`);
  } else {
    title.innerText = 'Products - Our Store';
    metaDescription.setAttribute('content', 'Browse our wide range of products across various categories.');
  }
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Validate that the required parameters are provided
if (!category || !subCategory) {
  document.getElementById('pageTitle').innerText =
    'Invalid URL parameters. Please provide both category and subCategory.';
  setSEOTags(); // Set default SEO tags
} else {
  setSEOTags(category, subCategory); // Set SEO tags based on parameters

  // Fetch JSON data
  fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => filterAndRenderProducts(data))
    .catch((error) => {
      console.error('Error fetching the JSON:', error);
      document.getElementById('productContainer').innerHTML =
        '<p style="color: red;">Failed to fetch data. Please try again later.</p>';
    });
}

// Function to filter products based on category and subCategory
function filterAndRenderProducts(data) {
  const container = document.getElementById('productContainer');
  const pageTitle = document.getElementById('pageTitle');

  // Check if category exists in the JSON
  if (!data[category]) {
    pageTitle.innerText = `Category "${category}" not found.`;
    container.innerHTML = '';
    return;
  }

  const categoryData = data[category];

  // Check if subCategory exists in the category
  if (!categoryData[subCategory]) {
    pageTitle.innerText = `SubCategory "${subCategory}" not found in "${category}".`;
    container.innerHTML = '';
    return;
  }

  const products = categoryData[subCategory];

  // Render each product
  if (products.length === 0) {
    pageTitle.innerText = `No products found in "${subCategory}".`;
    container.innerHTML = '';
    return;
  } else {
    pageTitle.style.color = "";
    let pageTitleName = subCategory.replaceAll("-", " ");
    if (subCategory === "console-pillars")
      pageTitleName = "Console & Pillars";
    pageTitle.innerText = pageTitleName;
  }

  // Clear any previous content in the container
  container.innerHTML = '';

  // Create and append product cards
  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Helper function to create a product card
function createProductCard(product) {
  const productCard = document.createElement('div');
  productCard.className = 'productCard';

  const productLink = document.createElement('a');
  const productURL = `/product.html?category=${category}&subCategory=${subCategory}&productCode=${product.productCode}`;
  productLink.href = productURL;
  productLink.className = 'productLink';

  productLink.innerHTML = `
      <img src="${product.image}" alt="${product.productCode}" class="productImage" />
      <div class="productDetails">
          <h3>${product.productCode}</h3>
          <!-- <p>${product.finish}</p> -->
      </div>
  `;

  productCard.appendChild(productLink);

  return productCard;
}