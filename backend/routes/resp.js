const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// Submit a response
router.post('/', async (req, res) => {
  try {
    const response = new Response({
      formId: req.body.formId,
      responses: req.body.responses
    });

    await response.save();
    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({
      message: "Validation failed",
      details: err.message
    });
  }
});

module.exports = router;