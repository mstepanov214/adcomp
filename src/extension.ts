import * as vscode from 'vscode';
import * as jsConvert from 'js-convert-case';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'adcomp.createAngularDartComponent',
    createAngularDartComponent
  );
  context.subscriptions.push(disposable);
}

async function createAngularDartComponent({ fsPath }: { fsPath: string }) {
  const inputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: 'Enter the name of the component directory...',
    prompt: `AngularDart component will be created at ${fsPath}`,
    validateInput: validateInput,
    ignoreFocusOut: true,
  };
  const name = await vscode.window.showInputBox(inputBoxOptions);
  if (name === undefined) {
    return;
  }
  const config = vscode.workspace.getConfiguration();
  const styleExtension = config.get<string>('adcomp.styleExtension');
  const includeComments = config.get<boolean>('adcomp.includeComments');
  const componentDirectoryUri = vscode.Uri.joinPath(vscode.Uri.file(fsPath), name);

  if (await uriExists(componentDirectoryUri)) {
    return vscode.window.showErrorMessage(`${componentDirectoryUri.fsPath} already exists.`);
  }

  const dartFileUri = vscode.Uri.joinPath(componentDirectoryUri, `${name}.dart`);
  const fileUris = [
    dartFileUri,
    vscode.Uri.joinPath(componentDirectoryUri, `${name}.html`),
    vscode.Uri.joinPath(componentDirectoryUri, `${name}.${styleExtension}`),
  ];

  try {
    const wsedit = new vscode.WorkspaceEdit();
    for (const uri of fileUris) {
      wsedit.createFile(uri);
    }
    await vscode.workspace.applyEdit(wsedit);

    const textDocument = await vscode.workspace.openTextDocument(dartFileUri);
    const editor = await vscode.window.showTextDocument(textDocument);
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, "import 'package:ngdart/angular.dart';\n\n");
    });
    const selector = jsConvert.toKebabCase(name);
    const className = jsConvert.toPascalCase(name);
    const adCompSnippet = new vscode.SnippetString(
      [
        ...(includeComments ? ['/// $1'] : []),
        '@Component(',
        `\tselector: '${selector}',`,
        `\ttemplateUrl: '${name}.html',`,
        `\tstyleUrls: ['${name}.css'],`,
        '\tdirectives: [coreDirectives],',
        '\tproviders: [],',
        ')',
        `class ${className} {`,
        includeComments ? '\t$2' : '\t$1',
        '}',
      ].join('\n')
    );
    editor.insertSnippet(adCompSnippet);
  } catch (error) {
    console.error('Component creation error:', error);
    vscode.window.showErrorMessage(`Component creation error: ${error}`);
  }
}

function validateInput(value: string): string | null {
  if (!value || value === '') {
    return 'The component directory name can not be empty';
  }
  if (jsConvert.toSnakeCase(value) !== value) {
    return 'The component directory name must be in snake_case format';
  }
  return null;
}

async function uriExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

export function deactivate() {}
