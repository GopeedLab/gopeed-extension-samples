[English](README.md) | [中文](README_zh-CN.md)

## 简介

这个示例把几种常见的 `gblob` 模式放进同一个扩展里，通过 `mode` 参数切换行为。

## 支持的模式

- `blob`：通过内存 `Blob` 构造文件
- `stream`：通过 `ReadableStream` 构造文件
- `http`：把远端 HTTP 响应体代理成 `gblob`
- `range`：创建一个支持断点续传的 opener

## 用法

```text
https://gblob.local/demo?mode=blob&name=blob.txt&text=hello
https://gblob.local/demo?mode=stream&name=stream.txt&text=line1%0Aline2%0A
https://gblob.local/demo?mode=http&url=https%3A%2F%2Fexample.com%2Ffile.bin&name=file.bin
https://gblob.local/demo?mode=range&url=https%3A%2F%2Fexample.com%2Ffile.bin&name=file.bin
```

## 说明

- `mode=http` 要求 HTTP 返回 `200`。
- `mode=range` 首次请求要求 `200`，断点续传请求要求 `206`。
- 用于断点续传的 opener 必须返回 `response.body`，不能返回 `response.body.getReader()`。
