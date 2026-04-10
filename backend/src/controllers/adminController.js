const db = require('../config/db');

exports.getAllStudents = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role, enrollment_no, branch, semester, batch_year, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, enrollment_no, branch, semester, batch_year } = req.body;
  const normalizedBatchYear = batch_year ? Number(batch_year) : null;
  try {
    const result = await db.query(
      'UPDATE users SET name=$1, email=$2, enrollment_no=$3, branch=$4, semester=$5, batch_year=$6 WHERE id=$7 RETURNING id, name, email, role, enrollment_no, branch, semester, batch_year',
      [name, email, enrollment_no || null, branch || null, semester || null, normalizedBatchYear, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await db.query('SELECT SUM(quantity) as count FROM books');
    const issuedBooks = await db.query("SELECT COUNT(*) as count FROM issued_books WHERE status = 'issued'");
    const totalUsers = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const totalFines = await db.query("SELECT SUM(amount) as sum FROM fines");

    res.json({
      totalBooks: totalBooks.rows[0].count || 0,
      issuedBooks: issuedBooks.rows[0].count || 0,
      totalUsers: totalUsers.rows[0].count || 0,
      totalFines: Number(totalFines.rows[0].sum || 0),
      fineCurrency: 'INR',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

exports.getFineReports = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT f.*, u.name as student_name, u.enrollment_no as student_enrollment_no, b.title as book_title
      FROM fines f
      JOIN users u ON f.user_id = u.id
      JOIN issued_books ib ON f.issued_book_id = ib.id
      JOIN books b ON ib.book_id = b.id
      ORDER BY f.created_at DESC
    `);
    res.json(result.rows.map((row) => ({
      ...row,
      amount: Number(row.amount || 0),
      currency: 'INR',
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fine reports' });
  }
};
