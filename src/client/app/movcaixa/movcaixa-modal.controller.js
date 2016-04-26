(function(){
    'use strict';

    angular
        .module('app.movcaixa')
        .controller('MovCaixaModalController', MovCaixaModalController);
    MovCaixaModalController.$inject = ['MovCaixa', '$modalInstance', '$scope', '$modal', 'MovCaixaService'];
    /* @ngInject */
    function MovCaixaModalController(MovCaixa, $modalInstance, $scope, $modal, MovCaixaService) {
        var vm = this;
        vm.title = 'Movimentar Caixa';
        vm.movcaixa = MovCaixa;
        vm.meioPag = ['Dinheiro','Cartão','Cheque','Ticket','Vale' ];
        
        vm.ok = ok;
        vm.cancel = cancel;


        function ok(data) {
            $modalInstance.close(data);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();