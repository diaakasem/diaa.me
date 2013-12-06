"use strict"
angular.module("diaa.meApp", []).config ($routeProvider) ->

  $routeProvider.when "/",
    templateUrl: "views/main.html"
    controller: "MainCtrl"

  $routeProvider.when "/aboutme",
    templateUrl: "views/aboutme.html",
    controller: "AboutmeCtrl"
  .when "/projects",
    templateUrl: "views/projects.html",
    controller: "ProjectsCtrl"
  .when "/career",
    templateUrl: "views/career.html",
    controller: "CareerCtrl"
  .when "/hobbies",
    templateUrl: "views/hobbies.html",
    controller: "HobbiesCtrl"
  .when "/connect",
    templateUrl: "views/connect.html",
    controller: "ConnectCtrl"

  .otherwise redirectTo: "/"

