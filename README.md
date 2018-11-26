# chpoom (`chpm`)

A CLI tool to run npm scripts with your prefered package manager, as `npm`, `yarn`, `ied`, `pnpm` or anything configured in the *chpoom config*.
Useful for setups where some team members use `npm` while others use `yarn`, especially when Windows and Unix-like systems are used across the
team.

> ## I'm [`yarpm`](https://github.com/BendingBender/yarpm)'s little sibling !
> 
> This tool is an experiment over [yarpm](https://github.com/BendingBender/yarpm), which is well maintained and should probably considered, depending on your needs.
>
> The difference is that `chpm` has no cli tool for choosing `yarn`.
> Instead, if you use `chpm` directly for command line, the script will look into configuration for an array of prefered packages manager. The first that exist will be used.

This tool is a helper to run scripts from `package.json`. Just substitute all `npm` or `yarn` calls with `chpm`
and you're good to go:
```json
{
  "scripts": {
    "start": "chpm run build",
    "build": "tsc index.ts"
  }
}
```

## What this tool is *not*
This tool is not meant to be an abstraction layer for calling `npm` or `yarn`. It will pass **all** arguments it receives
unfiltered to the chosen package manager. So you could create the following `package.json` and pass the `-s` flag to
`chpm` to silence `npm` output:
```json
{
  "scripts": {
    "start": "chpm run -s build",
    "build": "tsc index.ts"
  }
}
```
This will work if you invoke the script with `npm start`. Running the script with `yarn start` will result in the 
following error:
```
yarn run v0.21.3
error No command specified.
....
```
This is due to the fact that `yarn` doesn't understand the `-s` option. This is up to you to write your scripts so
 that only commands and options available to both `npm` and `yarn` are used.

## Installation

```bash
$ npm install chpm --save-dev
# or
$ yarn add chpm --dev
```

## CLI Command

`chpm` is an in-place substitute for places in `package.json` where `npm` or `yarn` is being used explicitly.
It reads the `npm_execpath` environment variable to determine the path to the currently used package manager. This env
var is only set when running `chpm` as a script. If `chpm` is used without being embedded in a script, it will
first look into the *chpoom config* or fallback to `npm`.

For specifiying your package manager in command line not in the npm environnement,
you need either to install chpm globally with `npm i -G chpm` or with what is you prefered package manager.
I personnaly use `pnpm`.

The you can just `$ chpm install & chpm run anything` and it will use your workspace configuration.

From here, you can just use `chpm` everywhere you would have use `npm` in your package.json.

## *chpoom config*

This file is there to specify your prefered packages managers, if chpm can't determine if one is already in use.
It's just an array of string.

The configuration is read by [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) so you can either use an array in `package.json` as :
```json
...
  "chpm": [
    "pnpn",
    "npm",
    "yarn"
  ],
...
```

or you can put a file in your workspace :
- `.chpmrc`
- `.chpmrc.json`
- `.chpmrc.yaml`
- `.chpmrc.yml`
- `.chpmrc.js`
- `chpm.config.js`

## Node API

The `chpm` package provides a node API.

```js
const chpm = require('chpm');
const promise = chpm(argv, options);
```

- **argv** `string[]` -- The argument list to pass to npm/yarn.
- **options** `object|undefined`
  - **options.npmPath** `string` -
    The path to npm/yarn.
    Default is `process.env.npm_execpath` if set, `npm` otherwise.
  - **options.env** `object` -
    Sets the environment key-value pairs, replaces the default usage of process.env to spawn child process.
  - **options.stdin** `stream.Readable|null` --
    A readable stream to send messages to stdin of child process.
    If this is `null` or `undefined`, ignores it.
    If this is `process.stdin`, inherits it.
    Otherwise, makes a pipe.
    Default is `null`.
    Set to `process.stdin` in order to send from stdin.
  - **options.stdout** `stream.Writable|null` --
    A writable stream to receive messages from stdout of child process.
    If this is `null` or `undefined`, cannot send.
    If this is `process.stdout`, inherits it.
    Otherwise, makes a pipe.
    Default is `null`.
    Set to `process.stdout` in order to print to stdout.
  - **options.stderr** `stream.Writable|null` --
    A writable stream to receive messages from stderr of child process.
    If this is `null` or `undefined`, cannot send.
    If this is `process.stderr`, inherits it.
    Otherwise, makes a pipe.
    Default is `null`.
    Set to `process.stderr` in order to print to stderr.

`chpm` returns a promise will be *resolved* when the spawned process exits, ***regardless of the exit code***.
The promise will be *rejected* in case of an internal error inside of `chpm`.

The promise is resolved with an object with the following 2 properties: `spawnArgs` and `code`.
The `spawnArgs` property contains the array of parameters that were passed to spawn the sub-process.
The `code` property is the exit code of the sub-process.

```js
chpm(['install']).then(result => {
  console.log(`${result.spawnArgs} -- ${result.code}`);
  // if executed as a package.json script via yarn: /usr/share/yarn/bin/yarn.js,install -- 0
});
```

## Changelog

https://github.com/BendingBender/chpm/blob/master/CHANGELOG.md

## Contributing

Thank you for contributing!

### Bug Reports or Feature Requests

Please use GitHub Issues.

## License
[MIT](https://github.com/BendingBender/chpm/blob/master/LICENSE)
