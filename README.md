# Monai Application Monorepo

使用 **pnpm workspace** 与 **Turborepo** 构建的 Monorepo，包含认证、生活记账前端与后端服务。

## 目录结构

- **apps/**
  - **auth** — 认证前端（登录 / 注册），Vite + React
  - **mark-live** — 生活记账前端，Vite + React（首页、明细、记一笔、统计、个人）
  - **mark-live-server** — 记账后端 API，NestJS + TypeORM + MySQL
  - **web** — 其他前端应用
- **packages/**
  - **ui** — 共享 UI 组件（Button、Card、Input、Label、toast 等）
  - **config** — 共享配置（如认证相关常量与客户端）

## 快速开始

1. 安装依赖：

   ```bash
   pnpm install
   ```

2. 开发环境：

   ```bash
   pnpm dev                    # 所有应用
   pnpm dev:auth               # 仅认证应用
   pnpm dev:mark-live          # 仅记账前端
   pnpm dev:mark-live-server   # 仅记账后端
   ```

3. 构建：

   ```bash
   pnpm build                  # 全部构建
   pnpm build:auth             # 仅认证
   pnpm build:mark-live        # 仅记账前端
   pnpm build:mark-live-server # 仅记账后端
   ```

4. 代码质量：

   ```bash
   pnpm lint        # ESLint 检查
   pnpm lint:fix    # 自动修复
   pnpm format      # Prettier 格式化
   ```

## 环境变量

根目录通过 `.env.development` / `.env.production` 管理，由 Turbo 的 `globalEnv` 下发到各应用。记账前端相关变量说明见 [apps/mark-live/README.md](apps/mark-live/README.md)。

- `VITE_AUTH_API_BASE_URL` — 认证服务地址
- `VITE_MARK_LIVE_API_BASE_URL` — mark-live API 地址
- `VITE_APP_MARK_LIVE_NAME` — 应用 clientId
- `VITE_APP_MARK_LIVE_BASE_PATH` — 前端路由 base（如生产环境 `/mark`）

## 技术栈

- **前端**：React 18、Vite 5、Tailwind CSS、React Router、Recharts（记账统计）
- **后端**：NestJS 9、TypeORM、MySQL、JWT
- **工程**：TypeScript、pnpm 9、Turborepo、ESLint、Prettier

## 要求

- Node.js >= 18
- pnpm 9.x（见 `packageManager`）
