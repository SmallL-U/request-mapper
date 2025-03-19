# Request Mapper

一个基于 Koa 的请求映射工具，用于灵活地处理和转发 HTTP 请求。

## 功能特点

- 支持请求路径和方法映射
- 内置数据验证（使用 Joi）
- 灵活的请求转换
- 自动请求转发
- 完整的错误处理
- TypeScript 支持

## 技术栈

- Node.js
- TypeScript
- Koa
- Axios
- Joi
- pnpm (包管理器)

## 安装

```bash
# 使用 pnpm 安装依赖
pnpm install
```

## 开发

```bash
# 启动开发服务器
pnpm dev
```

## 生产环境部署

```bash
# 启动生产服务器
pnpm start
```

## 项目结构

```
.
├── app/                    # 应用源代码
│   ├── config/            # 配置文件
│   ├── routes/            # 路由定义
│   ├── utils/             # 工具函数
│   └── index.ts           # 应用入口
├── .husky/                # Git hooks
├── .prettierrc           # Prettier 配置
├── nodemon.json          # Nodemon 配置
├── package.json          # 项目配置和依赖
├── tsconfig.json         # TypeScript 配置
└── pnpm-lock.yaml        # 依赖锁定文件
```

## 使用示例

```typescript
// 定义映射规则
const rules = [
  {
    path: '/api/users',
    method: 'GET',
    schema: Joi.object({
      page: Joi.number().min(1),
      limit: Joi.number().min(1).max(100)
    }),
    mapping: {
      url: 'https://api.example.com/users',
      method: 'GET',
      input: (data) => ({
        page: data.page,
        per_page: data.limit
      })
    }
  }
];

// 创建请求映射器
const mapper = new RequestMapper(rules);
```

## 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
PORT=3000
```

## 开发指南

### 代码风格

项目使用 Prettier 进行代码格式化，使用 ESLint 进行代码检查。

### Git 提交

项目使用 husky 进行 Git hooks 管理，确保代码质量。