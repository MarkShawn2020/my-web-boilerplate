# Code Inspector 集成说明

## 功能介绍

Code Inspector 是一个强大的开发工具，可以让您在浏览器中直接点击页面元素，自动跳转到对应的源代码位置。这极大地提升了开发效率，特别是在调试和修改 UI 组件时。

## 使用方法

### 1. 启动开发服务器
```bash
pnpm dev
```

### 2. 使用 Code Inspector

在浏览器中访问您的开发环境后：

- **Mac 用户**: 按住 `Option + Shift` 键
- **Windows/Linux 用户**: 按住 `Alt + Shift` 键

然后将鼠标移动到页面上的任何元素，您会看到一个高亮的遮罩层显示元素信息。点击该元素即可自动打开编辑器并定位到对应的源代码位置。

### 3. 控制台提示

打开浏览器控制台，您会看到 Code Inspector 的成功加载提示，包含可用的快捷键组合。

## 支持的编辑器

Code Inspector 支持以下编辑器：
- VSCode
- Cursor
- Windsurf
- WebStorm
- Atom
- HBuilderX
- PhpStorm
- PyCharm
- IntelliJ IDEA

## 注意事项

1. Code Inspector 仅在开发环境中启用，生产环境会自动禁用
2. 确保您的默认编辑器已正确配置
3. 某些动态生成的元素可能无法准确定位

## 配置说明

当前配置位于 `next.config.ts` 文件中：

```typescript
webpack: (config, { dev }) => {
  if (dev) {
    config.plugins.push(
      codeInspectorPlugin({
        bundler: 'webpack',
      })
    );
  }
  return config;
}
```

## 故障排除

如果 Code Inspector 无法正常工作：

1. 检查浏览器控制台是否有错误信息
2. 确保使用的是开发模式 (`pnpm dev`)
3. 清除浏览器缓存并刷新页面
4. 确认编辑器路径配置正确

## 更多信息

- [官方文档](https://inspector.fe-dev.cn)
- [GitHub 仓库](https://github.com/zh-lx/code-inspector)
- [npm 包](https://www.npmjs.com/package/code-inspector-plugin)