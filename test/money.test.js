import formatCurrency from '../scripts/utils/money.js'

if (formatCurrency(2005) === '20.95'){
    console.log('passed')
} else {
    console.log('failed')
}