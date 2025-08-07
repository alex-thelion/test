const db = require('../config/database');

exports.createBook = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO books (name, price) VALUES (?, ?)',
      [name, price]
    );

    res.status(201).json({
      message: 'Book created successfully',
      bookId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book' });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await db.execute('SELECT * FROM books');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const [books] = await db.execute(
      'SELECT * FROM books WHERE id = ?',
      [req.params.id]
    );

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(books[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};