const email = localStorage.getItem('email')
const message = document.querySelector('#cart-message')

document.querySelectorAll('.add-item').forEach((button) => {
  button.addEventListener('click', async () => {
    if (!email) {
      message.textContent = 'Please log in first.'
      return
    }

    const response = await fetch('/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        item: button.dataset.item,
        quantity: 1
      })
    })

    const result = await response.json()
    message.textContent = result.message
  })
})