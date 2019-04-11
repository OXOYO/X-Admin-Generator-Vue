/**
* Created by OXOYO on 2018/8/7.
*
* 滚动条
*/

<style lang="less" rel="stylesheet/less">
  .preview-scroll-bar {
    display: block;
    width: auto;
    height: 100%;
    /*padding-bottom: 60px;*/

    &:hover {
      >.vb-dragger {
        display: inline-block;
      }
    }

    >.vb-content {
      width: calc(~"100% + 20px") !important;
      padding: 0 !important;
    }
    >.vb-dragger {
      z-index: 1000;
      width: 12px;
      right: 0;
      text-align: center;
      display: none;

      &:hover {
        >.vb-dragger-styler {
          background: #A4A8B0;
          height: 100%;
        }
      }

      >.vb-dragger-styler {
        backface-visibility: hidden;
        transform: rotate3d(0,0,0,0);
        transition:
          background-color 100ms ease-out,
          margin 100ms ease-out,
          height 100ms ease-out;
        background: #808590;
        margin: 5px 3px 5px 3px;
        border-radius: 20px;
        height: calc(~"100% - 10px");
        display: block;
      }
    }
    .vb-scrolling-phantom {
      >.vb-dragger {
        >.vb-dragger-styler {
          background: #808590;
        }
      }
    }
    .vb-dragging {
      >.vb-dragger {
        >.vb-dragger-styler {
          background: #A4A8B0;
          margin: 0px;
          height: 100%;
        }
      }
    }
    .vb-dragging-phantom {
      >.vb-dragger {
        >.vb-dragger-styler {
          background: #A4A8B0;
        }
      }
    }
  }
</style>

<template>
  <div class="preview-scroll-bar" v-bar="options">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Scrollbar',
    props: {
      options: {
        type: Object,
        default: () => {
          return {
            preventParentScroll: true
          }
        }
      }
    }
  }
</script>
