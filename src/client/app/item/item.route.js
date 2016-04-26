(function() {
    'use strict';

    angular
        .module('app.item')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'item',
                config: {
                    url: '/item',
                    templateUrl: 'app/item/item.html',
                    controller: 'ItemController',
                    controllerAs: 'vm',
                    title: 'item',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-archive"></i> Cadastrar Itens'
                    }                    
                }
            }
        ];
    }
})();
