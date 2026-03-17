---
name: "figma-assistant"
description: "Provides comprehensive Figma assistance including design system integration, prototype embedding, and design-to-code guidance. Invoke when user asks for Figma-related help, design system integration, or design-to-code conversion."
---

# Figma Assistant

## 功能概述

这个技能帮助你在项目中集成和使用 Figma 设计资源，包括：

- 设计系统集成
- 原型展示和嵌入
- 设计规范文档
- 设计转代码指导

## 使用场景

1. **设计系统集成** - 当需要将 Figma 设计系统转换为代码组件时
2. **原型展示** - 在项目中嵌入和展示 Figma 原型
3. **设计规范** - 从 Figma 生成设计规范文档
4. **设计转代码** - 提供从 Figma 设计到代码实现的指导

## 主要功能

### 1. 设计系统集成
- 分析 Figma 设计系统结构
- 提取设计令牌（颜色、字体、间距等）
- 生成 Tailwind CSS 配置
- 创建可复用的 UI 组件

### 2. 原型嵌入
- 嵌入 Figma 原型链接
- 生成 iframe 嵌入代码
- 配置原型展示参数

### 3. 设计规范文档
- 生成组件使用文档
- 创建设计系统指南
- 提供设计资源说明

### 4. 设计转代码
- 提供 Figma 到 React 组件的转换指导
- 推荐最佳实践
- 帮助实现像素级还原

## 快速开始

### 嵌入 Figma 原型
```html
<iframe 
  style="border: 1px solid rgba(0, 0, 0, 0.1);"
  width="800" 
  height="450"
  src="https://www.figma.com/embed?embed_host=share&url=YOUR_FIGMA_URL"
  allowfullscreen>
</iframe>
```

### 设计系统集成步骤
1. 分析 Figma 文件结构
2. 提取设计令牌
3. 更新 Tailwind 配置
4. 创建基础组件
5. 编写使用文档

## 最佳实践

1. **设计令牌优先** - 始终先提取和定义设计令牌
2. **组件化思维** - 将设计分解为可复用的组件
3. **响应式设计** - 确保设计适配不同屏幕尺寸
4. **可访问性** - 遵循 WCAG 可访问性标准
5. **像素级还原** - 精确实现设计稿的每个细节

## 资源链接

- [Figma Developer API](https://www.figma.com/developers/api)
- [Figma 嵌入文档](https://help.figma.com/hc/en-us/articles/360040038553-Embed-Figma-Files)
- [设计系统最佳实践](https://www.designsystems.com/)
