/**
 * Created by Sonia on 4/3/2016.
 */
//For use the $resource, it should be to set when the module is created
var eleccionAngularApp = angular.module("eleccionAngularApp", ["ngResource"]);

eleccionAngularApp.controller("appController", function ($scope, $http) {
  //$http is used in order to getting the json data
  $scope.candidatoselection = "";
  $http.get('data/organization_list.json').success(function (data) {
    //data is able in the view thank to $scope
      $scope.candidatos = data;

  });

  //initialization (maybe it should be removed)
  $scope.candidatetitle= "Análisis de Sentimiento durante debate para ";
  $scope.candidatoselection = "Fuerza Popular";
  $scope.candidatoselectionId = "fuerzapopular";
  mapDrawPeru("fuerzapopular");
  //end initialization

  //showMapCandidate function is called from view when a candidate is selected
  $scope.showMapCandidate = function(candidate){
    $scope.candidatetitle= "Análisis de Sentimiento durante debate para ";
    $scope.candidatoselection = candidate.party;
    $scope.candidatoselectionId = candidate.partyId;
    mapDrawPeru(candidate.partyId);
  };
})

