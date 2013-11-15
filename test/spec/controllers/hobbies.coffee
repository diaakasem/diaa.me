'use strict'

describe 'Controller: HobbiesCtrl', () ->

  # load the controller's module
  beforeEach module 'diaa.meApp'

  HobbiesCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    HobbiesCtrl = $controller 'HobbiesCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
