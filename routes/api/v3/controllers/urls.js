import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

// GET: returns urlPreviews.js output to generate preview 
router.get('/preview', async function (req, res, next) {
    let url = req.query.url;
    let content = await getURLPreview(url);
    res.type('html');
    res.send(content);
})

export default router;