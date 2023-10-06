[English](README.md) | [中文](README_zh-CN.md)

## Introduction

This extension registers the `onResolve` event to parse all resource information from a `github release` download link and display it in the file list for selection.

## Implementation

The extension is written in pure JavaScript and uses `fetch` to request the corresponding `release` information from the GitHub API, and then parses all resource information and returns it to the downloader.

- Screenshot

![](.img/example.gif)
