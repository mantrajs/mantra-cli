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

var consoleLog = console.log;

function suppressStdOut() {
  console.log = function() {};
}

function restoreStdOut() {
  console.log = consoleLog;
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
    expect(checkFileOrDirExists('./blog/client/modules/core/containers/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/configs/')).to.equal(true);
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

describe("generate", function() {
  beforeEach(function() {
    fse.mkdirsSync('./tmp');
    process.chdir('./tmp');

    suppressStdOut();
    commands.create('blog');
    restoreStdOut();
    process.chdir('./blog');
  });

  afterEach(function() {
    process.chdir('../../');
    fse.removeSync('./tmp/blog');
  });

  describe("action", function() {
    it("generates action", function() {
      commands.generate('action', 'core:posts');
      expect(checkFileOrDirExists('./client/modules/core/actions/posts.js')).to.equal(true);
    });

    it("updates index.js", function() {
      commands.generate('action', 'core:posts');
      var indexContent = fs.readFileSync('./client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal("import posts from \'./posts\';\n\nexport default {\n  posts\n};\n");
    });
  });

  describe("container", function() {
    it("generates a container", function() {
      commands.generate('container', 'core:post');
      expect(checkFileOrDirExists('./client/modules/core/containers/post.js')).to.equal(true);
    });

    it("generates a component", function() {
      commands.generate('container', 'core:post');
      expect(checkFileOrDirExists('./client/modules/core/components/post.jsx')).to.equal(true);
    });
  });

  describe("component", function() {
    it("generates a component", function() {
      commands.generate('component', 'core:new_post');
      expect(checkFileOrDirExists('./client/modules/core/components/new_post.jsx')).to.equal(true);
    });
  });

  describe("collection", function() {
    it("generates a collection", function() {
      commands.generate('collection', 'posts');
      expect(checkFileOrDirExists('./lib/collections/posts.js')).to.equal(true);
    });

    it("updates lib/collections/index.js", function() {
      commands.generate('collection', 'posts');
      var indexContent = fs.readFileSync('./lib/collections/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal("import posts from \'./posts\';\n\nexport {\n  posts\n};\n");
    });
  });

  describe("method", function() {
    it("generates a method", function() {
      commands.generate('method', 'posts');
      expect(checkFileOrDirExists('./server/methods/posts.js')).to.equal(true);
    });

    it("updates server/methods/index.js", function() {
      commands.generate('method', 'posts');
      var indexContent = fs.readFileSync('./server/methods/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal("import posts from \'./posts\';\n\nexport default function () {\n  posts();\n}\n");
    });
  });

  describe("publication", function() {
    it("generates a publication", function() {
      commands.generate('publication', 'posts');
      expect(checkFileOrDirExists('./server/publications/posts.js')).to.equal(true);
    });

    it("updates server/publications/index.js", function() {
      commands.generate('publication', 'posts');
      var indexContent = fs.readFileSync('./server/publications/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal("import posts from \'./posts\';\n\nexport default function () {\n  posts();\n}\n");
    });
  });
});
