(function() {
    'use strict';

    angular
        .module('app.movcaixa')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'movcaixa',
                config: {
                    url: '/movcaixa',
                    templateUrl: 'app/movcaixa/movcaixa.html',
                    controller: 'MovCaixaController',
                    controllerAs: 'vm',
                    title: 'caixa',
                    settings: {
                        nav: 6,
                        content: '<i class="fa fa-calculator"></i> Movimentar Caixa'
                    }                    
                }
            }
        ];
    }
})();
