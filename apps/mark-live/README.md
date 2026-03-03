## 环境变量

由根目录 `.env.development` / `.env.production` 统一管理，Turbo 通过 `globalEnv` 传递：

- `VITE_AUTH_API_BASE_URL`：认证服务地址
- `VITE_MARK_LIVE_API_BASE_URL`：mark-live API 地址
- `VITE_APP_NAME`：应用标识（clientId）

---

## 数据模型

id(bigint 自增、非空、主键):

uid(bigint 非空):

type:(支出、收入)

title: (标题)

amount:(金额)

category:(分类)

tags:(标签)

image_url:(图片路径)

time:(自己输入的时间)

created_at:(数据生成的时间)

remark:(备注)

is_deleted:(软删除)
