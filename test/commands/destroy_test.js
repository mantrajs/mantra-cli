import {expect} from 'chai';
import fse from 'fs-extra';
import fs from 'fs';

import {generate, destroy} from '../../dist/commands';
import {setupTestApp, teardownTestApp, checkFileOrDirExists} from '../test_helpers';

describe("destroy command", function() {
  beforeEach(function() {
    setupTestApp();
  });

  afterEach(function() {
    teardownTestApp();
  });

  describe("action", function() {
    it("removes the action file", function() {
      let actionPath = './client/modules/core/actions/posts.js';
      fse.outputFileSync(actionPath, 'dummy content');
      let indexContent =
`import posts from './posts';

export default {
  posts
};
`;
      fse.outputFileSync('./client/modules/core/actions/index.js', indexContent);
      destroy('action', 'core:posts');
      expect((checkFileOrDirExists(actionPath))).to.equal(false);
    });

    it("removes the test file", function() {
      let testPath = './client/modules/core/actions/tests/posts.js';
      fse.outputFileSync(testPath, 'dummy content');
      destroy('action', 'core:posts');
      expect((checkFileOrDirExists(testPath))).to.equal(false);
    });

    it("can update the index file to an empty file", function() {
      fse.outputFileSync('./client/modules/core/actions/posts.js', 'dummy content');
      let indexContent =
`import posts from './posts';

export default {
  posts
};
`;
      fse.outputFileSync('./client/modules/core/actions/index.js', indexContent);
      destroy('action', 'core:posts');
      let updatedContent = fs.readFileSync(
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
      let indexContent =
`import posts from './posts';
import users from './users';

export default {
  posts,
  users
};
`;
      fse.outputFileSync('./client/modules/core/actions/index.js', indexContent);
      destroy('action', 'core:posts');
      let updatedContent = fs.readFileSync(
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
      let componentPath = './client/modules/core/components/posts.jsx';
      fse.outputFileSync(componentPath, 'dummy content');
      destroy('component', 'core:posts');
      expect((checkFileOrDirExists(componentPath))).to.equal(false);
    });

    it("removes the test file", function() {
      let testPath = './client/modules/core/components/tests/post_list.js';
      fse.outputFileSync(testPath, 'dummy content');
      destroy('component', 'core:postList');
      expect((checkFileOrDirExists(testPath))).to.equal(false);
    });
  });

  describe("container", function() {
    it("removes the container file", function() {
      let containerPath = './client/modules/core/containers/posts.js';
      fse.outputFileSync(containerPath, 'dummy content');
      destroy('container', 'core:posts');
      expect((checkFileOrDirExists(containerPath))).to.equal(false);
    });

    it("removes the component file", function() {
      let componentPath = './client/modules/core/components/posts.jsx';
      fse.outputFileSync(componentPath, 'dummy content');
      destroy('container', 'core:posts');
      expect((checkFileOrDirExists(componentPath))).to.equal(false);
    });

    it("removes the test file for container", function() {
      let testPath = './client/modules/core/containers/tests/post_list.js';
      fse.outputFileSync(testPath, 'dummy content');
      destroy('container', 'core:postList');
      expect((checkFileOrDirExists(testPath))).to.equal(false);
    });

    it("removes the test file for component", function() {
      let testPath = './client/modules/core/components/tests/post_list.js';
      fse.outputFileSync(testPath, 'dummy content');
      destroy('container', 'core:postList');
      expect((checkFileOrDirExists(testPath))).to.equal(false);
    });
  });

  describe("collection", function() {
    it("removes the collection file", function() {
      let collectionPath = './lib/collections/posts.js';
      fse.outputFileSync(collectionPath, 'dummy content');
      destroy('collection', 'posts');
      expect((checkFileOrDirExists(collectionPath))).to.equal(false);
    });

    it("updates the index file", function() {
      fse.outputFileSync('./lib/collections/posts.js', 'dummy content');
      let indexContent =
`import Posts from './posts';
import Users from './users';
import Comments from './comments';

export default {
  Posts,
  Users,
  Comments
};
`;
      fse.outputFileSync('./lib/collections/index.js', indexContent);
      destroy('collection', 'posts');
      let updatedContent = fs.readFileSync(
        './lib/collections/index.js', {encoding: 'utf-8'});
      expect(updatedContent).to.equal(
`import Users from './users';
import Comments from './comments';

export default {
  Users,
  Comments
};
`
      );
    });
  });

  describe("method", function() {
    it("removes the method file", function() {
      let methodPath = './server/methods/posts.js';
      fse.outputFileSync(methodPath, 'dummy content');
      destroy('method', 'posts');
      expect((checkFileOrDirExists(methodPath))).to.equal(false);
    });

    it("updates the index file", function() {
      fse.outputFileSync('./server/methods/posts.js', 'dummy content');
      let indexContent =
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
      destroy('method', 'groupActivities');
      let updatedContent = fs.readFileSync(
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
      let publicationPath = './server/publications/posts.js';
      fse.outputFileSync(publicationPath, 'dummy content');
      destroy('publication', 'posts');
      expect((checkFileOrDirExists(publicationPath))).to.equal(false);
    });

    it("updates the index file", function() {
      fse.outputFileSync('./server/publications/posts.js', 'dummy content');
      let indexContent =
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
      destroy('publication', 'groupActivities');
      let updatedContent = fs.readFileSync(
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
      generate('module', 'comments');
      destroy('module', 'comments');

      expect(checkFileOrDirExists('./client/modules/comments')).to.equal(false);
    });

    it("updates the main.js file", function() {
      let mainFilePath = './client/main.js';
      let content =
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
      destroy('module', 'comments');
      let updatedContent = fs.readFileSync(mainFilePath, {encoding: 'utf-8'});
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
