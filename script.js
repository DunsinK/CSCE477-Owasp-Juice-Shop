const form = document.querySelector('#login-form')
const message = document.querySelector('#message')

function validateLogin (email, password) {
	if (!email || !password) {
		return 'Email and password are required.'
	}

	if (!email.includes('@')) {
		return 'Email must contain @.'
	}

	if (password.length < 8) {
		return 'Password must be at least 8 characters.'
	}

	return ''
}

form.addEventListener('submit', async (event) => {
	event.preventDefault()

	const email = document.querySelector('#email').value.trim()
	const password = document.querySelector('#password').value
	const validationMessage = validateLogin(email, password)

	if (validationMessage) {
		message.textContent = validationMessage
		return
	}

	const response = await fetch('/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	})

	const result = await response.json()
	message.textContent = result.message
})

