import express from 'express';
var router = express.Router();

router.get('/', async function (req, res, next) {
    const comments = await req.models.Comment.find();
    let queryPostId = req.query.postID
    let commentsArray = [];
    try {
        for (let i = 0; i < comments.length; i++) {
            if (queryPostId == comments[i].post) {
                const postJSON = {
                    username: comments[i].username,
                    comment: comments[i].comment,
                    post: comments[i]._id,
                    created_date: comments[i].created_date
                }
                commentsArray.push(postJSON);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
    res.type('json');
    res.send(commentsArray);
});


router.post('/', async function (req, res, next) {
    try {
        if (req.session.isAuthenticated) {
            const comment = new req.models.Comment({
                created_date: Date(),
                comment: req.body.newComment,
                username: req.session.account.username,
                post: req.body.postID
            })
            await comment.save();
            res.json({ status: "success" })
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
})

export default router;