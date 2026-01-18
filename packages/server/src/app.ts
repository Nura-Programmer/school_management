import express from 'express';
import schoolRoutes from './routes/school.routes';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/schools', schoolRoutes);

app.get('/', (req, res) => {
    res.send('Hello, School Management System!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;