# Monai Application Monorepo

这是一个使用 **pnpm workspace** 和 **Turborepo** 构建的 Monorepo 工程。

## 目录结构

- `apps/`
  - `web`: 前端应用
- `packages/`
  - `ui`: 共享 UI 组件库
  - `config`: 共享配置

## 快速开始

1. 安装依赖:

   ```bash
   pnpm install
   ```

2. 启动开发环境:

   ```bash
   pnpm dev
   ```

3. 构建项目:
   ```bash
   pnpm build
   ```
