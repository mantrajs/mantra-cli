import {expect} from 'chai';
import fse from 'fs-extra';

import {create} from '../../dist/commands';
import {checkFileOrDirExists} from '../test_helpers';

describe("create command", function() {
  beforeEach(function() {
    fse.mkdirsSync('./tmp');
    process.chdir('./tmp');
  });

  afterEach(function() {
    fse.removeSync('./blog');
    process.chdir('../');
  });

  it("creates a skeleton mantra app", function() {
    create('blog');
    expect(checkFileOrDirExists('./blog')).to.equal(true);
    expect(checkFileOrDirExists('./blog/package.json')).to.equal(true);
    expect(checkFileOrDirExists('./blog/.gitignore')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/configs/context.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/actions/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/actions/tests')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/components/main_layout.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/components/home.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/components/tests')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/containers/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/containers/tests')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/configs/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/routes.jsx')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/modules/core/libs/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/client/main.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/lib/collections/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/publications/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/methods/index.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/configs/')).to.equal(true);
    expect(checkFileOrDirExists('./blog/server/main.js')).to.equal(true);
    expect(checkFileOrDirExists('./blog/.eslintrc')).to.equal(true);
    expect(checkFileOrDirExists('./blog/.scripts/mocha_boot.js')).to.equal(true);
  });
});
