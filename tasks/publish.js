// This script is intended to parse markdown representing posts and generate
// html content
//
// usage: publish post[ ...] 
// -----


module.exports = function(grunt) {
  var async = require('async');
  var marked = require('marked');
  var hljs = require('highlight.js');
  var renderer = new marked.Renderer();
  var path = require('path');
  var fs = require('fs')

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

  var POSTS_PER_PAGE = 5;
  var OUTPUT_DIR = 'dist/posts'
  // var posts = process.argv.slice(2); // posts
  var pages = [];

  var childProcess = require('child_process');



  grunt.registerMultiTask('publish', 'description', function() {
    var done = this.async();
    var page = {};


    async.forEach(this.files, function(file, callback) {
      grunt.log.writeln(file.src + " | " + file.dest);
      var filename = file.src.filename;

      var data = grunt.file.read(file.src);
      var html = marked(data);

      page[file.src] = html;
      // grunt.log.writeln(html);
      // fs.readFile(filename, 'utf8', function(err, data) {
      //   var html = marked(data);

      //   page[filename] = html;

      //   // all posts have been transformed in the page
      //   var pageFilename = OUTPUT_DIR + '/page-' + index + '.json';
      //   fs.writeFile(pageFilename, JSON.stringify(page, null, 2), function(err){
      //     if (err){
      //       console.log(err);
      //     }
      //   });

      // });
      callback();
    }, function(err) {
        grunt.log.writeln('iterating done');
        grunt.log.writeln(JSON.stringify(page, null, 2));
        done();
    });    

    // done();
  });

};

// while (posts.length > 0){
//   page = {};
//   page['posts'] = posts.splice(0, POSTS_PER_PAGE);
//   pages.push(page);
// }

// if (!fs.existsSync(OUTPUT_DIR)){
//   fs.mkdirSync(OUTPUT_DIR)
// }




// pages.forEach(function(page, index){

//   var posts = page['posts'];

//   posts.forEach(function(filename) {
//     fs.readFile(filename, 'utf8', function(err, data) {
//       var html = marked(data);
//       // var newFilename = path.basename(filename, '.md') + '.html';

//       page[filename] = html;

//       // if all posts have been transformed, write to file
//       for (var i=0; i<posts.length; i++){
//         if (!(filename in page)){
//           return;
//         }
//       }
//       // all posts have been transformed in the page
//       var pageFilename = OUTPUT_DIR + '/page-' + index + '.json';
//       fs.writeFile(pageFilename, JSON.stringify(page, null, 2), function(err){
//         if (err){
//           console.log(err);
//         }
//       });

//     });
//   });

// })


