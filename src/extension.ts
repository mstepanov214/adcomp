import * as vscode from 'vscode';
import * as path from 'path';
import * as jsConvert from 'js-convert-case';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'adcomp.createAngularDartComponent',
    async (args: { path: string }) => {
      const name = await vscode.window.showInputBox({
        placeHolder: 'Enter the name of the component directory...',
        validateInput: (value: string) => {
          if (jsConvert.toSnakeCase(value) !== value) {
            return 'The component directory name must be in snake_case format';
          }
          return null;
        },
      });
      if (name === undefined) {
        return;
      }
      const config = vscode.workspace.getConfiguration();
      const styleExtension = config.get<string>('adcomp.styleExtension');
      const includeComments = config.get<boolean>('adcomp.includeComments');
      
      const dartFileUri = vscode.Uri.file(path.join(args.path, name, `${name}.dart`));
      const fileUris = [
        dartFileUri,
        vscode.Uri.file(path.join(args.path, name, `${name}.html`)),
        vscode.Uri.file(path.join(args.path, name, `${name}.${styleExtension}`)),
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
      }
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
