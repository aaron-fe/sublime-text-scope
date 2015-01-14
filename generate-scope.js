var fs = require('fs');
// var languages = require('./languages');
// you need to replace the 'packages_dir' with your own packages directory path
var packages_dir = '/Users/xxx/Library/Application Support/Sublime Text 2/Packages/';
var languages = fs.readdirSync(packages_dir);
var lan_filter = /^(\.|0_package_control_loader|(All Autocomplete)|(Color Scheme)|(CSS3_Syntax)|Default|Emmet|Graphviz|Language - English)|(Package Control)|PyV8|Rails|(Regular Expressions)|ShellScript|Smarty|Text|(Theme - Default)|User|bz2|jQuery|Vintage/;

languages = languages.filter(function (lan, index) {
  return !lan_filter.test(lan);
});

var ret = [];

var rScope = /<key>scopeName<\/key>\n[\t\s]*<string>([^<]+)<\/string>/;
// read files
ret = languages.map(function (language, index) {
  var tmLanguage = packages_dir + language + '/' + language + '.tmLanguage';
  var lan_content = fs.readFileSync(tmLanguage, {encoding: 'utf8'});
  var scope = lan_content.match(rScope);

  if (scope != null && typeof scope[1] !== 'undefined') {
    scope = scope[1];
  } else {
    scope = '';
  }

  return  '*\t' + language + ': ' + scope;
});

fs.writeFile('scope.md', ret.join('\n'), function (err) {
  if (err) {
    throw err;
  }

  console.log('language scope is generated successfully!');
});
