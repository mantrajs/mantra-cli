var fs = require('fs');
var expect = require('chai').expect;
var fse = require('fs-extra');

var commands = require('../dist/commands');

function checkFileOrDirExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }

    throw e;
  }

  return true;
}

describe("create", function() {
  beforeEach(function() {
    fse.mkdirsSync('./tmp');
    process.chdir('./tmp');
  });

  afterEach(function() {
    fse.removeSync('./blog');
    process.chdir('../');
  });

  it("creates a skeleton mantra app", function() {
    commands.create('blog');
    expect(checkFileOrDirExists('./blog')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/configs/context.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/actions/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/components/main_layout.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/routes.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/main.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/lib/collections/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/publications/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/methods/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/configs/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/main.js')).to.equal(true);
  });
});
