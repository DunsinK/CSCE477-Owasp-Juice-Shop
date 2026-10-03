const prices = { 'Apple Juice': 3, 'Orange Juice': 4 }
const email = localStorage.getItem('email')
const items = document.querySelector('#order-items')
const total = document.querySelector('#order-total')
const message = document.querySelector('#checkout-message')

let cart = []

function showCart () {
  items.replaceChildren()
  let orderTotal = 0

  cart.forEach(({ item, quantity }) => {
    const lineTotal = prices[item] * quantity
    orderTotal += lineTotal
    const row = document.createElement('li')
    row.textContent = `${item} x ${quantity} - $${lineTotal.toFixed(2)}`
    items.appendChild(row)
  })

  if (cart.length === 0) {
    const row = document.createElement('li')
    row.textContent = 'Your cart is empty.'
    items.appendChild(row)
  }

  total.textContent = `Total: $${orderTotal.toFixed(2)}`
}

async function loadCart () {
  if (!email) {
    const row = document.createElement('li')
    row.textContent = 'Please log in first.'
    items.replaceChildren(row)
    total.textContent = ''
    return
  }

  const response = await fetch('/cart?email=' + encodeURIComponent(email))
  const result = await response.json()
  cart = result.items || []
  showCart()
}

document.querySelector('#checkout-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!email) {
    message.textContent = 'Please log in first.'
    return
  }

  if (cart.length === 0) {
    message.textContent = 'Add an item before checking out.'
    return
  }

  const response = await fetch('/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })

  const result = await response.json()

  if (!response.ok) {
    message.textContent = result.message
    return
  }

  window.location.href = '/order-complete.html'
})

loadCart()
