<template>
  <div class="shopper">
    <button @click="btnHome">我是购物车</button>
    <ul class="shop_list">
      <li class="shop_child"
          v-for="(item, ind) in dataList"
          :key="ind">
        <span class="shop_cont">{{ item.name }}</span>
        <button class="btnAdd"
                @click="btnAdd(item)">+</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import data from "../assets/mock/data";

export default {
  name: "shopper",
  data () {
    return {
      dataList: []
    };
  },
  computed: {},
  methods: {
    btnHome () {
      this.$router.push('/Home');
    },
    btnAdd (item) {
      debugger
      this.$store.state.shopCarList.filter(items => {
        console.log(item)
        if (item.id === items.id) {
          return items
        }

      })
      this.$store.commit("setShopCar",


        {
          count: item.count,
          id: item.id,
          isCheck: item.isCheck,
          name: item.name,
          price: item.price,
          // count: 1
        });
    }
  },
  mounted () {
    this.dataList = data;
  }
};
</script>

<style>
* {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shopper,
.shop_list {
  width: 100%;
  height: 100%;
}

.shop_child {
  width: 100%;
  height: 44px;
  line-height: 44px;
}

.shop_cont {
  width: 50%;
  display: inline-block;
}
.btnDel,
.btnAdd {
  width: 30px;
  height: 30px;
}
</style>
