'use strict'

controller = ($scope) ->
  $scope.now = ->
    moment().format('LLLL')

angular.module('diaa.meApp')
  .controller 'AboutmeCtrl', controller
