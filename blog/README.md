# Blog

## 目录

```
blog/
├── index.html          列表页
├── posts.json          帖子元信息
├── postassets/         帖子附件，一个帖子一个目录
│   └── <id>/           文件名由 assets 字段声明
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
- `assets`（可选）：附件列表，见下节。

## 帖子附件

帖子可以带图片、源码、数据等附件。文件放在 `postassets/<id>/` 下，同目录可以放多个；
`posts.json` 里用 `assets` 字段登记：

```json
{
  "id": "0000001b",
  "title": "二分：三种写法、边界与答案判定",
  "date": "2026-11-21",
  "summary": "……",
  "tags": ["OI", "ACM", "C++"],
  "assets": [
    { "file": "bisect-demo.svg", "name": "区间收缩示意图", "note": "查找 x = 23 的四轮区间变化" },
    { "file": "lower_bound.cpp", "name": "lower_bound.cpp", "note": "可直接编译" }
  ]
}
```

- `file`：相对 `postassets/<id>/` 的文件名，只允许字母、数字、点、下划线与连字符，
  不接受子目录，避免越出帖子自己的附件目录。
- `name`：显示名，省略时用文件名。
- `note`：一行说明，可省略；`size` 也可选填（如 `"12 KB"`），仅作显示。

正文页在 `<article>` 之后放一个空面板即可，`assets/post.js` 会按当前文件名推出编号、
读取 `posts.json` 并填出附件列表；没有 `assets` 字段时面板保持隐藏：

```html
<section class="assets" id="assets" hidden></section>
<script src="../assets/post.js"></script>
```

附件是普通 `<a download>` 链接，静态托管直接可下。图片想在正文里直接显示，
就写常规的 `<figure><img src="../postassets/<id>/x.svg" alt="…"><figcaption>…</figcaption></figure>`，
不必再登记一遍（登记只是让它在附件栏里可点）。列表页读同一个字段，显示“附件 n”标记。

## 样式

所有页面共用 `assets/mfc.css`，页面里不再内联 `<style>`。外观为 MFC 风格的浅灰面板：
1px 立体边框（左上白、右下灰）、无圆角、无渐变高光；窗口标题栏、按钮、状态栏分格
均按此规则。改配色只需改文件顶部的 `:root` 变量。

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
