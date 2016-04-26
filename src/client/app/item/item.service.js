(function() {
    'use strict';
    angular
        .module('app.item')
        .factory('ItemService', ItemService);
    ItemService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ItemService(dataservice,DataserviseProvider,UtilsFunctions) {
        var inner_join = {0 :"galeria g on i.id_galeria = g.id_galeria"};
        var campos = " i.id_item, i.id_emp, i.id_galeria, i.tipo, i.qt_bolas, i.descricao, i.detalhes, i.valor, i.status,i.codigo,i.show_est,g.imagem"
        var camposInvalidos = ['imagem'];    	
        var dataset = DataserviseProvider.getPrmWebService();
        var service = {
            startDataset : startDataset,
            provider     : provider,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_emp');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','itens');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_item');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'left_join',inner_join);       
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta do Item';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.codigo != "") {
                consulta += " and i.codigo = "+prmConsulta.codigo;
            };
            if (prmConsulta.descricao != "") {
                consulta += " and i.descricao LIKE '%"+prmConsulta.descricao+"%'";
            }
            if (prmConsulta.status != ""){
                consulta += " and i.status = "+prmConsulta.status;
            }  
            DataserviseProvider.setDataset(dataset,'modulo','itens i');   
            DataserviseProvider.setDataset(dataset,'id_tabela','i.id_item');                     
            DataserviseProvider.setDataset(dataset,'id_index_main','i.id_emp');            
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                	return data
           		 });            
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do item.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_emp = DataserviseProvider.indexGeral.id_emp;    	
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do Item.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_item);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do item.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_item);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }  
        
        function provider () {
        	return DataserviseProvider;
        }               
    }
})();