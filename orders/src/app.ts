import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { currentUser, errorHandler, NotFoundError } from '@bohdktickets/common';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production',
  }),
);
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
