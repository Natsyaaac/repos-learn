const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

//tes koneksi database

pool.connect((err, client, release) => {
  if(err) {
    console.error('Database conection error: ',  err.stack)
  } else {
    console.log('Conectend to PostgreSQl database');
    release();
  }
});


// API Endpoint: Get all users
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT product_id, category_id, product_name, price, stock, description FROM products ORDER BY product_id ASC'
        );
        res.json({
            success: true,
            data: result.rows,
            total: result.rowCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error fetching data'
        });
    }
});

// API Endpoint: Get user by ID
app.get('/api/products/:product_id', async (req, res) => {
    try {
        const { product_id } = req.params;
        const result = await pool.query(
            'SELECT product_id, product_name, price, stock FROM products WHERE product_id = $1',
            [product_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
});

// API Endpoint: Search users
app.get('/api/products/search/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await pool.query(
            `SELECT product_id, product_name, price, stock
             FROM products 
             WHERE product_name ILIKE $1 OR description ILIKE $1
             ORDER BY stock DESC`,
            [`%${keyword}%`]
        );
        res.json({
            success: true,
            data: result.rows,
            total: result.rowCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error searching users'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});