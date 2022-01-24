<template>
  <div class="Home">
     <div class="product" v-for="(item, ind) in data" :key="ind">
      <div class="phone">{{item.name}}</div>
      <div class="phoneBtn">
        <button class="delBtn btn" @click="delBtn(ind)">-</button>
        <span>{{item.count}}</span>
        <button class="addBtn btn" @click="addBtn(ind)">+</button>
      </div>
    </div>
  </div>
</template>

<script>
// import echarts from "echarts";
// import "../../node_modules/echarts/dist/extension/bmap.min.js";
export default {
  name: "HelloWorld",
  data() {
    return {

    };
  },
  computed:{
    data(){
      return  this.$store.state.shopCarList
    }
  },
  methods: {
    delBtn(ind){
      this.$store.commit('delCount',ind)
    },
    addBtn(ind){
      this.$store.commit('addCount',ind)
    }
  },
  mounted() {
    // console.log(this.$store.commit('addCount',ind))
    console.log(this.$store.state.shopCarList)
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Home {
  position: relative;
  left: 50%;
  width: 90%;
  height: 600px;
  margin-left: -45%;
  box-shadow: 0 0 8px #fbd157;
  border-radius: 10px;
}
</style>
