(function() {
    'use strict';
    angular
        .module('app.movest')
        .controller('MovEstDelController', MovEstDelController);
    MovEstDelController.$inject = ['$q','MovEst', '$modalInstance'];
    /* @ngInject */
    function MovEstDelController($q,MovEst, $modalInstance) {
        var vm = this;
        vm.title = 'Cancelar Movimentação';
        vm.movest = MovEst;

        vm.ok = ok;
        vm.cancel = cancel;
        ////////////////
        function ok() {
            $modalInstance.close(vm.movest);               
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();