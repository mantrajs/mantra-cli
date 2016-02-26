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
    expect(checkFileOrDirExists('./blog/package.json')).to.equal(true);
    expect(checkFileOrDirExists('./blog/.gitignore')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/configs/context.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/actions/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/components/main_layout.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/components/home.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/containers/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/configs/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/routes.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/main.js')).to.equal(true);
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

    commands.create('blog');
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

    it("updates an empty index.js", function() {
      commands.generate('action', 'core:posts');
      var indexContent = fs.readFileSync('./client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';

export default {
  posts
};
`);
    });

    it("updates a non-empty index.js", function() {
      var originalContent =
`import posts from \'./posts\';

export default {
  posts
};
`;
      fs.writeFileSync('./client/modules/core/actions/index.js', originalContent);

      commands.generate('action', 'core:comments');
      var indexContent = fs.readFileSync('./client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';
import comments from \'./comments\';

export default {
  posts,
  comments
};
`);
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
    it("generates a stateless component by default", function() {
      commands.generate('component', 'core:post');
      var content = fs.readFileSync('./client/modules/core/components/post.jsx', {encoding: 'utf-8'});
      expect(content).to.equal(
`import React from 'react';

const Post = () => (
  <div>
    Post
  </div>
);

export default Post;
`);
    });

    it("generates a class extending React.Component if useClass option is provided", function() {
      commands.generate('component', 'core:post', {useClass: true});
      var content = fs.readFileSync('./client/modules/core/components/post.jsx', {encoding: 'utf-8'});
      expect(content).to.equal(
`import React from 'react';

class Post extends React.Component {
  render() {
    return (
      <div>
        Post
      </div>
    );
  }
});

export default Post;
`);
    });
  });

  describe("collection", function() {
    it("generates a collection", function() {
      commands.generate('collection', 'posts');
      expect(checkFileOrDirExists('./lib/collections/posts.js')).to.equal(true);
    });

    it("updates an empty lib/collections/index.js", function() {
      commands.generate('collection', 'posts');
      var indexContent = fs.readFileSync('./lib/collections/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import Posts from \'./posts\';

export {
  undefined,
  Posts
};
`);
    });

    it("updates a non-empty lib/collections/index.js", function() {
      var originalContent =
`import Posts from \'./posts\';

export {
  Posts
};
`;
      fs.writeFileSync('./lib/collections/index.js', originalContent);

      commands.generate('collection', 'users');
      var indexContent = fs.readFileSync('./lib/collections/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import Posts from \'./posts\';
import Users from \'./users\';

export {
  Posts,
  Users
};
`);
    });
  });

  describe("method", function() {
    it("generates a method", function() {
      commands.generate('method', 'posts');
      expect(checkFileOrDirExists('./server/methods/posts.js')).to.equal(true);
    });

    it("updates an empty server/methods/index.js", function() {
      commands.generate('method', 'posts');
      var indexContent = fs.readFileSync('./server/methods/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';

export default function () {
  posts();
}
`);
    });

    it("updates a non-empty server/methods/index.js", function() {
      var originalContent =
`import posts from \'./posts\';

export default function () {
  posts();
}
`;
      fs.writeFileSync('./server/methods/index.js', originalContent);

      commands.generate('method', 'users');
      var indexContent = fs.readFileSync('./server/methods/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';
import users from \'./users\';

export default function () {
  posts();
  users();
}
`);
    });
  });

  describe("publication", function() {
    it("generates a publication", function() {
      commands.generate('publication', 'posts');
      expect(checkFileOrDirExists('./server/publications/posts.js')).to.equal(true);
    });

    it("updates an empty server/publications/index.js", function() {
      commands.generate('publication', 'posts');
      var indexContent = fs.readFileSync('./server/publications/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';

export default function () {
  posts();
}
`);
    });

    it("updates a non-empty server/publications/index.js", function() {
      var originalContent =
`import posts from './posts';

export default function () {
  posts();
}
`;
      fs.writeFileSync('./server/publications/index.js', originalContent);

      commands.generate('publication', 'users');
      var indexContent = fs.readFileSync('./server/publications/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';
import users from \'./users\';

export default function () {
  posts();
  users();
}
`);
    });
  });

  describe("module", function() {
    it("generates a module", function() {
      commands.generate('module', 'comments');
      expect(checkFileOrDirExists('./client/modules/comments')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/actions/index.js')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/components/')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/containers/')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/configs/')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/index.js')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/routes.jsx')).to.equal(true);
    });
  });
});
