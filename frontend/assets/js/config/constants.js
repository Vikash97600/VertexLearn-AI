/* constants.js - Application Configurations and Routing Enums */

export const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://127.0.0.1:8000/api/v1' 
    : 'https://api.vertexlearn.ai/api/v1';

export const AI_SERVICE_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://127.0.0.1:8001/api/v1'
    : 'https://ai.vertexlearn.ai/api/v1';

export const STORAGE_KEYS = {
    THEME: 'vertexlearn_theme',
    ACCESS_TOKEN: 'vertexlearn_access_token',
    REFRESH_TOKEN: 'vertexlearn_refresh_token',
    USER_INFO: 'vertexlearn_user',
    REMEMBER_ME: 'vertexlearn_remember_me',
    SIDEBAR_COLLAPSED: 'vertexlearn_sidebar_collapsed'
};

export const ROLES = {
    STUDENT: 'student',
    INSTRUCTOR: 'instructor',
    ADMIN: 'admin'
};

export const ROUTES = {
    PUBLIC_HOME: '/index.html',
    LOGIN: '/login.html',
    REGISTER: '/register.html',
    STUDENT_DASHBOARD: '/student.html',
    INSTRUCTOR_DASHBOARD: '/instructor.html',
    ADMIN_DASHBOARD: '/admin.html',
    COURSE_PLAYER: '/player.html',
    ERROR_404: '/404.html'
};

export const RATE_LIMITS = {
    AUTH_REQUESTS_LIMIT: 10,
    AI_REQUESTS_LIMIT: 20,
    STANDARD_REQUESTS_LIMIT: 100
};
