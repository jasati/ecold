(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htTopNav', htTopNav);
    htTopNav.$inject = ['DataserviseProvider','$cookies', '$modal'];
    /* @ngInject */

    function htTopNav (DataserviseProvider, $cookies, $modal) {
        var directive = {
            bindToController: true,
            controller: TopNavController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'navline': '=',
                'usuario': '=',
                'logado': '='
            },
            templateUrl: 'app/layout/ht-top-nav.html'
        };

        /* @ngInject */
        function TopNavController() {
            var vm = this;
        }


        return directive;
    }
})();
