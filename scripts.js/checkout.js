import { cart, removeFromCart, calculateQuantityCarts, updateQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';


hello();

const today = dayjs();

const deliveryDay = today.add(7, 'days');

deliveryDay.format('dddd, MMMM D'); //This is according to the dayjs documentation, the format() method is used to format a date object into a string representation based on the specified format. In this case, 'dddd' represents the full name of the day of the week, 'MMMM' represents the full name of the month, and 'D' represents the day of the month without leading zeros. So, deliveryDay.format('dddd, MMMM D') will return a string like "Tuesday, June 21" if today is June 14th.
console.log(deliveryDay);


let cartSummaryHTML = '';

//for each item in the cart, find the matching product in the products array and add it to the cart summary HTML
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  //placeholder for the matching item selected from the products array
  let matchingProduct;

  //loop through the products array to find the matching product for the cart item
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


function deliveryOptiosHTML() {
  deliveryOptions.forEach((deliveryOption) => {
    const today = daysjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    // const priceString = 
    `
      <div class="delivery-option">
      <input type="radio" class="delivery-option-input" name="delivery-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    `
  }


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

  // update event listener for the update quantity link
  // document.querySelectorAll('.update-quantity-link')
  //   .forEach((link) => {
  //     link.addEventListener("click", () => {
  //       const productId = link.dataset.productId;
  //       console.log("this is the product-Id", productId);
  //     })
  //   })


  /*  
  14g. add 2 HTML element after the "update" link
  * An <input class="quantity-input".(for entering a new quantity)
  * A <span class="save-quantity-link">save</span> (for saving the new quantity)
  * Style the <input> and set its width to 30px (put the style in the file: css)
  * Add a class "link-primary" to the <span> (for styling the link)*/

  // document.querySelectorAll('.update-quantity-link')
  //   .forEach((link) => {
  //     link.addEventListener("click", () => {
  //       const productId = link.dataset.productId;
  //       console.log("this is the product-Id", productId);
  //       const input = document.createElement('input');
  //       input.classList.add('quantity-input');
  //       input.setAttribute('type', 'number');

  //       console.log(input);

  //       const saveSpan = document.createElement('span')
  //       saveSpan.classList.add('save-quantity-link', 'link-primary');
  //       saveSpan.textContent = 'save';

  //     })
  //   })

  /*
  14h. Make "save" appear when clicking "update".
  * when clicking "update", get the cart-item-container for the product, and add the class "is-editing-quantity" to the      container use.classlist.
  * In the checkout.css,  style the <input> & "save" link and ass display: none; (they will be invisible at the start).
  * The css ".is-editing-quantity" .quantity-input [...] styles elements with class "quantity-input" inside an element with class "is-editing-quantity"
  * use this, and "dipslay: initial"; (resets the display property) to make the <input> appear when editing the quantity. same for the "Save" link */


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



  /*
  14i, similar css selector as 14h, make the "update and save" links disappear when editing the quantity.
  14j. Now we'll implement switching between "update and save"   
  * Add "click" event listener to all save links. when clicking "save". do the opposite of "update": get the cart-item-container for the product,  and remove the class "is-editing-quantity". This should reverse all the styling that's applied when editing the quantity.*/


  function saveQuantity(productId) {
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );


    const newQuantity = Number(container.querySelector('.quantity-input').value);

    // Validate the new quantity: it should be an integer between 1 and 1000 and not a decimal number. If the new quantity is invalid, we simply return and do not update the cart.
    if (newQuantity < 1 || newQuantity > 1000 || !Number.isInteger(newQuantity)) {
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
        if (event.key === 'Enter') {
          saveQuantity(input.dataset.productId)
        }
      })
    })