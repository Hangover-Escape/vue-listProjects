<template>
  <div class="navList">
    <ul class="navLeft">
      <li class="navItem" v-for="(item, index) in items" :key="index">
        <router-link :to="'/' + item.ad">{{ item.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "navList",
  data() {
    return {
      items: [
        { name: "家里早起时间点", ad: "Home" },
        { name: "家里吃饭点点", ad: "Gream" },
        { name: "Echars", ad: "Echars" },
        { name: "图报表", ad: "Echearts01" },
        {name:"图表2", ad:"childEcher"}
      ]
    };
  }
};
</script>

<style scoped>
.navList {
  position: fixed;
  top: 0.5rem;
  bottom: 0;
  left: 0;
  padding: 0.2rem 0.4rem;
  line-height: 0.4rem;
  background-color: #293c55;
  overflow-y: auto;
  z-index: 15;
}
.navLeft {
  width: 1.68rem;
  font-family: "Microsoft Yahei", sans-serif;
}
.navItem a {
  size: 0.14rem;
  color: #b2b2b2;
}
.navItem a:hover {
  color: rgba(255, 255, 255, 0.8);
}

@media screen and (max-width: 3.75rem) {
  #navList {
    position: relative;
    width: 100%;
    padding: 0.5rem 0.2rem;
    box-sizing: border-box;
    line-height: 0.2rem;
  }
  .navLeft {
     width: 1.68rem;

  }
  .navLeft .navItem {
    display: inline-block;
    margin: 0.5rem 0;
    /* padding: 0 0.8rem; */
    border-right: solid 0.1rem #b2b2b2;
  }
  /* .navItem:last-child {
    border-right: none;
  } */
}
</style>
