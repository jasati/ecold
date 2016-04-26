(function(){
    'use strict';

    angular
        .module('app.galeria')
        .controller('GaleriaModalController', GaleriaModalController);
    GaleriaModalController.$inject = ['$q', '$modalInstance', '$scope', 'config', 'DataserviseProvider', 'dataservice', 'logger'];
    /* @ngInject */
    function GaleriaModalController($q, $modalInstance, $scope, config, DataserviseProvider, dataservice, logger) {
        var vm = this;
        vm.title = 'Selecionar Imagem na Galeria';
        vm.urlImagem = config.urlImagem;
        vm.galeria = [];
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;
        vm.imgSel = 0;
        vm.img = [];
        //////////

        vm.getGaleria = getGaleria;
        vm.selecionarImagem = selecionarImagem;
        vm.ok = ok;
        vm.cancel = cancel;
        activate();
        
        ////////////
        function activate() {
            var promises = [prmWeb(), getGaleria()];
            return $q.all(promises).then(function() {
                logger.info('Janela Galeria Ativada');
            });  
        }

        function prmWeb() {  
            DataserviseProvider.clearPrmWebServise();
            DataserviseProvider.configPrmWebService('id_index_main','id_emp');
            DataserviseProvider.configPrmWebService('valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.configPrmWebService('modulo','galeria');
            DataserviseProvider.configPrmWebService('id_tabela','id_galeria');              
        }   

        function getGaleria() {
            var msgErro = 'Falha na Consulta da galeria';
            var servico = 'consulta';
            var consulta = "";
            DataserviseProvider.configPrmWebService('consulta',consulta); 
            DataserviseProvider.configPrmWebService('limit',getLimite());          
            return dataservice.dadosWeb(DataserviseProvider.getPrmWebService(),servico,msgErro).then(function (data) {
                vm.galeria = data['reg'];
                vm.totalReg = data['qtde'];
                return vm.galeria;
            });
        } 

        function selecionarImagem (img) {
            vm.imgSel = img.id_galeria;
            vm.img = img;
        }

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }

        function setPage () {
            getGaleria();
        }             

        function ok() {
        	$modalInstance.close(vm.img);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();