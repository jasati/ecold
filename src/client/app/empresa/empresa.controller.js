(function () {
    'use strict';

    angular
        .module('app.empresa')
        .controller('EmpresaController', EmpresaController);

    EmpresaController.$inject = ['$q', 'logger', 'EmpresaService', 'routerHelper'];
    /* @ngInject */
    function EmpresaController($q, logger, EmpresaService, routerHelper) {
        var vm = this;

        vm.title = 'Empresa';
        vm.empresa = [];

        vm.getEmpresa = getEmpresa;
        vm.editEmpresa = editEmpresa;

        activate();

        function activate() {
            var promises = [getEmpresa()];
            return $q.all(promises).then(function() {
                logger.info('Janela Empresa Ativada');
            });            
            
        }

        function getEmpresa() {
            EmpresaService.load().then(function(data){
              vm.empresa = data['reg'][0];            
            });            
        } 
 
        function editEmpresa() {
          EmpresaService.update(vm.empresa).then(function(data){

          });
        }
    }
})();
