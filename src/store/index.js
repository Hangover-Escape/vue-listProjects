import Vue from 'vue';
import Vuex from 'vuex';
// import Apps from './modules/start';

Vue.use( Vuex );

const state = {
  productList: [],
  shopCarList: []
};

const mutations = {
  setProduct ( state, payload ) {
    state.productList = [...payload]
  },
  setShopCar ( state, payload ) {
    state.shopCarList = [...state.shopCarList, payload]
  },
  addCount ( state, ind ) {
    console.log(ind)
    state.shopCarList[ind].count++
  },
  delCount ( state, ind ) {
    state.shopCarList[ind].count--
  }
};

const store = new Vuex.Store( {
  state,
  mutations
} );
export default store;
