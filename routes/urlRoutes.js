const express = require('express');
const router = express.Router();
// const urlController = require('../controllers/urlController');
const { createShortUrl, redirectUrl, getUrls } = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/shorten', authMiddleware,createShortUrl);
router.get('/urls',getUrls);
router.get('/:code',redirectUrl);


module.exports = router;
