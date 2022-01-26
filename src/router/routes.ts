import { RouteConfig } from 'vue-router'
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import(/* webpackChunkName: "about" */ '../components/Home.vue'),
    meta: {
      title: '首页'
    }
  }
  // {
  //   path: '/HelloWorld',
  //   name: 'HelloWorld',
  //   component: () => import(/* webpackChunkName: "about" */ '../components/HelloWorld.vue'),
  //   meta: {
  //     title: '菜单栏'
  //   }
  // }
]
export default routes
