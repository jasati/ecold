(function() {
    'use strict';
    angular
        .module('app.movest')
        .controller('MovEstPedModalController', MovEstPedModalController);
    MovEstPedModalController.$inject = ['Pedidos','$modalInstance','MovEstService'];
    /* @ngInject */
    function MovEstPedModalController(Pedidos,$modalInstance,MovEstService) {
        var vm = this;
        vm.title = 'Pedidos';
        vm.pedido = Pedidos;
        vm.totalReg = 0;
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;  

        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        ////////////////
        function activate() { 	
        }

        function setPage () {
            readPedido()
        }        

        function ok(mov) {
        	$modalInstance.close(mov);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }            


    }
})();