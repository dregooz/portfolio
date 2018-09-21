'use strict';

const Promise = require('bluebird');
const sass = require('node-sass');
const fs = require('fs');
const fse = require('fs-extra');

const watch = require('watch');

watch.watchTree('.', {
  ignoreDotFiles: true,
  filter: name => !name.match(/dist/),
  interval: .2
}, () => {
   _readDir('./views')
  .then(viewNames => {
    viewNames = viewNames.filter(viewName => viewName !== '.DS_Store');

    return Promise.join(
      fse.copy(`./assets`, `./dist/assets`),
      Promise.map(viewNames, viewName => buildView(viewName))
    )
    .then(() => {
      return Promise.join(
        fse.copy(`./favicon`, `./dist/assets/favicon`)
      );
    });
  })
  .then(() => console.log('Build completed successfully.'))
  .catch(err => console.log(err));
});



function buildView(viewName) {
  return Promise.join(
    fse.copy(`./views/${viewName}/index.html`, `./dist/${viewName}/index.html`),
    fse.copy(`./index.js`, `./dist/${viewName}/index.js`),
    fse.copy(`./views/${viewName}/assets`, `./dist/${viewName}/assets`),
    fse.copy(`./favicon/favicon.ico`, `./dist/${viewName}/favicon`)
  )
  .then(() => {
    return _readDir(`./views/${viewName}`)
    .then(files => {
      return Promise.map(files.filter(fileName => fileName.includes('.scss')), fileName => {
        return _sassToCss(`./views/${viewName}/${fileName}`)
        .then(css => _writeFile(`./dist/${viewName}`, fileName.replace(`scss`, `css`), css));
      });
    });
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
