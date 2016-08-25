/**
 * ng-context-menu - v1.0.2 - An AngularJS directive to display a context menu
 * when a right-click event is triggered
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */
(function(angular) {
  'use strict';

  angular
    .module('ng-context-menu', [])
          .factory('ContextMenuService', service)
          .directive('contextMenu', ['$document', 'ContextMenuService', '$compile', contextMenu]);

  function service() {

    var service = {
      element: null,
      menuElement: null
    };

    return service;
  }

  function contextMenu($document, ContextMenuService, $compile) {
    return {
      restrict: 'A',
      scope: {
        'callback': '&contextMenu',
        'disabled': '&contextMenuDisabled',
        'closeCallback': '&contextMenuClose',
        'marginBottom': '@contextMenuMarginBottom',
        'contextMenuItems': '='
      },
      link: link
    };

    function link($scope, $element, $attrs) {
      var opened = false;
      if ($scope.contextMenuItems) {
        createMenu();
      }
      bindEvents();

      function open(event, menuElement) {
        menuElement.addClass('open');

        var doc = $document[0].documentElement;
        var docLeft = (window.pageXOffset || doc.scrollLeft) -
                        (doc.clientLeft || 0),
                docTop = (window.pageYOffset || doc.scrollTop) -
                        (doc.clientTop || 0),
                elementWidth = menuElement[0].scrollWidth,
                elementHeight = menuElement[0].scrollHeight;
        var docWidth = doc.clientWidth + docLeft,
                docHeight = doc.clientHeight + docTop,
                totalWidth = elementWidth + event.pageX,
                totalHeight = elementHeight + event.pageY,
                left = Math.max(event.pageX - docLeft, 0),
                top = Math.max(event.pageY - docTop, 0);

        if (totalWidth > docWidth) {
          left = left - (totalWidth - docWidth);
        }

        if (totalHeight > docHeight) {
          var marginBottom = $scope.marginBottom || 0;
          top = top - (totalHeight - docHeight) - marginBottom;
        }

        menuElement.css('top', top + 'px');
        menuElement.css('left', left + 'px');
        opened = true;
      }

      function close(menuElement) {
        menuElement.removeClass('open');

        if (opened) {
          $scope.closeCallback();
        }

        opened = false;
      }

      function contextMenuHandler(event) {
        if (!$scope.disabled()) {
          if (ContextMenuService.menuElement) {
            close(ContextMenuService.menuElement);
          }
          ContextMenuService.menuElement = angular.element(
                  document.getElementById(getTarget())
          );
          ContextMenuService.element = event.target;
          //console.log('set', ContextMenuService.element);

          event.preventDefault();
          event.stopPropagation();
          $scope.$apply(function() {
            $scope.callback({ $event: event });
          });
          $scope.$apply(function() {
            open(event, ContextMenuService.menuElement);
          });
        }
      }

      function getTarget() {
        if ($scope.contextMenuItems) {
          return $attrs.id + '-menu';
        }

        return $attrs.target;
      }

      function handleKeyUpEvent(event) {
        //console.log('keyup');
        if (!$scope.disabled() && opened && event.keyCode === 27) {
          $scope.$apply(function() {
            close(ContextMenuService.menuElement);
          });
        }
      }

      function handleClickEvent(event) {
        if (!$scope.disabled() &&
                opened &&
                (event.button !== 2 ||
                event.target !== ContextMenuService.element)) {
          $scope.$apply(function() {
            close(ContextMenuService.menuElement);
          });
        }
      }

      function bindEvents() {
        $element.bind('contextmenu', contextMenuHandler);
        $document.bind('keyup', handleKeyUpEvent);
        // Firefox treats a right-click as a click and a contextmenu event
        // while other browsers just treat it as a contextmenu event
        $document.bind('click', handleClickEvent);
        $document.bind('contextmenu', handleClickEvent);

        $scope.$on('$destroy', function() {
          //console.log('destroy');
          $document.unbind('keyup', handleKeyUpEvent);
          $document.unbind('click', handleClickEvent);
          $document.unbind('contextmenu', handleClickEvent);
        });
      }

      function createMenu() {
        $element.attr('data-target', $attrs.id + '-menu');
        var menu = $scope.contextMenuItems;

        var div = document.createElement('div');
        div.className = 'dropdown position-fixed';
        div.id = $attrs.id + '-menu';
        var ulItem = document.createElement('ul');
        ulItem.className = 'dropdown-menu';
        ulItem.setAttribute('role', 'menu');
        menu.forEach(function(menuItem, index, restOfArray) {
          var lstItem = document.createElement('li');
          if($scope.contextMenuItems[index].disabled){
            lstItem.setAttribute('ng-class', '{"disabled": isDisabled(' + index + ')}');
          }
          lstItem.appendChild(_createMenuItem(menuItem, index));
          ulItem.appendChild(lstItem);
        });

        div.appendChild(ulItem);
        var newElement = $compile(div)($scope);
        $element.append(newElement);
      }

      function _createMenuItem(menuItem, index) {
        var aItem = document.createElement('a');
        aItem.className = 'pointer';
        aItem.setAttribute('role', 'menuitem');
        aItem.setAttribute('tabindex', index);
        aItem.setAttribute('ng-click', 'callbackHandler(' + index + ')');
        aItem.id = $attrs.id + '-menu-item-' + index;
        aItem.appendChild(document.createTextNode(menuItem.title));
        return aItem;
      }

      $scope.callbackHandler = function(itemIndex){
        if(!$scope.isDisabled(itemIndex)) {
          $scope.contextMenuItems[itemIndex].callback(document.getElementById($attrs.id));
        }
      };

      $scope.isDisabled = function(itemIndex){
        if ($scope.contextMenuItems[itemIndex].disabled) {
          return $scope.contextMenuItems[itemIndex].disabled(document.getElementById($attrs.id));
        }
      };
    }
  }

})(angular);