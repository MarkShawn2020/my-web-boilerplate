# 🚀 Supabase 标准工作流

> **原则**: 只使用 Supabase SDK 和 migration 文件，无额外脚本

## ⚡ 立即执行

```bash
# 1. 升级 CLI (推荐)
npm install -g supabase@latest

# 2. 应用迁移
supabase db push

# 3. 生成类型
supabase gen types typescript --local > src/types/database.ts
```

## 📁 Migration 文件

- `supabase/migrations/20250723170055_create_user_tables_with_rls.sql`

包含：
- ✅ `user_profiles` 表 + RLS 策略
- ✅ `user_preferences` 表 + RLS 策略  
- ✅ `user_subscriptions` 表 + RLS 策略
- ✅ 触发器和索引

## 🎯 验证结果

```bash
# 打开数据库管理界面
supabase studio

# 查看迁移状态
supabase db diff

# 检查类型定义
cat src/types/database.ts
```

## 📊 预期效果

- **Header 加载时间**: 2-3 秒 → ~1 秒
- **数据库表**: 3 个业务表已创建
- **RLS 策略**: 所有表都已启用安全策略

---

**核心思想**: Supabase SDK 本身就足够强大，无需额外脚本。