module.exports = {
  name: 'editor',
  description: 'A simple editor interface, local files only (no git or NPM)',
  values: {
    name: 'my-editor',
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
  ],
  exclude: [
    'pqs.config.js',
  ],
  steps: [
    {
      type: 'replace',
      files: ['**/*'],
    },
    {
      type: 'command',
      command: 'curl -o e2.min.js https://raw.githubusercontent.com/basementuniverse/e2/refs/heads/master/dist/e2.min.js',
      description: 'Fetching latest e2.min.js...',
    },
  ],
};
