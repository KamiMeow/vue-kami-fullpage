(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gsap')) :
  typeof define === 'function' && define.amd ? define(['exports', 'gsap'], factory) :
  (global = global || self, factory(global.KamiFullpage = {}, global.gsap));
}(this, (function (exports, gsap) { 'use strict';

  var script = {
    name: "VueKamiFullpage",

    props: {
      kamiOptions: {
        type: Object,
        validator: function (value) {
          value.speed = value.speed || 1.5;
          value.isLoop = value.isLoop || false;
          value.heights = value.heights || [];
          value.alignment = value.alignment || "top";

          return true;
        }
      }
    },

    mounted: function mounted() {
      var this$1 = this;

      var ref = this.$refs;
      var container = ref.container;

      this.$nextTick(function () {
        this$1.init();

        container.addEventListener("mousewheel", this$1.handleMousewheel);
        container.addEventListener('keypress', this$1.handleKeypress);
        window.addEventListener("resize", this$1.handleResize);

        if (this$1.activeSlide !== 0) {
          this$1.activeSlide = this$1.activeSlide;
        }
      });
    },

    data: function () { return ({
      lastOffsetTop: 0,
      isAnimate: false,
      height: 0,

      event: {
        activeSlide: -1,
        prevSlide: -1,
        isTop: false,
      },

      countSlides: 0,
    }); },

    computed: {
      heights: function heights() {
        var this$1 = this;

        return this.kamiOptions.heights.map(function (height, index) {
          if (height) {
            if (height[0] === "+" || height[0] === "-") {
              return this$1.height + +height;
            }
            if (parseInt(+height)) {
              return height;
            }
            if (height === "fill") {
              return this$1.height;
            }
          }

          var slide = document.querySelector("#pages").children[index]
            .clientHeight;

          return false;
        });
      },

      activeSlide: {
        get: function get() {
          return this.event.activeSlide;
        },
        set: function set(value) {
          if (value > this.activeSlide) {
            if (value === this.countSlides) {
              if (this.kamiOptions.isLoop) { value = 0; }
              else { value -= 1; }
            }
          } else if (value < 0) {
            if (this.kamiOptions.isLoop) {
              if (this.activeSlide === -1) { value = 0; }
              else { value = this.countSlides - 1; }
            } else { value += 1; }
          }

          if (!(value === this.event.activeSlide)) {
            this.event = {
              isTop: !(value > this.activeSlide),
              prevSlide: this.activeSlide,
              activeSlide: value
            };

            this.$emit("start-slide", this.event);
            this.scrollAnimate();
          }
        }
      }
    },

    methods: {
      handleMousewheel: function handleMousewheel() {
        if (!this.isAnimate) {
          this.scroll(event);
        }
      },
      handleKeypress: function handleKeypress(e) {
        // TODO: Slide by arrows
        console.log(e);
      },
      handleResize: function handleResize() {
        this.init();
        this.scrollAnimate();
      },

      init: function init() {
        var this$1 = this;

        var ref = this.$refs;
        var pages = ref.pages;
        if (pages === undefined || !pages.hasChildNodes()) { return; }

        var slides = pages.childNodes;

        this.countSlides = slides.length;
        this.height = window.innerHeight;

        slides.forEach(function (slide, index) {
          slide.classList.add('kami-slide');
          slide.id = "slide-" + index;

          if (this$1.heights[index]) {
            slide.style.height = (this$1.heights[index]) + "px";
          } else {
            this$1.heights[index] = slide.offsetHeight;
            slide.style.height = slide.offsetHeight;
          }
        });
      },

      slideTo: function slideTo(id) {
        this.activeSlide = id;
      },

      scroll: function scroll(e) {
        console.log(e);
        if (e.deltaY > 0) {
          this.activeSlide += 1;
        } else {
          this.activeSlide -= 1;
        }
      },
      scrollAnimate: function scrollAnimate() {
        var this$1 = this;

        this.isAnimate = true;

        var slides = document.querySelector("#pages");
        var offsetTop = -document.querySelector(("#slide-" + (this.activeSlide)))
          .offsetTop;

        if (this.kamiOptions.alignment === "bottom") {
          if (this.activeSlide + 1 < this.countSlides) {
            offsetTop = -document
              .querySelector(("#slide-" + (this.activeSlide + 1)))
              .offsetTop;
            offsetTop += this.height;
          }
        } else if (this.kamiOptions.alignment === "center") {
          var offsetY = Math.abs(this.heights[this.activeSlide] - this.height);

          if (this.heights[this.activeSlide] > this.height) {
            offsetTop -= offsetY / 2;
          } else if (this.heights[this.activeSlide] < this.height) {
            offsetTop += offsetY / 2;
          }
        }

        // var requestId = requestAnimationFrame(callback)
        // console.log(`from: ${this.lastOffsetTop};to: ${offsetTop}`);
        // const baka = document.getElementById("sds");

        // this.animate({
        //   duration: this.kamiOptions.speed,
        //   timing: (timeFraction) => timeFraction,
        //   draw: (offsetTop) => {
        //     slides.style.cssText = `translate3d(0, ${offsetTop}px, 0)`;
        //   },
        // });

        new gsap.TweenLite(slides, this.kamiOptions.speed, {
          transform: ("translate3d(0, " + offsetTop + "px, 0)"),
          onComplete: function () {
            this$1.isAnimate = false;
            this$1.$emit("end-slide", this$1.event);
            this$1.lastOffsetTop = offsetTop;
          }
        });
      }
      // animate(options) {
      //   const start = performance.now();

      //   requestAnimationFrame(function animate(time) {
      //     let timeFraction = (time - start) / options.duration;
      //     if (timeFraction > 1) timeFraction = 1;

      //     const progress = options.timing(timeFraction);

      //     options.draw(progress);

      //     if (timeFraction < 1) {
      //       requestAnimationFrame(animate);
      //     }
      //   });
      // },
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: "container", attrs: { id: "kami-container" } }, [
      _c(
        "div",
        { staticClass: "paginations" },
        _vm._l(_vm.countSlides, function(pagination, i) {
          return _c(
            "div",
            {
              key: "el-" + i,
              staticClass: "pagination-el",
              class: i === _vm.event.activeSlide ? "pagination-active" : "",
              on: {
                click: function($event) {
                  return _vm.slideTo(i)
                }
              }
            },
            [_vm._v(_vm._s(i + 1))]
          )
        }),
        0
      ),
      _vm._v(" "),
      _c("div", { ref: "pages", attrs: { id: "pages" } }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-5bc83aee_0", { source: "\n#kami-container[data-v-5bc83aee] {\n  overflow: hidden;\n}\n#pages[data-v-5bc83aee] {\n  width: 100vw;\n  height: 100vh;\n}\n.paginations[data-v-5bc83aee] {\n  height: auto;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  background-color: #ffffff05;\n  z-index: 1000;\n}\n.pagination-el[data-v-5bc83aee] {\n  font-family: \"Gulim\" !important;\n  display: inline;\n  color: #888;\n  user-select: none;\n  cursor: pointer;\n  font-size: 23px;\n  margin: 10px;\n}\n.pagination-active[data-v-5bc83aee] {\n  color: #ddd;\n}\n", map: {"version":3,"sources":["W:\\.all gits\\plugins\\kami-fullpage\\kami-fullpage\\src\\KamiFullpage.vue"],"names":[],"mappings":";AA4OA;EACA,gBAAA;AACA;AAEA;EACA,YAAA;EACA,aAAA;AACA;AAEA;EACA,YAAA;EACA,kBAAA;EACA,SAAA;EACA,QAAA;EACA,2BAAA;EACA,aAAA;AACA;AACA;EACA,+BAAA;EACA,eAAA;EACA,WAAA;EACA,iBAAA;EACA,eAAA;EACA,eAAA;EACA,YAAA;AACA;AACA;EACA,WAAA;AACA","file":"KamiFullpage.vue","sourcesContent":["<template>\n  <div id=\"kami-container\" ref=\"container\">\n    <div class=\"paginations\">\n      <div\n        v-for=\"(pagination, i) in countSlides\"\n        :key=\"`el-${i}`\"\n        class=\"pagination-el\"\n        :class=\"i === event.activeSlide ? 'pagination-active' : ''\"\n        @click=\"slideTo(i)\"\n      >{{ i + 1 }}</div>\n    </div>\n\n    <div id=\"pages\" ref=\"pages\">\n      <slot />\n    </div>\n  </div>\n</template>\n\n<script>\nimport { TweenLite } from \"gsap\";\n\nexport default {\n  name: \"VueKamiFullpage\",\n\n  props: {\n    kamiOptions: {\n      type: Object,\n      validator: value => {\n        value.speed = value.speed || 1.5;\n        value.isLoop = value.isLoop || false;\n        value.heights = value.heights || [];\n        value.alignment = value.alignment || \"top\";\n\n        return true;\n      }\n    }\n  },\n\n  mounted() {\n    const { container } = this.$refs;\n\n    this.$nextTick(() => {\n      this.init();\n\n      container.addEventListener(\"mousewheel\", this.handleMousewheel);\n      container.addEventListener('keypress', this.handleKeypress);\n      window.addEventListener(\"resize\", this.handleResize);\n\n      if (this.activeSlide !== 0) {\n        this.activeSlide = this.activeSlide;\n      }\n    });\n  },\n\n  data: () => ({\n    lastOffsetTop: 0,\n    isAnimate: false,\n    height: 0,\n\n    event: {\n      activeSlide: -1,\n      prevSlide: -1,\n      isTop: false,\n    },\n\n    countSlides: 0,\n  }),\n\n  computed: {\n    heights() {\n      return this.kamiOptions.heights.map((height, index) => {\n        if (height) {\n          if (height[0] === \"+\" || height[0] === \"-\") {\n            return this.height + +height;\n          }\n          if (parseInt(+height)) {\n            return height;\n          }\n          if (height === \"fill\") {\n            return this.height;\n          }\n        }\n\n        const slide = document.querySelector(\"#pages\").children[index]\n          .clientHeight;\n\n        return false;\n      });\n    },\n\n    activeSlide: {\n      get() {\n        return this.event.activeSlide;\n      },\n      set(value) {\n        if (value > this.activeSlide) {\n          if (value === this.countSlides) {\n            if (this.kamiOptions.isLoop) value = 0;\n            else value -= 1;\n          }\n        } else if (value < 0) {\n          if (this.kamiOptions.isLoop) {\n            if (this.activeSlide === -1) value = 0;\n            else value = this.countSlides - 1;\n          } else value += 1;\n        }\n\n        if (!(value === this.event.activeSlide)) {\n          this.event = {\n            isTop: !(value > this.activeSlide),\n            prevSlide: this.activeSlide,\n            activeSlide: value\n          };\n\n          this.$emit(\"start-slide\", this.event);\n          this.scrollAnimate();\n        }\n      }\n    }\n  },\n\n  methods: {\n    handleMousewheel() {\n      if (!this.isAnimate) {\n        this.scroll(event);\n      }\n    },\n    handleKeypress(e) {\n      // TODO: Slide by arrows\n      console.log(e)\n    },\n    handleResize() {\n      this.init();\n      this.scrollAnimate();\n    },\n\n    init() {\n      const { pages } = this.$refs;\n      if (pages === undefined || !pages.hasChildNodes()) return;\n\n      const slides = pages.childNodes;\n\n      this.countSlides = slides.length;\n      this.height = window.innerHeight;\n\n      slides.forEach((slide, index) => {\n        slide.classList.add('kami-slide');\n        slide.id = `slide-${index}`;\n\n        if (this.heights[index]) {\n          slide.style.height = `${this.heights[index]}px`;\n        } else {\n          this.heights[index] = slide.offsetHeight;\n          slide.style.height = slide.offsetHeight;\n        }\n      });\n    },\n\n    slideTo(id) {\n      this.activeSlide = id;\n    },\n\n    scroll(e) {\n      console.log(e);\n      if (e.deltaY > 0) {\n        this.activeSlide += 1;\n      } else {\n        this.activeSlide -= 1;\n      }\n    },\n    scrollAnimate() {\n      this.isAnimate = true;\n\n      const slides = document.querySelector(\"#pages\");\n      let offsetTop = -document.querySelector(`#slide-${this.activeSlide}`)\n        .offsetTop;\n\n      if (this.kamiOptions.alignment === \"bottom\") {\n        if (this.activeSlide + 1 < this.countSlides) {\n          offsetTop = -document\n            .querySelector(`#slide-${this.activeSlide + 1}`)\n            .offsetTop;\n          offsetTop += this.height;\n        }\n      } else if (this.kamiOptions.alignment === \"center\") {\n        const offsetY = Math.abs(this.heights[this.activeSlide] - this.height);\n\n        if (this.heights[this.activeSlide] > this.height) {\n          offsetTop -= offsetY / 2;\n        } else if (this.heights[this.activeSlide] < this.height) {\n          offsetTop += offsetY / 2;\n        }\n      }\n\n      // var requestId = requestAnimationFrame(callback)\n      // console.log(`from: ${this.lastOffsetTop};to: ${offsetTop}`);\n      // const baka = document.getElementById(\"sds\");\n\n      // this.animate({\n      //   duration: this.kamiOptions.speed,\n      //   timing: (timeFraction) => timeFraction,\n      //   draw: (offsetTop) => {\n      //     slides.style.cssText = `translate3d(0, ${offsetTop}px, 0)`;\n      //   },\n      // });\n\n      new TweenLite(slides, this.kamiOptions.speed, {\n        transform: `translate3d(0, ${offsetTop}px, 0)`,\n        onComplete: () => {\n          this.isAnimate = false;\n          this.$emit(\"end-slide\", this.event);\n          this.lastOffsetTop = offsetTop;\n        }\n      });\n    }\n    // animate(options) {\n    //   const start = performance.now();\n\n    //   requestAnimationFrame(function animate(time) {\n    //     let timeFraction = (time - start) / options.duration;\n    //     if (timeFraction > 1) timeFraction = 1;\n\n    //     const progress = options.timing(timeFraction);\n\n    //     options.draw(progress);\n\n    //     if (timeFraction < 1) {\n    //       requestAnimationFrame(animate);\n    //     }\n    //   });\n    // },\n  }\n};\n</script>\n\n<style scoped>\n#kami-container {\n  overflow: hidden;\n}\n\n#pages {\n  width: 100vw;\n  height: 100vh;\n}\n\n.paginations {\n  height: auto;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  background-color: #ffffff05;\n  z-index: 1000;\n}\n.pagination-el {\n  font-family: \"Gulim\" !important;\n  display: inline;\n  color: #888;\n  user-select: none;\n  cursor: pointer;\n  font-size: 23px;\n  margin: 10px;\n}\n.pagination-active {\n  color: #ddd;\n}\n</style>\n\n<style>\nbody {\n  margin: 0;\n}\n</style>\n"]}, media: undefined })
  ,inject("data-v-5bc83aee_1", { source: "\nbody {\n  margin: 0;\n}\n", map: {"version":3,"sources":["W:\\.all gits\\plugins\\kami-fullpage\\kami-fullpage\\src\\KamiFullpage.vue"],"names":[],"mappings":";AA4QA;EACA,SAAA;AACA","file":"KamiFullpage.vue","sourcesContent":["<template>\n  <div id=\"kami-container\" ref=\"container\">\n    <div class=\"paginations\">\n      <div\n        v-for=\"(pagination, i) in countSlides\"\n        :key=\"`el-${i}`\"\n        class=\"pagination-el\"\n        :class=\"i === event.activeSlide ? 'pagination-active' : ''\"\n        @click=\"slideTo(i)\"\n      >{{ i + 1 }}</div>\n    </div>\n\n    <div id=\"pages\" ref=\"pages\">\n      <slot />\n    </div>\n  </div>\n</template>\n\n<script>\nimport { TweenLite } from \"gsap\";\n\nexport default {\n  name: \"VueKamiFullpage\",\n\n  props: {\n    kamiOptions: {\n      type: Object,\n      validator: value => {\n        value.speed = value.speed || 1.5;\n        value.isLoop = value.isLoop || false;\n        value.heights = value.heights || [];\n        value.alignment = value.alignment || \"top\";\n\n        return true;\n      }\n    }\n  },\n\n  mounted() {\n    const { container } = this.$refs;\n\n    this.$nextTick(() => {\n      this.init();\n\n      container.addEventListener(\"mousewheel\", this.handleMousewheel);\n      container.addEventListener('keypress', this.handleKeypress);\n      window.addEventListener(\"resize\", this.handleResize);\n\n      if (this.activeSlide !== 0) {\n        this.activeSlide = this.activeSlide;\n      }\n    });\n  },\n\n  data: () => ({\n    lastOffsetTop: 0,\n    isAnimate: false,\n    height: 0,\n\n    event: {\n      activeSlide: -1,\n      prevSlide: -1,\n      isTop: false,\n    },\n\n    countSlides: 0,\n  }),\n\n  computed: {\n    heights() {\n      return this.kamiOptions.heights.map((height, index) => {\n        if (height) {\n          if (height[0] === \"+\" || height[0] === \"-\") {\n            return this.height + +height;\n          }\n          if (parseInt(+height)) {\n            return height;\n          }\n          if (height === \"fill\") {\n            return this.height;\n          }\n        }\n\n        const slide = document.querySelector(\"#pages\").children[index]\n          .clientHeight;\n\n        return false;\n      });\n    },\n\n    activeSlide: {\n      get() {\n        return this.event.activeSlide;\n      },\n      set(value) {\n        if (value > this.activeSlide) {\n          if (value === this.countSlides) {\n            if (this.kamiOptions.isLoop) value = 0;\n            else value -= 1;\n          }\n        } else if (value < 0) {\n          if (this.kamiOptions.isLoop) {\n            if (this.activeSlide === -1) value = 0;\n            else value = this.countSlides - 1;\n          } else value += 1;\n        }\n\n        if (!(value === this.event.activeSlide)) {\n          this.event = {\n            isTop: !(value > this.activeSlide),\n            prevSlide: this.activeSlide,\n            activeSlide: value\n          };\n\n          this.$emit(\"start-slide\", this.event);\n          this.scrollAnimate();\n        }\n      }\n    }\n  },\n\n  methods: {\n    handleMousewheel() {\n      if (!this.isAnimate) {\n        this.scroll(event);\n      }\n    },\n    handleKeypress(e) {\n      // TODO: Slide by arrows\n      console.log(e)\n    },\n    handleResize() {\n      this.init();\n      this.scrollAnimate();\n    },\n\n    init() {\n      const { pages } = this.$refs;\n      if (pages === undefined || !pages.hasChildNodes()) return;\n\n      const slides = pages.childNodes;\n\n      this.countSlides = slides.length;\n      this.height = window.innerHeight;\n\n      slides.forEach((slide, index) => {\n        slide.classList.add('kami-slide');\n        slide.id = `slide-${index}`;\n\n        if (this.heights[index]) {\n          slide.style.height = `${this.heights[index]}px`;\n        } else {\n          this.heights[index] = slide.offsetHeight;\n          slide.style.height = slide.offsetHeight;\n        }\n      });\n    },\n\n    slideTo(id) {\n      this.activeSlide = id;\n    },\n\n    scroll(e) {\n      console.log(e);\n      if (e.deltaY > 0) {\n        this.activeSlide += 1;\n      } else {\n        this.activeSlide -= 1;\n      }\n    },\n    scrollAnimate() {\n      this.isAnimate = true;\n\n      const slides = document.querySelector(\"#pages\");\n      let offsetTop = -document.querySelector(`#slide-${this.activeSlide}`)\n        .offsetTop;\n\n      if (this.kamiOptions.alignment === \"bottom\") {\n        if (this.activeSlide + 1 < this.countSlides) {\n          offsetTop = -document\n            .querySelector(`#slide-${this.activeSlide + 1}`)\n            .offsetTop;\n          offsetTop += this.height;\n        }\n      } else if (this.kamiOptions.alignment === \"center\") {\n        const offsetY = Math.abs(this.heights[this.activeSlide] - this.height);\n\n        if (this.heights[this.activeSlide] > this.height) {\n          offsetTop -= offsetY / 2;\n        } else if (this.heights[this.activeSlide] < this.height) {\n          offsetTop += offsetY / 2;\n        }\n      }\n\n      // var requestId = requestAnimationFrame(callback)\n      // console.log(`from: ${this.lastOffsetTop};to: ${offsetTop}`);\n      // const baka = document.getElementById(\"sds\");\n\n      // this.animate({\n      //   duration: this.kamiOptions.speed,\n      //   timing: (timeFraction) => timeFraction,\n      //   draw: (offsetTop) => {\n      //     slides.style.cssText = `translate3d(0, ${offsetTop}px, 0)`;\n      //   },\n      // });\n\n      new TweenLite(slides, this.kamiOptions.speed, {\n        transform: `translate3d(0, ${offsetTop}px, 0)`,\n        onComplete: () => {\n          this.isAnimate = false;\n          this.$emit(\"end-slide\", this.event);\n          this.lastOffsetTop = offsetTop;\n        }\n      });\n    }\n    // animate(options) {\n    //   const start = performance.now();\n\n    //   requestAnimationFrame(function animate(time) {\n    //     let timeFraction = (time - start) / options.duration;\n    //     if (timeFraction > 1) timeFraction = 1;\n\n    //     const progress = options.timing(timeFraction);\n\n    //     options.draw(progress);\n\n    //     if (timeFraction < 1) {\n    //       requestAnimationFrame(animate);\n    //     }\n    //   });\n    // },\n  }\n};\n</script>\n\n<style scoped>\n#kami-container {\n  overflow: hidden;\n}\n\n#pages {\n  width: 100vw;\n  height: 100vh;\n}\n\n.paginations {\n  height: auto;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  background-color: #ffffff05;\n  z-index: 1000;\n}\n.pagination-el {\n  font-family: \"Gulim\" !important;\n  display: inline;\n  color: #888;\n  user-select: none;\n  cursor: pointer;\n  font-size: 23px;\n  margin: 10px;\n}\n.pagination-active {\n  color: #ddd;\n}\n</style>\n\n<style>\nbody {\n  margin: 0;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-5bc83aee";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  var plugin = {
    installed: false,

    install: function install(Vue, ref) {
      var name = ref.name;

      console.log('name', __vue_component__.name);

      if (this.installed) { return; }
      this.installed = true;

      name = name || __vue_component__.name;
      Vue.component(name, __vue_component__);
    },
  };

  var ref = window || global;
  var Vue = ref.Vue;
  if (Vue) {
    Vue.use(plugin);
  }

  exports.default = __vue_component__;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
