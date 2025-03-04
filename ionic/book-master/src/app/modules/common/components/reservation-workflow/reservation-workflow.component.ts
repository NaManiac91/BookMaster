import {Component, OnInit, Type} from '@angular/core';
import {IModel, Provider} from "../../../shared/rest-api-client";
import {ObjectProfileView} from "../../object-profile/services/object-profile.service";
import {ModelInitializerService} from "../../../shared/services/model-initializer/model-initializer.service";

@Component({
  selector: 'app-reservation-workflow',
  templateUrl: './reservation-workflow.component.html',
  styleUrls: ['./reservation-workflow.component.scss'],
})
export class ReservationWorkflowComponent implements OnInit {
  view: ObjectProfileView = ObjectProfileView.List;
  type!: Type<IModel>;

  constructor(private modelInitializerService: ModelInitializerService) {}

  ngOnInit() {
    this.type = this.modelInitializerService.getTypeByClassName(Provider.name);
  }

}
