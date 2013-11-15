'use strict'

describe 'Directive: navmenu', () ->

  # load the directive's module
  beforeEach module 'diaa.meApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<navmenu></navmenu>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the navmenu directive'
