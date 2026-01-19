import express from 'express';
import schoolRoutes from './routes/school.routes';
import { errorHandler } from './middleware/error.middleware';

import testRoutes from "../tests/__test__.routes";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/schools', schoolRoutes);

app.get('/', (req, res) => {
    res.send('Hello, School Management System!');
});

if (process.env.ENV === 'test') {
    app.use('/__test__', testRoutes);
}

// Must be the last middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;