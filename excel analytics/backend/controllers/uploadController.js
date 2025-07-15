// Get upload history for current user
exports.getUploadHistory = async (req, res) => {
  try {
    const history = await File.find({ user: req.user.id })
      .sort({ uploadDate: -1 })
      .limit(20)
      .select('filename originalname uploadDate');
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const multer = require('multer');
const XLSX = require('xlsx');
const File = require('../models/File');
const Analysis = require('../models/Analysis');

// Multer config (for demonstration, storing in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadMiddleware = upload.single('file');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Parse Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Basic analysis: numeric columns stats
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const stats = {};
    columns.forEach(col => {
      const values = data.map(row => row[col]).filter(v => typeof v === 'number');
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        stats[col] = { count: values.length, sum, mean, min, max };
      }
    });

    // Save file info to DB
    const fileDoc = new File({
      user: req.user.id,
      filename: req.file.filename || req.file.originalname,
      originalname: req.file.originalname,
      data: data,
    });
    await fileDoc.save();

    // Save analysis result
    const analysis = new Analysis({
      file: fileDoc._id,
      user: req.user.id,
      analysisResult: { stats, columns },
    });
    await analysis.save();

    // Get upload history for user (last 10 uploads)
    const history = await File.find({ user: req.user.id })
      .sort({ uploadDate: -1 })
      .limit(10)
      .select('filename originalname uploadDate');

    res.json({ 
      message: 'File uploaded and analyzed', 
      data, 
      stats, 
      columns, 
      history 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete upload history for current user
exports.deleteUploadHistory = async (req, res) => {
  try {
    await require('../models/File').deleteMany({ user: req.user.id });
    res.json({ message: 'Upload history deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
