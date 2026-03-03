/**
 * 数据库配置类型与常量，供 ConfigService 或直接接入 TypeORM / mysql2 使用。
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbname: string;
}

export const databaseConfigDefaults: DatabaseConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'admin123',
  dbname: 'mark_live_db',
};

/** 从环境变量读取并合并默认值（用于非 Nest 场景，如脚本） */
export function getDatabaseConfigFromEnv(): DatabaseConfig {
  return {
    host: process.env.DB_HOST ?? databaseConfigDefaults.host,
    port: parseInt(process.env.DB_PORT ?? String(databaseConfigDefaults.port), 10),
    user: process.env.DB_USER ?? databaseConfigDefaults.user,
    password: process.env.DB_PASSWORD ?? databaseConfigDefaults.password,
    dbname: process.env.DB_NAME ?? databaseConfigDefaults.dbname,
  };
}
