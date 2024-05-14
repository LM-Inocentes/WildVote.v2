import { INavData } from '@coreui/angular';


export const navItemsGeneral: INavData[] = [
  {
    name: 'General',
    title: true,
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-chart' },
  },
  {
    name: 'Account',
    title: true,
  },
  {
    name: 'Scan',
    url: '/scan',
    iconComponent: { name: 'cilFingerprint' },
  },
  {
    name: 'Login',
    url: '/login',
    iconComponent: { name: 'cil-input' },
  },
];
