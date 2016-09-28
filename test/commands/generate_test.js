import {expect} from 'chai';
import fse from 'fs-extra';
import fs from 'fs';

import {generate} from '../../dist/commands';
import {setupTestApp, teardownTestApp, checkFileOrDirExists} from '../test_helpers';

describe("generate command", function() {
  beforeEach(function() {
    setupTestApp();
  });

  afterEach(function() {
    teardownTestApp();
  });

  describe("action", function() {
    it("generates action", function() {
      generate('action', 'core:posts');
      expect(checkFileOrDirExists('./client/modules/core/actions/posts.js')).to.equal(true);
    });

    it("updates an empty index.js", function() {
      generate('action', 'core:posts');
      let indexContent = fs.readFileSync('./client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';

export default {
  posts
};
`);
    });

    it("updates a non-empty index.js", function() {
      let originalContent =
`import posts from \'./posts\';

export default {
  posts
};
`;
      fs.writeFileSync('./client/modules/core/actions/index.js', originalContent);

      generate('action', 'core:comments');
      let indexContent = fs.readFileSync('./client/modules/core/actions/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';
import comments from \'./comments\';

export default {
  posts,
  comments
};
`);
    });

    it("does not update index.js if file already exists", function() {
      let originalContent =
`import posts from \'./posts\';
import comments from \'./comments\';

export default {
  posts,
  comments
};
`;
      fs.writeFileSync('./client/modules/core/actions/index.js', originalContent);

      generate('action', 'core:comments');
      let indexContent = fs.readFileSync('./client/modules/core/actions/index.js', {encoding: 'utf-8'});
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
      generate('action', 'core:group.post');
      expect(checkFileOrDirExists('./client/modules/core/actions/group.post.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      generate('action', 'core:groupPost');
      expect(checkFileOrDirExists('./client/modules/core/actions/group_post.js')).to.equal(true);
    });

    it("generates a test file", function() {
      generate('action', 'core:flaggedComments');
      let content = fs.readFileSync('./client/modules/core/actions/tests/flagged_comments.js', {encoding: 'utf-8'});
      expect(content).to.equal(
`const {describe, it} = global;
import {expect} from 'chai';
import {spy, stub} from 'sinon';
import actions from '../flagged_comments';

describe('core.actions.flagged_comments', () => {
  it('should do something');
});
`);
    });

    it("generates a test file even though tests directory does not exist", function() {
      fse.removeSync('./client/modules/core/actions/tests');
      generate('action', 'core:flaggedComments');
      expect(checkFileOrDirExists('./client/modules/core/actions/tests/flagged_comments.js')).to.equal(true);
    });
  });

  describe("container", function() {
    it("generates a container", function() {
      generate('container', 'core:post');
      expect(checkFileOrDirExists('./client/modules/core/containers/post.js')).to.equal(true);
    });

    it("generates a component", function() {
      generate('container', 'core:post');
      expect(checkFileOrDirExists('./client/modules/core/components/post.jsx')).to.equal(true);
    });

    it("does not generate any files if entity name contains a dot", function() {
      generate('container', 'core:header.menu');
      expect(checkFileOrDirExists('./client/modules/core/containers/header.menu.js')).to.equal(false);
      expect(checkFileOrDirExists('./client/modules/core/components/header.menu.jsx')).to.equal(false);
    });

    it("does not generate any files if entity name is empty", function() {
      generate('container', 'core::header');
      expect(checkFileOrDirExists('./client/modules/core/containers/.js')).to.equal(false);
      expect(checkFileOrDirExists('./client/modules/core/components/.js')).to.equal(false);
      expect(checkFileOrDirExists('./client/modules/core/containers/header.js')).to.equal(false);
      expect(checkFileOrDirExists('./client/modules/core/components/header.jsx')).to.equal(false);
    })

    it("converts the entity name to snakecase for the file name", function() {
      generate('container', 'core:headerMenu');
      expect(checkFileOrDirExists('./client/modules/core/containers/header_menu.js')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/core/components/header_menu.jsx')).to.equal(true);
    });

    it("generates a test file for the container", function() {
      generate('container', 'core:commentList');
      let content = fs.readFileSync('./client/modules/core/containers/tests/comment_list.js', {encoding: 'utf-8'});
      expect(content).to.equal(
`const {describe, it} = global;
import {expect} from 'chai';
import {stub, spy} from 'sinon';
import {composer} from '../comment_list';

describe('core.containers.comment_list', () => {
  describe('composer', () => {

//    const Tracker = {nonreactive: cb => cb()};
//    const getCollections = (post) => {
//      const Collections = {
//        Posts: {findOne: stub()}
//      };
//      Collections.Posts.findOne.returns(post);
//      return Collections;
//    };

    it('should do something');
  });
});
`);
    });

    it("generates a test file for the component", function() {
      generate('container', 'core:commentList');
      let content = fs.readFileSync('./client/modules/core/components/tests/comment_list.js', {encoding: 'utf-8'});
      expect(content).to.equal(
`const {describe, it} = global;
import {expect} from 'chai';
import {shallow} from 'enzyme';
import CommentList from '../comment_list';

describe('core.components.comment_list', () => {
  it('should do something');
});
`);
    });

    it("does not generate storybook if not configured", function() {
      generate('container', 'core:commentList', {}, {});
      expect(checkFileOrDirExists('./client/modules/core/components/.stories/comment_list.js')).to.equal(false);
    });

    it("generates storybook if configured", function() {
      generate('container', 'core:commentList', {}, { storybook: true });
      expect(checkFileOrDirExists('./client/modules/core/components/.stories/comment_list.js')).to.equal(true);
    });
  });

  describe("component", function() {
    it("generates a stateless component by default", function() {
      generate('component', 'core:post', {}, {tabSize: 2});
      let content = fs.readFileSync('./client/modules/core/components/post.jsx', {encoding: 'utf-8'});
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
      generate('component', 'core:post', {useClass: true}, {tabSize: 2});
      let content = fs.readFileSync('./client/modules/core/components/post.jsx', {encoding: 'utf-8'});
      expect(content).to.equal(
`import React from 'react';

class Post extends React.Component {
  constructor(props) {
    super(props);
  }

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
      generate('component', 'core:header.menu');
      expect(checkFileOrDirExists('./client/modules/core/components/header.menu.jsx')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      generate('component', 'core:headerMenu');
      expect(checkFileOrDirExists('./client/modules/core/components/header_menu.jsx')).to.equal(true);
    });

    it("generates a test file", function() {
      generate('component', 'core:headerMenu');
      let content = fs.readFileSync('./client/modules/core/components/tests/header_menu.js', {encoding: 'utf-8'});
      expect(content).to.equal(
`const {describe, it} = global;
import {expect} from 'chai';
import {shallow} from 'enzyme';
import HeaderMenu from '../header_menu';

describe('core.components.header_menu', () => {
  it('should do something');
});
`);
    });

    it("does not generate storybook if not configured", function() {
      generate('component', 'core:commentList', {}, {});
      expect(checkFileOrDirExists('./client/modules/core/components/.stories/comment_list.js')).to.equal(false);
    });

    it("generates storybook if configured", function() {
      generate('component', 'core:commentList', {}, { storybook: true });
      expect(checkFileOrDirExists('./client/modules/core/components/.stories/comment_list.js')).to.equal(true);
    });
  });

  describe("collection", function() {
    it("generates a collection", function() {
      generate('collection', 'posts');
      expect(checkFileOrDirExists('./lib/collections/posts.js')).to.equal(true);
    });

    it("uses collection2 if schema option is specified so", function() {
      generate('collection', 'posts', {schema: 'collection2'});
      let content = fs.readFileSync('./lib/collections/posts.js', {encoding: 'utf-8'});
      expect(content).to.match(/attachSchema/);
    });

    it("uses astronomy if schema option is specified so", function() {
      generate('collection', 'posts', {schema: 'astronomy'});
      let content = fs.readFileSync('./lib/collections/posts.js', {encoding: 'utf-8'});
      expect(content).to.match(/Class\.create/);
    });

    it("does not use collection2 if no viable schema option is provided", function() {
      generate('collection', 'posts');
      let content = fs.readFileSync('./lib/collections/posts.js', {encoding: 'utf-8'});
      expect(content).to.not.match(/attachSchema/);
    });

    it("uses custom template if configured", function() {
      let config = {
        tabSize: 2,
        templates: [
          {
            name: 'collection',
            text: 'custom template for <%= collectionName %>'
          }
        ]
      };
      generate('collection', 'posts', {schema: 'collection2'}, config);
      let content = fs.readFileSync('./lib/collections/posts.js', {encoding: 'utf-8'});
      expect(content).to.not.match(/custom template for posts/);
    });

    it("updates an empty lib/collections/index.js", function() {
      generate('collection', 'posts');
      let indexContent = fs.readFileSync('./lib/collections/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import Posts from \'./posts\';

export {
  undefined,
  Posts
};
`);
    });

    it("updates a non-empty lib/collections/index.js", function() {
      let originalContent =
`import Posts from \'./posts\';

export {
  Posts
};
`;
      fs.writeFileSync('./lib/collections/index.js', originalContent);

      generate('collection', 'postCategories');
      let indexContent = fs.readFileSync('./lib/collections/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import Posts from \'./posts\';
import PostCategories from \'./post_categories\';

export {
  Posts,
  PostCategories
};
`);
    });

    it('does not update index.js if file already exists', function() {
      let originalContent =
`import Posts from \'./posts\';
import PostCategories from \'./post_categories\';

export {
  Posts,
  PostCategories
};
`;
      fs.writeFileSync('./lib/collections/index.js', originalContent);

      generate('collection', 'postCategories');
      let indexContent = fs.readFileSync('./lib/collections/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import Posts from \'./posts\';
import PostCategories from \'./post_categories\';

export {
  Posts,
  PostCategories
};
`);

    });

    it("does not generate if entity name contains a dot", function() {
      generate('collection', 'user.info');
      expect(checkFileOrDirExists('./lib/collections/user.info.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      generate('collection', 'userInfo');
      expect(checkFileOrDirExists('./lib/collections/user_info.js')).to.equal(true);
    });
  });

  describe("method", function() {
    it("generates a method", function() {
      generate('method', 'posts');
      expect(checkFileOrDirExists('./server/methods/posts.js')).to.equal(true);
    });

    it("updates an empty server/methods/index.js", function() {
      generate('method', 'posts');
      let indexContent = fs.readFileSync('./server/methods/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';

export default function () {
  posts();
}
`);
    });

    it("updates a non-empty server/methods/index.js", function() {
      let originalContent =
`import posts from \'./posts\';

export default function () {
  posts();
}
`;
      fs.writeFileSync('./server/methods/index.js', originalContent);

      generate('method', 'users');
      let indexContent = fs.readFileSync('./server/methods/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';
import users from \'./users\';

export default function () {
  posts();
  users();
}
`);
    });

    it("does not update index.js if file already exists", function() {
      let originalContent =
`import posts from \'./posts\';
import users from \'./users\';

export default function () {
  posts();
  users();
}
`;
      fs.writeFileSync('./server/methods/index.js', originalContent);

      generate('method', 'users');
      let indexContent = fs.readFileSync('./server/methods/index.js', {encoding: 'utf-8'});
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
      generate('method', 'group.note');
      expect(checkFileOrDirExists('./server/methods/group.note.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      generate('method', 'groupNote');
      expect(checkFileOrDirExists('./server/methods/group_note.js')).to.equal(true);
    });
  });

  describe("publication", function() {
    it("generates a publication", function() {
      generate('publication', 'posts');
      expect(checkFileOrDirExists('./server/publications/posts.js')).to.equal(true);
    });

    it("updates an empty server/publications/index.js", function() {
      generate('publication', 'posts');
      let indexContent = fs.readFileSync('./server/publications/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';

export default function () {
  posts();
}
`);
    });

    it("updates a non-empty server/publications/index.js", function() {
      let originalContent =
`import posts from './posts';

export default function () {
  posts();
}
`;
      fs.writeFileSync('./server/publications/index.js', originalContent);

      generate('publication', 'users');
      let indexContent = fs.readFileSync('./server/publications/index.js', {encoding: 'utf-8'});
      expect(indexContent).to.equal(
`import posts from \'./posts\';
import users from \'./users\';

export default function () {
  posts();
  users();
}
`);
    });

    it("does not update index.js if file already exists", function() {
      let originalContent =
`import posts from './posts';
import users from \'./users\';

export default function () {
  posts();
  users();
}
`;
      fs.writeFileSync('./server/publications/index.js', originalContent);

      generate('publication', 'users');
      let indexContent = fs.readFileSync('./server/publications/index.js', {encoding: 'utf-8'});
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
      generate('publication', 'group.note');
      expect(checkFileOrDirExists('./server/publications/group.note.js')).to.equal(false);
    });

    it("converts the entity name to snakecase for the file name", function() {
      generate('publication', 'groupNote');
      expect(checkFileOrDirExists('./server/publications/group_note.js')).to.equal(true);
    });
  });

  describe("module", function() {
    it("generates a module", function() {
      generate('module', 'comments');
      expect(checkFileOrDirExists('./client/modules/comments')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/libs')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/actions/index.js')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/components/')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/containers/')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/configs/')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/index.js')).to.equal(true);
      expect(checkFileOrDirExists('./client/modules/comments/routes.jsx')).to.equal(true);
    });

    it("updates client/main.js", function() {
      generate('module', 'comments');
      let content = fs.readFileSync('./client/main.js', {encoding: 'utf-8'});
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
      generate('module', 'group.notes');
      expect(checkFileOrDirExists('./client/modules/group.notes/')).to.equal(false);
    });

    it("converts the module name to snakecase for the directory name", function() {
      generate('module', 'groupNotes');
      expect(checkFileOrDirExists('./client/modules/group_notes')).to.equal(true);
    });
  });
});
