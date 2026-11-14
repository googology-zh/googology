# 定义库

本目录存放定义库页面与其数据文件，词条由帖子生成器（`D:\expander\pages\poster\shejiqi`）维护。

```
definitions/
├── index.html          定义库页面，读取 definitions.json 后渲染
├── definitions.json    词条数据
└── README.md
```

## definitions.json

数组，每个元素是一个词条：

```json
[
  {
    "term": "googol",
    "alias": "古戈尔",
    "group": "基础概念",
    "body": "10 的 100 次方，即 $10^{100}$。",
    "tags": ["基础", "数"]
  }
]
```

| 字段 | 说明 |
| --- | --- |
| `term` | 术语，必填；为空则该条不显示 |
| `alias` | 中文名或英文名，可省略 |
| `group` | 分组，缺省为「其它」 |
| `body` | 定义正文，纯文本，可含 `$...$`；空行分段 |
| `tags` | 标签数组，可省略 |

- 分组按「基础概念 → 记法 → 函数」排序，其余分组依次排在后面；同组内保持文件中的顺序。
- 文件缺失或内容为 `[]` 时，页面显示空库提示。

## 页面注意事项

- 页面用 `fetch` 读取 `definitions.json`，`file://` 下不可用，需经 HTTP 访问。
- 公式由 MathJax 在渲染后统一排版；筛选用输入框即时过滤，不重新请求数据。
- 生成器改完数据后，刷新页面即可看到结果（`cache: no-store`）。
