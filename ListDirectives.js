angular.module('MyList').directive('fileUpload', function () {
    return {
      restrict: 'A',
      scope: {},
      link: function(scope, element) {
          element.bind('click', function(e){         
              document.querySelector('#uploadFile').click();
          } );      
       }
    };
});

