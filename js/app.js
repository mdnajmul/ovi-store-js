const productDetailsContainer = document.getElementById('product-details');
const allProductsContainer = document.getElementById('all-products');
const searchField = document.getElementById('searchInput');
const searchButton = document.getElementById('search-btn');
const errorField = document.getElementById('error');

//initially load all products
const loadProducts = () => {
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

//products load by clicking search button
searchButton.addEventListener('click', function(){
    
  //clear product details container
  productDetailsContainer.innerHTML = '';
  //clear all products field container
  allProductsContainer.innerHTML = '';
  //clear error field
  errorField.innerHTML = '';

  const searchInputValue = searchField.value;

  //show error message
  if(searchInputValue === ''){
      errorField.innerHTML = `<h1 class="text-center mt-3 text-danger">Please write any product category name!</h1>`;
      return;
  }

  const url = `https://fakestoreapi.com/products/category/${searchInputValue}`;
  fetch(url)
  .then(res => res.json()
  .then(data => showProducts(data)))
  .finally(() => searchField.value = '')
});

// show all product in UI 
const showProducts = (products) => {
  //show error message
  if(products.length === 0){
    errorField.innerHTML = `<h1 class="text-center mt-3 text-danger">No Products Found!</h1>`;
      return;
  }
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${image}></img>
      </div>
      <h5><strong>${product.title}</strong></h5>
      <p><span style="color:#0099ff" class="text-bold">Category: </span><span style="color:#ff33cc">${product.category}</span></p>
      <p><span style="color:#ff3300"><strong>Rating: </strong</span><span style="color:#00ff00">${product.rating.rate}</span></p>
      <p><span style="color:#00cc99"><strong>Rated By: </strong</span><span style="color:#ff00ff">${product.rating.count}</span><span style="color:#0000ff"> users</span></p>
      <h2>Price: $ ${product.price}</h2>
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
      <button onclick="getProductDetails(${product.id})" class="btn btn-danger">Details</button></div>
      `;
      allProductsContainer.appendChild(div);
  }
};

//add to cart button functionality
let count = 0;
const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("price", price);

  updateTaxAndCharge();
  document.getElementById("total-Products").innerText = count;
};

//get input value by id
const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total.toFixed(2);
  updateTotal();
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = value;
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if(priceConverted <= 200){
    setInnerText("delivery-charge", 20);
    updateTotal();
  }
  if (priceConverted > 200 && priceConverted <= 400) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", (priceConverted * 0.2).toFixed(2));
    updateTotal();
  }
  if (priceConverted > 400 && priceConverted <= 500) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", (priceConverted * 0.3).toFixed(2));
    updateTotal();
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", (priceConverted * 0.4).toFixed(2));
    updateTotal();
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};

//load product details by clicking detals button
const getProductDetails = productId => {
  const url = `https://fakestoreapi.com/products/${productId}`;
  fetch(url)
  .then(res => res.json())
  .then(data => displayProductDetails(data));
};

//show product details in UI
const displayProductDetails = (product) => {
  productDetailsContainer.innerHTML = `
  <hr>
  <div class="text-center">
    <img class="product-details-image" src=${product.image}></img>
  </div>
  <h1 class="text-center text-success fw-bold">${product.title}</h1>
  <h3 class="text-center fw-bold"><span class="text-warning fw-bold">Category: </span>${product.category}</h3>
  <h3 class="text-center fw-bold"><span class="text-info fw-bold">Price: </span>$${product.price}</h3>
  <p class="text-center">${product.description}</p>
  <hr>
  `;
};

//buy now button functionality
const buyNow = () => {
  alert('Your payment succesfully completed!');
  location.reload();
}
