import program from 'commander';
import pkg from '../package.json';
import {create} from './commands';

program
  .version(pkg.version);

program
  .command('create [appName]')
  .alias('c')
  .description('create a new application')
  .action(function (appName) {
    create(appName);
  });

program
  .command('generate [type] [name]')
  .alias('g')
  .description('generate type with name')
  .action(function (type, name) {
    console.log(type, name);
  });

program.parse(process.argv);
