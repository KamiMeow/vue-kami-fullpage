import KamiFullpage from './KamiFullpage.vue';

const plugin = {
  installed: false,

  install(Vue, { name }) {
    console.log('name', KamiFullpage.name);

    if (this.installed) return;
    this.installed = true;

    name = name || KamiFullpage.name;
    Vue.component(name, KamiFullpage);
  },
};

const { Vue } = window || global;
if (Vue) {
  Vue.use(plugin);
}

export default KamiFullpage;
