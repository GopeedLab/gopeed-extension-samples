[English](README.md) | [中文](README_zh-CN.md)

## Introduction

This sample puts several common `gblob` modes into one extension and switches behavior through the `mode` query parameter.

## Supported Modes

- `blob`: build a file from in-memory `Blob`
- `stream`: build a file from `ReadableStream`
- `http`: proxy a remote HTTP response body into `gblob`
- `range`: create a resumable download source through an opener function

## Usage

```text
https://gblob.local/demo?mode=blob&name=blob.txt&text=hello
https://gblob.local/demo?mode=stream&name=stream.txt&text=line1%0Aline2%0A
https://gblob.local/demo?mode=http&url=https%3A%2F%2Fexample.com%2Ffile.bin&name=file.bin
https://gblob.local/demo?mode=range&url=https%3A%2F%2Fexample.com%2Ffile.bin&name=file.bin
```

## Notes

- `mode=http` expects HTTP `200`.
- `mode=range` expects `200` on the first request and `206` on resumed requests.
- The resume opener must return `response.body`, not `response.body.getReader()`.
