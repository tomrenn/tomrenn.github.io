// This script is intended to parse markdown representing posts and generate
// html content
//
// usage: publish post[ ...] 
// -----
var marked = require('marked');
var hljs = require('highlight.js');
var renderer = new marked.Renderer();
var path = require('path');
var fs = require('fs')

var POSTS_PER_PAGE = 5;
var outputDir = 'dist/'
var posts = process.argv.slice(2); // posts
var pages = [];

while (posts.length > 0){
  page = {};
  page['posts'] = posts.splice(0, POSTS_PER_PAGE);
  pages.push(page);
}

console.log(pages);

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

pages.forEach(function(page, index){

  var posts = page['posts'];

  posts.forEach(function(filename) {
    fs.readFile(filename, 'utf8', function(err, data) {
      var html = marked(data);
      var newFilename = path.basename(filename, '.md') + '.html';

      page[filename] = html;

      // if all posts have been transformed, write to file
      for (var i=0; i<posts.length; i++){
        if (!(filename in page)){
          return;
        }
      }
      // all posts have been transformed in the page
      fs.writeFile('page-'+index+'.json', JSON.stringify(page), function(err){
        console.log(err);
      });

    });
  });

})


