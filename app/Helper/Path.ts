export const BASE_URL = process.env.BACKEND_URL;

export const path: { [key: string]: string } = {
    registration: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    getTask: '/task',
    getAllTaks: '/task/all',
    getAllUser: '/auth/all-users',
};
