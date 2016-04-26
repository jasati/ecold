(function() {
    'use strict';
    angular
        .module('app.movest')
        .factory('MovEstService', MovEstService);
    MovEstService.$inject = ['DataserviseProvider','dataservice', 'UtilsFunctions', 'MovCaixaService'];
    /* @ngInject */
    function MovEstService(DataserviseProvider,dataservice, UtilsFunctions, MovCaixaService) {
        var camposMov = "m.id_mov,m.tipo,m.data,m.descricao,"+
            "m.id_usuario,m.id_pessoa,m.id_emp,m.pagamento,m.recebido,m.troco,m.total,m.obs,m.status,"+
            "p.nome_comp as pessoa,u.nome as usuario";
        var cpInvalidosMov = ['pessoa','usuario'];
        var left_joinMov = {0:"pessoas p on m.id_pessoa = p.id_pessoa",1:"usuarios u on m.id_usuario = u.id_usuario"};             
        var camposItM = "im.id_im, im.id_mov, im.id_item, im.qt, im.valor, im.desc, im.acres, i.descricao,"+
            "im.acres+(im.qt*im.valor)-im.desc as total";
        var inner_joinItM = {0 :"itens i on im.id_item = i.id_item"};
        var cpIvalidositM = ['descricao', 'total','codigo','detalhes','id_emp','id_galeria','imagem',
            'qt_bolas','select','status','tipo','custo'];
        var datasetMov = DataserviseProvider.getPrmWebService();
        var datasetChartMov = DataserviseProvider.getPrmWebService();
        var datasetChartIm = DataserviseProvider.getPrmWebService();
        var datasetItM = DataserviseProvider.getPrmWebService();
        var movPedido = [];
        var service = {
            startDatasetMov : startDatasetMov,
            startDatasetItM : startDatasetItM,
            readMov         : readMov,
            readItM         : readItM,
            createMov       : createMov,
            createItM       : createItM,
            updateMov       : updateMov,
            deletar      : deletar,
            provider     : provider,
            novaMov      : novaMov,
            novoItem     : novoItem,
            loadMov      : loadMov,
            movimentarCaixa :movimentarCaixa,
            movPedido    : movPedido,
            readDataChart: readDataChart,
            readDataImChart:readDataImChart
        };
        return service;
        ////////////////
        function startDatasetMov() {          
            DataserviseProvider.setDataset(datasetMov,'id_index_main','m.id_emp');
            DataserviseProvider.setDataset(datasetMov,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetMov,'modulo','mov_estoque m');
            DataserviseProvider.setDataset(datasetMov,'id_tabela','m.id_mov');
            DataserviseProvider.setDataset(datasetMov,'campos',camposMov);
            DataserviseProvider.setDataset(datasetMov,'left_join',left_joinMov);       
        }

        function startDatasetItM() {          
            DataserviseProvider.setDataset(datasetItM,'id_index_main','im.id_mov');
            DataserviseProvider.setDataset(datasetItM,'modulo','itens_mov im');
            DataserviseProvider.setDataset(datasetItM,'id_tabela','im.id_im');
            DataserviseProvider.setDataset(datasetItM,'campos',camposItM);
            DataserviseProvider.setDataset(datasetItM,'inner_join',inner_joinItM);       
        }


        function novaMov (tipoMov) {
            var desc;
            if (tipoMov == 0) {
               desc = 'Movimento de Saida no Estoque.'
            } else {
               desc = 'Movimento de Entrada no Estoque.'
            }
            var now = new Date();
            var mov ={
                id_mov:0,
                tipo:tipoMov,
                data:UtilsFunctions.formatData(now, now.getHours()+':'+now.getMinutes()),
                descricao:desc,
                id_usuario:DataserviseProvider.indexGeral.id_usuario,
                id_emp:DataserviseProvider.indexGeral.id_emp,
                id_pessoa:null,
                pessoa:null,
                usuario:null,
                pagamento:null,
                troco:0.00,
                total:0.00,
                recebido:0.00,
                obs:null,
                status:1
            };         
            return mov;   
        }
        function novoItem () {
            var itMov = {
                id_im:0,
                id_mov:0,
                id_item:0,
                qt:1.00,
                valor:2.00,
                total:2.00,
                desc:0.00,
                acres:0.00,
                descricao:'item teste'
            };
            return itMov;
        }

        function loadMov (id_mov) {
            startDatasetMov();
            var msgErro = 'Falha na Consulta da Movimentação';
            var servico = 'consulta'; 
            var consulta = " and m.id_mov = "+id_mov;
            DataserviseProvider.setDataset(datasetMov,'consulta',consulta);   
            return dataservice.dadosWeb(datasetMov,servico,msgErro)
                .then(function (data) {
                    return data
                 });
        }
        function readMov (prmConsulta,prmLimit) {
            startDatasetMov();
            var msgErro = 'Falha na Consulta da Movimentação';
            var servico = 'consulta';        	
        	var consulta = " and m.tipo = "+prmConsulta.tipoMov;
            if (prmConsulta.descricao != ""){
                consulta += " and m.descricao LIKE '%"+prmConsulta.descricao+"%'";
            }
            if (prmConsulta.usuario != ""){
                consulta += " and u.nome LIKE '%"+prmConsulta.usuario+"%'";
            } 
            if (prmConsulta.pessoa != ""){
                consulta += " and p.nome_comp LIKE '%"+prmConsulta.pessoa+"%'";
            }             
            if (prmConsulta.dataIni != "" && prmConsulta.dataFim != ""){
                consulta += " and m.data BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dataIni,'00:00')
                			+"' and '"+UtilsFunctions.formatData(prmConsulta.dataFim,'23:59')+"'";
            } else if (prmConsulta.dataIni != "" && prmConsulta.dataFim == "") {
                consulta += " and m.data = '"+UtilsFunctions.formatData(prmConsulta.dataIni,'00:00')+"'";
            };
            if (prmConsulta.status) {
                consulta += " and m.status = "+prmConsulta.status;
            }
           
            DataserviseProvider.setDataset(datasetMov,'consulta',consulta);   
            DataserviseProvider.setDataset(datasetMov,'limit',prmLimit);          
            return dataservice.dadosWeb(datasetMov,servico,msgErro)
            	.then(function (data) {
                	return data
           		 });
        }

        function readDataChart(prm) {
            var msgErro = 'Falha na Consulta da Movimentação';
            var servico = 'consulta';   
            var campos = prm.data+",sum(m.total) as total, m.tipo";
            var consulta = " and m.status = 2 ";
            if (prm.dataIni != "" && prm.dataFim != ""){
                consulta += " and m.data BETWEEN '"+UtilsFunctions.formatData(prm.dataIni,'00:00')
                            +"' and '"+UtilsFunctions.formatData(prm.dataFim,'23:59')+"'";
            } else if (prm.dataIni != "" && prm.dataFim == "") {
                consulta += " and m.data = '"+UtilsFunctions.formatData(prm.dataIni,'00:00')+"'";
            };
            var groupBy = prm.dataGr+",m.tipo";
            var orderBy = 'm.id_mov'
            DataserviseProvider.setDataset(datasetChartMov,'campos',campos);
            DataserviseProvider.setDataset(datasetChartMov,'consulta',consulta); 
            DataserviseProvider.setDataset(datasetChartMov,'group by',groupBy);            
            DataserviseProvider.setDataset(datasetChartMov,'order by',orderBy);  
            DataserviseProvider.setDataset(datasetChartMov,'id_index_main','m.id_emp');
            DataserviseProvider.setDataset(datasetChartMov,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetChartMov,'modulo','mov_estoque m');
            DataserviseProvider.setDataset(datasetChartMov,'id_tabela','m.id_mov');
            return dataservice.dadosWeb(datasetChartMov,servico,msgErro)
                .then(function (data) {
                    return data
                 });
        }

        function readItM (id_mov) {
            var msgErro = 'Falha na Consulta dos Itens da Movimentação';
            var servico = 'consulta'; 
            DataserviseProvider.setDataset(datasetItM,'valor_id_main',id_mov);
            return dataservice.dadosWeb(datasetItM,servico,msgErro)
                .then(function (data){
                    return data
                });
        }

        function readDataImChart(prm) {
            var msgErro = 'Falha na Consulta dos itens do grafico';
            var servico = 'consulta';   
            var campos = "i.id_item, i.descricao, sum(im.qt) as qt_vendido";
            var consulta = " and m.tipo = 0 and m.status = 2";
            if (prm.dataIni != "" && prm.dataFim != ""){
                consulta += " and m.data BETWEEN '"+UtilsFunctions.formatData(prm.dataIni,'00:00')
                            +"' and '"+UtilsFunctions.formatData(prm.dataFim,'23:59')+"'";
            } else if (prm.dataIni != "" && prm.dataFim == "") {
                consulta += " and m.data = '"+UtilsFunctions.formatData(prm.dataIni,'00:00')+"'";
            };
            var groupBy = "i.id_item";
            var innerJoin = {0:'itens i on im.id_item = i.id_item',1:'mov_estoque m on im.id_mov = m.id_mov'}
            DataserviseProvider.setDataset(datasetChartIm,'campos',campos);
            DataserviseProvider.setDataset(datasetChartIm,'consulta',consulta); 
            DataserviseProvider.setDataset(datasetChartIm,'group by',groupBy);            
            DataserviseProvider.setDataset(datasetChartIm,'inner_join',innerJoin);  
            DataserviseProvider.setDataset(datasetChartIm,'id_index_main','m.id_emp');
            DataserviseProvider.setDataset(datasetChartIm,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(datasetChartIm,'modulo','itens_mov im');
            DataserviseProvider.setDataset(datasetChartIm,'id_tabela','m.id_im');
            return dataservice.dadosWeb(datasetChartIm,servico,msgErro)
                .then(function (data) {
                    return data
                 });
        }        

        function createMov (data) {
        	var action = 'novo';
            var msgErro = 'Falha na Abertura da Movimentação.';
            var msgSucess = 'Abertura de Movimento';        	
	        data = UtilsFunctions.removeCamposInvalidos(data,cpInvalidosMov);
            DataserviseProvider.setDataset(datasetMov,'modulo','mov_estoque');            
	        DataserviseProvider.setDataset(datasetMov,'estrutura',data);
	        return dataservice.dadosWeb(datasetMov,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }

        function createItM (data) {
            var action = 'novo';
            var msgErro = 'Falha na Sincronia dos Itens da Movimentação.';
            var msgSucess = 'Movimentação Fechada com sucesso!';
            for (var i = 0; i < data.length; i++) {
                data[i] = UtilsFunctions.removeCamposInvalidos(data[i],cpIvalidositM);
            };          
            DataserviseProvider.setDataset(datasetItM,'id_index_main','id_mov');
            DataserviseProvider.setDataset(datasetItM,'id_tabela','id_im');            
            DataserviseProvider.setDataset(datasetItM,'modulo','itens_mov');
            DataserviseProvider.setDataset(datasetItM,'estrutura',data);
            return dataservice.dadosWeb(datasetItM,action,msgErro,msgSucess)
                .then(function (data){
                    return data;
                });
        }        

        function updateMov (data) {
            var action = 'editar';
            var msgErro = 'Falha no Fechamento da Movimentação.';
            var msgSucess = 'Fechamento de Movimento';            
            data = UtilsFunctions.removeCamposInvalidos(data,cpInvalidosMov);
            data = UtilsFunctions.removeCamposInvalidos(data,'data');//para nao alterar a data com formato diferente
            DataserviseProvider.setDataset(datasetMov,'id_tabela','id_mov');
            DataserviseProvider.setDataset(datasetMov,'valor_id',data.id_mov);                        
            DataserviseProvider.setDataset(datasetMov,'estrutura',data);
            return dataservice.dadosWeb(datasetMov,action,msgErro,msgSucess)
                .then(function (data){
                    return data;
                });
        }

        function deletar (data) {
            var msgErro = 'Falha no cancelamento da movimentação.';
            var msgSucess = 'Cancelamento realizada com sucesso!';
            var servico = 'delete';
            DataserviseProvider.setDataset(datasetMov,'id_tabela','id_mov');
            DataserviseProvider.setDataset(datasetMov,'modulo','mov_estoque');                
            DataserviseProvider.setDataset(datasetMov,'valor_id',data.id_mov);
            return dataservice.dadosWeb(datasetMov,servico,msgErro,msgSucess)
                .then(function (data){
                    return data;
                });
        }

        function movimentarCaixa (data) {
            var mov = {
                tipo:0,//entrada no caixa
                id_usuario:data.id_usuario,
                descricao:data.descricao,
                valor:data.total,
                tipo_moeda:data.pagamento,
                id_emp:data.id_emp,
                data:data.data
            }
            MovCaixaService.create(mov);

        }

        function provider () {
        	return DataserviseProvider;
        }
    }
})();