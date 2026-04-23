import session from 'express-session';

export default () => session({
    name: 'sid',
    secret: 'ssh!quiet,it\'ascret!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: true,
        secure: process.env.ENV === 'production'
    },
});