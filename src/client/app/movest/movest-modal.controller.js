(function(){
    'use strict';

    angular
        .module('app.movest')
        .controller('MovEstModalController', MovEstModalController);
    MovEstModalController.$inject = ['MovEst','$q', '$modalInstance', '$modal', 'config', 'logger', 'MovEstService','ItemService', 'UtilsFunctions','DataserviseProvider'];
    /* @ngInject */
    function MovEstModalController(MovEst, $q, $modalInstance, $modal, config, logger, MovEstService, ItemService, UtilsFunctions,DataserviseProvider) {
        var vm = this;
        vm.dataAtual = new Date();
        vm.title = 'Venda';
        vm.movest = [];
        vm.itemMov = [];
        vm.itemSearch = "";
        vm.exibirBt = false;
        vm.focus = false;
        vm.visualisando = false;
        vm.reloadPedido = true;
        vm.ePedido = false;
        vm.consulta = {dataIni:"",dataFim:"",descricao:"",usuario:"",tipoMov:"0",pessoa:"",status:"0"}
        vm.verPedido = null;
        vm.abrirVenda = abrirVenda;
        vm.identificarPessoa = identificarPessoa;
        vm.fecharVenda = fecharVenda;
        vm.ok = ok;
        vm.qtPedido = 0;
        vm.cancel = cancel;
        vm.remItemLista = remItemLista;
        vm.novaCompra = novaCompra;
        vm.itemCompra = itemCompra;
        vm.finalizarCompra = finalizarCompra;
        vm.cancelarMov = cancelarMov;
        vm.selecionarPedido = selecionarPedido;
        activate();
        
        ////////////

        function activate () {
            var promises = [dataPadrao (),MovEstService.startDatasetItM(),visualizarMov(),startVerificaPedido()];
            return $q.all(promises).then(function(data){
                //logger.info('Janela de Venda Ativada');
            });
        }

        function startVerificaPedido() {
            vm.verPedido = window.setInterval(
                function(){
                    if(vm.reloadPedido){
                        readPedido()
                    }
                },60000);
        }

        function visualizarMov () {
            if (MovEst != 1) {
                MovEstService.loadMov(MovEst.id_mov)
                    .then(function(data){
                        vm.movest = data['reg'][0];
                        MovEstService.readItM(MovEst.id_mov)
                            .then(function(data){
                                vm.itemMov = data['reg'];
                                vm.visualisando = true;
                            }); 
                    });

            };
        }

        function readPedido() {
            
            MovEstService.readMov(vm.consulta,15).then(function(data){
                MovEstService.movPedido = data['reg'];
                vm.qtPedido = data['qtde'];              
            });

        }


        function selecionarPedido() {
            var modalInstance = $modal.open({
              templateUrl: 'app/movest/movest-pedidos.html',
              controller: 'MovEstPedModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Pedidos: function () {
                  return MovEstService.movPedido;
                }
              }              
            });
            
            modalInstance.result.then(function (mov) {
                vm.ePedido = true;
                vm.movest = mov;
                vm.movest.status = 1;//modificando para venda
                vm.movest.id_usuario = DataserviseProvider.indexGeral.id_usuario;
                vm.movest.id_pessoa = 1;
                MovEstService.updateMov(vm.movest);
                MovEstService.readItM(vm.movest.id_mov)
                    .then(function(data){
                        vm.itemMov = data['reg'];
                    }); 
            });
        }



        function novaCompra () {
            var movest = MovEstService.novaMov(1);//entrada
            movest.id_pessoa = 2;
            MovEstService.createMov(movest).then(function (data){
                if (data.status == 'ok') {
                    movest.id_mov = data.last_insert;
                    vm.movest = movest;
                    vm.itemMov = [];
                    vm.visualisando = true;
                    document.getElementById('descricao').focus();
                };
            });            
        }

        function itemCompra ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13 && vm.movest.status == 1) {
                informarItem();
            }
        }

        function finalizarCompra () {
            vm.movest.status = 2;
            MovEstService.updateMov(vm.movest).then(function(data){
                if (data.status =='ok') {
                    MovEstService.createItM(vm.itemMov).then(function(r){
                        vm.itemMov = [];
                        logger.info('Entrada no estoque realizado com sucesso!');
                    });
                };
            });
        }

        function cancelarMov () {
            var modalInstance = $modal.open({
              templateUrl: 'app/movest/delete.html',
              controller: 'MovEstDelController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                MovEst: function () {
                  return vm.movest;
                }
              }              
            });
            
            modalInstance.result.then(function (del) {
                MovEstService.deletar(del).then(function (data) {
                    if (data.status = 'ok') {
                        vm.movest = [];
                        vm.itemMov = [];                        
                        logger.info('Movimento cancelado');
                    };
                });
            });            
        }

        function abrirVenda ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                if (vm.movest.status == '' || vm.movest.status == undefined || vm.movest.status==2 ) {
                    var movest = MovEstService.novaMov(0);//saida
                    movest.id_pessoa = 1;
                    MovEstService.createMov(movest).then(function (data){
                        if (data.status == 'ok') {
                            movest.id_mov = data.last_insert;
                            vm.movest = movest;
                            identificarPessoa(1,'Consumidor');                            
                            vm.itemMov = [];
                            informarItem();
                            vm.visualisando = false;
                        };
                    });
                    
                } else {
                    informarItem();
                }
                
            };

        }
        function dataPadrao () {
          var data = new Date();
          vm.consulta.dataIni = data;
          vm.consulta.dataFim = data;
        }

        function identificarPessoa (id, nome) {
            vm.movest.pessoa = nome;
            vm.movest.id_pessoa = id;
        }

        function informarItem () {
            var qt=null, operador=null, codDesc=null, cod="", desc="";
            operador = /[\W]/.exec(vm.itemSearch);
            if (operador) {
                operador = operador.toString(operador);
            };
            qt = /[0-9]*/.exec(vm.itemSearch);
            if (qt) {
                qt = qt.toString(qt)
            };
            codDesc = /\W.*$/.exec(vm.itemSearch)
            if (codDesc) {
                codDesc = codDesc.toString(codDesc);
                codDesc = codDesc.replace("*","");
            };
            
            if (Number(codDesc)) {
                cod = codDesc;
            } else {
                desc = codDesc===null?vm.itemSearch:codDesc;

            }
            var movimento = {
                    consulta : {
                        codigo : cod,
                        descricao:desc,
                        status:"1"
                    },
                    tipo:vm.movest.tipo
                };
            if (operador!=null && qt>0 && codDesc!="") {
                ItemService.startDataset();
                ItemService.read(consulta).then(function(data){
                    if (data['reg'].length > 0) {
                        var itens = data['reg'];
                        itens[0].qt = Number(qt);
                        itens[0].total = itens[0].qt * itens[0].valor;
                        additemLista(itens);
                        totalMov();
                        limpar();                 
                    } else {
                        logger.warning('Item não encontrado.');
                    }
                });                 
            } else {

                var modalInstance = $modal.open({
                  templateUrl: 'app/item/item-selecionar.html',
                  controller: 'ItemSelModalController',
                  controllerAs: 'vm',
                  size: '',
                  backdrop:'static',
                  resolve: {
                    Movimento: function () {
                      return movimento;
                    }
                  }              
                });
                
                modalInstance.result.then(function (save) {
                    additemLista(save);
                    totalMov();
                    limpar();
                });
            }
            
        }

        function additemLista (argument) {
            for (var i = 0; i < argument.length; i++) {
                argument[i].id_mov = vm.movest.id_mov;
                vm.itemMov[vm.itemMov.length] = argument[i];
            };
        }

        function remItemLista (index) {
            vm.itemMov.splice(index,1);
        }

        function limpar () {
            vm.itemSearch = '';
        }
        function totalMov () {
            var t = 0;
            for (var i = 0; i < vm.itemMov.length; i++) {
               t += vm.itemMov[i].qt * vm.itemMov[i].valor;
            };
            vm.movest.total = t;
        }

        function fecharVenda () {
            if (vm.movest.status == 1 && vm.movest.total > 0) {
                var modalInstance = $modal.open({
                  templateUrl: 'app/movest/movest-fechamento.html',
                  controller: 'MovEstFechModalController',
                  controllerAs: 'vm',
                  size: '',
                  backdrop:'static',
                  resolve: {
                    MovEst: function () {
                      return vm.movest;
                    }
                  }              
                });
                
                modalInstance.result.then(function (save) {
                    MovEstService.updateMov(save).then(function(data){
                        if (data.status =='ok') {
                            if (!vm.ePedido) {
                                MovEstService.createItM(vm.itemMov).then(function(r){
                                    MovEstService.movimentarCaixa(save);
                                    vm.itemMov = [];
                                    vm.ePedido = false;
                                    readPedido();
                                });
                            } else {
                                MovEstService.movimentarCaixa(save);
                                vm.itemMov = [];
                            }
                        };
                    })

                });                
            };
        }

        function ok(save) {
            window.clearInterval(vm.verPedido );
        	$modalInstance.close(save);
        }
        function cancel(){
            window.clearInterval(vm.verPedido );
        	$modalInstance.dismiss('cancel');
        }
    }
})();