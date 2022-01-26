<template>
  <div class="thisIsHome">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <router-view />
          <el-footer>footer</el-footer>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style lang="scss" scoped>
.thisIsHome {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      height: 44px;
      color: #000;
    }

    .el-aside {
      height: 100%;
      background-color: #d3dce6;
      color: #333;
      text-align: center;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      flex: 1;
      text-align: center;
      position: relative;
      .el-footer {
        width: 100%;
        position: absolute;
        bottom: 0;
      }
      // line-height: 160px;
    }
  }
}
</style>
