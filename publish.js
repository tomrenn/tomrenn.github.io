// This script is intended to parse markdown representing posts and generate
// html content
// -----
var marked = require('marked');
var hljs = require('highlight.js');
var renderer = new marked.Renderer();
var path = require('path');
var fs = require('fs')

var outputDir = 'dist/'
var args = process.argv.slice(2);

// bugfix for stupid hljs class not getting added
// https://github.com/chjj/marked/pull/418
renderer.code = function(code, language){
  return '<pre><code class="hljs ' + language + '">' + 
    hljs.highlight(language, code).value +
    '</code></pre>';
};

marked.setOptions({
  renderer: renderer,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

args.forEach(function(filename) {
  fs.readFile(filename, 'utf8', function(err, data) {
    var html = marked(data);
    var newFilename = path.basename(filename, '.md') + '.html';
    fs.writeFile(outputDir + newFilename, html, function(err){
      console.log(err);
    });
  });
});

