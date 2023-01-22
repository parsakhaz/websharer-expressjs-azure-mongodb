import express from 'express';

var router = express.Router();

// deletes userInfo
router.delete('/', async function (req, res, next) {
    let usernameSession = req.session.account.username
    // find the right post
    const userInfo = await req.models.UserInfo.find()
    try {
        if (req.session.isAuthenticated) {
            if (JSON.stringify(userInfo).includes(usernameSession)) {
                await req.models.UserInfo.deleteMany({ username: usernameSession })
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

// POST: if users logged in, save userinfo
router.post('/', async function (req, res, next) {
    try {
        if (req.session.isAuthenticated) {
            const userInfo = new req.models.UserInfo({
                biography: req.body.biography,
                username: req.session.account.username
            })
            await userInfo.save();
            res.json({ status: "success" })
        } else {
            res.status(401).json({ status: "error", error: "not logged in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
})

// GET: return all fields in UserInfo schema
router.get('/', async function (req, res, next) {
    const userInfo = await req.models.UserInfo.find();
    let queryUsername = req.query.username
    let userInfoArray = [];
    try {
        for (let i = 0; i < userInfo.length; i++) {
            if (queryUsername == userInfo[i].username) {
                const postJSON = {
                    biography: userInfo[i].biography,
                    username: userInfo[i].username
                }
                userInfoArray.push(postJSON);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
    res.type('json');
    res.send(userInfoArray);
});

export default router;