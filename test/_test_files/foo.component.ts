@Component({
  selector: 'foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent {
  title = '';
  hasError: boolean;
  value: string;

  constructor() { }
}
