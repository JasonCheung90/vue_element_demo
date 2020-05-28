import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('../components/Login')
},
{
  path: '/home',
  name: 'home',
  component: () => import('../components/Home')
},
{
  path: '/',
  redirect: '/login'
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (tokenStr) return next()
  next('/login')
})
export default router
