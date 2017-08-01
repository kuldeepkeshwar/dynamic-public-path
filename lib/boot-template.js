const dependenciesCache = {};
const __buildOptions = {
  publicPath: PUBLIC_PATH,
  assetsFile: ASSETS_FILE,
  libModuleName: LIB_MODULE_NAME
};
let _graph;
const fetchGraph = () => {
  if (!_graph) {
    _graph = new Promise(async (resolve) => {
      const graph = await fetch(`${__buildOptions.publicPath + __buildOptions.assetsFile}`).then(d => d.json());

      resolve(graph);
    });
  }
  return _graph;
};
const appendScriptToBody = (src) => {
  return new Promise(resolve => {
    if (dependenciesCache[src]) {
      return resolve(true);
    }
    const s = document.createElement('script');

    s.type = 'text/javascript';
    s.src = src;
    s.onload = function () {
      // console.log(`${src} loaded.`);
      resolve(true);
      s.onload = null;
    };
    document.body.append(s);
    dependenciesCache[src] = true;
  });
};

const loadDependency = async (module, graph) => {
  const dependencies = graph.assets[module].js;

  return await dependencies.reduce((result, dependency)=>{
    if (result) {
      return result.then(()=>appendScriptToBody(__buildOptions.publicPath + dependency));
    }
    return appendScriptToBody(__buildOptions.publicPath + dependency);
  }, undefined);
};

const configure = (options) =>{
  Object.assign(__buildOptions,options)
};
const importModule = async (module) => {
  const graph = await fetchGraph();

  await loadDependency(module, graph);
  return new Promise((resolve)=>{
    const clear = setInterval(()=>{
      if (window[__buildOptions.libModuleName]) {
        clearInterval(clear);
        resolve(window[__buildOptions.libModuleName][module].default || window[__buildOptions.libModuleName][module]);
      }
    }, 50);
  });
};

export default { configure, import: importModule, __options: __buildOptions};
