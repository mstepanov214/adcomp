# adcomp
[![vscode-install](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=mstepanov214.adcomp)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mstepanov214.adcomp)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/mstepanov214.adcomp)

This VS Code extension provides an explorer context menu option to create an empty AngularDart component in the desired directory.

![adcomp-demo](https://github.com/user-attachments/assets/ae0ea017-f6d6-47c0-af78-8d5cdea918c2)

## Configuration Properties
The extension supports the following configuration options:

- `adcomp.styleExtension`
  Specifies the file extension for the component's style file. Useful if you are using a preprocessor such as the [sass_builder](https://pub.dev/packages/sass_builder) package.  
  - `css` (default)  
  - `scss`  
  - `sass`

- `adcomp.includeComments`
  Specifies whether to include a comment section in the generated component.  
  - Default: `true`
 
- `adcomp.useLegacyPackageName`
  Enables the legacy `angular` package name instead of `ngdart`. Use this option if your project depends on AngularDart version `<= 7.0.2`. See [changelog](https://pub.dev/packages/ngdart/changelog#710).
  - Default: `false`
