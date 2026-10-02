# Juice Shop for CSCE 477
A basic HTML + JavaScript login form and shop page that mimic Juice Shop. Logged-in
users can add sample items to a cart. Each cart row is stored in `cart.txt` with
the user's email first.

## Run it

Use Node.js 22, 24, or another recent supported version:

```text
node server.js
```

Open <http://localhost:3000> and try `student@example.com` with `password123`.
After logging in, select an item to append it to `cart.txt`.

## Implementation note

For this example, a small Node.js server is better than browser-only JavaScript
because server-side validation cannot be bypassed by editing the page. The text file
keeps the example easy to understand, but a real application should use a database,
hashed passwords, HTTPS, sessions, and rate limiting.