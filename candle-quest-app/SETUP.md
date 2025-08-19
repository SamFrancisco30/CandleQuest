# CandleQuest 项目配置说明

## 环境变量配置

在项目根目录创建 `.env.local` 文件，包含以下配置：

```bash
# Supabase配置
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 获取Supabase配置

1. 登录 [Supabase](https://supabase.com)
2. 选择或创建项目
3. 进入项目设置 → API
4. 复制以下信息：
   - Project URL → `REACT_APP_SUPABASE_URL`
   - anon public → `REACT_APP_SUPABASE_ANON_KEY`

## 数据库表结构

确保Supabase项目中已创建以下表：

### users 表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### training_sessions 表
```sql
CREATE TABLE training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mode INTEGER NOT NULL,
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  user_choice TEXT NOT NULL,
  actual_result TEXT NOT NULL,
  score INTEGER NOT NULL,
  is_wrong BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 启动项目

1. 安装依赖：`npm install`
2. 配置环境变量（见上文）
3. 启动开发服务器：`npm start`

## 注意事项

- 确保Supabase项目已启用Row Level Security (RLS)
- 如果遇到CORS问题，请在Supabase项目设置中配置允许的域名
- 首次运行时会自动创建用户记录
