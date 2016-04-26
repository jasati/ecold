(function() {
    'use strict';

    angular
        .module('app.empresa')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'empresa',
                config: {
                    url: '/empresa',
                    templateUrl: 'app/empresa/empresa-cadastro.html',
                    controller: 'EmpresaController',
                    controllerAs: 'vm',
                    title: 'empresa',
                    settings: {
                        nav: 7,
                        content: '<i class="fa fa-institution"></i> Dados Empresa'
                    }                    
                }
            }
        ];
    }
})();
