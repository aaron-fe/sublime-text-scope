var fs = require('fs');
var chalk = require('chalk');

// You need to replace the 'packages_dir' with your own packages directory path
var packages_dir = '/Users/xxx/Library/Application Support/Sublime Text 2/Packages/';
var languages = fs.readdirSync(packages_dir);
// var languages = require('./languages');
var ret = [];
var rScope = /<key>scopeName<\/key>\n[\t\s]*<string>([^<]+)<\/string>/;

ret = languages.map(function (language, index) {
  var tmLanguage = packages_dir + language + '/' + language + '.tmLanguage';
  var lan_content = '';
  var scope = '';
  // read .tmLanguage files to get the scopeName
  if (fs.existsSync(tmLanguage)) {
    lan_content = fs.readFileSync(tmLanguage, {encoding: 'utf8'});
  }

  var scopeMatch = lan_content.match(rScope);

  if (scopeMatch != null && typeof scopeMatch[1] !== 'undefined') {
    scope = scopeMatch[1];
  } else {
    scope = '';
  }

  if (scope == '') {
    return '';
  }
  // add a '*\t' prefix, in order to follow the markdown list grammar
  return  '*\t' + language + ': ' + scope;
});

// escape the ones without a scopeName
ret = ret.filter(function (scp) {
  return scp !== '';
});

fs.writeFile('scope.md', ret.join('\n'), function (err) {
  if (err) {
    throw err;
  }

  console.log(chalk.green('language scope map is generated successfully!'));
});
