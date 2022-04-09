const PerftestApp = require('./src/perftestApp');

const args = process.argv.slice(2);

const url = args[0] || 'https://www.voici.fr';
const interval = args[1] || 60000;
const port = args[2] || 3001;

const perftestApp = new PerftestApp(url, interval, port);
perftestApp.run();
