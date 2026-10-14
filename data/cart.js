export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = 
    [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
    },
      {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
      }]
    }



  function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));

  }

export function addToCart(productId, valueSelection) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
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

  saveToStorage();

}

// Update cart quantity cart elements 
export function calculateQuantityCarts() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  console.log(cartQuantity);
  return cartQuantity;
}



// to know how to deleted one of the product, we can create a new array, loop through each item, add the product except the one we want to delete, and then assign the new array to the cart.
export function removeFromCart(productId){
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();

}

/*
14l. In cart.js create a function updateQuantity(productId, newQuantity) which will find a matching productId in the cart, and update its quantity to th new quatity(remember to save to storage after).
* then, import and use this function when clicking the "save" link. */

export function updateQuantity(productId, newQuantity){
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId){
      cartItem.quantity = newQuantity;
    }
    saveToStorage();
  })
}