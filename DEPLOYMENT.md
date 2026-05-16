# 汽车电商网站 - 部署指南

## 项目概述

本项目是一个完整的汽车电商平台，包含：
- **前台公开站**（`client/`）- React + Vite + TailwindCSS
- **后台管理**（`admin/`）- React + Ant Design Pro
- **后端 API**（`server/`）- Node.js + Express + MongoDB

---

## 本地开发启动

### 前提条件
- Node.js 18+
- MongoDB（本地或 MongoDB Atlas）

### 1. 启动后端服务

```bash
cd server
cp .env.example .env  # 配置环境变量
npm install
npm run seed          # 初始化数据（首次）
npm run dev           # 启动开发服务器（端口 3001）
```

### 2. 启动前台

```bash
cd client
npm install
npm run dev    # 端口 5173
```

### 3. 启动后台管理

```bash
cd admin
npm install
npm run dev    # 端口 5174
```

访问地址：
- 前台: http://localhost:5173
- 后台管理: http://localhost:5174
- 管理员账号: admin@cardealership.com / Admin@123456

---

## 外网部署（免费方案）

### 步骤一：MongoDB Atlas 数据库

1. 访问 [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. 注册免费账号，创建 M0（免费）集群
3. 创建数据库用户（记录用户名/密码）
4. 网络访问 → 添加 IP `0.0.0.0/0`（允许所有 IP）
5. 获取连接字符串：`mongodb+srv://user:pass@cluster.mongodb.net/car-dealership`

### 步骤二：GitHub 推送代码

```bash
git init
git add .
git commit -m "初始化汽车电商项目"
git remote add origin https://github.com/你的用户名/car-dealership.git
git push -u origin main
```

### 步骤三：Railway 部署后端

1. 访问 [railway.app](https://railway.app)，用 GitHub 账号登录
2. New Project → Deploy from GitHub → 选择你的仓库
3. 选择 `server/` 目录部署
4. 设置环境变量：

```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/car-dealership
JWT_SECRET=your-super-secure-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-client.vercel.app,https://your-admin.vercel.app
```

5. 获取 Railway 部署 URL（如：`https://api.xxx.railway.app`）

### 步骤四：Vercel 部署前台

1. 访问 [vercel.com](https://vercel.com)，用 GitHub 账号登录
2. New Project → 选择仓库 → **Root Directory 设置为 `client`**
3. 环境变量：
   ```
   VITE_API_URL=https://api.xxx.railway.app
   ```
4. 部署，获取 URL（如：`https://car-client.vercel.app`）

### 步骤五：Vercel 部署后台管理

1. Vercel New Project → 同一仓库 → **Root Directory 设置为 `admin`**
2. 环境变量：
   ```
   VITE_API_URL=https://api.xxx.railway.app
   ```
3. 部署，获取 URL（如：`https://car-admin.vercel.app`）

### 步骤六：初始化生产数据

```bash
cd server
MONGODB_URI=mongodb+srv://... npm run seed
```

---

## 环境变量汇总

### server/.env（生产）
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster/car-dealership
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-client.vercel.app,https://your-admin.vercel.app
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
```

### client/.env.production
```env
VITE_API_URL=https://your-api.railway.app
```

### admin/.env.production
```env
VITE_API_URL=https://your-api.railway.app
```

---

## 管理员默认账号

| 字段 | 值 |
|------|-----|
| 邮箱 | admin@cardealership.com |
| 密码 | Admin@123456 |
| 角色 | 超级管理员 |

**⚠️ 首次登录后请立即修改密码！**

---

## 功能清单

### 前台功能
- [x] 自动轮播 Banner（支持后台配置）
- [x] 车辆分类导航
- [x] 热门车型展示
- [x] 促销活动区域
- [x] 车辆列表（筛选/排序/搜索/分页）
- [x] 车辆详情（图片画廊/视频播放/参数表）
- [x] 联系我们（表单+联系方式）
- [x] 中英文双语切换
- [x] 完整响应式适配（手机/平板/电脑）

### 后台功能
- [x] 管理员登录（账号密码）
- [x] 仪表盘（数量统计）
- [x] 车辆管理（增删改查 + 图片/视频上传）
- [x] 分类管理
- [x] 促销/轮播管理
- [x] 联系信息管理
- [x] 车辆上架/下架/热门开关

---

## 技术架构

```
前台 (Vercel)          后台管理 (Vercel)
React + Vite           React + Ant Design Pro
TailwindCSS            
       |                      |
       └──────────┬───────────┘
                  |
            API (Railway)
         Node.js + Express
                  |
            MongoDB Atlas
```
