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
  // config markdown options
  marked.setOptions({
    renderer: renderer,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  var publishDesc = 'Turn Markdown into HTML'

  grunt.registerMultiTask('publish', publishDesc, function() {
    var done = this.async();
    var page = {};
    var options = this.options();
    var output = options.output;
    if (output === undefined){
      grunt.fail.fatal('An \'output\' file in options must be specified.');
    }

    // store simple array of filenames for all posts
    var postFilenames = this.files.map(function (file){
      return file.src[0];
    });
    page['posts'] = postFilenames;


    // read file and turn markdown into html
    async.forEach(this.files, function(file, callback) {
      var filename = file.src.filename;
      var data = grunt.file.read(file.src);

      page[file.src] = marked(data);
      callback();
    }, function(err) {
        // write page file
        grunt.file.write(output, JSON.stringify(page, null, 2));
        done();
    });

  });

};
