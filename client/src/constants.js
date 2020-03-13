export const BACKEND_ROUTE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8001';

export const COOKIE_STATE_TRUE = '1';
export const COOKIE_STATE_FALSE = '0'

export const COOKIE_LOGGED_IN_IDENTIFIER = 'magbelle_logged_in';
export const COOKIE_LOGGED_IN_EXPIRE_DAYS = 30;
export const COOKIE_USER_ID_IDENTIFIER = 'magbelle_user_id';
export const COOKIE_USER_ID_EXPIRE_DAYS = 30;
