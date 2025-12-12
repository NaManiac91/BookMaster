import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/shared/components/login/login.component';
import {AuthCallbackComponent} from "./modules/shared/components/auth-callback/auth-callback.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadChildren: () => import('./modules/folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
