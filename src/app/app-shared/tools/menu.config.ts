export const APP_MENU = [
  {
    id: 'dashboard',
    title: 'Dashboards',
    icon: 'airplay',
    children: [
      { id: 'crm', title: 'CRM', route: '/dashboard/crm' },
      { id: 'analytics', title: 'Analytics', route: '/dashboard/analytics' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'cast',
    children: [
      { id: 'sales', title: 'Sales Report', route: '/reports/sales' }
    ]
  }
];
