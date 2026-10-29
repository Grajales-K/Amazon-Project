import { cart, removeFromCart, calculateQuantityCarts, updateQuantity, isValidQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';


let cartSummaryHTML = '';

//for each item in the cart, find the matching product in the products array and add it to the cart summary HTML
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchingProduct = products.find((product) => product.id === productId);


  // Skip cart items whose product no longer exists, so the checkout doesn't break
  if(!matchingProduct){
    console.warn(`product ${productId} not found, Skipping`);
    return;
  }

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image" src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input" type="number" data-product-id="${matchingProduct.id}">
          <span  class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
            Save
          </span>
          <span  class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked class="delivery-option-input" name="delivery-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio" class="delivery-option-input" name="delivery-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio" class="delivery-option-input" name="delivery-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
       
  `;
});

// console.log(cartSummaryHTML);

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      // console.log("this is the carrito", cart);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();

      updateCart();//to update the cart quantity in the header when an item is removed and sent to the cart header.

    })

  })

updateCart(); //update the cart quantity in the header when the page loads


function updateCart() {
  const cartQuantity = calculateQuantityCarts();

  const cartHeaderCheckout = document.querySelector('.js-cart-checkout')

  cartHeaderCheckout.innerHTML = `${cartQuantity} ${cartQuantity === 1 ? 'item' : 'items'}`;
}


document.querySelectorAll('.update-quantity-link')
  .forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      console.log("this is the product-Id", productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      container.classList.add('is-editing-quantity');
    })

  })


function saveQuantity(productId) {
  const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );


  const newQuantity = Number(container.querySelector('.quantity-input').value);

  // Validate the new quantity
  if (!isValidQuantity(newQuantity)) {
    return;
  }

  // If the new value is valid, call updateQuantity() (from cart.js) to replace the product's quantity in the cart array and save it.
  // Then call updateCart() to recalculate the total and update the cart quantity in the header.
  updateQuantity(productId, newQuantity);
  updateCart();

  container.querySelector('.quantity-label').innerHTML = newQuantity;
  container.classList.remove('is-editing-quantity');

  console.log("this is Saved product-Id", productId);

}


// 14k. when clicking "Save", use the DOM to get the quantity <input> value, and this will be the new quantity of the product in the cart.

//event listerner "click" on 'Save button'
document.querySelectorAll('.save-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      saveQuantity(link.dataset.productId)
    })
  })



/* 14m. try to come up with more features such as:
* Validacion between 1 and 1000,
* Add keyboard support (allow updating by pressin 'enter' key) */

document.querySelectorAll('.quantity-input')
  .forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if( event.key === 'Enter'){
        saveQuantity(input.dataset.productId)
      }
    })
  })