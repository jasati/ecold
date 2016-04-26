(function() {
    'use strict';
    angular
        .module('app.estoque')
        .factory('EstoqueService', EstoqueService);
    EstoqueService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function EstoqueService(dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "i.id_item,i.descricao,i.valor,(SELECT COALESCE(sum(im.valor),0) / COALESCE(count(im.id_item),0) FROM itens_mov im "+
 "INNER JOIN mov_estoque m on im.id_mov = m.id_mov WHERE im.id_item = i.id_item  AND m.tipo = 1 and m.status = 2"+
") as custo_medio,CASE i.tipo WHEN 0 THEN i.saldo WHEN 1 THEN (SELECT SUM(i1.saldo*i1.qt_bolas) FROM itens i1 WHERE i1.tipo = 1)"+
" ELSE i.saldo END as saldo";
        var dataset = DataserviseProvider.getPrmWebService();
        var datasetEst = DataserviseProvider.getPrmWebService();
        var datasetFnEst = DataserviseProvider.getPrmWebService();
        var service = {
            startDataset : startDataset,
            read         : read,
            atualizarSaldo : atualizarSaldo,
            readEstoque : readEstoque
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','i.id_emp');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','itens i');
            DataserviseProvider.setDataset(dataset,'id_tabela','i.id_item');
            DataserviseProvider.setDataset(dataset,'campos',campos);
        }

        function startDatasetEst() {          
            DataserviseProvider.setDataset(datasetEst,'id_index_main','id_emp');
            DataserviseProvider.setDataset(datasetEst,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetEst,'modulo','estoque');
            DataserviseProvider.setDataset(datasetEst,'id_tabela','id_estoque');
        }
        function startDatasetFnEst() {          
            DataserviseProvider.setDataset(datasetFnEst,'id_index_main','id_emp');
            DataserviseProvider.setDataset(datasetFnEst,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetFnEst,'valor_id',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetFnEst,'modulo','data_estoque');
        }        

        function read (prmConsulta,prmLimit) {
            startDataset();
            var msgErro = 'Falha na Consulta do Item';
            var servico = 'consulta';
            var consulta = "";
            consulta += " and i.status = 1 and i.show_est = 1";        	

            if (prmConsulta.descricao != "") {
                consulta += " and i.descricao LIKE '%"+prmConsulta.descricao+"%'";
            }
          
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                	return data
           		 });            
        }

        function atualizarSaldo () {
            startDatasetFnEst();
            var msgErro = 'Falha na Atualização do estoque';
            var servico = 'functionSql';         
            return dataservice.dadosWeb(datasetFnEst,servico,msgErro)
                .then(function (data) {
                    return data
                 });             
        }

        function readEstoque () {
            startDatasetEst();
            var msgErro = 'Falha na Consulta do Estoque';
            var servico = 'consulta';
            return dataservice.dadosWeb(datasetEst,servico,msgErro)
                .then(function (data) {
                    return data
                 });            
        }


    }
})();