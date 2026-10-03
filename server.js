const fs = require('fs')
const http = require('http')
const path = require('path')

const port = Number(process.env.PORT || 3000)
const cartFile = path.join(__dirname, 'cart.txt')
const users = fs.readFileSync(path.join(__dirname, 'users.txt'), 'utf8')
  .trim()
  .split('\n')
  .map((line) => {
    const [email, password] = line.split(':')
    return { email, password }
  })

function validateLogin (email, password) {
  if (!email || !password) return 'Email and password are required.'
  if (!email.includes('@')) return 'Email must contain @.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  return ''
}

function readCart () {
  const text = fs.readFileSync(cartFile, 'utf8').trim()
  if (!text) return []
  return text.split('\n').filter(Boolean).map((line) => {
    const [email, item, quantity] = line.trim().split('|')
    return { email, item, quantity: Number(quantity) }
  })
}

function writeCart (rows) {
  const text = rows.map((row) => `${row.email}|${row.item}|${row.quantity}`).join('\n')
  fs.writeFileSync(cartFile, text ? `${text}\n` : '')
}

function sendFile (response, fileName, contentType) {
  response.writeHead(200, { 'Content-Type': contentType })
  response.end(fs.readFileSync(path.join(__dirname, fileName)))
}

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    sendFile(response, 'index.html', 'text/html')
    return
  }

  if (request.method === 'GET' && request.url === '/script.js') {
    sendFile(response, 'script.js', 'text/javascript')
    return
  }

  if (request.method === 'GET' && request.url === '/signup.js') {
    sendFile(response, 'signup.js', 'text/javascript')
    return
  }

  if (request.method === 'GET' && request.url === '/shop.html') {
    sendFile(response, 'shop.html', 'text/html')
    return
  }

  if (request.method === 'GET' && request.url === '/item.js') {
    sendFile(response, 'item.js', 'text/javascript')
    return
  }

  if (request.method === 'GET' && request.url === '/checkout.html') {
    sendFile(response, 'checkout.html', 'text/html')
    return
  }

  if (request.method === 'GET' && request.url === '/checkout.js') {
    sendFile(response, 'checkout.js', 'text/javascript')
    return
  }

  if (request.method === 'GET' && request.url === '/order-complete.html') {
    sendFile(response, 'order-complete.html', 'text/html')
    return
  }

  if (request.method === 'POST' && request.url === '/login') {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      const { email, password } = JSON.parse(body)
      const validationMessage = validateLogin(email, password)
      const validUser = users.some((user) => user.email === email && user.password === password)
      const message = validationMessage || (validUser ? 'Login successful.' : 'Invalid email or password.')
      response.writeHead(validUser && !validationMessage ? 200 : 400, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message }))
    })
    return
  }

  if (request.method === 'POST' && request.url === '/register') {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      const { email, password } = JSON.parse(body)
      const validationMessage = validateLogin(email, password)

      if (validationMessage) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: validationMessage }))
        return
      }

      if (users.some((user) => user.email === email)) {
        response.writeHead(409, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'An account with that email already exists.' }))
        return
      }

      fs.appendFileSync(path.join(__dirname, 'users.txt'), `\n${email}:${password}`)
      users.push({ email, password })
      response.writeHead(201, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: 'Account created. You can now log in.' }))
    })
    return
  }

  if (request.method === 'POST' && request.url === '/cart') {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      const { email, item, quantity } = JSON.parse(body)
      const validEmail = users.some((user) => user.email === email)
      const validQuantity = Number.isInteger(quantity) && quantity > 0

      if (!validEmail || !item || !validQuantity) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'A valid email, item, and quantity are required.' }))
        return
      }

      const rows = readCart()
      rows.push({ email, item, quantity })
      writeCart(rows)
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: `${item} added to your cart.` }))
    })
    return
  }

  if (request.method === 'GET' && (request.url === '/cart' || request.url.startsWith('/cart?'))) {
    const email = new URL(request.url, 'http://localhost').searchParams.get('email') || ''
    const items = readCart()
      .filter((row) => row.email === email)
      .map(({ item, quantity }) => ({ item, quantity }))
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ items }))
    return
  }

  if (request.method === 'POST' && request.url === '/checkout') {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      const { email } = JSON.parse(body)
      const validEmail = users.some((user) => user.email === email)

      if (!validEmail) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Log in before checking out.' }))
        return
      }

      writeCart(readCart().filter((row) => row.email !== email))
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: 'Order placed.' }))
    })
    return
  }

  response.writeHead(404)
  response.end('Not found')
})

server.listen(port, () => {
  console.log(`Login demo running at http://localhost:${port}`)
})