const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const db = require('../config/db');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf';
    if (!isPdf) {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

exports.uploadMiddleware = upload.single('file');

const uploadPdfToCloudinary = (fileBuffer, originalname, type) => {
  const ext = path.extname(originalname || 'file.pdf').replace('.', '').toLowerCase() || 'pdf';
  const base = path.basename(originalname || 'file', path.extname(originalname || 'file'))
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .slice(0, 40);
  const publicId = `${type || 'file'}-${Date.now()}-${base || 'upload'}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'sati-library',
        resource_type: 'raw',
        public_id: publicId,
        format: ext,
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

exports.uploadFile = async (req, res) => {
  const { title, type, category_id, year, subject, branch, semester } = req.body;
  if (!isCloudinaryConfigured) {
    return res.status(503).json({ error: 'Cloudinary is not configured on the server' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    const uploadResult = await uploadPdfToCloudinary(req.file.buffer, req.file.originalname, type);
    const file_path = uploadResult.secure_url;
    const cloudinary_public_id = uploadResult.public_id;

    const uploadedBy = req.user?.id || null;
    let uploaderName = null;

    if (uploadedBy) {
      const uploaderResult = await db.query('SELECT name FROM users WHERE id = $1', [uploadedBy]);
      uploaderName = uploaderResult.rows[0]?.name || null;
    }

    const result = await db.query(
      'INSERT INTO notes_pyqs (title, type, category_id, year, subject, branch, semester, file_path, cloudinary_public_id, uploaded_by, uploader_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [title, type, category_id, year, subject, branch, semester, file_path, cloudinary_public_id, uploadedBy, uploaderName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT n.*, c.name as category_name
      FROM notes_pyqs n
      LEFT JOIN categories c ON n.category_id = c.id
      ORDER BY n.uploaded_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

exports.getMyUploads = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT n.*, c.name as category_name
      FROM notes_pyqs n
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE n.uploaded_by = $1
      ORDER BY n.uploaded_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your uploads' });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    const fileResult = await db.query('SELECT file_path, cloudinary_public_id FROM notes_pyqs WHERE id = $1', [id]);
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileRecord = fileResult.rows[0];

    if (isCloudinaryConfigured && fileRecord.cloudinary_public_id) {
      await cloudinary.uploader.destroy(fileRecord.cloudinary_public_id, { resource_type: 'raw' });
    }

    // Legacy local-file cleanup for entries uploaded before Cloudinary migration.
    if (fileRecord.file_path && /^uploads\//.test(fileRecord.file_path)) {
      const legacyPath = path.resolve(__dirname, '../../', fileRecord.file_path);
      if (fs.existsSync(legacyPath)) {
        fs.unlinkSync(legacyPath);
      }
    }

    await db.query('DELETE FROM notes_pyqs WHERE id = $1', [id]);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
}
