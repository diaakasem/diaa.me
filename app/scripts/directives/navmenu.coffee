"use strict"
controller = ()->
angular.module("diaa.meApp")
  .directive "navmenu", () ->
    templateUrl: "views/directives/navmenu.html"
    restrict: "E"
    controller: ["$scope", controller]
