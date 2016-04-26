(function () {
    'use strict';

    angular
        .module('app.movest')
        .controller('MovEstController', MovEstController);

    MovEstController.$inject = ['$filter','$q', '$modal', 'logger','dataservice', 'routerHelper', 'MovEstService', 'EstoqueService'];
    /* @ngInject */
    function MovEstController($filter,$q, $modal, logger, dataservice, routerHelper, MovEstService, EstoqueService) {
        var vm = this;
       
        var camposInvalidos = ['pessoa','usuario'];
        vm.title = 'Movimentação de estoque';
        vm.movest = [];
        vm.consulta = {dataIni:"",dataFim:"",descricao:"",usuario:"",tipoMov:"",pessoa:""}
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;  
        vm.totalVenda = 0;
        vm.statusAlert = '';
        vm.statusOk = '';

        //methods shortcut
        vm.getMovEst = getMovEst;
        vm.newMovEst = newMovEst;
        vm.deleteMovEst = deleteMovEst;
        vm.setPage = setPage;
        vm.setPageEstoque = setPageEstoque;
        vm.setTipoMov = setTipoMov;
        vm.openMovEst = openMovEst;
        vm.convDate = convDate;
        vm.getEstoque = getEstoque;
        vm.atualizarEstoque = atualizarEstoque;
        activate();

        //methods
        function activate() {
            var promises = [dataPadrao(), MovEstService.startDatasetMov(), setTipoMov(1)];
            return $q.all(promises).then(function() {
                logger.info('Janela Movimentação de Estoque Ativada');
            });
        }

        function getMovEst() {
            MovEstService.readMov(vm.consulta,getLimite()).then(function(data){
              vm.movest = data['reg'];
              vm.totalReg = data['qtde'];  
              vm.totalVenda = 0;
              angular.forEach(vm.movest, function(value, key){
                vm.totalVenda += value.total;
              });            
            });
        } 

        function getEstoque() {
            EstoqueService.read(vm.consulta,getLimite()).then(function(data){
              vm.estoque = data['reg'];
              vm.totalReg = data['qtde']; 
              vm.chartLabel = [];
              vm.chartValor = []; 
              vm.chartSerie = ['Saldo'];
              //exemplos http://jtblin.github.io/angular-chart.js/      
              var dados = [];
              for (var i = 0; i < vm.estoque.length; i++) {
                if (vm.estoque[i].saldo > 0) {
                    vm.chartLabel.push(vm.estoque[i].descricao);
                    dados.push(vm.estoque[i].saldo);                  
                };
              };
              vm.chartValor.push(dados);
              getDataEstoque();           
            });            
        }  
        function getDataEstoque (){
            EstoqueService.readEstoque().then(function (data){
              vm.dataEstoque = new Date(data['reg'][0].data_atualizado);
            });
        }

        function atualizarEstoque () {
          EstoqueService.atualizarSaldo().then(function (data){
            if (data.status = 'ok') {
              getEstoque();
            };
          })
        }       

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

         function newMovEst() {
            var args = 1;
            var tpl = "";
            if (vm.consulta.tipoMov == 0) {
              tpl = "app/movest/movest-saida.html";
            } else {
              tpl = "app/movest/movest-entrada.html";
            }
            var modalInstance = $modal.open({
              templateUrl: tpl,
              controller: 'MovEstModalController',
              controllerAs: 'vm',
              size: 'lg',
              backdrop:'static',
              keyboard:false,
              resolve: {
                MovEst: function () {
                  return args;
                }
              }  
            });
        }

        function openMovEst (index) {
            var tpl = "";
            if (vm.consulta.tipoMov == 0) {
              tpl = "app/movest/movest-saida.html";
            } else {
              tpl = "app/movest/movest-entrada.html";
            }          
            var modalInstance = $modal.open({
              templateUrl: tpl,
              controller: 'MovEstModalController',
              controllerAs: 'vm',
              size: 'lg',
              backdrop:'static',
              resolve: {
                MovEst: function () {
                  return index;
                }
              }              
            });
        }

        function deleteMovEst(index) {
            var modalInstance = $modal.open({
              templateUrl: 'app/movest/delete.html',
              controller: 'MovEstDelController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                MovEst: function () {
                  return index;
                }
              }              
            });
            modalInstance.result.then(function(data){
              MovEstService.deletar(data).then(function(result){
                if (result.status =='ok') {
                  getMovEst();
                }
              })
            });
        }    

        function setTipoMov (tipoMov) {
          vm.consulta.tipoMov = tipoMov;
          getMovEst();
        }

        function dataPadrao () {
          var data = new Date();
          vm.consulta.dataIni = data;
          vm.consulta.dataFim = data;
        }

        function removeCamposInvalidos (data) {
          for (var i = 0; i < camposInvalidos.length; i++) {
            delete data[camposInvalidos[i]];
          };
          return data;
        }

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getMovEst();
        }
        function setPageEstoque () {
            getEstoque();
        }        

    }
})();
