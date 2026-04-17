[English](README.md) | [中文](README_zh-CN.md)

## Introduction

This sample shows the basic `gopeed.runtime.webview` workflow in an extension.
It opens a page, waits for it to load, reads a few browser-side fields, collects cookies, and exports the result as a JSON file through `gblob`.

## Usage

Install the extension, then create a task with a fake URL like this:

```text
https://webview.local/?url=https%3A%2F%2Fexample.com
```

The downloaded JSON contains:

- `title`
- `url`
- `readyState`
- `userAgent`
- `cookies`

## Notes

- If the current platform does not provide `gopeed.runtime.webview`, the extension throws `MessageError` directly.
