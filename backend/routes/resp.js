const express = require('express');
const router = express.Router();
const Response = require('../models/response');

// Submit a response
router.post('/', async (req, res) => {
  try {
    const response = new Response(req.body);
    await response.save();
    res.status(201).send(response);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;