import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';
// library we are using for sessions
import sessions from 'express-session';
import msIdExpress from 'microsoft-identity-express'
const appSettings = {
    appCredentials: {
        clientId: "542b7624-1f17-4cff-9e34-7c778674305e",
        tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "D-I8Q~dzDlYYHN7.LXZXXs2kkXwGyW5pxbHzZbx7"
    },
    // // for local host
    // authRoutes: {
    //     redirect: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
    //     error: "/error", // the wrapper will redirect to this route in case of any error.
    //     unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    // }
    // for azure hosting 
    authRoutes: {
        redirect: "https://test.parsak.me/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};


import apiv1Router from './routes/api/v1/apiv1.js';
import apiv2Router from './routes/api/v2/apiv2.js';
import apiv3Router from './routes/api/v3/apiv3.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// code to setup sessions to work properly
const oneDay = 1000 * 60 * 60 * 24 // one day in milliseconds
app.use(sessions({
    secret: "secret key i am making up",
    saveUnitialized: true,
    cookie: { maxAge: oneDay }, // will keep session in cookies for a day, so you don't have to keep logging back in
    resave: false
}))

// mongoDB middleware
app.use((req, res, next) => {
    req.models = models
    next()
})

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);

app.get('/signin',
    msid.signIn({ postLoginRedirect: '/' })
)

app.get('/signout',
    msid.signOut({ postLogoutRedirect: '/' })
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Permission was denied")
})

const port = process.env.port || 8000;
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8080;
// }
app.listen(port);


export default app;
