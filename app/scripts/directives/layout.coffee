"use strict"
controller = ()->
angular.module("diaa.meApp")
  .directive "layout", () ->
    templateUrl: "views/directives/layout.html"
    transclude: true,
    replace: true,
    scope: true,
    restrict: "E"
    controller: ["$scope", controller]
