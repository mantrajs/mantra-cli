import {expect} from 'chai';
import * as utils from '../../lib/generators/utils';
import fse from 'fs-extra';

describe("removeWholeLine", function() {
  it("removes the whole line on which the given string appears", function() {
    let line = '{\n  User,\n  Posts,\n  Comments}';
    let result = utils.removeWholeLine(line, 'User');
    expect(result).to.equal('{\n  Posts,\n  Comments}');
  });

  it("removes the whole line on which the given regex matches", function() {
    let line = '{\n  User,\n  Posts,\n  Comments}';
    let result = utils.removeWholeLine(line, /[a-zA-Z]{5}/g);
    expect(result).to.equal('{\n  User,\n  Comments}');
  });
});

describe("removeFromIndexFile", function() {
  let dummyPath = './tmp/removeFromIndexFile/sample.js';

  afterEach(function() {
    // Cleanup
    fse.removeSync(dummyPath);
  });

  it("removes import/export lines - capitalizeVarName", function() {
    // Setup
    fse.outputFileSync(dummyPath, `
import Comments from './comments';
import Users from './users';
import Posts from './posts';

export {
  Commnets,
  Users,
  Posts
};
`
    );

    utils.removeFromIndexFile(dummyPath, 'users', {capitalizeVarName: true});
    let result = fse.readFileSync(dummyPath, {encoding: 'utf-8'});
    expect(result).to.equal(`
import Comments from './comments';
import Posts from './posts';

export {
  Commnets,
  Posts
};
`
    );
  });

  it("removes import/export lines", function() {
    // Setup
    fse.outputFileSync(dummyPath, `
import comments from './comments';
import users from './users';

export default function () {
  comments();
  users();
}
`
    );

    utils.removeFromIndexFile(dummyPath, 'users', {capitalizeVarName: false});
    let result = fse.readFileSync(dummyPath, {encoding: 'utf-8'});
    expect(result).to.equal(`
import comments from './comments';

export default function () {
  comments();
}
`
    );
  });
});
