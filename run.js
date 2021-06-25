const path = require('path');
const { exec } = require('child_process');


let webserver = exec('npm run dev', { cwd: path.join(__dirname, 'webserver') });
let webpage = exec('npm start', { cwd: path.join(__dirname, 'webpage') });

let currentIO = null;

let switchIO = (targetIO) => {
    process.stdin.unpipe();

    if (currentIO) {    
        currentIO.stdout.unpipe(process.stdout);
        currentIO.stderr.unpipe(process.stderr);
    }

    currentIO = targetIO;

    process.stdin.pipe(targetIO.stdin);
    targetIO.stdout.pipe(process.stdout);
    targetIO.stderr.pipe(process.stderr);
};

let serverIO = () => switchIO(webserver);
let pageIO = () => switchIO(webpage);


if (process.argv.includes('-s') || process.argv.includes('server')) {
    serverIO();
}
else {
    pageIO();
}

process.stdin.on('data', (data) => {
    let command = data.toString().toLowerCase().trim();

    if (command === 'r' || command === 'react') {
        pageIO();
    }
    else if (command === 's' || command === 'server') {
        serverIO();
    }
});