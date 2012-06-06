/*globals _*/
/*jshint asi:true,trailing:true*/
function AppCtrl($scope) {
  'use strict';

  $scope.tasks = [{
    text: 'Voici un premier task',
    folders: ['#collect'],
    contexts: [],
    done: false
  }, {
    text: 'Voici un deuxième task',
    folders: ['#nextaction', '#project'],
    contexts: ['@work'],
    done: false
  }]
}

AppCtrl.$inject = ['$scope']

function ListCtrl($scope) {

}
ListCtrl.$inject = ['$scope']

function EditCtrl($scope) {
  var rxFolders = /(?:^|\s)(#[^\s]+)/g,
    rxCtxs = /(?:^|\s)(@[^\s]+)/g

  var parseTags = function(rx, str, ar) {
    var match

    while (match = rx.exec(str)) {
      console.log("pushing " + match[1])
      ar.push(match[1])
    }
  }

  $scope.clearItem = function() {
    this.new.task = ''
    this.new.tags = ''
  }

  $scope.addItem = function() {
    var newItem = {
        folders: [],
        contexts: [],
        done: false
      }
      
    newItem.text = this.new.task

    parseTags(rxFolders, this.new.tags, newItem.folders)
    parseTags(rxCtxs, this.new.tags, newItem.contexts)

    this.tasks.push(newItem)
    this.tasks.isDirty = true
    this.clearItem()
  }
}

EditCtrl.$inject = ['$scope']

function MenuCtrl($scope, $location) {
  var foldersCache,
    contextsCache

  var getUniqueItems = function(arTasks, arProp) {
    var res = []

    if (arTasks && arTasks.length) {
      for (var i = 0; i < arTasks.length; i++) {
        for (var j = 0; j < arTasks[i][arProp].length; j++) {
          console.log("adding " + arTasks[i][arProp][j])
          res.push(arTasks[i][arProp][j])
        }
      }

      res = _.uniq(res)
    }

    return res.sort()
  }

  $scope.test = function() {
    console.log($location.search())
  }
  
  $scope.getUniqueFolders = function() {
    if ($scope.tasks.isDirty || !foldersCache) {
      // Set both folders and contexts to null so that they are re-computed, and remove isDirty
      if ($scope.tasks.isDirty) {
        contextsCache = null
        $scope.tasks.isDirty = false
      }

      foldersCache = getUniqueItems(this.tasks, 'folders')
    }
    return foldersCache
  }

  $scope.getUniqueContexts = function() {
    if ($scope.tasks.isDirty || !contextsCache) {
      // Set both folders and contexts to null so that they are re-computed, and remove isDirty
      if ($scope.tasks.isDirty) {
        foldersCache = null
        $scope.tasks.isDirty = false
      }

      contextsCache = getUniqueItems(this.tasks, 'contexts')
    }
    return contextsCache
  }
}

MenuCtrl.$inject = ['$scope', '$location']
