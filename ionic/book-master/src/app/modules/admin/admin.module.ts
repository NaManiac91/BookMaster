import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorComponent } from './components/editor/editor.component';
import { AdminService } from './services/admin.service';
import { CommonModule } from '../common/common.module';

const components = [
  EditorComponent
];

const services = [
  AdminService
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: components,
  exports: components,
  providers: services
})
export class AdminModule {}
