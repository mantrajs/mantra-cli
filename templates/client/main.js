import {createApp} from 'mantra-core';
import initContext from './configs/context';

// modules

// init context
const context = initContext();

// create app
const app = createApp(context);
// load modules
app.init();
