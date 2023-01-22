import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

// POST: if users logged in, save post w/ username 
router.post('/', async function (req, res, next) {
    try {
        if (req.session.isAuthenticated) {
            const post = new req.models.Post({
                url: req.body.url,
                description: req.body.description,
                company: req.body.company,
                created_date: Date(),
                content: req.body.type,
                username: req.session.account.username,
                id: req.body.id
            })
            await post.save();
            res.json({ status: "success" })
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
})

// DELETE: deletes the given post (if you are creator of the post)
router.delete('/', async function (req, res, next) {
    let queryPostId = req.body.postID
    let usernameSession = req.session.account.username
    // find the right post
    const posts = await req.models.Post.findById(queryPostId);
    try {
        if (req.session.isAuthenticated) {
            if (posts.username.includes(usernameSession)) {
                await req.models.Comment.deleteMany({ post: queryPostId })
                await req.models.Post.deleteOne({ _id: queryPostId })
                res.json({ status: 'success' })
            } else {
                res.status(401).json({ status: "error", error: "you can only delete your own posts" });
            }
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
});

// GET: returns all the fields in the Post schema
router.get('/', async function (req, res, next) {
    const posts = await req.models.Post.find();
    let queryUsername = req.query.username
    let htmlDescArray = [];
    try {
        for (let i = 0; i < posts.length; i++) {
            if (queryUsername) {
                if (queryUsername == posts[i].username) {
                    // the below is viewable in network requests to posts
                    const postHtmlPreview = await getURLPreview(posts[i].url);
                    const postJSON = {
                        username: posts[i].username,
                        description: posts[i].description,
                        htmlPreview: postHtmlPreview,
                        url: posts[i].url,
                        likes: posts[i].likes,
                        created_date: posts[i].created_date,
                        // id: posts[i].username,
                        id: posts[i]._id
                    }
                    htmlDescArray.push(postJSON);
                }
            } else
            // uncommenting this means the user can only see posts they make themselves in homepage
            // if (req.session.isAuthenticated) {
            //     let username = req.session.account.username
            //     if (username == posts[i].username) {
            //         const postHtmlPreview = await getURLPreview(posts[i].url);
            //         const postJSON = {
            //             username: posts[i].username,
            //             description: posts[i].description,
            //             htmlPreview: postHtmlPreview,
            //         }
            //         htmlDescArray.push(postJSON);
            //     }
            // } else 
            // if (!req.session.isAuthenticated && !queryUsername) 
            {
                const postHtmlPreview = await getURLPreview(posts[i].url);
                const postJSON = {
                    username: posts[i].username,
                    description: posts[i].description,
                    htmlPreview: postHtmlPreview,
                    url: posts[i].url,
                    likes: posts[i].likes,
                    created_date: posts[i].created_date,
                    // id: posts[i].username,
                    id: posts[i]._id
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


// POST: mark the current user as liking the given post
router.post('/like', async function (req, res, next) {
    let queryPostId = req.body.postID
    let username = req.session.account.username
    // find the right post
    const posts = await req.models.Post.findById(queryPostId);
    try {
        if (req.session.isAuthenticated) {
            if (!posts.likes.includes(username)) {
                posts.likes.push(username)
            }
            await posts.save()
            res.json({ status: 'success' })
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
});

// GET: mark the current user as unliking the given post
router.post('/unlike', async function (req, res, next) {
    let queryPostId = req.body.postID
    let username = req.session.account.username
    // find the right post
    const posts = await req.models.Post.findById(queryPostId);
    try {
        if (req.session.isAuthenticated) {
            if (posts.likes.includes(username)) {
                posts.likes.pop(username)
            }
            await posts.save()
            res.json({ status: 'success' })
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
});

export default router;