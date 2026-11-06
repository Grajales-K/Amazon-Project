import { cart, removeFromCart, calculateQuantityCarts, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  //for each item in the cart, find the matching product in the products array and add it to the cart summary HTML
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    //placeholder for the matching item selected from the products array
    const matchingProduct = getProduct(productId)

    console.log(matchingProduct);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      //how many option we want to add.
      deliveryOption.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
        
    `;
  });


  function deliveryOptionsHTML(matchingProduct, cartItem) {

    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        //how many option we want to add.
        deliveryOption.deliveryDays, 'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCents
        === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}`;


      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" 
          ${isChecked ? 'checked' : ''} 
          class="delivery-option-input" 
          name="delivery-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString}
            </div>
          </div>
        </div>
      `
    });

    return html;
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

        renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed
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

    renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed

  }

  //event listerner "click" on 'Save button'
  document.querySelectorAll('.save-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        saveQuantity(link.dataset.productId)
        renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed
      })
    })

  document.querySelectorAll('.quantity-input')
    .forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          saveQuantity(input.dataset.productId)
          renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed
        }
      })
    })

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        //this is a shortand property to take the productId and deliveryOptionId from the element.dataset object and assign them to variables with the same name.
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId)
        renderOrderSummary(); //re-render the order summary to reflect the updated delivery option
        renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed
      });
    });

}


// ------- exercises lesson15 15a --------

// this code will deleted after reviewed, this is just to avoid create a new files and deleted after

// -------- 15a. Using the dayjs, get the date 5 daus after today and display it in the format: <month> <day of the month>

const today = dayjs();
const fiveDaysLater = today.add(5, 'days');
console.log(fiveDaysLater.format('MMMM D'), "exercise 15a display the month and the day",); //November 6

// ------- 15b. Calcula one month after today and displa it in the same format
const OneMonthLater = today.add(1, 'month');
console.log(OneMonthLater.format('MMMM D'), "exercise 15b display the month and the day",); //December 1

// ------- 15b. Daysjs has a .substrac(...) method withc subtracts time from a date. Calculate 1 month before today and display it.

const OneMonthBefore = today.subtract(1, 'month')
console.log(OneMonthBefore.format('MMMM D'), "exercise 15c display the month and the day",); //October 1

// ------- 15d. Get day from dayjs and display it in this format '<Day of week>' (format should be 'monday', 'tuesday', etc.)

const dayOfweek = today.format('dddd');
console.log(dayOfweek, "exercise 15d display the day of the week",); //Thursday

// ------- 15e. Create a function isWeekend(date) that takes a dayjs object, and returns whether the date is 'Saturday' or 'Sunday'. use the solution fro 15d test wit a differents dates

const dayOfWeek = today.format('dddd').toLowerCase();
console.log(dayOfWeek, "exercise 15d display the day of the week"); // thursday

// ------- 15e. isWeekend(date) using the solution from 15d

function isWeekend(date) {
  const dayOfWeek = date.format('dddd').toLowerCase();
  return dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
}

// Test with different dates
console.log(isWeekend(today), "today");                        // false 
console.log(isWeekend(dayjs('2026-11-07')), "saturday"); 
console.log(isWeekend(dayjs('2026-11-08')), "sunday");         // true
console.log(isWeekend(dayjs('2026-11-09')), "monday");         // false  