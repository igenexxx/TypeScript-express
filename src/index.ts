import express from 'express';
import cookieSession from 'cookie-session';

import { router } from './routes/loginRoutes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['ksj3j432']}));
app.use(router);

app.listen(3000, () => console.log('Listening on port 3000'));
