'use strict'

describe 'Controller: ProjectsCtrl', () ->

  # load the controller's module
  beforeEach module 'diaa.meApp'

  ProjectsCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ProjectsCtrl = $controller 'ProjectsCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
