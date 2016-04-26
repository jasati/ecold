(function () {
    'use strict';

    angular
        .module('app.usuario')
        .controller('UsuarioController', UsuarioController);

    UsuarioController.$inject = ['$q', '$modal', 'logger', 'DataserviseProvider','dataservice', 'routerHelper'];
    /* @ngInject */
    function UsuarioController($q, $modal, logger, DataserviseProvider, dataservice, routerHelper) {
        var vm = this;
        vm.title = 'Usuario';
        vm.usuarios = [];
        vm.consulta = {nome:"",email:"",status:""}
        var dataset = DataserviseProvider.getPrmWebService();

        vm.getUsuario = getUsuario;
        vm.editUsuario = editUsuario;
        vm.newUsuario = newUsuario;
        vm.deleteUsuario = deleteUsuario;
        vm.setPage = setPage;
        vm.optionConsulta = [
                {valor:"0",desc:"Inativo"},
                {valor:"1",desc:"Ativo"}
        ];
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
            var promises = [prmWeb(), getUsuario()];
            return $q.all(promises).then(function() {
                logger.info('Janela usuario Ativada');
            });            
            
        }

        function getUsuario() {
            var msgErro = 'Falha na Consulta do Usuario';
            var servico = 'consulta';
            var consulta = "";
            if (vm.consulta.nome != ""){
                consulta += " and nome LIKE '%"+vm.consulta.nome+"%'";
            }
            if (vm.consulta.email != ""){
                consulta += " and email LIKE '%"+vm.consulta.email+"%'";
            }
            if (vm.consulta.status != ""){
                consulta += " and status = "+vm.consulta.status.valor;
            }  
            DataserviseProvider.setDataset(dataset,'consulta',consulta);          
            DataserviseProvider.setDataset(dataset,'limit',getLimite());          
            return dataservice.dadosWeb(dataset,servico,msgErro).then(function (data) {
                vm.usuarios = data['reg'];
                vm.totalReg = data['qtde'];
                return vm.usuarios;
            });
        } 

         function newUsuario() {
            var usuario = {};
            usuario.id_emp = DataserviseProvider.indexGeral.id_emp;
            var modalInstance = $modal.open({
              templateUrl: 'app/usuario/usuario-cadastro.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Usuario: function () {
                  return usuario;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
                var msgErro = 'Falha na inclusão do usuario.';
                var msgSucess = 'Inclusão realizada com sucesso!';
                var servico = 'novo';
                DataserviseProvider.setDataset(dataset,'estrutura',save);
                dataservice.dadosWeb(dataset,servico,msgErro,msgSucess).then(function (data){
                    getUsuario();
                });
            });
        }   

         function editUsuario(index) {
            var modalInstance = $modal.open({
              templateUrl: 'app/usuario/usuario-cadastro.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Usuario: function () {
                  return index;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
                var msgErro = 'Falha na Atualização do Usuario.';
                var msgSucess = 'Atualização realizada com sucesso!';
                var servico = 'editar';
                DataserviseProvider.setDataset(dataset,'valor_id',save.id_usuario);
                DataserviseProvider.setDataset(dataset,'estrutura',save);
                dataservice.dadosWeb(dataset,servico,msgErro,msgSucess);
            });
        }


         function deleteUsuario(index) {
            var modalInstance = $modal.open({
              templateUrl: 'delete.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Usuario: function () {
                  return index;
                }
              }              
            });
            
            modalInstance.result.then(function (del) {
                var msgErro = 'Falha na exclusão do usuario.';
                var msgSucess = 'Exclusão realizada com sucesso!';
                var servico = 'delete';
                DataserviseProvider.setDataset(dataset,'valor_id',del.id_usuario);
                dataservice.dadosWeb(dataset,servico,msgErro,msgSucess).then(function (data){
                    getUsuario();
                });;
            });
        }    

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getUsuario();
        }

        function prmWeb() {     
            DataserviseProvider.setDataset(dataset,'id_index_main','id_emp');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','usuarios');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_usuario');              
        }
    }
})();
