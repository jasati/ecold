(function() {
    'use strict';
    angular
        .module('app.empresa')
        .factory('EmpresaService', EmpresaService);
    EmpresaService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function EmpresaService(dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "id_emp,fantasia,razao" 	
        var dataset = DataserviseProvider.getPrmWebService();
        var service = {
            load         : load,
            update       : update
        };
        return service;
        ////////////////
        function startDataset() {           
            DataserviseProvider.setDataset(dataset,'modulo','empresa');
            DataserviseProvider.setDataset(dataset,'id_index_main','1');
            DataserviseProvider.setDataset(dataset,'valor_id_main','1');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_emp');              
        }

        function load() {
            startDataset();
            var msgErro = 'Falha na Consulta da Empresa';
            var servico = 'consulta'; 
            var consulta = " and id_emp = "+DataserviseProvider.indexGeral.id_emp;
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            return dataservice.dadosWeb(dataset,servico,msgErro)
                .then(function (data) {
                    return data
                 });          
        }


        function update (data) {
            var msgErro = 'Falha na Atualização da Empresa.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_emp);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();