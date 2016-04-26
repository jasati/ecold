(function() {
    'use strict';
    angular
        .module('app.galeria')
        .controller('GaleriaController', GaleriaController);
    GaleriaController.$inject = ['$q','FileUploader','DataserviseProvider', 'dataservice', 'config', '$scope', 'logger'];
    /* @ngInject */
    function GaleriaController($q, FileUploader,DataserviseProvider, dataservice, config, $scope, logger) {
        var vm = this;
        vm.title = 'Galeria';
        var Uploader = $scope.uploader = new FileUploader({
        	url:config.urlWebService+'upload/'+DataserviseProvider.indexGeral.id_emp+',true'
        });
        var dataset = DataserviseProvider.getPrmWebService();

        Uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        }); 
        vm.urlImagem = config.urlImagem;
        vm.galeria = [];
        vm.imgSelect = [];
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;
        vm.imgSel = 0;
        vm.btnDel = true;

        //////
        vm.getGaleria = getGaleria;
        vm.deleteImagem = deleteImagem;
        activate();

        ////////////////
        function activate() {
            var promises = [prmWeb(), getGaleria()];
            return $q.all(promises).then(function() {
                logger.info('Janela Galeria Ativada');
            });  
        }

        function prmWeb() {   
            DataserviseProvider.setDataset(dataset,'id_index_main','id_emp');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','galeria');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_galeria');              
        }        

        function getGaleria() {
            var msgErro = 'Falha na Consulta da galeria';
            var servico = 'consulta';
            var consulta = "";
      		DataserviseProvider.setDataset(dataset,'consulta',consulta); 
            DataserviseProvider.setDataset(dataset,'limit',getLimite());          
            return dataservice.dadosWeb(dataset,servico,msgErro).then(function (data) {
                vm.galeria = data['reg'];
                vm.totalReg = data['qtde'];
                return vm.galeria;
            });
        } 

        function deleteImagem (img) {
            var servico = 'delete';
            DataserviseProvider.setDataset(dataset,'valor_id',img.id_galeria); 
            dataservice.dadosWeb(dataset,servico).then(function (data){
                if (data.status == "ok") {
                    servico = 'deleteimg';
                    DataserviseProvider.setDataset(dataset,'nomeImg',img.imagem);
                    dataservice.dadosWeb(dataset,servico).then(function (data){
                        vm.galeria.splice(img,1);
                        logger.info(data.msg);
                        getGaleria();
                    });                
                } else {
                    logger.warning(data.msg);
                }
            });                   	
        }


        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getGaleria();
        }        

        // CALLBACKS

        Uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        Uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        Uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        Uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        Uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        Uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        Uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        Uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        Uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        Uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        Uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', Uploader);        

    }
})();