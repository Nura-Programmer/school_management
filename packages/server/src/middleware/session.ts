import session from 'express-session';
import { IN_PROD, SESS_NAME, SESS_PASS } from '../utils/config';

const SESS_LIFE = 1000 * 60 * 60 * 24; // 1 day

export default () => session({
    name: SESS_NAME,
    secret: SESS_PASS,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESS_LIFE,
        sameSite: true,
        secure: IN_PROD
    },
});