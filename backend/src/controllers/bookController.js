const db = require('../config/db');

exports.getAllBooks = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

exports.addBook = async (req, res) => {
  const { title, author, category_id, isbn, quantity, description, genre, loan_period_days } = req.body;
  try {
    const normalizedLoanPeriod = Number(loan_period_days);
    const safeLoanPeriod = [60, 90, 180].includes(normalizedLoanPeriod) ? normalizedLoanPeriod : 90;

    const result = await db.query(
      'INSERT INTO books (title, author, category_id, isbn, quantity, available_quantity, description, summary, genre, loan_period_days) VALUES ($1, $2, $3, $4, $5, $5, $6, NULL, $7, $8) RETURNING *',
      [title, author, category_id, isbn, quantity, description, genre || 'General', safeLoanPeriod]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add book' });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, category_id, isbn, quantity, available_quantity, description, genre, loan_period_days } = req.body;
  try {
    const normalizedLoanPeriod = Number(loan_period_days);
    const safeLoanPeriod = [60, 90, 180].includes(normalizedLoanPeriod) ? normalizedLoanPeriod : 90;

    const result = await db.query(
      'UPDATE books SET title=$1, author=$2, category_id=$3, isbn=$4, quantity=$5, available_quantity=$6, description=$7, genre=$8, loan_period_days=$9 WHERE id=$10 RETURNING *',
      [title, author, category_id, isbn, quantity, available_quantity, description, genre || 'General', safeLoanPeriod, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM books WHERE id = $1', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  const trimmedName = (name || '').trim();

  if (!trimmedName) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [trimmedName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Category already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to add category' });
  }
}
