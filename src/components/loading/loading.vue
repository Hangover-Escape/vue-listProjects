<template>
  <transition name="scale">
    <div v-show="show" id="loading-view" class="loading-view">
      <!-- <div v-if="$channel === 'qb'" class="loading-warp">
        <div class="loading-img-warp">
          <img src="./img/img-circle.png" class="rotate">
        </div>
        <div class="loading-tips">{{ message }}</div>
      </div> -->
      <div class="loading-box">
        <div class="loading-imgs">
          <img src="./img/img-circle.png" class="img-circle">
          <img v-if="$channel == 'wk'" src="./img/img-inner.png" class="img-inner">
        </div>
        <div class="loading-tips">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>
<script>
/**
   * Loading components.
   * @module components/common/Loading
   * @param {Object} props
   * @param {Boolean} [props.state=false] - 是否显示
   */
  export default {
    name: 'Loading',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: '加载中...'
      }
    },
    data () {
      return {
      }
    }

  }
</script>
<style lang="scss" scoped>
.loading-view {
  top:0;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9000;
}

.loading-tips {
  font-size: .28rem;
  color: #fff;
  text-align: center;
}

 .loading-box {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 2.36rem;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, .7);
    border-radius: .12rem;
    padding: .24rem 0;
  }

  .loading-message {
    color: #fff;
    font-size: .24rem;
    text-align: center;
  }

.rotate {
  -webkit-animation: rotate 0.75s 0s linear infinite;
  animation: rotate 0.75s 0s linear infinite;
}

@keyframes rotate {
  0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
  }
  50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
  }
  100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
  }
}
.scale-leave-active {
  -webkit-animation: scale .35s  ease-in;
    animation: scale .35s ease-in;
}

@keyframes scale {
  0% {
    -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
  }
  35%{
    opacity: .5;
  }
  70% {
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(0);
      transform: scale(0);
      opacity: 0;
  }
}
  .loading-imgs {
    position: relative;
    display: block;
    height: .78rem;
    width: .78rem;
    margin: 0 auto .18rem;

    img {
      position: absolute;
      top: 0;
      left: 0;
      height: .78rem;
      width: .78rem;
    }
    .img-circle {
      animation: rotate 0.75s 0s linear infinite;
    }
  }

</style>
