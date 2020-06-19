export default [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName: "welcome" */ '../views/Welcome')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '../components/Users')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import(/* webpackChunkName: "roles" */ '../components/Roles')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import(/* webpackChunkName: "rights" */ '../components/Rights')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import(/* webpackChunkName: "reports" */ '../components/Reports')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import(/* webpackChunkName: "params" */ '../components/Params')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "orders" */ '../components/Orders')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import(/* webpackChunkName: "goods" */ '../components/Goods')
      },
      {
        path: '/addgoods',
        name: 'addgoods',
        component: () => import(/* webpackChunkName: "addgoods" */ '../components/Addgoods')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import(/* webpackChunkName: "categories" */ '../components/Categories')
      }
    ],
    redirect: '/welcome'
  },
  {
    path: '/',
    redirect: '/login'
  }
]
