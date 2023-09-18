[English](README.md) | [中文](README_zh-CN.md)

## 介绍

此扩展注册了`onResolve`事件，从`github release`链接中解析出所有资源信息，并在文件列表中显示出来供选择。

## 实现

此扩展使用原生 JavaScript 编写，通过`fetch`从 GitHub API 请求对应的`release`信息，然后解析出所有资源信息返回给下载器。

- 效果图

![](.img/example.gif)