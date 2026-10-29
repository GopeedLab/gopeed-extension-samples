[English](README.md) | [中文](README_zh-CN.md)

## 介绍

此扩展注册了`onResolve`事件，从`github release`链接中解析出所有资源信息，并在文件列表中显示出来供选择。

## 设置

- **User-Agent**：请求 GitHub API 时使用的 HTTP User-Agent。
- **GitHub API Token**（可选）：在 Gopeed 的扩展设置中填入 [GitHub Personal Access Token](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)，以使用[更高的认证请求额度](https://docs.github.com/zh/rest/using-the-rest-api/rate-limits-for-the-rest-api)。留空时使用匿名请求。认证请求仍受 GitHub 限流规则约束。

Token 仅在解析 Release 时通过 `Authorization: Bearer` 请求头发送给 GitHub API，不会添加到资源下载请求中。

支持链接：`https://github.com/<owner>/<repo>/releases`、`/releases/latest` 和 `/releases/tag/<tag>`。

## 实现

此扩展使用原生 JavaScript 编写，通过`fetch`从 GitHub API 请求对应的`release`信息，然后解析出所有资源信息返回给下载器。

- 效果图

![](.img/example.gif)
