# adcomp

This VS Code extension provides an explorer context menu option to create an empty AngularDart component in the desired directory.

![adcomp-demo](https://github.com/mstepanov214/adcomp/assets/22296883/2ca71fd9-dcfd-4ee7-a4cc-478f890d2428)

## Configuration Properties
The extension supports the following configuration options:

- `adcomp.styleExtension`
  Specifies the file extension for the component's style file. Useful if you are using a preprocessor such as the [sass_builder](https://pub.dev/packages/sass_builder) package.  
  Possible values:  
  - `css` (default)  
  - `scss`  
  - `sass`

- `adcomp.includeComments`
  Specifies whether to include a comment section in the generated component.  
  - Default: `true`