import { NgModule } from '@angular/core';
import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '../common/common.module';
import { AdminModule } from '../admin/admin.module';

@NgModule({
  imports: [
    SharedModule,
    FolderPageRoutingModule,
    CommonModule,
    AdminModule
  ],
  declarations: [FolderPage]
})
export class FolderPageModule {}
