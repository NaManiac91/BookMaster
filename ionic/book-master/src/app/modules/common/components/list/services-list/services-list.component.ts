import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Service} from "../../../../shared/rest-api-client";

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent  implements OnInit {
  @Input() services: Service[] = [];
  @Input() selectable = false;

  @Output() selected = new EventEmitter<Service>();

  constructor() { }

  ngOnInit() {}

}
