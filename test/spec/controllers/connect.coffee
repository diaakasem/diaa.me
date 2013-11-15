'use strict'

describe 'Controller: ConnectCtrl', () ->

  # load the controller's module
  beforeEach module 'diaa.meApp'

  ConnectCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ConnectCtrl = $controller 'ConnectCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
