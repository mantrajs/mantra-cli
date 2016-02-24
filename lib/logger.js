import {green, yellow, cyan, red} from 'colors';

export const logger = {
  create(msg) {
    console.log(green(`  create  `) + msg);
  },
  update(msg) {
    console.log(yellow(`  update  `) + msg);
  },
  exists(msg) {
    console.log(cyan(`  exists  `) + msg);
  },
  run(msg) {
    console.log(green(`  run  `) + msg);
  },
  error(msg) {
    console.log(red(`  error  `) + msg);
  }
};
