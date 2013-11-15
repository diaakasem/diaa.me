'use strict'

describe 'Controller: AboutmeCtrl', () ->

  # load the controller's module
  beforeEach module 'diaa.meApp'

  AboutmeCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    AboutmeCtrl = $controller 'AboutmeCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
