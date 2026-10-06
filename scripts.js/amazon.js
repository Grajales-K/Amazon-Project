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

// exercise implemented from 13a to 13f. adding the class to the selector, save it in a variable selector, then updated the conditions to check if the product is already in the cart, if it is, we update the quantity, if not we add a new item to the cart. Finally, we update the cart quantity in the header.

let addedMessageTimeoutId;
document.querySelectorAll('.js-add-cart').forEach((button) => {
  button.addEventListener('click', () => {
    // 13h. use destructuring to update this code.
    // const productId = button.dataset.productId;
    const { productId } = button.dataset;
    const selector = document.querySelector(
      `.js-quantity-selector-${productId}`
    ).value;
    const valueSelection = Number(selector);

    // 13i-k. add a unique clase to this element identified which product is for
    const displayMessageAdded = document.querySelector(
      `.js-display-add-message-${productId}`
    );

    // 13l. after 2 seconds use setTimeout to make the message disappear by removing the class.

    displayMessageAdded.classList.add('added-to-cart-visible');

    // 13m. if we click 'add to cart' wait 1 to 1.5 seconds and click again, the message disappear quickly, (since the previus setTimeout is still running and will make the message desappear soon).

    clearTimeout(addedMessageTimeoutId);
    // Modify the code so when we click, it refreshes the 2 seconds wait time. you can use clearTimeout() to cancel the previus one.
    addedMessageTimeoutId = setTimeout(() => {
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
      // 13h. use the shorhand  property to update this code.
      cart.push({
        // productId: productId,
        productId, //when the property name and the variable name are the same, we can use the shorthand property to update this code.
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
