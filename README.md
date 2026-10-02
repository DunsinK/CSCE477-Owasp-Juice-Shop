# Juice Shop for CSCE 477
A basic HTML + JavaScript login form that mimics Juice Shop's login page. 

## Run it

Use Node.js 22, 24, or another recent supported version:

```text
node server.js
```

Open <http://localhost:3000> and try `student@example.com` with `password123`.

## Implementation note

For this example, a small Node.js server is better than browser-only JavaScript
because server-side validation cannot be bypassed by editing the page. The text file
keeps the example easy to understand, but a real application should use a database,
hashed passwords, HTTPS, sessions, and rate limiting.