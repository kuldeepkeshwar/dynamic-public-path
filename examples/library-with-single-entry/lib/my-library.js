import a from './a';
import b from './b';

export default {
  normalFunctions: ()=>[a, b],
  onDemanFunctions: ()=> Promise.all([System.import('./c'), System.import('./d')])
};
