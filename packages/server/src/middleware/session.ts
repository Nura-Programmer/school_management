import session from 'express-session';
import mySqlSession from 'express-mysql-session';

import { dbOptions, IN_PROD, SESS_NAME, SESS_PASS } from '../utils/config';

const SESS_LIFE = 1000 * 60 * 60 * 24; // 1 day

const MySQLStore = mySqlSession(session);
const sessionStore = new MySQLStore(dbOptions);

export default () => session({
    name: SESS_NAME,
    secret: SESS_PASS,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: SESS_LIFE,
        sameSite: true,
        secure: IN_PROD
    },
});

sessionStore.onReady().then(() => {
    console.log('Session store is ready.');
}).catch((error) => {
    console.error('Error initializing session store:', error);
});