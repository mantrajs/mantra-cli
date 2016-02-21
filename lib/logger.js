import {green, yellow, cyan} from 'colors';

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
  }
};
