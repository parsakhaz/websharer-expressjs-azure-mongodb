import express from 'express';
import session from 'express-session';
var router = express.Router();

// returns information about the logged in user
router.get('/myIdentity', async function (req, res, next) {
    try {
        if (req.session.isAuthenticated) {
            res.json({
                status: "loggedin",
                userInfo: {
                    name: req.session.account.name,
                    username: req.session.account.username
                }
            }
            )
        }
        else {
            res.json({ status: "loggedout" });
        }
    }
    catch (error) {
        console.log(error)
    }
});





export default router;
