import { Router } from '@vaadin/router';
import { store } from './store/store.js';

export function initRouter(outlet) {
  const router = new Router(outlet);
  
  router.setRoutes([
    {
      path: '/',
      component: 'employee-list'
    },
    {
      path: '/employee/new',
      component: 'employee-form'
    },
    {
      path: '/employee/edit/:id',
      component: 'employee-form',
      action: async (context, commands) => {
        const element = document.createElement('employee-form');
        element.isEdit = true;
        const employee = store.getState().employees.find(
          emp => emp.id === parseInt(context.params.id)
        );
        element.employee = employee;
        return element;
      }
    }
  ]);

  return router;
}