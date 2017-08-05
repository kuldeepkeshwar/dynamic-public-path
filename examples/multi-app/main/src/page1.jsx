import React from 'react';
import MyLibrary from 'MyLibrary';

export default class Page1 extends React.Component {
  constructor(){
    super();
    this.state={}
  }
  componentDidMount(){
    MyLibrary.import('library').then((module)=>{
      const fns= module.normalFunctions(); // these function's defination are already bundled into lib
      const add = fns[0];
      const subtract = fns[1];
      this.setState({
        addResult:add(20,10),
        subResult:subtract(20,10)
      })

      module.onDemanFunctions().then((results)=>{ // these function's defination are fetched ondemand
          const divide = results[0];
          const multiple = results[1];
          this.setState({
            divideResult:divide(20,10),
            multipleResult:multiple(20,10)
          })
      }); 
      
    });
    
  }
  render () {
    return (
      <div>
        <h1>Page1 !!!</h1>

        <div>
          <h3>Result from static functions</h3>
          <div>Add Result: {this.state.addResult}</div>
          <div>Subtract Result: {this.state.subResult}</div>
        </div>
        <div>
          <h3>Result from function's definations fetch on demand</h3>
          <div>Divide Result: {this.state.divideResult}</div>
          <div>Multiple Result: {this.state.multipleResult}</div>
        </div>
     </div>
    );
  }
}
