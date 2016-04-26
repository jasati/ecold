(function () {
    'use strict';

    angular
        .module('app.movcaixa')
        .controller('MovCaixaController', MovCaixaController);

    MovCaixaController.$inject = ['$q', '$modal', 'logger', 'MovCaixaService', 'routerHelper', 'DataserviseProvider'];
    /* @ngInject */
    function MovCaixaController($q, $modal, logger, MovCaixaService, routerHelper, DataserviseProvider) {
        var vm = this;

        vm.title = 'Movimento de Caixa';
        vm.movcaixa = [];
        vm.consulta = {descricao:"",dtini:"", dtfim:"",tipo:""}
                vm.optionConsulta = [
                {valor:"0",desc:"Entrada"},
                {valor:"1",desc:"Saida"}
        ];
        vm.totalCaixa = 0;
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        vm.getMovCaixa = getMovCaixa;
        vm.newMovCaixa = newMovCaixa;
        vm.setPage = setPage;
        vm.convDate = convDate;
        activate();

        function activate() {
            var promises = [dataPadrao(),MovCaixaService.startDataset(), getMovCaixa()];
            return $q.all(promises).then(function() {
                logger.info('Janela Caixa Ativada');
            });            
            
        }

        function getMovCaixa() {
            MovCaixaService.read(vm.consulta,getLimite()).then(function(data){
              vm.movcaixa = data['reg'];
              vm.totalReg = data['qtde'];              
              vm.totalCaixa = 0;
              angular.forEach(vm.movcaixa, function(value, key){
                if (value.tipo ==0) {
                  vm.totalCaixa += value.valor;
                } else {
                  vm.totalCaixa -= value.valor;
                }
              });              
            });            
        } 

         function newMovCaixa() {
            var movcaixa = {
              id_emp:DataserviseProvider.indexGeral.id_emp,
              id_usuario:DataserviseProvider.indexGeral.id_usuario,
              data:new Date()
            };
            var modalInstance = $modal.open({
              templateUrl: 'app/movcaixa/movcaixa-cadastro.html',
              controller: 'MovCaixaModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                MovCaixa: function () {
                  return movcaixa;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
              MovCaixaService.create(save).then(function(data){
                getMovCaixa();
              })
            });
        }   

        function dataPadrao () {
          var data = new Date();
          vm.consulta.dtini = data;
          vm.consulta.dtfim = data;
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getItem();
        }

    }
})();
