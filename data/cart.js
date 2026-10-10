export const cart = [];

export function (productId, valueSelection) {
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
}