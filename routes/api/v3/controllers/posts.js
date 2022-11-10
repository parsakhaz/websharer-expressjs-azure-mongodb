import e from 'express';
import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async function (req, res, next) {

    try {
        if (req.session.isAuthenticated) {
            const post = new req.models.Post({
                url: req.body.url,
                description: req.body.description,
                company: req.body.company,
                created_date: Date(),
                content: req.body.type,
                username: req.session.account.username
            })
            await post.save();
            res.json({ status: "success" })
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/', async function (req, res, next) {
    const posts = await req.models.Post.find();
    let queryUsername = req.query.username
    let htmlDescArray = [];
    try {
        for (let i = 0; i < posts.length; i++) {
            if(queryUsername) {
                if (queryUsername == posts[i].username) {
                    const postHtmlPreview = await getURLPreview(posts[i].url);
                    const postJSON = {
                        username: posts[i].username,
                        description: posts[i].description,
                        htmlPreview: postHtmlPreview,
                    }
                    htmlDescArray.push(postJSON);
                }
            } else if (req.session.isAuthenticated) {
                let username = req.session.account.username
                if (username == posts[i].username) {
                    const postHtmlPreview = await getURLPreview(posts[i].url);
                    const postJSON = {
                        username: posts[i].username,
                        description: posts[i].description,
                        htmlPreview: postHtmlPreview,
                    }
                    htmlDescArray.push(postJSON);
                }
            } else if (!req.session.isAuthenticated && !queryUsername) {
                const postHtmlPreview = await getURLPreview(posts[i].url);
                const postJSON = {
                    username: posts[i].username,
                    description: posts[i].description,
                    htmlPreview: postHtmlPreview,
                }
                htmlDescArray.push(postJSON);
            }
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
    res.type('json');
    res.send(htmlDescArray);
})

export default router;