import { cart, removeFromCart, calculateQuantityCarts } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';


let cartSummaryHTML = '';


cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  console.log(matchingProduct);

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
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
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


  // Ternary operator: condition ? valueIfTrue : valueIfFalse
  // If cartQuantity is exactly 1, use the singular 'item'; otherwise use the plural 'items'.
  // Each ${...} is evaluated separately: the first inserts the number, the second inserts the word.
  cartHeaderCheckout.innerHTML = `${cartQuantity} ${cartQuantity === 1 ? 'item' : 'items'}`;
}


// let's do interactive step by step th 'update button'
// 14f.in checkout.js get all the update links from the page and add a "click " event listener to each link.also, attach the productId to each link, when clicking, get the product ID AND  console.log.

update event listener for the update quantity link
document.querySelectorAll('.update-quantity-link')
  .forEach((link) =>{
    link.addEventListener( "click", () => {
      const productId = link.dataset.productId;
      console.log("this is the product-Id", productId);
    })
  })

