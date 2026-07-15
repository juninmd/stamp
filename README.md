# 🕒 stamp

A small **VS Code extension** for timestamps. Insert the current time as **ISO** or **Unix**, and convert a selected value between formats — Unix seconds, Unix millis, ISO 8601, human-readable.

## Commands
| command | does |
|---------|------|
| `stamp: Inserir data/hora ISO` | insert `2026-07-15T12:00:00.000Z` at the cursor |
| `stamp: Inserir Unix (segundos)` | insert `1784116800` |
| `stamp: Converter seleção (Unix ↔ ISO)` | detect the selected value and replace it with a format you pick (`Ctrl+Alt+T`) |

Selection conversion auto-detects: 10 digits → Unix seconds, 13 digits → Unix millis, otherwise a parseable date.

## Install (dev)
Open the folder in VS Code and press **F5**, or package with `npx @vscode/vsce package`.

## Layout
- `src/time.js` — pure conversion logic (`nowFormats`, `detectAndConvert`), unit-tested.
- `extension.js` — the three commands (only file importing `vscode`).

## Dev
```bash
bun test
```

MIT.
