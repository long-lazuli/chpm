'use strict';

const chpm = require('../lib');

const argv = process.argv.slice(2);

exports.run = function run(options) {
  chpm(argv, Object.assign({stdin: process.stdin, stdout: process.stdout, stderr: process.stderr}, options || {}))
  // Not sure why, but sometimes the process never exits on Git Bash (MINGW64)
    .then((res) => process.exit(res.code))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};
