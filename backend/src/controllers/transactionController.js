const db = require('../config/db');

const FINE_PER_DAY_INR = 5;
const VALID_LOAN_PERIOD_DAYS = [60, 90, 180];

exports.issueBook = async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    await db.query('BEGIN');

    const bookRes = await db.query('SELECT available_quantity, loan_period_days FROM books WHERE id = $1', [book_id]);
    if (bookRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Book not found' });
    }

    if (bookRes.rows[0].available_quantity <= 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'Book not available' });
    }

    const bookLoanPeriod = Number(bookRes.rows[0].loan_period_days);
    const loanPeriodDays = VALID_LOAN_PERIOD_DAYS.includes(bookLoanPeriod) ? bookLoanPeriod : 90;
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + loanPeriodDays);

    await db.query(
      'INSERT INTO issued_books (user_id, book_id, issue_date, due_date) VALUES ($1, $2, $3, $4)',
      [user_id, book_id, issueDate, dueDate]
    );

    await db.query('UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1', [book_id]);

    await db.query(
      "UPDATE issue_requests SET status = 'approved' WHERE user_id = $1 AND book_id = $2 AND status = 'pending'",
      [user_id, book_id]
    );

    await db.query('COMMIT');
    res.json({ message: 'Book issued successfully', due_date: dueDate, loan_period_days: loanPeriodDays });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to issue book' });
  }
};

exports.returnBook = async (req, res) => {
  const { issued_book_id } = req.body;
  try {
    await db.query('BEGIN');

    const issuedBookRes = await db.query('SELECT * FROM issued_books WHERE id = $1', [issued_book_id]);
    if (issuedBookRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Issued book record not found' });
    }

    const issuedBook = issuedBookRes.rows[0];

    if (issuedBook.status === 'returned') {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'Book already returned' });
    }

    const return_date = new Date();
    await db.query(
      "UPDATE issued_books SET return_date = $1, status = 'returned' WHERE id = $2",
      [return_date, issued_book_id]
    );

    await db.query('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1', [issuedBook.book_id]);

    const dueDate = new Date(issuedBook.due_date);
    if (return_date > dueDate) {
      const diffTime = return_date.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const fineAmount = Number((diffDays * FINE_PER_DAY_INR).toFixed(2));
      await db.query(
        'INSERT INTO fines (user_id, issued_book_id, amount) VALUES ($1, $2, $3)',
        [issuedBook.user_id, issued_book_id, fineAmount]
      );
    }

    await db.query('COMMIT');
    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to return book' });
  }
};

exports.getAllIssuedBooks = async (req, res) => {
  try {
    const result = await db.query(`
            SELECT ib.*, b.title, u.name as user_name, u.enrollment_no as user_enrollment_no
            FROM issued_books ib
            JOIN books b ON ib.book_id = b.id
            JOIN users u ON ib.user_id = u.id
            ORDER BY ib.issue_date DESC
        `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch issued books' });
  }
};

exports.getIssueRequests = async (req, res) => {
  try {
    const result = await db.query(`
            SELECT ir.*, b.title, u.name as user_name, u.enrollment_no as user_enrollment_no
            FROM issue_requests ir
            JOIN books b ON ir.book_id = b.id
            JOIN users u ON ir.user_id = u.id
            WHERE ir.status = 'pending'
            ORDER BY ir.request_date DESC
        `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch issue requests' });
  }
}
