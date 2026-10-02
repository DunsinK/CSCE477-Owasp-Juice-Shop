const fs = require('fs')
const http = require('http')
const path = require('path')

const port = 3000
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

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(fs.readFileSync(path.join(__dirname, 'index.html')))
    return
  }

  if (request.method === 'GET' && request.url === '/script.js') {
    response.writeHead(200, { 'Content-Type': 'text/javascript' })
    response.end(fs.readFileSync(path.join(__dirname, 'script.js')))
    return
  }

  if (request.method === 'GET' && request.url === '/shop.html') {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(fs.readFileSync(path.join(__dirname, 'shop.html')))
    return
  }

  if (request.method === 'GET' && request.url === '/item.js') {
    response.writeHead(200, { 'Content-Type': 'text/javascript' })
    response.end(fs.readFileSync(path.join(__dirname, 'item.js')))
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

      fs.appendFileSync(path.join(__dirname, 'cart.txt'), `${email}|${item}|${quantity}\n`)
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: `${item} added to your cart.` }))
    })
    return
  }

  response.writeHead(404)
  response.end('Not found')
})

server.listen(port, () => {
  console.log(`Login demo running at http://localhost:${port}`)
})