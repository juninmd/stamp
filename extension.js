const vscode = require("vscode");
const { nowFormats, detectAndConvert } = require("./src/time");

function insert(text) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  editor.edit((b) => {
    for (const sel of editor.selections) b.replace(sel, text);
  });
}

async function convertSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const sel = editor.selection;
  const raw = editor.document.getText(sel);
  if (!raw.trim()) {
    vscode.window.showInformationMessage("stamp: selecione um Unix ou uma data ISO primeiro.");
    return;
  }
  const conv = detectAndConvert(raw);
  if (!conv) {
    vscode.window.showWarningMessage(`stamp: não reconheci "${raw.trim()}" como timestamp.`);
    return;
  }
  const pick = await vscode.window.showQuickPick(
    [
      { label: conv.iso, description: "ISO 8601" },
      { label: String(conv.unix), description: "Unix (segundos)" },
      { label: String(conv.unixMs), description: "Unix (ms)" },
      { label: conv.human, description: "legível (UTC)" },
    ],
    { placeHolder: `Detectado: ${conv.kind} — escolha o formato de saída` },
  );
  if (pick) editor.edit((b) => b.replace(sel, pick.label));
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("stamp.insertIso", () => insert(nowFormats(new Date()).iso)),
    vscode.commands.registerCommand("stamp.insertUnix", () =>
      insert(String(nowFormats(new Date()).unix)),
    ),
    vscode.commands.registerCommand("stamp.convert", convertSelection),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
