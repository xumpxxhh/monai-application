---
alwaysApply: false
description: 当用户要求进行git提交操作时，需要符合本规则。
---

## git commit 规则

基于本项目历史提交，统一使用以下格式：

`<type>(<scope>): <subject>`

### 1) 格式约束

- `type` 必填，小写英文
- `scope` 建议填写，使用模块名/包名
- `subject` 必填，使用简洁中文描述本次改动结果
- 冒号后保留一个空格
- 一次提交只表达一个主要意图

### 2) type 取值

- `feat`: 新功能、新接口、新能力
- `fix`: 缺陷修复、兼容性修复
- `chore`: 工程配置、脚手架、依赖、仓库维护
- `docs`: 文档更新
- `refactor`: 重构（不改变外部行为）
- `temp`: 临时提交（默认不推荐，合并前应整理）

### 3) scope 命名

优先使用项目内真实模块名，保持与目录/包一致。历史中高频 scope：

- `mark-live`
- `mark-live-server`
- `auth`
- `config`
- `ui`
- `package`

### 4) subject 编写规范

- 说明“做了什么”，不写“在做什么”
- 避免空泛描述，如“调整一下”“更新代码”
- 不包含句号、感叹号等结尾标点
- 控制长度，建议 8~30 个字

### 5) 推荐示例

- `feat(mark-live): 增加图片预览能力`
- `fix(mark-live-server): 修复 dist-bundle 运行适配问题`
- `chore: 统一环境变量与工程配置`
- `docs: 补充 SSO 流程说明`
- `refactor(ui): 统一共享组件导出结构`
