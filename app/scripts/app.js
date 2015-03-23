(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.appName = 'Meta App';
  app.selectedPage = 'posts';

  app.contactLinks = [
    {label: 'LinkedIn', img: 'linkedin/grey-66px.png', link: 'https://linkedin.com/in/tomrenn'},
    {label: 'GitHub', img: 'github-grey-64px.png', link: 'https://github.com/tomrenn'},
  ];
 
  app.tomFacts = [
    {label: 'Can juggle', checked: true},
    {label: 'Finished a MOOC',
      link: 'https://drive.google.com/file/d/0BzRjnq6vdRTvUGdQRWtnQkVkbFU/view?usp=sharing',
      hasLink: true,
      checked: true},
    {label: 'Built an arc reactor',
      link: 'images/arc-reactor.png',
      hasLink: true,
      checked:true},
    {label: 'Include a clever unchecked goal', checked: false}
  ];

  var polyStatusButton = app.querySelector("[icon=help]");
  var polyStatusDialog = app.querySelector('#polymerStatus');
  // polyStatusButton.addEventListener("click", function(){
  //   console.log('wtf');
  //   polyStatusDialog.toggle();
  // });

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('template-bound', function() {
    console.log('Our app is ready to rock!');

    var ajax = document.querySelector("core-ajax");
    ajax.addEventListener("core-response", 
      function(e) {
        console.log(e.detail.response.posts);
        var data = e.detail.response;
        var posts = []
        data.posts.forEach(function(post){
          posts.push(data[post]);
        })
        app.posts = posts;
        // document.querySelector('template').model = {
        //   response: e.detail.response
        // };
      }
    );
  });





// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
