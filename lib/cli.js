import program from 'commander';
import pkg from '../package.json';
import {create, generate, destroy} from './commands';

program
  .version(pkg.version);

program
  .command('create [appPath]')
  .alias('c')
  .option('-v, --verbose', 'show output of scripts in the console')
  .option('-c, --config [value]', 'use custom config file')
  .description('create a new application')
  .action(function (appPath, options) {
    create(appPath, options);
  });

program
  .command('generate [type] [name]')
  .alias('g')
  .option('-c, --use-class', 'extend React.Component class when generating components')
  .option('-s, --schema [value]', 'specify a schema solution to use for Mongo collections')
  .description('generate an entity with the name provided')
  .action(function (type, name, options) {
    const customConfig = readCustomConfig();

    generate(type, name, options, customConfig);
  })
  .on('--help', function () {
    console.log('  Choose from the following generator types:');
    console.log('');
    console.log('  action, component, container, collection, method, publication, module');
    console.log('');
    console.log('  You need to provide module name for action, component, and container');
    console.log("  Format your 'name' argument in the form of moduleName:entityName");
    console.log('');
    console.log('  e.g. `mantra generate action core:post`');
  });

program
  .command('destroy [type] [name]')
  .alias('d')
  .description('delete files generated for the given type and name')
  .action(function (type, name, options) {
    const customConfig = readCustomConfig();

    destroy(type, name, options, customConfig);
  });

program.parse(process.argv);
