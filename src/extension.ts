// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({ path: __dirname + "/../.env" });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const MODEL = "text-davinci-003";

// Example
/*
async function runCompletion() {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "How are you today?",
  });
  console.log(completion.data.choices[0].text);
}
*/

function getSelectedText(): string {
  const editor = vscode.window.activeTextEditor;
  const selectedText = editor?.document.getText(editor.selection);
  // Should not be undefined
  return selectedText!;
}

async function explainCode(): Promise<string> {
  const code = getSelectedText();
  const output = await openai.createCompletion({
    model: MODEL,
    prompt: "Explain this code: \n" + code,
  });
  return output.data.choices[0].text;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-gpt" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "code-gpt.explainCode",
    async () => {
      const output = await explainCode();
      vscode.window.showInformationMessage(output);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
