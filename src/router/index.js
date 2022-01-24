import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home';
import Gream from '@/components/Gream';
import Echars from '@/components/Echars';
import Echearts01 from '@/components/Echearts01';
import childEcher from '@/components/childEcher';

Vue.use( VueRouter )

const routes= [
  { path: '/', redirect: '/Home' },
  { path: '/Home', component: Home },
  { path: '/Gream', component: Gream },
  { path: '/Echars', component: Echars },
  { path: '/Echearts01', component: Echearts01 },
  { path: '/childEcher', component: childEcher },
];

const router = new VueRouter( {
  routes
} );
export default router;
