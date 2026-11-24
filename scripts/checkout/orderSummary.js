import { cart, removeFromCart, calculateQuantityCarts, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import  isSatSun  from  '../weekDay.js';
import { renderCheckoutHeader } from './checkoutHeader.js';


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

    const dateString = calculateDeliveryDate(deliveryOption);

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
      const dateString = calculateDeliveryDate(deliveryOption);
   

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

        renderCheckoutHeader(); 

        renderOrderSummary(); //re-render the order summary to reflect the updated delivery option

        renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed. 
      })

    })

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
    // Then call renderCheckoutHeader() to recalculate the total and update the cart quantity in the header.
    updateQuantity(productId, newQuantity);
    renderCheckoutHeader();

    renderOrderSummary(); //re-render the order summary to reflect the updated delivery option

    renderPaymentSummary(); //re-render the payment summary to reflect the updated cart after an item is removed

  }

  //event listerner "click" on 'Save button'
  document.querySelectorAll('.save-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        saveQuantity(link.dataset.productId)
      });
    });

  document.querySelectorAll('.quantity-input')
    .forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          saveQuantity(input.dataset.productId)
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

};

console.log(' ------- exercises lesson15 a - e --------')

// this code will deleted after reviewed, this is just to avoid create a new files and deleted after

// -------- 15a. Using the dayjs, get the date 5 daus after today and display it in the format: <month> <day of the month>

const today = dayjs();
const fiveDaysLater = today.add(5, 'days');
 //November 6

// ------- 15b. Calcula one month after today and displa it in the same format
const OneMonthLater = today.add(1, 'month');
 //December 1

// ------- 15b. Daysjs has a .substrac(...) method withc subtracts time from a date. Calculate 1 month before today and display it.

const OneMonthBefore = today.subtract(1, 'month')
console.log(OneMonthBefore.format('MMMM D'), "exercise 15c display the month and the day",); //October 1

// ------- 15d. Get day from dayjs and display it in this format '<Day of week>' (format should be 'monday', 'tuesday', etc.)

const dayOfweek = today.format('dddd');
// console.log(dayOfweek, "exercise 15d display the day of the week",); //Thursday

// ------- 15e. Create a function isWeekend(date) that takes a dayjs object, and returns whether the date is 'Saturday' or 'Sunday'. use the solution fro 15d test wit a differents dates


// function isWeekend(date) {
//   const dayOfWeek = date.format('dddd').toLowerCase();
//   return dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
// }

// data coming from weekDay.js
// Test with different dates
console.log(isSatSun(today), "today");                        // false 
console.log(isSatSun(dayjs('2026-11-07')), "saturday");       // true
console.log(isSatSun(dayjs('2026-11-08')), "sunday");         // true
console.log(isSatSun(dayjs('2026-11-09')), "monday");         // false  

// ------- 15f. Move isweekend() into a separate file and use export default. Import this function in another file and run it.

// ------- 15g. We can also rename a default export when we inport. In 15f, when we "import isSatSun" and use this new name to the function.

// ------- 15h. when deletinh s product from the cart, instead of using the DOM and updating the page directly with delete(), generate the hml for the order summary.

//  update in lines lines 129-143

// ------- 15i. In the payment summary on the right, the number in the first line "item (3}": is supposed to show the cart quantity. howover, this number is always 3. replace this number with the actual cart quantity and make sure it updates whenever we change the cart.
// done in paymentSummary.js line 22 and 31

// ------- 15j. Create a new file in the checkout folder callad checkoutHeader.js, create a function renderCheckoutHeader, generate the HTML, and display it on the page. note: insert the correct cart quantity into the HTML. 
// done in checkoutHeader.js and checkout.js and checkout.html


// ------- 15k. after deleting a product from the cart, re-render the checkout Header so the cart quantity is up-to-date. Note: use MVC instead of updating the page directly with the DOM.
// done in lines 129-143

// ------- 15l.In orderSummary.js, we have some code at the top that takes a deliveryOption, calculates the delivery date, and formats it.This code is repeated in deliveryOptionsHTML().Create a function to reuse this code. (Create a function calculateDeliveryDate(deliveryOption) in deliveryOptions.js, import and run this function in orderSummary.js).
// done in deliveryOptions.js and orderSummary.js lines 49-51 and 55-57

/* ------- 15m. When calculating the delivert date, skip0 ll Saturdays and Sundays. 
e.g. Examples: if today is Friday, Oct 5 and we choose 1-day delivery, 
the delivery date should be Monday, Oct 8 (skip the weekend).
*Friday, Nov 27 + 3 days = Wednesday, Dec 3 (skip the weekend).
*Tuesday, Nov 24 + 3 days = Friday, Nov 27 (no weekend in between).
*Friday, Nov 27 + 7 days = Tuesday, Dec 8 (skip 2 weekends in between).

  done in file deliveryOptions.js and using weeDay.js
*/


/* ------- 15n. Make the "Update" quantity interactive using MVC: instead of updating the page
directly with the DOM, update the data and re-render every part of the page that depends on it.
done in saveQuantity() in orderSummary.js:
  updateQuantity()        -> changes the data (cart) and saves it
  renderCheckoutHeader()  -> header total
  renderOrderSummary()    -> products and quantities
  renderPaymentSummary()  -> totals */