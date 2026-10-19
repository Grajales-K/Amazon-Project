export function formatCurrency(priceCents){
    return (priceCents/100).toFixed(2)

}

// when we want to export only one function we can use default export, so we can import it with any name we want.
export default formatCurrency;