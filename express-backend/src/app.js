import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import interviewRouter from './routes/interview.routes.js';
import questionRouter from './routes/question.routes.js';
import scoreRouter from './routes/score.routes.js';
import vacancyRouter from './routes/vacancy.routes.js';
import chatRouter from './routes/chat.routes.js';

// Routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/interviews', interviewRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/scores', scoreRouter);
app.use('/api/v1/vacancies', vacancyRouter);
app.use('/api/v1/chats', chatRouter);

export { app };
