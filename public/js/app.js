'use strict';
(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBYxibiatzB0sUHIINexl6aLajydaVZbj4",
    authDomain: "timeaway-ddb73.firebaseapp.com",
    databaseURL: "https://timeaway-ddb73.firebaseio.com",
    projectId: "timeaway-ddb73",
    storageBucket: "timeaway-ddb73.appspot.com",
    messagingSenderId: "39745169337"
  };
  firebase.initializeApp(config);
	angular
		.module('tamapp',['firebase','ui.bootstrap','ui.select'])
    	.controller('DashboardCtrl',DashboardCtrl)
	    .service('FormApprovalSrvc', FormApprovalSrvc)

	    DashboardCtrl.$inject = ['$scope','$firebaseObject','$firebaseArray', '$uibModal', 'FormApprovalSrvc'];
	    function DashboardCtrl($scope,$firebaseObject,$firebaseArray, $uibModal, FormApprovalSrvc){
        var vm = this;
        vm.auth = firebase.auth();
        vm.auth.onAuthStateChanged(user =>{
          vm.onAuthStateChanged(user);
        });

        const ref = firebase.database().ref();
        const leavesPerEmployeeRef = ref.child('leavesperemployee');
        const formsForApprovalRef = ref.child('formsforapproval');
        const transactionRef = ref.child('transaction');

        vm.signIn = function(){
          var provider = new firebase.auth.GoogleAuthProvider();
          vm.auth.signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            // ...
          }).catch(function(error) {
            alert(error.code + ': '+error.message);
          });
        };
        vm.onAuthStateChanged = function(user){
          vm.user = {};
          if (user) {
            console.log(user);
            vm.user.isSignedOn = true;
            vm.user.name = user.displayName;
            vm.user.email = user.email;
            vm.user.uid = user.uid;
            vm.user.photo = (user.photoURL || '/images/profile_placeholder.png');
          }
          $scope.$apply();
        };
        vm.signOut = function(){
          vm.auth.signOut().then(function() {
            vm.user = {};
            $scope.apply();
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
        };

        vm.historyList = $firebaseArray(transactionRef.limitToLast(5));
        console.log(vm.historyList);
	    }



	    FormApprovalSrvc.$inject = ['$http'];
	    function FormApprovalSrvc($http){
        
	    }
})();