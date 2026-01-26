//.env andmebaasi seadistused
const mysql = require("mysql2/promise");
require('dotenv').config();

// Loo ühendus andmebaasiga
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Testi ühendust andmebaasiga
async function testYhendus()
{
    await pool.query('SELECT 1');
    console.log('Ühendus olemas');
}

testYhendus();

// Kõik uudised
async function getNews()
{
    const [rows] = await pool.query('SELECT * FROM news');
    return rows;
}

async function getNewsById(id)
{
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    return rows[0];
}

async function deleteNews(id)
{
    const [result] = await pool.query(
        'DELETE FROM news WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

async function createNews(title, content, imagePath)
{
    return pool.execute('INSERT INTO news (title, content, image) VALUES (?, ?, ?)',[title, content, imagePath]);
}

async function updateNews(id, title, content, image)
{
    return pool.execute(
        'UPDATE news SET title = ?, content = ?, image = ? WHERE id = ?',
        [title, content, image, id]
    );
}

module.exports = {
    getNews,
    getNewsById,
    deleteNews,
    createNews,
    updateNews
};