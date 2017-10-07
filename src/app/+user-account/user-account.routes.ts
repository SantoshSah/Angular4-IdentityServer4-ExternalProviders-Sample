import { UserAccountComponent } from './user-account.component';

export const routes = [
  { path: '', children: [
    { path: '', component: UserAccountComponent },
    { path: 'sign-up', loadChildren: './+sign-up#SignUpModule' },
    { path: 'sign-in', loadChildren: './+sign-in#SignInModule' }
  ]},
];
