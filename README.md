# dynamic-public-path [![Build Status](https://travis-ci.org/kuldeepkeshwar/dynamic-public-path.svg?branch=master)](https://travis-ci.org/kuldeepkeshwar/dynamic-public-path)
this plugin is to allow webpack to use publicPath value that isn't known at build time.

This generate a boot file which allows you to load bundles from other projects built with webpack at runtime. 

It is extremely helpful when you prepare a build for library with multiple entry points allowing you to load library chunks on demand.

or if you are trying to show views from multiple apps into a single app.
(instead of exposing child app as npm module & adding to your app at build time, you can use them directly at runtime) 

 For now it works with options `library` & `libraryTarget` as 'umd'
## install
```
npm install dynamic-public-path
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
 const DynamicPublicPathPlugin = require('dynamic-public-path');
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
    new DynamicPublicPathPlugin({
        outputPath: './lib',
        bootfilename:'my-library.js'
        global: 'MyLibrary', // gobal variable to access library
        publicPath: 'window.publicPath'
    })
  ]
 }
```
above build will create `my-library.js` under the `lib` folder

Add `my-library.js` into other project via script tag
#### index.html 
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
#### app.js 
```
import MyLibrary from 'MyLibrary'

// set public path 
window.publicPath= 'https://test-app/static/';

//or use configure function
/*
* MyLibrary.configure({publicPath:'https://test-app/static/'})
*/

MyLibrary.import('a').then((module)=>{
console.log(module) // {value :10}
})
MyLibrary.import('b').then((module)=>{
console.log(module) // {value :20}
})
```

 # License [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)
