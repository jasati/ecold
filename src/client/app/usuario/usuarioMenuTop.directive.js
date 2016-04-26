(function() {
    'use strict';
    angular
        .module('app.usuario')
        .directive('usuarioMenuTop', usuarioMenuTop);
    usuarioMenuTop.$inject = ['DataserviseProvider', '$cookies', '$modal', 'dataservice'];
    /* @ngInject */
    function usuarioMenuTop (DataserviseProvider, $cookies, $modal, dataservice) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: UsuarioMenuTopController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
            	'usuario':'=',
            	'logado': '='
            },
            templateUrl: 'app/usuario/usuario-menu-top.html'
        };


        function UsuarioMenuTopController () {
            var vm = this;

            vm.logoff = logoff;
            vm.cadastroUsuarioLogado = cadastroUsuarioLogado;
            vm.alterarSenha = alterarSenha;

            function logoff () {
                delete($cookies['nomeUser']);
                delete($cookies['idUser']);
                delete($cookies['idEmp']);
                DataserviseProvider.indexGeral.id_usuario = '';
                DataserviseProvider.indexGeral.id_emp = '';
                vm.logado = false;
                vm.usuario = {};
            }

            function cadastroUsuarioLogado () {

                var modalInstance = $modal.open({
                  templateUrl: 'app/usuario/usuario-cadastro.html',
                  controller: 'UsuarioModalController',
                  controllerAs: 'vm',
                  size: '',
                  backdrop:true,
                  resolve: {
                    Usuario: function () {
                      return vm.usuario;
                    }
                  }              
                });                
	            modalInstance.result.then(function (save) {
	                var msgErro = 'Falha na Atualização do Usuario.';
	                var msgSucess = 'Atualização realizada com sucesso!';
	                var servico = 'editar';
	                prmWeb();
	                DataserviseProvider.configPrmWebService('valor_id',save.id_usuario);
	                DataserviseProvider.configPrmWebService('estrutura',save);
	                dataservice.dadosWeb(DataserviseProvider.getPrmWebService(),servico,msgErro,msgSucess);
	            });
            }

            function alterarSenha () {
                var modalInstance = $modal.open({
                  templateUrl: 'app/usuario/usuario-alterar-senha.html',
                  controller: 'UsuarioModalController',
                  controllerAs: 'vm',
                  size: 'sm',
                  backdrop:true,
                  resolve: {
                    Usuario: function () {
                      return vm.usuario;
                    }
                  }
                });
	            modalInstance.result.then(function (save) {
	                var msgErro = 'Falha na Atualização do Usuario.';
	                var msgSucess = 'Atualização realizada com sucesso!';
	                var servico = 'editar';
	                prmWeb();
	                DataserviseProvider.configPrmWebService('valor_id',save.id_usuario);
	                DataserviseProvider.configPrmWebService('estrutura',save);
	                dataservice.dadosWeb(DataserviseProvider.getPrmWebService(),servico,msgErro,msgSucess);
	            });
            }

	        function prmWeb() {          
	            DataserviseProvider.configPrmWebService('id_index_main','id_emp');
	            DataserviseProvider.configPrmWebService('valor_id_main','1');
	            DataserviseProvider.configPrmWebService('modulo','usuarios');
	            DataserviseProvider.configPrmWebService('id_tabela','id_usuario');              
	        }



        }
        return directive;
    }
})();