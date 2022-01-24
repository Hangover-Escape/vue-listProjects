<template>
  <div id="app">
    <!-- <my-nav></my-nav> -->
    <router-view class="main_content" />
  </div>
</template>

<script>
// import myNav from "@/components/nav";
export default {
  name: "App",
  components: {
    // myNav
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
}

html,
body,
#app {
  font-family: "Microsoft Yahei", sans-serif;
  width: 100%;
  height: 100%;
  background: #cdd;
}

.main_content {
  position: relative;
  top: 80px;
  width: 100%;
  margin-bottom: 135px;
  padding-left: 248px;
  box-sizing: border-box;
}

@media screen and (max-width: 964px) {
  .main_content {
    padding-left: 0;
  }
}
</style>
