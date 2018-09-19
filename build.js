'use strict';

const Promise = require('bluebird');
const sass = require('node-sass');
const fs = require('fs');
const fs = require('fse');

_readDir('./views')
.then(viewNames => {
  viewNames = viewNames.filter(viewName => viewName !== '.DS_Store');

  console.log(viewNames);

  viewNames.forEach(viewName => buildView(viewName));
})
.catch(err => console.log(err));



function buildView(viewName) {
  return Promise.props({
    html: Promise.props({
      index: _readFile(`./views/${viewName}/index.html`).then(buffer => buffer.toString())
    }),
    scss: _readDir(`./views/${viewName}`)
    .then(files => {
      const output = {};

      return Promise.map(files.filter(fileName => fileName.includes('.scss')), fileName => {
        return _sassToCss(`./views/${viewName}/${fileName}`)
        .then(result => output[fileName] = result);
      })
      .then(() => output);
    }),
    js: _readFile(`./index.js`).then(buffer => buffer.toString()),
    assets
  })
  .then(src => {
    console.log(src);
    return Promise.props({
      html: Promise.props({
        index: _writeFile(`./dist/${viewName}`, `index.html`, src.html.index)
      }),
      scss: Promise.map(Object.keys(src.scss), fileName => {
        const css = src.scss[fileName];
        _writeFile(`./dist/${viewName}`, fileName.replace(`scss`, `css`), css);
      }),
      js: _writeFile(`./dist/${viewName}`, 'index.js', src.js)
    })
  });
}


function _readDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, result) => err ? reject(err) : resolve(result));
  });
}


function _readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => err ? reject(err) : resolve(result));
  });
}


function _writeFile(path, fileName, data) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err, result) => {
      if (err && !err.message.includes('EEXIST')) return reject(err);

      fs.writeFile(`${path}/${fileName}`, data, (err, result) => err ? reject(err) : resolve(result));
    });
  });
}


function _sassToCss(path) {
  return new Promise((resolve, reject) => {
    sass.render({
      file: path,
      // importer: (...args) => console.log(args)
    }, (err, result) => err ? reject(err) : resolve(result.css.toString()));
  });
}
