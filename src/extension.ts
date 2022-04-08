import * as vscode from 'vscode';
import * as path from 'path';
import * as jsConvert from 'js-convert-case';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'adcomp.createAngularDartComponent',
    async (args: { path: string }) => {
      const name = await vscode.window.showInputBox({
        placeHolder: 'Enter component directory name...',
        validateInput: (value: string) => {
          if (jsConvert.toSnakeCase(value) !== value) {
            return 'Component directory name must be a snake case string';
          }
          return null;
        },
      });
      if (name === undefined) {
        return;
      }
      const dartFile = vscode.Uri.file(path.join(args.path, name, `${name}.dart`));

      const fileUris = [
        dartFile,
        vscode.Uri.file(path.join(args.path, name, `${name}.html`)),
        vscode.Uri.file(path.join(args.path, name, `${name}.scss`)),
      ];
      try {
        await vscode.workspace.fs.stat(vscode.Uri.parse(path.join(args.path, name)));
        return vscode.window.showWarningMessage(`${name} directory already exists`);
      } catch {
        const wsedit = new vscode.WorkspaceEdit();
        for (const fileUri of fileUris) {
          wsedit.createFile(fileUri);
        }
        await vscode.workspace.applyEdit(wsedit);

        const textDocument = await vscode.workspace.openTextDocument(dartFile);
        const editor = await vscode.window.showTextDocument(textDocument);
        await editor.edit((editBuilder) => {
          editBuilder.insert(editor.selection.active, "import 'package:angular/angular.dart';\n\n");
        });
        const selector = jsConvert.toKebabCase(name);
        const className = jsConvert.toPascalCase(name);
        const adCompSnippet = new vscode.SnippetString(
          [
            '/// $1',
            '@Component(',
            `\tselector: '${selector}',`,
            `\ttemplateUrl: '${name}.html',`,
            `\tstyleUrls: ['${name}.css'],`,
            '\tdirectives: [coreDirectives],',
            '\tproviders: [],',
            ')',
            `class ${className} {`,
            '\t$2',
            '}',
          ].join('\n')
        );
        editor.insertSnippet(adCompSnippet);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
