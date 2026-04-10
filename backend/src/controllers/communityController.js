const db = require('../config/db');

exports.getBookComments = async (req, res) => {
    const bookId = Number(req.params.id);
    try {
        const result = await db.query(
            'SELECT id, book_id, user_id, user_name, comment, created_at FROM book_comments WHERE book_id = $1 ORDER BY created_at DESC',
            [bookId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch book comments' });
    }
};

exports.addBookComment = async (req, res) => {
    const bookId = Number(req.params.id);
    const userId = req.user.id;
    const comment = String(req.body.comment || '').trim();

    if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
    }

    try {
        const userResult = await db.query('SELECT name FROM users WHERE id = $1', [userId]);
        const userName = userResult.rows[0]?.name || 'Student';

        const result = await db.query(
            'INSERT INTO book_comments (book_id, user_id, user_name, comment) VALUES ($1, $2, $3, $4) RETURNING id, book_id, user_id, user_name, comment, created_at',
            [bookId, userId, userName, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add book comment' });
    }
};

exports.getFileComments = async (req, res) => {
    const fileId = Number(req.params.id);
    try {
        const result = await db.query(
            'SELECT id, file_id, user_id, user_name, comment, created_at FROM file_comments WHERE file_id = $1 ORDER BY created_at DESC',
            [fileId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch file comments' });
    }
};

exports.addFileComment = async (req, res) => {
    const fileId = Number(req.params.id);
    const userId = req.user.id;
    const comment = String(req.body.comment || '').trim();

    if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
    }

    try {
        const userResult = await db.query('SELECT name FROM users WHERE id = $1', [userId]);
        const userName = userResult.rows[0]?.name || 'Student';

        const result = await db.query(
            'INSERT INTO file_comments (file_id, user_id, user_name, comment) VALUES ($1, $2, $3, $4) RETURNING id, file_id, user_id, user_name, comment, created_at',
            [fileId, userId, userName, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add file comment' });
    }
};
