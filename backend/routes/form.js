const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const multer = require('multer');

// Configure Multer for image uploads
const upload = multer({ dest: 'uploads/' });

// Create a new form
router.post('/', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).send(form);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Upload header image
router.post('/:id/headerImage', upload.single('image'), async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    form.headerImage = `/uploads/${req.file.filename}`;
    await form.save();
    res.send(form);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get form by ID (for preview/fill)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.send(form);
  } catch (err) {
    res.status(404).send();
  }
});

module.exports = router;