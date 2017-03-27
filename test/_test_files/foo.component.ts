@Component({
  selector: 'foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent {
  myProperty = '';
  @Input() myLongProperty: string;

  constructor(public myService: MyService) { }

  get myGetter(): boolean {
    return false;
  }

  myMethod() {
    // do smth
  }

  good = false;
}
