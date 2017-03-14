@Component({
  selector: 'foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent {
  myProperty = '';
  myLongProperty: string;

  constructor() { }

  get myGetter(): boolean {
    return false;
  }

  myMethod() {
    // do smth
  }
}
