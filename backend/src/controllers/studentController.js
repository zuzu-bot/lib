const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getStudentDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const issuedBooks = await db.query(`
      SELECT ib.*, b.title, b.author
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      WHERE ib.user_id = $1 AND ib.status = 'issued'
    `, [userId]);

    const fines = await db.query(`
      SELECT f.*, b.title
      FROM fines f
      JOIN issued_books ib ON f.issued_book_id = ib.id
      JOIN books b ON ib.book_id = b.id
      WHERE f.user_id = $1
    `, [userId]);

    res.json({
      issuedBooks: issuedBooks.rows,
      fines: fines.rows.map((fine) => ({
        ...fine,
        amount: Number(fine.amount || 0),
        currency: 'INR',
      })),
      fineCurrency: 'INR',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.requestIssue = async (req, res) => {
  const userId = req.user.id;
  const { book_id } = req.body;
  try {
    // Check if already requested
    const existing = await db.query(
      "SELECT * FROM issue_requests WHERE user_id = $1 AND book_id = $2 AND status = 'pending'",
      [userId, book_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Request already pending' });
    }

    const result = await db.query(
      'INSERT INTO issue_requests (user_id, book_id) VALUES ($1, $2) RETURNING *',
      [userId, book_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request issue' });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      'SELECT id, name, email, role, enrollment_no, branch, semester, batch_year FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password, enrollment_no, branch, semester, batch_year } = req.body;
  const normalizedBatchYear = batch_year ? Number(batch_year) : null;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        `UPDATE users
         SET name=$1, email=$2, enrollment_no=$3, branch=$4, semester=$5, batch_year=$6, password=$7
         WHERE id=$8
         RETURNING id, name, email, role, enrollment_no, branch, semester, batch_year`,
        [name, email, enrollment_no || null, branch || null, semester || null, normalizedBatchYear, hashedPassword, userId]
      );
      return res.json(result.rows[0]);
    }

    const result = await db.query(
      `UPDATE users
       SET name=$1, email=$2, enrollment_no=$3, branch=$4, semester=$5, batch_year=$6
       WHERE id=$7
       RETURNING id, name, email, role, enrollment_no, branch, semester, batch_year`,
      [name, email, enrollment_no || null, branch || null, semester || null, normalizedBatchYear, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.getPersonalHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const history = await db.query(`
      SELECT ib.*, b.title, b.author
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      WHERE ib.user_id = $1
      ORDER BY ib.issue_date DESC
    `, [userId]);
    res.json(history.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

exports.getMyIssuedBooks = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(`
            SELECT ib.*, b.title, b.author
            FROM issued_books ib
            JOIN books b ON ib.book_id = b.id
            WHERE ib.user_id = $1
            ORDER BY ib.issue_date DESC
        `, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your books' });
  }
}

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  try {
    const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentHash = userResult.rows[0].password;
    const isMatch = await bcrypt.compare(currentPassword, currentHash || '');
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, userId]);

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to change password' });
  }
};
