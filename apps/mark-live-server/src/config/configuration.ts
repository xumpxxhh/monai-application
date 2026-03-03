export default () => ({
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? 'admin123',
    dbname: process.env.DB_NAME ?? 'mark_live_db',
  },
  auth: {
    cookieName: process.env.AUTH_COOKIE_NAME ?? 'auth_token',
    jwtSecret: process.env.JWT_SECRET ?? 'your_very_secret_key_for_jwt_signing',
  },
  upload: {
    /** 上传服务地址，如 http://localhost:8888 */
    baseUrl: process.env.UPLOAD_BASE_URL ?? 'http://localhost:8888',
    /** 上传接口路径 */
    path: process.env.UPLOAD_PATH ?? '/api/v1/auth/upload',
  },
});
