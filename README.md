# warp-cli

A command line tool to help vue-server-cli build projects


## [Documentation](#documentation)

<a name="documentation"></a>

### Installation

<a name="installation"></a>

```shell
npm install warp-cli
```

```javascript
var inquirer = require('inquirer');
inquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  });
```

<a name="examples"></a>

### Examples (Run it and see it)

Check out the [`packages/inquirer/examples/`](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples) folder for code and interface examples.

```shell
node packages/inquirer/examples/pizza.js
node packages/inquirer/examples/checkbox.js
# etc...
```

### Methods

<a name="methods"></a>

#### `inquirer.prompt(questions) -> promise`

Launch the prompt interface (inquiry session)

- **questions** (Array) containing [Question Object](#question) (using the [reactive interface](#reactive-interface), you can also pass a `Rx.Observable` instance)
- returns a **Promise**

#### `inquirer.registerPrompt(name, prompt)`

Register prompt plugins under `name`.

- **name** (string) name of the this new prompt. (used for question `type`)
- **prompt** (object) the prompt object itself (the plugin)

#### `inquirer.createPromptModule() -> prompt function`

Create a self contained inquirer module. If you don't want to affect other libraries that also rely on inquirer when you overwrite or add new prompt types.

```js
var prompt = inquirer.createPromptModule();

prompt(questions).then(/* ... */);
```