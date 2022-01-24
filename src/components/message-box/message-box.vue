<template>
  <div class="message-box-wrapper">
    <div
      v-if="show"
      class="message-box-mask"
      @touchmove.prevent.stop
    ></div>

    <transition name="message-box">
      <div v-show="show" class="message-box" @touchmove.prevent.stop>
        <div class="message-box-content">
          <div v-if="title" class="message-box-title">{{ title }}</div>
          <img
            v-if="imgUrl"
            :src="imgUrl"
            :style="{ height: `${imgHeight}rem` }"
            class="message-box-image"
            alt=""
          >
          <div v-if="message" class="message-box-message" v-html="message"></div>
        </div>

        <div class="message-box-btns" :class="[ `btns-align-${align}` ]">
          <template v-for="(btn, index) in buttons">
            <button
              :key="index"
              type="button"
              class="message-box-btn"
              :class="[
                typeof btn === 'object' && btn.emphasize ? 'emphasize' : '',
                typeof btn === 'object' && btn.cssClass ? btn.cssClass : ''
              ]"
              @click="onClickBtn(index)"
            >
              {{ typeof btn === 'object' ? btn.label : btn }}
            </button>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      imgUrl: {
        type: String,
        default: ''
      },
      imgHeight: {
        type: Number,
        default: 0.9
      },
      message: {
        type: String,
        default: ''
      },
      buttons: {
        type: Array,
        default: () => ['']
      },
      align: {
        type: String,
        default: 'row'
      },
      show: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      onClickBtn (index) {
        this.$emit('onClickBtn', index)
        this.$emit('update:show', false) // 支持sync
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/style/base';

  .message-box-wrapper {
    position: relative;
    z-index: 9999;
  }

  .message-box-mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  .message-box {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 5.6rem;
    z-index: 99999;
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    border-radius: .24rem;
    font-size: .26rem;
    overflow: hidden;
    backface-visibility: hidden;

    &-content {
      position: relative;
      padding: .4rem;
    }

    &-title {
      color: #2d2f46;
      font-size: .34rem;
      line-height: .48rem;
      text-align: center;
      margin-bottom: .18rem;
    }

    &-image {
      display: block;
      max-width: 4.8rem;
      height: 1.8rem;
      margin: 0 auto .3rem;
    }

    &-message {
      color: #030303;
      font-size: .26rem;
      line-height: .38rem;
      text-align: center;
    }

    &-btns {
      display: flex;

      &.btns-align-column {
        flex-direction: column;
      }

      &.btns-align-row {
        .message-box-btn:not(:first-child) {
          @include border(1px, solid, #EBEBEB, 'left');
        }
      }
    }

    &-btn {
      @include border(1px, solid, #EBEBEB, 'top');

      flex: 1;
      height: .88rem;
      color: #3a72ef;
      font-size: .34rem;
      line-height: .88rem;
      background-color: #fff;

      &:focus {
        outline: none;
      }

      &.emphasize {
        font-weight: 500;
      }
    }
  }

  .message-box-enter-active,
  .message-box-leave-active {
    transition: all .2s;
  }

  .message-box-enter,
  .message-box-leave-to {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.9);
  }
</style>
