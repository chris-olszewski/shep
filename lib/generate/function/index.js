const create = require('../../util/create');
const P = require('bluebird');

module.exports = function (args){
  var name = args._[2];

  if (name) {
    return create.dir('./functions/' + name).
      then(createIndexJS).
      then(createPackageJSON).
      then(createGitIgnore).
      then(createAwsConfig);
  } else {
    return P.reject('You did not supply a name for the function');
  }

  function createAwsConfig(){
    const content = { CodeSize: 373208,
      Description: '',
      FunctionName: name,
      Handler: 'index.handler',
      MemorySize: 128,
      Role: '',
      Runtime: 'nodejs',
      Timeout: 3
    };
    create.file('./functions/' + name + '/awsConfig.json', content);
  }

  function createIndexJS(){
    const content = `module.exports.handler = function(event, context) {
      // DO STUFF HERE
    }`;
    create.file('./functions/' + name + '/index.js', content);
  }

  function createGitIgnore(){
    const content = `node_modules/*`;
    create.file('./functions/' + name + '/.gitignore', content);
  }

  function createPackageJSON(){
    const content = {
      'name': name,
      'version': '0.0.1',
      'description': '',
      'main': 'index.js',
      'scripts': {
        'test': 'echo \"Error: no test specified\" && exit 1'
      },
      'author': '',
      'dependencies': {}
    };
    create.file('./functions/' + name + '/package.json', content);
  }
};