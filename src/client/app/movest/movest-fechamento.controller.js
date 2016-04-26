(function() {
    'use strict';
    angular
        .module('app.movest')
        .controller('MovEstFechModalController', MovEstFechModalController);
    MovEstFechModalController.$inject = ['$modalInstance','MovEst'];
    /* @ngInject */
    function MovEstFechModalController($modalInstance,MovEst) {
        var vm = this;
        vm.title = 'Fechar Venda';
        vm.movest = MovEst;
        vm.meioPag = ['Dinheiro','Cartão','Cheque','Ticket','Vale' ];

    	vm.troco = troco;
    	vm.ok = ok;
    	vm.cancel = cancel;



        activate();
        ////////////////
        function activate() {
        }
        function troco () {
        	if (vm.movest.recebido > vm.movest.total) {
        		vm.movest.troco = vm.movest.recebido - vm.movest.total;
        	} else {
        		vm.movest.troco = 0;
        	}
        }

        function ok() {
        	vm.movest.status = 2;
        	var save = vm.movest;
        	$modalInstance.close(save);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }        
    }
})();