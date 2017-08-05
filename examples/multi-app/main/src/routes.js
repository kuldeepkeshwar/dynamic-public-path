
const errorLoading = err => console.error('Dynamic page loading failed', err);
const loadModuleDefault = cb => (module) => {
  cb(null, module.default);
};

const page1Route = {
  path: 'page1',
  getComponent (loc, callback) {
    System.import('./page1.jsx').then(loadModuleDefault(callback)).catch(errorLoading);
  }
};
const routes = [{
  path: '/',
  getComponent (loc, callback) {
    System.import('./app.jsx').then(loadModuleDefault(callback)).catch(errorLoading);
  },
  getChildRoutes (nextState, cb) {    
    cb(null, [
      page1Route
    ]);
  }
}];

export default routes;
