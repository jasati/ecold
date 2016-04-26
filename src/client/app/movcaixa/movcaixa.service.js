(function() {
    'use strict';
    angular
        .module('app.movcaixa')
        .factory('MovCaixaService', MovCaixaService);
    MovCaixaService.$inject = ['DataserviseProvider','dataservice', 'UtilsFunctions'];
    /* @ngInject */
    function MovCaixaService(DataserviseProvider,dataservice, UtilsFunctions) {
    	var cpInvalidos = [];
    	var dataset = DataserviseProvider.getPrmWebService();
        var datasetChart = DataserviseProvider.getPrmWebService();
        var service = {
            create       : create,
            read         : read,
            startDataset : startDataset,
            readDataChart: readDataChart
        };
        return service;
        ////////////////

        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_emp');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','mov_caixa');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_mc');
        }

        function read (prmConsulta,prmLimit) {
            startDataset();
            var msgErro = 'Falha na Consulta do caixa';
            var servico = 'consulta';  
            var consulta = '';
            if (prmConsulta.descricao != ""){
                consulta += " and descricao LIKE '%"+prmConsulta.descricao+"%'";
            }

            if (prmConsulta.tipo != ""){
                consulta += " and tipo = "+prmConsulta.tipo;
            }

            if (prmConsulta.dtini != "" && prmConsulta.dtfim != ""){
                consulta += " and data BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dtini,'00:00')
                			+"' and '"+UtilsFunctions.formatData(prmConsulta.dtfim,'23:59')+"'";
            } else if (prmConsulta.dtini != "" && prmConsulta.dtfim == "") {
                consulta += " and data = '"+UtilsFunctions.formatData(prmConsulta.dtini,'00:00')+"'";
            };  
           
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                	return data
           		 });
        }   

        function readDataChart(prm) {
            var msgErro = 'Falha na Consulta do caixa';
            var servico = 'consulta';   
            var campos =  "m.tipo, SUM(m.valor) as valor";
            var consulta = "";
            if (prm.dataIni != "" && prm.dataFim != ""){
                consulta += " and m.data BETWEEN '"+UtilsFunctions.formatData(prm.dataIni,'00:00')
                            +"' and '"+UtilsFunctions.formatData(prm.dataFim,'23:59')+"'";
            } else if (prm.dataIni != "" && prm.dataFim == "") {
                consulta += " and m.data = '"+UtilsFunctions.formatData(prm.dataIni,'00:00')+"'";
            };
            var groupBy = "m.tipo";
            var orderBy = 'm.id_mc'
            DataserviseProvider.setDataset(datasetChart,'campos',campos);
            DataserviseProvider.setDataset(datasetChart,'consulta',consulta); 
            DataserviseProvider.setDataset(datasetChart,'group by',groupBy);            
            DataserviseProvider.setDataset(datasetChart,'order by',orderBy);  
            DataserviseProvider.setDataset(datasetChart,'id_index_main','m.id_emp');
            DataserviseProvider.setDataset(datasetChart,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetChart,'modulo','mov_caixa m');
            DataserviseProvider.setDataset(datasetChart,'id_tabela','m.id_mc');
            return dataservice.dadosWeb(datasetChart,servico,msgErro)
                .then(function (data) {
                    return data
                 });
        }             

        function create(data) {
        	startDataset();
        	var action = 'novo';
            var msgErro = 'Falha no lançamento da movimentação no caixa.';
            var msgSucess = 'Movimento de entrada no caixa.';        	
	        //data = UtilsFunctions.removeCamposInvalidos(data,cpInvalidosMov);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();