module.exports = {
  name: 'component-minimal',
  description: 'A TypeScript component bundled with webpack (only index.ts, no src directory)',
  values: {
    name: 'my-component',
    version: '0.0.1',
    description: 'My new component',
    author: process.env.USER || 'Gordon Larrigan <gordonlarrigan@gmail.com> (https://gordonlarrigan.com)',
    initialiseGit: true,
  },
  questions: [
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      argument: 'name',
      shortArgument: 'n',
      validate: (input) => input.length > 0 || 'Project name is required',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      argument: 'description',
      shortArgument: 'd',
    },
    {
      type: 'confirm',
      name: 'initialiseGit',
      message: 'Initialise git repository?',
      argument: 'git',
      shortArgument: 'g',
    },
  ],
  exclude: [
    'pqs.config.js',
    '**/node_modules/**',
  ],
  steps: [
    {
      type: 'replace',
      files: ['**/*'],
    },
    {
      type: 'command',
      command: 'npm install',
      description: 'Installing dependencies...',
    },
    {
      type: 'command',
      condition: (answers) => answers.initialiseGit,
      command: 'git init',
      description: 'Initializing git repository...',
    },
  ],
};
