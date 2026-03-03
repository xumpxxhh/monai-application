-- 创建数据库 mark_live_db
CREATE DATABASE IF NOT EXISTS mark_live_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE mark_live_db;

-- 账单表
CREATE TABLE IF NOT EXISTS bill (
  id          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
  uid         BIGINT        NOT NULL COMMENT '用户 id',
  type        VARCHAR(10)   NOT NULL COMMENT '类型：支出 / 收入',
  title       VARCHAR(255)  NOT NULL DEFAULT '' COMMENT '标题',
  amount      DECIMAL(14,2) NOT NULL DEFAULT 0 COMMENT '金额',
  category    VARCHAR(64)   NOT NULL DEFAULT '' COMMENT '分类',
  tags        VARCHAR(512)  NULL DEFAULT NULL COMMENT '标签，逗号分隔或 JSON',
  image_url   VARCHAR(1024) NULL DEFAULT NULL COMMENT '图片路径',
  time        DATETIME      NOT NULL COMMENT '用户输入的时间',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据生成时间',
  remark      VARCHAR(1024) NULL DEFAULT NULL COMMENT '备注',
  is_deleted  TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '软删除：0 未删除，1 已删除',
  PRIMARY KEY (id),
  KEY idx_uid (uid),
  KEY idx_uid_time (uid, time),
  KEY idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单表';
