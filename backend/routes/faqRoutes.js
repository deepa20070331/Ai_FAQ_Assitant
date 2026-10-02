const express = require('express');
const { getFAQs, askAI } = require('../controllers/faqController');

const router = express.Router();

router.get('/faqs', getFAQs);
router.post('/ask-ai', askAI);

module.exports = router;
