const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

require('dotenv').config();

const server = express();

server.use(express.json({ limit: '25mb' }));
server.use(cors());

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    database: 'bookshop',
    user: 'root',
    password: process.env.DB_PASSWORD,
  });

  connection.connect();
  return connection;
}

const port = process.env.PORT;
server.listen(port, () => {
  console.log('Server is listening in http://localhost' + port);
});

//Leer/listar todas las entradas existentes:

server.get('/api/books', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT * FROM books';
  const [result] = await connection.query(sql);
  connection.end();

  res.status(201).json({
    success: true,
    result: result,
  });
});

//Crear/añadir un nuevo elemento.

server.post('/api/newbook', async (req, res) => {
  const data = req.body;
  const { title, author, year, pages } = data;

  const connection = await getConnection();
  const sql = 'INSERT INTO books(title, author, year, pages) VALUES (?,?,?,?)';
  const [resultInsert] = await connection.query(sql, [title, author, year, pages]);
  connection.end();

  res.status(201).json({
    success: true,
    message: 'El libro ha sido añadido correctamente',
  });
});

//Actualizar una entrada existente.

server.put('/api/book/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  const { year, pages } = newData;

  const connection = await getConnection();
  const sql = 'UPDATE books SET year=?,pages=? WHERE id=?';
  const [result] = await connection.query(sql, [year, pages, id]);

  res.status(201).json({
    success: true,
    message: 'El libro ha sido actualizado correctamente',
  });
});
