# dynamic-webpack-plugin
webpack plugin for loading chunks & dependencies with dynamic public path.

This generate a boot file which allows you to load bundles from other projects built with webpack at runtime.  
## install
```
npm install dynamic-webpack-plugin
```

## example
let say we want to publish `MyLibrary` which expose 2 bundles  `a.js` & `b.js`
#### a.js
```
export default {value:10}
```
#### b.js
```
export default {value:20}
```
#### library.webpack.config.js
```
 const DynamicWebpackPlugin = require('dynamic-webpack-plugin');
 const config = {
  entry: {
    a: ['a.js'],
    b: ['b.js']
  },
  output: {
    path: __dirname + '/lib',
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js',
    library: ['ab', '[name]'],
    libraryTarget: 'umd'
  },
  plugins:[
    new DynamicWebpackPlugin({
        outputPath: './lib',
        bootfilename:'my-library.js'
        global: 'MyLibrary',
        publicPath: 'window.publicPath'
    })
  ]
 }
```
above build will create `my-library.js` under the `lib` folder

Add `my-library.js` into other project via script tag
#### index.html -> 
```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>React App</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.js"></script>
	<script src="https://test-app/static/my-library.js"></script>
</head>
<body>
  <div class="container">
    <div id="app">Loading...</div>
	</div>
</body>
</html>

```
#### app.js -> 
```
import MyLibrary from 'MyLibrary'
window.publicPath= 'https://test-app/static/';
MyLibrary.import('a').then((module)=>{
console.log(module) // {value :10}
})
MyLibrary.import('b').then((module)=>{
console.log(module) // {value :20}
})
```
