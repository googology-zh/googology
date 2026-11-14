# Blog

## 目录

```
blog/
├── index.html          列表页
├── posts.json          帖子元信息
└── postsfiles/         帖子正文，一个帖子一个 HTML 文件
    ├── 00000001.html
    └── 00000002.html
```

## 帖子编号

文件名就是帖子编号：**8 位十六进制**（32 位无符号整数），小写，从 `00000001.html`
开始递增，不重复、不复用。写新帖时取当前最大编号 + 1，例如 `00000002.html`。

## posts.json

```json
{
  "posts": [
    {
      "id": "00000001",
      "title": "起点",
      "date": "2026-11-14",
      "summary": "列表页显示的一行摘要，可省略",
      "tags": ["入门"]
    }
  ]
}
```

- `id`：8 位十六进制，对应 `postsfiles/<id>.html`。
- `date`：`YYYY-MM-DD`，列表按日期倒序，同日期按编号倒序。
- 顶层也可以直接是数组 `[ ... ]`。
- 帖子正文的路径由 `id` 推出，不需要写 `file` 字段。

## 列表页的行为

1. 读取 `posts.json` 拿到标题、日期、摘要、标签。
2. 尝试读取 `postsfiles/` 的目录索引（服务器需要开启目录列表，Apache / nginx autoindex /
   `python -m http.server` 默认都行）。目录里有、但 `posts.json` 里没登记的帖子会以
   “无标题” 补进列表。
3. 两者都拿不到时，列表页会显示错误提示。

## 公式（LaTeX）

帖子页里挂着 MathJax（tex-mml-chtml，来自 jsDelivr），行内写 `$...$`，独立成行写 `$$...$$`，
`\(` `\)` 和 `\[` `\]` 也认。示例见 `postsfiles/00000002.html`。

- 正文里 `$` 和反斜杠原样保留，不需要额外转义；`&` 会被转成 `&amp;`，HTML 解析后仍是 `&`，
  所以 `aligned` 环境里的对齐符号照常写。
- MathJax 是运行时排版的，断网或屏蔽 jsDelivr 时会看到原始的 LaTeX 源码。
- 列表页不加载 MathJax，标题和摘要里的 `$...$` 不会排版。

## 本地预览

`fetch` 在 `file://` 下不可用，必须走 HTTP：

```
cd blog
python -m http.server 8000
```

然后打开 http://localhost:8000/ 。
