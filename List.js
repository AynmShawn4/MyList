angular.module('MyList', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);


angular.module('MyList').service("shareData", function(){
  var currentTags = [];
  var totalTags = [];
  return {
    getValue: function(){
      return currentTags;
    }, 
    addValue: function(v){
      //check dup
      for (i = 0; i < currentTags.length; i++){
        if (currentTags[i] == v){
          return;
        }
      }
      currentTags.push(v);
    }, 
    removeValue: function(index){
      currentTags.splice(index,1);
    },
    getTotal: function(){
      return totalTags;
    },
    removeFromTotal: function(index){
      totalTags.splice(index,1);
    },
    addTotalValue: function(v){
      for (i = 0; i < totalTags.length; i++){
        if (totalTags[i] == v){
          return;
        }
      }
      totalTags.push(v);
    }
  };
});

angular.module('MyList').controller('MyListController',['$uibModal','$scope', '$window', '$timeout', 'shareData', function ($uibModal, $scope, $window,$timeout, shareData) {
  
  $scope.username = "List";
  $scope.ratingModel = "Rating(All)";
  $scope.tagModel = "tag";
 
  $scope.nameModel = "";
  $scope.plotModel = '';
  $scope.musicModel = "";
  $scope.overallModel = "";
  $scope.imageModel = "";
  $scope.ratingFilter = ['B', 'B+', 'A-', 'A', 'A+-', 'A+', 'A++', 'S', 'All'];

  $scope.collection = ['A+', 'B+', 'S'];

  $scope.status = {
    isopen: false
  };

  $scope.items = ['item1', 'item2', 'item3'];

  matching = { "B+": 0, "A-": 1, "A": 2, "A+":3, "A+-":4, "A++":5, "S":6, "ALL":7 };

  message = [{ type: 'danger', msg:"You need to fill all fields with *"}, {type: 'success', msg:"You have entered successfully"  }  ];

  $scope.msgShow = false;

  $scope.leftPanelStyle = {
    'border': '1px solid #bdcfed',
    'height': ($window.innerHeight - 200)+"px",
    'position': 'relative',

  };

  $scope.rightPanelStyle = {
    'border': '1px solid #bdcfed',
    //'height': ($window.innerHeight - 200)+"px",
    'position': 'relative',
    'float' : 'right',
    'margin-right': '2.4%',

  };

  $scope.dynamicPopover = {
    content: '',
    templateUrl: 'myPopoverTemplate.html',
    name: ''
  };

  $scope.currentTags = shareData.getValue();

  $scope.data = {username:"", totalNumber:0, tags:[], record:[]};

  $scope.sortByRating = function(index){
    $scope.sortRating = $scope.ratingFilter[index];
    $scope.ratingModel = "Rating(" +$scope.sortRating + ")"; 
    console.log("sort by " + $scope.ratingFilter[index]);
  };


  $scope.sortRating = "All";

  $scope.rating = function(index){

    console.log("clicked on " + index + " model " + $scope.radioModel);

  };

  reset = function(){
    $scope.nameModel = " ";
    $scope.currentTags = [];
    $scope.plotModel = "";
    $scope.musicModel = "";
    $scope.imageModel = "";
    $scope.overallModel = "";
    $scope.radioModel = null;

  };

  $scope.searchModel = {
    model: ""
  };

  $scope.submit = function(){
    //validate here
    if (($scope.nameModel == "") || ($scope.plotModel == "") ||($scope.musicModel == "") || ($scope.overallModel =="") || ($scope.radioModel == null)){
      $scope.msgShow = "true";
      $scope.msg = message[0].msg;
      $scope.msgClss = "alert-danger";
    
    } else {

      var record = {
        name: $scope.nameModel,
        tags: $scope.currentTags,
        plot: $scope.plotModel,
        music: $scope.musicModel,
        image: $scope.imageModel,
        overall: $scope.overallModel,
        rating: $scope.radioModel
      };
      $scope.data.record.push(record);
      $scope.msgShow = "true";
      $scope.msg = message[1].msg;
      $scope.msgClss = "alert-success";
      $timeout(function(){
        reset();
        $scope.msgShow = "false";

      }, 500);
    }
  };

  $scope.removeTag = function(index){
    console.log("remove tag from current");
    shareData.removeValue(index);

   // $scope.currentTags.splice(index, 1);

  };

  $scope.usernameSubmit = function(){

    $scope.popoverOpen = false;
    $scope.username = $scope.dynamicPopover.name + "'s List";
  };


  $scope.submitFunc = function(evt){ //file submit event
    var f = evt.files[0]; 

    if (f) {
        var r = new FileReader();
        r.onload = function(e) {  //onload callback
          alert($scope.fileInput);
        }
        r.readAsText(f);
      } else { 
        alert("Failed to load file");
      }
  };


  $scope.saveFunc = function(){
  
    var downloader = document.getElementById('link');
   // downloader.href = da;
    downloader.click();
     
  };


$scope.open = function (size) {

    var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
            items: function () {
                return $scope.items;
            }
        }
    });

    modalInstance.result.then(function () {
    }, function () {
    });
};

}]);


angular.module('MyList').filter('myRatingFilter', function(){
  return function(items, filterReq){
    var ret = [];
    if (filterReq == "All"){
      return items;
    }
    angular.forEach(items, function(e){
      if (e.rating == filterReq){
        ret.push(e);
      }
    });
    return ret;
  };

});


angular.module('MyList').controller('ModalInstanceCtrl', function ( $scope, $uibModalInstance, items, shareData) {

  $scope.deleteAddModel = "Delete";
  $scope.deleteAddClass = "btn btn-danger";
  deleteAdd = 0;
  $scope.glyphiconClass = "glyphiconClass glyphicon glyphicon-plus";
  $scope.collapse = true;
  $scope.buttonClass = "btn btn-default btn-sm";


  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.submit = function(){
    shareData.addTotalValue($scope.inputTag);
    $scope.inputTag = "";
  };

  $scope.changeMode = function(){
    if (deleteAdd == 0){
      deleteAdd = 1;
      $scope.glyphiconClass = "glyphicon glyphicon-minus";
      $scope.buttonClass = "btn btn-danger btn-sm";
      $scope.deleteAddModel = "Add";
      $scope.deleteAddClass = "btn btn-primary";
    } else {
      deleteAdd = 0;
      $scope.glyphiconClass = "glyphicon glyphicon-plus";
      $scope.buttonClass = "btn btn-default btn-sm";
      $scope.deleteAddModel = "Delete";
      $scope.deleteAddClass = "btn btn-danger";
    }
  };

  $scope.$watch( 

    function(){
      return shareData.getTotal();
    }, 
    function(newValue, oldValue) {
      if (newValue != null) {
        //update Controller2's xxx value
        $scope.currentTags= newValue;
      }
    }
  );

  $scope.removeTag = function(index, x){
    if (deleteAdd == 1){
      shareData.removeFromTotal(index);
      shareData.removeValue(index);

    } else {
      //add to currentTags
      shareData.addValue(x);
    }
  };
});