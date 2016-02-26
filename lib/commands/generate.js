import generateAction from '../generators/action';
import generateComponent from '../generators/component';
import generateContainer from '../generators/container';
import generateCollection from '../generators/collection';
import generateMethod from '../generators/method';
import generatePublication from '../generators/publication';
import generateModule from '../generators/module';

/**
 * Get a generator given an entity type. Returns undefined if there is no
 * generator for the type.
 *
 * @param type {String} - type of entity to generate
 * @return generator {Function} - generator for that entity
 */
function getGenerator(type) {
  const generatorMap = {
    action: generateAction,
    component: generateComponent,
    container: generateContainer,
    collection: generateCollection,
    method: generateMethod,
    publication: generatePublication,
    module: generateModule
  };

  return generatorMap[type];
}

export default function generate(type, name, options = {}) {
  let generator = getGenerator(type);
  if (! generator) {
    console.log(`Could not find a generator for ${type}`);
    console.log('Run `mantra generate --help` for more options.');
    return;
  }

  generator(name, options);
}
