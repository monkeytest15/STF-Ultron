module.exports = function ShellCtrl($scope) {
  $scope.result = null

  $scope.run = function(command) {
    if (command === 'clear') {
      $scope.clear()
      return
    }

    $scope.command = ''

    return $scope.control.shell(command)
      .progressed(function(result) {
        console.log("this is progressed")
        $scope.result = result
        $scope.data = result.data.join('')
        $scope.$digest()
      })
      .then(function(result) {
        console.log("this is then")
        $scope.result = result
        $scope.data = result.data.join('')
        $scope.$digest()
      })
  }

  $scope.clear = function() {
    $scope.command = ''
    $scope.data = ''
    $scope.result = null
  }
}
