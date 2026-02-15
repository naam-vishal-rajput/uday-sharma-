// Express server for MORDENMILAN PALACE LLP
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { cakes } = require('./data/cakes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// GET all cakes for Bento Bakery Shop
app.get('/api/cakes', (req, res) => {
    // Optional: Filter by category if query param exists
    const category = req.query.category;
    if (category) {
        const filteredCakes = cakes.filter(cake =>
            cake.category.toLowerCase() === category.toLowerCase()
        );
        return res.json(filteredCakes);
    }
    res.json(cakes);
});

// POST contact form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email, and message are required'
        });
    }

    // Log the contact submission (in real app, you'd email this or save to DB)
    console.log('📧 New Contact Form Submission:');
    console.log(`From: ${name} (${email})`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Message: ${message}`);
    console.log('---'.repeat(10));

    // Simulate successful submission
    res.json({
        success: true,
        message: 'Thank you for contacting us. We will respond within 24 hours.'
    });
});

// POST order placement
app.post('/api/order', (req, res) => {
    const { items, total, customerInfo } = req.body;

    // Validate order
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Cannot place empty order'
        });
    }

    // Generate a random order ID
    const orderId = 'MMP-ORDER-' + Math.floor(Math.random() * 10000);

    // Log the order
    console.log('🛒 New Order Placed:');
    console.log(`Order ID: ${orderId}`);
    console.log('Items:');
    items.forEach(item => {
        console.log(`  - ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`);
    });
    console.log(`Total: ₹${total}`);
    if (customerInfo) {
        console.log(`Customer: ${customerInfo.name} (${customerInfo.email})`);
    }
    console.log('---'.repeat(10));

    // Return success response
    res.json({
        success: true,
        orderId: orderId,
        message: 'Your order has been placed successfully! We will contact you shortly.'
    });
});

// Serve index.html for SPA routes (exclude API and static file requests)
app.get('*', (req, res, next) => {
    // Don't serve HTML for asset/API requests
    if (req.path.startsWith('/api/') || /\.(css|js|ico|png|jpg|jpeg|gif|svg|woff|woff2)$/i.test(req.path)) {
        return res.status(404).end();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (try alternative ports if current one is in use)
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`
    🚀 MORDENMILAN PALACE LLP Server is running!
    📍 http://localhost:${port}
    🍰 Bento Bakery Shop is open for business!
    `);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            throw err;
        }
    });
}
startServer(PORT);