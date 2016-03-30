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

function prepareTestApp() {
  suppressStdOut();
  fse.mkdirsSync('./tmp');
  process.chdir('./tmp');

  commands.create('blog');
  process.chdir('./blog');

  fse.outputFileSync('./.meteor/packages', 'test');
  restoreStdOut();
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
    expect(checkFileOrDirExists('./blog/.eslintrc')).to.equal(true);
  });

});

describe("generate", function() {
  beforeEach(function() {
    prepareTestApp();
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

    it("does not generate if entity name contains a dot", function() {
      commands.generate('action', 'core:group.post');
      expect(checkFileOrDirExists('./client/modules/core/actions/group.post.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      commands.generate('action', 'core:groupPost');
      expect(checkFileOrDirExists('./client/modules/core/actions/group_post.js')).to.equal(true);
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

    it("does not generate any files if entity name contains a dot", function() {
      commands.generate('container', 'core:header.menu');
      expect(checkFileOrDirExists('./client/modules/core/containers/header.menu.js')).to.equal(false);
      expect(checkFileOrDirExists('./client/modules/core/components/header.menu.jsx')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      commands.generate('container', 'core:headerMenu');
      expect(checkFileOrDirExists('./client/modules/core/containers/header_menu.js')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/core/components/header_menu.jsx')).to.equal(true);
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
}

export default Post;
`);
    });

    it("does not generate if entity name contains a dot", function() {
      commands.generate('component', 'core:header.menu');
      expect(checkFileOrDirExists('./client/modules/core/components/header.menu.jsx')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      commands.generate('component', 'core:headerMenu');
      expect(checkFileOrDirExists('./client/modules/core/components/header_menu.jsx')).to.equal(true);
    });
  });

  describe("collection", function() {
    it("generates a collection", function() {
      commands.generate('collection', 'posts');
      expect(checkFileOrDirExists('./lib/collections/posts.js')).to.equal(true);
    });

    it("uses collection2 if schema option is specified so", function() {
      commands.generate('collection', 'posts', {schema: 'collection2'});
      var content = fs.readFileSync('./lib/collections/posts.js', {encoding: 'utf-8'});
      expect(content).to.match(/attachSchema/);
    });

    it("does not use collection2 if no viable schema option is provided", function() {
      commands.generate('collection', 'posts');
      var content = fs.readFileSync('./lib/collections/posts.js', {encoding: 'utf-8'});
      expect(content).to.not.match(/attachSchema/);
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

    it("does not generate if entity name contains a dot", function() {
      commands.generate('collection', 'user.info');
      expect(checkFileOrDirExists('./lib/collections/user.info.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      commands.generate('collection', 'userInfo');
      expect(checkFileOrDirExists('./lib/collections/user_info.js')).to.equal(true);
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

    it("does not generate if entity name contains a dot", function() {
      commands.generate('method', 'group.note');
      expect(checkFileOrDirExists('./server/methods/group.note.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      commands.generate('method', 'groupNote');
      expect(checkFileOrDirExists('./server/methods/group_note.js')).to.equal(true);
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

    it("does not generate if entity name contains a dot", function() {
      commands.generate('publication', 'group.note');
      expect(checkFileOrDirExists('./server/publications/group.note.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      commands.generate('publication', 'groupNote');
      expect(checkFileOrDirExists('./server/publications/group_note.js')).to.equal(true);
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

    it("updates client/main.js", function() {
      commands.generate('module', 'comments');
      var content = fs.readFileSync('./client/main.js', {encoding: 'utf-8'});
      expect(content).to.equal(
`import {createApp} from 'mantra-core';
import initContext from './configs/context';

// modules
import coreModule from './modules/core';
import commentsModule from './modules/comments';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(commentsModule);
app.init();
`);
    });

    it("does not generate if entity name contains a dot", function() {
      commands.generate('module', 'group.notes');
      expect(checkFileOrDirExists('./client/modules/group.notes/')).to.equal(false);
    });

    it("converts the module name to snakecase for the directory name", function() {
      commands.generate('module', 'groupNotes');
      expect(checkFileOrDirExists('./client/modules/group_notes')).to.equal(true);
    });
  });
});

describe("destroy", function() {
  beforeEach(function() {
    prepareTestApp();
  });

  afterEach(function() {
    process.chdir('../../');
    fse.removeSync('./tmp/blog');
  });

  describe("action", function() {
    it("removes the action file", function() {
      var actionPath = './client/modules/core/actions/posts.js';
      fse.outputFileSync(actionPath, 'dummy content');
      var indexContent =
`import posts from './posts';

export default {
  posts
};
`;
      fse.outputFileSync('./client/modules/core/actions/index.js', indexContent);
      commands.destroy('action', 'core:posts');
      expect((checkFileOrDirExists(actionPath))).to.equal(false);
    });

    it("can update the index file to an empty file", function() {
      fse.outputFileSync('./client/modules/core/actions/posts.js', 'dummy content');
      var indexContent =
`import posts from './posts';

export default {
  posts
};
`;
      fse.outputFileSync('./client/modules/core/actions/index.js', indexContent);
      commands.destroy('action', 'core:posts');
      var updatedContent = fs.readFileSync(
        './client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`
export default {
};
`
      );
    });

    it("updates the index file", function() {
      fse.outputFileSync('./client/modules/core/actions/posts.js', 'dummy content');
      var indexContent =
`import posts from './posts';
import users from './users';

export default {
  posts,
  users
};
`;
      fse.outputFileSync('./client/modules/core/actions/index.js', indexContent);
      commands.destroy('action', 'core:posts');
      var updatedContent = fs.readFileSync(
        './client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`import users from './users';

export default {
  users
};
`
      );
    });
  });

  describe("component", function() {
    it("removes the component file", function() {
      var componentPath = './client/modules/core/components/posts.jsx';
      fse.outputFileSync(componentPath, 'dummy content');
      commands.destroy('component', 'core:posts');
      expect((checkFileOrDirExists(componentPath))).to.equal(false);
    });
  });

  describe("container", function() {
    it("removes the container file", function() {
      var containerPath = './client/modules/core/containers/posts.js';
      fse.outputFileSync(containerPath, 'dummy content');
      commands.destroy('container', 'core:posts');
      expect((checkFileOrDirExists(containerPath))).to.equal(false);
    });

    it("removes the component file", function() {
      var componentPath = './client/modules/core/components/posts.jsx';
      fse.outputFileSync(componentPath, 'dummy content');
      commands.destroy('container', 'core:posts');
      expect((checkFileOrDirExists(componentPath))).to.equal(false);
    });
  });

  describe("collection", function() {
    it("removes the collection file", function() {
      var collectionPath = './lib/collections/posts.js';
      fse.outputFileSync(collectionPath, 'dummy content');
      commands.destroy('collection', 'posts');
      expect((checkFileOrDirExists(collectionPath))).to.equal(false);
    });

    it("updates the index file", function() {
      fse.outputFileSync('./lib/collections/posts.js', 'dummy content');
      var indexContent =
`import posts from './posts';
import users from './users';
import comments from './comments';

export default {
  posts,
  users,
  comments
};
`;
      fse.outputFileSync('./lib/collections/index.js', indexContent);
      commands.destroy('collection', 'posts');
      var updatedContent = fs.readFileSync(
        './lib/collections/index.js', {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`import users from './users';
import comments from './comments';

export default {
  users,
  comments
};
`
      );
    });
  });

  describe("method", function() {
    it("removes the method file", function() {
      var methodPath = './server/methods/posts.js';
      fse.outputFileSync(methodPath, 'dummy content');
      commands.destroy('method', 'posts');
      expect((checkFileOrDirExists(methodPath))).to.equal(false);
    });

    it("updates the index file", function() {
      fse.outputFileSync('./server/methods/posts.js', 'dummy content');
      var indexContent =
`import users from './users';
import posts from './posts';
import groupActivities from './group_activities';

export default function () {
  users();
  posts();
  groupActivities();
}
`;
      fse.outputFileSync('./server/methods/index.js', indexContent);
      commands.destroy('method', 'groupActivities');
      var updatedContent = fs.readFileSync(
        './server/methods/index.js', {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`import users from './users';
import posts from './posts';

export default function () {
  users();
  posts();
}
`
      );
    });
  });

  describe("publication", function() {
    it("removes the publication file", function() {
      var publicationPath = './server/publications/posts.js';
      fse.outputFileSync(publicationPath, 'dummy content');
      commands.destroy('publication', 'posts');
      expect((checkFileOrDirExists(publicationPath))).to.equal(false);
    });

    it("updates the index file", function() {
      fse.outputFileSync('./server/publications/posts.js', 'dummy content');
      var indexContent =
`import users from './users';
import posts from './posts';
import groupActivities from './group_activities';

export default function () {
  users();
  posts();
  groupActivities();
}
`;
      fse.outputFileSync('./server/publications/index.js', indexContent);
      commands.destroy('publication', 'groupActivities');
      var updatedContent = fs.readFileSync(
        './server/publications/index.js', {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`import users from './users';
import posts from './posts';

export default function () {
  users();
  posts();
}
`
      );
    });
  });

  describe("module", function() {
    it("removes the module directory", function() {
      commands.generate('module', 'comments');
      commands.destroy('module', 'comments');

      expect(checkFileOrDirExists('./client/modules/comments')).to.equal(false);
    });

    it("updates the main.js file", function() {
      var mainFilePath = './client/main.js';
      var content =
`import {createApp} from 'mantra-core';
import initContext from './configs/context';

// modules
import coreModule from './modules/core';
import commentsModule from './modules/comments';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(commentsModule);
app.init();

`;
      fse.outputFileSync(mainFilePath, content);
      commands.destroy('module', 'comments');
      var updatedContent = fs.readFileSync(mainFilePath, {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`import {createApp} from 'mantra-core';
import initContext from './configs/context';

// modules
import coreModule from './modules/core';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.init();

`
      );
    });
  });
});
