import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async function(req, res, next) {
    try{
        const post = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            created_date: Date(),
            content: req.body.type,
            username: req.body.username
        })
        await post.save();
        res.json({"status": "success"})
    } catch(error) {
        console.log(error);
        res.status(500).json({status: "error", error: error});
    }
})

router.get('/', async function(req, res, next) {
    const posts = await req.models.Post.find();
    let htmlDescArray = [];
    try{
        for(let i = 0; i < posts.length; i++) {
            const postHtmlPreview = await getURLPreview(posts[i].url);
            const postJSON = {
                username: posts[i].username,
                description: posts[i].description,
                htmlPreview: postHtmlPreview,
            }
            htmlDescArray.push(postJSON);
        }
        
    } catch(error) {
        console.log(error);
        res.status(500).json({status: "error", error: error});
    }
    res.type('json');
    res.send(htmlDescArray);
})

export default router;