import {destroyAction} from '../generators/action';
import {destroyComponent} from '../generators/component';
import {destroyContainer} from '../generators/container';
import {destroyCollection} from '../generators/collection';
import {destroyMethod} from '../generators/method';
import {destroyPublication} from '../generators/publication';

export default function destroy(type, name) {
  let destroyFn = getDestroyFn(type);
  if (! destroyFn) {
    console.log(`Invalid type ${type}`);
    console.log('Run `mantra generate --help` for more options.');
    return;
  }

  destroyFn(name);
}

function getDestroyFn(type) {
  const destroyFnMap = {
    action: destroyAction,
    component: destroyComponent,
    container: destroyContainer,
    collection: destroyCollection,
    method: destroyMethod,
    publication: destroyPublication
  };

  return destroyFnMap[type];
}
