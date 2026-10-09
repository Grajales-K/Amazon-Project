import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

let productHTML = '';

products.forEach((product) => {
  productHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>
          
          <div class="added-to-cart js-display-add-message-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-cart" data-product-id="${
            product.id
          }"
            > Add to Cart </button>
        </div>`;
});

document.querySelector('.js-products-grid').innerHTML = productHTML;

// how to add elements to the cart? to understand how to add the exact product to the cart, we need a  HTML "data attribute" eg. (data-nameElement...),  which allow us to attach any information to an element.

//dataset: will return an object containing all the data attributes of the element. For example, if we have a button with a data attribute like data-product-name="${product.id}, with dataset we have access to the element stored in.

let addedMessageTimeout = {};


document.querySelectorAll('.js-add-cart').forEach((button) => {
  button.addEventListener('click', () => {
    // 13h. use destructuring to update this code.
    // const productId = button.dataset.productId;
    const { productId } = button.dataset;
    const selector = document.querySelector(
      `.js-quantity-selector-${productId}`
    ).value;
    const valueSelection = Number(selector);

    const displayMessageAdded = document.querySelector(
      `.js-display-add-message-${productId}`
    );

    displayMessageAdded.classList.add('added-to-cart-visible');

    clearTimeout(addedMessageTimeout[productId]);

    addedMessageTimeout[productId] = setTimeout(() => {
      displayMessageAdded.classList.remove('added-to-cart-visible');
    }, 2000);

    let matchingItem;

    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += valueSelection;
    } else {

      cart.push({
        productId, 
        quantity: valueSelection
      });
    }

    // Update cart quantity in the header
    let cartQuantity = 0;
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });

    console.log(cartQuantity);

    //update the cart quantity in the header
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  });
});
