const dependenciesCache = {};
const __buildOptions = {
  assetsFile: ASSETS_FILE,
  libModuleName: LIB_MODULE_NAME
};
const __options ={
  publicPath : undefined
};
const options = {};
const keys= ['publicPath','assetsFile','libModuleName'];

Object.defineProperty(__buildOptions,keys[0],{
  get:function(){
    return PUBLIC_PATH
  }
});
const getOptionValue=(key) =>{
  if(!__options[key]){
    return __buildOptions[key];
  }
  return __options[key];
};
keys.forEach(key=>Object.defineProperty(options,key,{
  get:function(){
    if(!__options[key]){
      return __buildOptions[key];
    }
    return __options[key];
  }
}))


let _graph;
const fetchGraph = () => {
  if (!_graph) {
    _graph = new Promise(async (resolve) => {
      const graph = await fetch(`${options.publicPath + options.assetsFile}`).then(d => d.json());

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
      return result.then(()=>appendScriptToBody(options.publicPath + dependency));
    }
    return appendScriptToBody(options.publicPath + dependency);
  }, undefined);
};

const configure = (options) =>{
  Object.assign(__options,options)
};
const getModule = (module) => {
  const pattern = options.libModuleName;
  if(Array.isArray(pattern)){
    const len=pattern.length;
    if(len===1){
      return window[options.libModuleName[0]].default || window[options.libModuleName[0]]
    }else{
      return window[options.libModuleName[0]][module].default || window[options.libModuleName[0]][module]
    }
  }else{
    return window[options.libModuleName].default || window[options.libModuleName]
  }
}
const importModule = async (module) => {
  if(!options.publicPath){
    throw new Error('publicPath is not set, you can set it at build time or use configure for runtime ');
  }
  const graph = await fetchGraph();

  await loadDependency(module, graph);
  return new Promise((resolve)=>{
    const clear = setInterval(()=>{
      const _module = getModule(module);
      if (_module) {
        clearInterval(clear);
        resolve(_module);
      }
    }, 50);
  });
};

export default { configure, import: importModule, __options: options};
