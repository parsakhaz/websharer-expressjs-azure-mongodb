import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';

import apiv1Router from './routes/api/v1/apiv1.js';
import apiv2Router from './routes/api/v2/apiv2.js';

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

app.use((req, res, next) => {
  req.models = models
  next()
})

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);

const port = process.env.port || 8000;
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8080;
// }
app.listen(port);


export default app;
