# adcomp

Extension provides explorer context menu option to create Angular Dart component in the desired directory.

```bash
βββ πparent_dir
β   βββ πcreated_component
β       βββ created_component.dart
β       βββ created_component.html
β       βββ created_component.scss
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
