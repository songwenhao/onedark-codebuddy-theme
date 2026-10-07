# One Dark Pro for CodeBuddy

One Dark Pro 主题的 CodeBuddy 移植件，与姊妹项目
[onedark-dsh-theme](https://github.com/songwenhao/onedark-dsh-theme)（DeepSeek Harness
版本）同一血统：三个忠实还原的暗色口味，One Dark 的暖灰蓝调贯穿整个工作台。

CodeBuddy CN 是 VS Code 分支（内核 1.106），主题即标准 VS Code 颜色主题扩展，
不涉及 dsh 那套 CJS 注入机制——本仓库的复杂度全部花在一处：**颜色键全覆盖补丁**。

## 三个口味

| 主题 | 编辑器背景 | 侧边栏背景 |
| --- | --- | --- |
| One Dark Pro | `#282c34` | `#21252b` |
| One Dark Pro Darker | `#23272e` | `#1e2227` |
| One Dark Pro Night Flat | `#16191d` | `#16191d` |

语法高亮三口味完全一致（上游如此），含语义高亮（`semanticHighlighting`）。

## 为什么不是直接装市场版 One Dark Pro

市场版（`zhuangtongfa.material-theme` 3.20.2，本扩展的 vendored 来源）的
主题表停留在旧版 VS Code 时代：CodeBuddy 1.106 工作台读取的 81 个颜色键
（命令中心、通知、快速输入、菜单、CodeBuddy 自家聊天面板 chrome 等）它都没有
定义，这些位置会回落到 Dark Modern / Catppuccin 底色的默认值——冷灰蓝、
青绿色调，和 One Dark 的暖灰明显割裂（CodeBuddy 默认暗色主题
"CodeBuddy Dark" 的底子是 Catppuccin Mocha）。

本移植件用 `scripts/gen-themes.mjs` 里的补丁表把这 81 个键全部补齐，
取值遵循 One Dark 自己的约定（`#abb2bf` 前景、`#2c313a` 悬浮、`#4d78cc`
徽标蓝等），并按口味引用各自的背景梯度自动适配。生成器内置
`REQUIRED_KEYS` 断言：换新上游 vendored 文件重新生成时，覆盖缺口会直接报错。

## 目录结构

```
vendor/OneDark-Pro*.json        上游 One Dark Pro 3.20.2 原样副本（改动的事实来源）
scripts/gen-themes.mjs          生成器：vendored 表 + 覆盖补丁 → themes/
themes/*.color-theme.json       生成产物（扩展实际加载的文件）
```

改配色请改 `scripts/gen-themes.mjs` 后重新生成，不要手改 `themes/`。

## 重新生成主题

```bash
node scripts/gen-themes.mjs
```

## 打包 VSIX

```bash
npx @vscode/vsce package --allow-missing-repository --no-dependencies
```

## 安装到 CodeBuddy

命令行：

```bash
"C:\Users\danjing\AppData\Local\Programs\CodeBuddy CN\bin\buddycn.cmd" --install-extension onedark-codebuddy-theme-0.1.0.vsix
```

或在 CodeBuddy 扩展视图 `···` 菜单 → **从 VSIX 安装…**。

装完后 `Ctrl+K Ctrl+T` 打开颜色主题选择器，选
**One Dark Pro / One Dark Pro Darker / One Dark Pro Night Flat**。

## 许可

MIT。主题内容源自 [One Dark Pro](https://github.com/Binaryify/OneDark-Pro)（MIT）。
