# adcomp

Extension provides explorer context menu option to create Angular Dart component in the desired directory.

```bash
├── 📂parent_dir
│   └── 📂created_component
│       ├── created_component.dart
│       ├── created_component.html
│       └── created_component.scss
```

```dart
import 'package:angular/angular.dart';

///
@Component(
  selector: 'created-component',
  templateUrl: 'created_component.html',
  styleUrls: ['created_component.css'],
  directives: [coreDirectives],
  providers: [],
)
class CreatedComponent {

}
```

Intended to be used with the [sass_builder](https://pub.dev/packages/sass_builder) package.
