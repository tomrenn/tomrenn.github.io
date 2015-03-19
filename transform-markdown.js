// This script is intended to parse markdown representing posts and generate
// html content
// -----

var marked = require('marked');
var hljs = require('highlight.js');
var renderer = new marked.Renderer();

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

console.log(marked('```js\n console.log("hello"); \n```'));
