[English](README.md) | [中文](README_zh-CN.md)

## 简介

这个示例展示了扩展里最基础的 `gopeed.runtime.webview` 用法：
打开一个页面、等待加载完成、读取几个浏览器侧字段、获取 cookies，然后通过 `gblob` 导出一个 JSON 文件。

## 用法

安装扩展后，创建一个类似下面的任务：

```text
https://webview.local/?url=https%3A%2F%2Fexample.com
```

下载得到的 JSON 会包含：

- `title`
- `url`
- `readyState`
- `userAgent`
- `cookies`

## 说明

- 如果当前平台不支持 `gopeed.runtime.webview`，扩展会直接抛出 `MessageError`。
