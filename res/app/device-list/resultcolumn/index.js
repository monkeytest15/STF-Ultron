module.exports = angular.module('stf.device-list.resultcolumn', [
  require('gettext').name
])
  .service('DeviceResultcolumnService', require('./device-resultcolumn-service'))
