require('./memory.css')

module.exports = angular.module('stf.memory', [

])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('control-panes/memory/memory.jade',
      require('./memory.jade')
    )
  }])
  .controller('MemoryCtrl', require('./memory-controller'))
