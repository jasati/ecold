(function(){
    'use strict';

    angular
        .module('app.usuario')
        .controller('UsuarioModalController', UsuarioModalController);
    UsuarioModalController.$inject = ['Usuario','$scope', '$modalInstance'];
    /* @ngInject */
    function UsuarioModalController(Usuario, $scope, $modalInstance) {
        var vm = this;
        vm.title = 'Cadastro Usuario';
        vm.usuario = Usuario;
        vm.senha = {
            oldsenha : '',
            newsenha : '',
            rsenha : ''
        };
        vm.senhaInvalida = false;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.validaSenha = validaSenha;

        
        ////////////

        function validaSenha(senha){
            if (senha.oldsenha == vm.usuario.senha) {
                vm.usuario.senha = senha.newsenha;
                ok(vm.usuario);
            } else {
                vm.senhaInvalida = true;
            }
        }

        function ok(save) {
        	$modalInstance.close(save);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();