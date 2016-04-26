(function () {
    'use strict';

    angular
        .module('app.estoque')
        .controller('EstoqueController', EstoqueController);

    EstoqueController.$inject = ['$q', 'logger', 'EstoqueService', 'routerHelper'];
    /* @ngInject */
    function EstoqueController($q, logger, EstoqueService, routerHelper) {
        var vm = this;
        vm.title = 'Estoque';
        vm.estoque = [];
        vm.consulta = {descricao:"",status:"", codigo:""}
        
        vm.getEstoque = getEstoque;
        vm.setPageEstoque = setPageEstoque;
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
            var promises = [EstoqueService.startDataset(), getEstoque()];
            return $q.all(promises).then(function() {
                logger.info('Janela Estoque Ativada');
            });            
            
        }

        function getEstoque() {
            EstoqueService.read(vm.consulta,getLimite()).then(function(data){
              vm.estoque = data['reg'];
              vm.totalReg = data['qtde'];              
            });            
        } 

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPageEstoque () {
            getEstoque();
        }

    }
})();
