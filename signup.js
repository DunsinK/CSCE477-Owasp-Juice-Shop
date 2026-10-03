(() => {
const form = document.querySelector('#signup-form')
const message = document.querySelector('#signup-message')

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = document.querySelector('#signup-email').value.trim()
  const password = document.querySelector('#signup-password').value
  const repeatedPassword = document.querySelector('#signup-password-repeat').value

  if (password !== repeatedPassword) {
    message.textContent = 'Passwords do not match.'
    return
  }

  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const result = await response.json()
  message.textContent = result.message

  if (response.ok) form.reset()
})
})()