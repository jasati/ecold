(function() {
    'use strict';

    angular
        .module('app.galeria')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'galeria',
                config: {
                    url: '/galeria',
                    templateUrl: 'app/galeria/galeria.html',
                    controller: 'GaleriaController',
                    controllerAs: 'vm',
                    title: 'galeria',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-picture-o"></i> Galeria'
                    }                    
                }
            }
        ];
    }
})();