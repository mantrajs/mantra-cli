import {green, yellow, cyan, blue, red} from 'colors';

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
  invoke(msg) {
    console.log(blue(`  invoke  `) + msg);
  },
  remove(msg) {
    console.log(red(`  remove  `) + msg);
  }
};
