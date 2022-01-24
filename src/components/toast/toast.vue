<template>
  <transition name="toast">
    <div v-show="show" class="toast-wrapper">
      <div class="toast">
        <i v-if="type" class="toast-icon iconfont" :class="iconTypeClass"></i>
        <span class="toast-message" v-html="message"></span>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info',
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return ['info', 'fail', 'success'].indexOf(value) !== -1
        }
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      iconTypeClass () {
        switch (this.type) {
          case 'success': return 'icon-radio-checked' // 暂用
          case 'fail': return 'icon-delete' // 暂用
          case 'info': return 'icon-info'
          default: return ''
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/font/base/iconfont.css";

  .toast-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .toast {
    background: rgba(0, 0, 0, 0.7);
    border-radius: .25rem;
    padding: .3rem .4rem;
    max-width: 80%;
    min-width: 1.9rem;

    .toast-icon {
      display: block;
      color: #fff;
      font-size: .74rem;
      line-height: .74rem;
      text-align: center;
      margin: 0 auto .16rem;
    }

    .toast-message {
      display: block;
      color: #fff;
      font-size: .28rem;
      line-height: .4rem;
      text-align: center;
    }
  }

  .toast-enter-active,
  .toast-leave-active {
    transition: all .2s;
  }

  .toast-enter,
  .toast-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
</style>
