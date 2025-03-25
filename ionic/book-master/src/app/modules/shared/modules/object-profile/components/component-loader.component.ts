import {
  AfterViewInit,
  Component,
  ComponentRef,
  EventEmitter,
  Input, OnChanges, OnDestroy, Output,
  ViewChild,
  ViewContainerRef
} from "@angular/core";

@Component({
  selector: 'app-component-loader',
  template: `<div #containerRef></div>`
})
export class ComponentLoaderComponent  implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('containerRef', { read: ViewContainerRef }) containerRef!: ViewContainerRef;
  cmpRef!: ComponentRef<any>;
  private isViewInitialized: boolean = false;

  @Input() object: any;

  private _component: any;
  @Input() set component(cmp: any) {
    if(this.cmpRef){
      this.containerRef.remove(this.containerRef.indexOf(this.cmpRef.hostView));
      this.cmpRef = <any>null;
    }
    this._component= cmp;
  }

  get component(): any {
    return this._component;
  }

  @Output() instance = new EventEmitter();

  constructor() { }

  updateComponent() {
    if (!this._component){
      return;
    }

    if (!this.isViewInitialized) {
      return;
    }

    if (!this.cmpRef) {
      this.cmpRef = this.containerRef.createComponent(this.component);
      this.cmpRef.instance.object = this.object;
      this.instance.emit(this.cmpRef.instance);
    }
  }

  ngOnChanges() {
    this.updateComponent()
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
