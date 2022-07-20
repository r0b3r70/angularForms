import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import('./account-signup/account-signup.module').then((m) => m.AccountSignupModule),
  },
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
