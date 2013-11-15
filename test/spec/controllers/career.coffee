'use strict'

describe 'Controller: CareerCtrl', () ->

  # load the controller's module
  beforeEach module 'diaa.meApp'

  CareerCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    CareerCtrl = $controller 'CareerCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
