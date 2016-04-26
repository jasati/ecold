(function() {
    'use strict';

    angular
        .module('app.movest')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'movest',
                config: {
                    url: '/movest',
                    templateUrl: 'app/movest/movest.html',
                    controller: 'MovEstController',
                    controllerAs: 'vm',
                    title: 'movimentacao',
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-cubes"></i> Movimentar Estoque'
                    }                    
                }
            }
        ];
    }
})();
