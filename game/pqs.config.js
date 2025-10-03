module.exports = {
  name: 'game',
  description: 'A TypeScript game project',
  values: {
    name: 'my-game',
    version: '0.0.1',
    description: 'My new game',
    author: process.env.USER || 'Gordon Larrigan <gordonlarrigan@gmail.com> (https://gordonlarrigan.com)',
    initialiseGit: true,
  },
  questions: [
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      argument: 'name',
      shortArgument: '-n',
      validate: (input) => input.length > 0 || 'Project name is required',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      argument: 'description',
      shortArgument: '-d',
    },
    {
      type: 'confirm',
      name: 'initialiseGit',
      message: 'Initialise git repository?',
      argument: 'git',
      shortArgument: '-g',
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
