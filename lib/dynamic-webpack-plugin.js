const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const bootWebpackConfig = require('./webpack-boot');

function getRequiredFilesFromParentChunks(parentChunks, allChunks) {
  let requiredFiles = [];

  for (let i = 0; i < parentChunks.length; i++) {
    const parentChunkId = parentChunks[i];
    const parentChunk = allChunks.find(chunk => chunk.id === parentChunkId);

    // it's possible that parent has another parent
    // get them recursively
    if (parentChunk) {
      if (parentChunk.parents.length > 0) {
        requiredFiles = getRequiredFilesFromParentChunks(
          parentChunk.parents,
          allChunks
        );
      }
      // add own files
      requiredFiles = requiredFiles.concat(parentChunk.files);
    }
  }

  return requiredFiles;
}

function mapFileByExtension(stats, chunkFiles) {
  const fileMap = {};

  // remove .map file first
  const files = chunkFiles.filter(file => {
    return file.indexOf('.map') === -1;
  });

  files.forEach(file => {
    const fileExt = file.replace(/(.*\.([a-z0-9]+))/, '$2');

    if (fileMap[fileExt]) {
      fileMap[fileExt].push(file);
    } else {
      fileMap[fileExt] = [file];
    }
  });

  return fileMap;
}
function parseModuleDependencyGraph(stats) {
  const entryPoints = {};
  const allChunks = stats.chunks;

    // create map
  for (let i = 0; i < allChunks.length; i++) {
    const currentChunk = allChunks[i];
    const chunkName = currentChunk.names[0];
    const parentChunks = currentChunk.parents;
    const requiredFiles = getRequiredFilesFromParentChunks(
        parentChunks,
        allChunks
      ).concat(currentChunk.files);

      // add to map
    const fileMap = mapFileByExtension(stats, requiredFiles);

    entryPoints[chunkName] = fileMap;
  }

  return entryPoints;
}
function generateDependencyGraph(params) {
  const jsonStats = params.toJson();

  const output = {
    hash: jsonStats.hash,
    path: jsonStats.path,
    assets: parseModuleDependencyGraph(jsonStats)
  };

      // eslint-disable-next-line no-sync
  fs.writeFileSync(this.output, JSON.stringify(output, null, 2));
}
function changePublicPath(params) {
  Object.keys(params.compilation.assets)
  .filter(name => name.includes('.js') && !name.includes('.js.map'))
  .forEach(name => {
    fs.readFile(path.join(this.outputPath, name), (err, data) => {
      if (err) throw err;

      const newBundle = data
        .toString()
        .replace('__webpack_require__.p = ""', `__webpack_require__.p = ${this.publicPath}`);

      fs.writeFile(path.join(this.outputPath, name), newBundle, err => {
        if (err) throw err;
      });
    });
  });
}
function generateBootFile() {
  webpack(Object.assign(bootWebpackConfig, { output: this.bootFileOptions }), (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    console.log('\n generated boot file');
  });
}
const bootFileDefaultOptions = {
  path: '',
  filename: 'boot.js',
  library: ['DynamicWebpack'],
  libraryTarget: 'umd'
};

class DynamicWebpackPlugin {
  constructor(options) {
    this.publicPath = options.publicPath;
    this.outputPath = path.join(process.cwd(), options.outputPath);
    this.output = path.join(process.cwd(), options.assetsFile);
    this.bootFileOptions = Object.assign({}, bootFileDefaultOptions, {
      library: options.global,
      filename: options.bootfilename,
      path: this.outputPath
    });
  }

  apply(compiler) {
    compiler.plugin('done', generateDependencyGraph.bind(this));
    compiler.plugin('done', changePublicPath.bind(this));
    compiler.plugin('done', generateBootFile.bind(this));
  }
}

module.exports = DynamicWebpackPlugin;
