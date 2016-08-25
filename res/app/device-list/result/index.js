require('./device-list-result.css')

module.exports = angular.module('stf.device-list.result', [
  require('stf/device').name,
  require('stf/user/group').name,
  require('stf/common-ui').name,
  require('stf/admin-mode').name,
  require('../column').name,
  require('../empty').name
])
  .directive('deviceListResult', require('./device-list-result-directive'))
