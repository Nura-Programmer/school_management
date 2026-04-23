import express from 'express';

import session from './middleware/session';
import schoolRoutes from './routes/school.routes';
import { errorHandler } from './middleware/error.middleware';
import testRoutes from '../tests/__test__.routes';

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session());

app.use('/api/schools', schoolRoutes);

app.get('/api', (req, res) => {
   res.send('Hello, School Management System!');
});

if (process.env.ENV === 'test') {
   app.use('/api/__test__', testRoutes);
}

app.use((req, res, next) => {
   res.status(404).send("Sorry can't find that!");
});

// Must be the last middleware
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

export default app;
