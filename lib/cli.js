import program from 'commander';
import pkg from '../package.json';
import {create, generate} from './commands';

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
  .option('-k --klass', 'When generating components, extend React.Component class')
  .description('generate an entity with the name provided')
  .action(function (type, name, options) {
    generate(type, name, options);
  });

program.parse(process.argv);
