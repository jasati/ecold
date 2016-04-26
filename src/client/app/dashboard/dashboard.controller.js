(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', '$modal', 'dataservice', 'DataserviseProvider', 'logger', 'MovCaixaService','MovEstService','EmpresaService'];
    /* @ngInject */
    function DashboardController($q,$modal, dataservice, DataserviseProvider, logger, MovCaixaService,MovEstService,EmpresaService) {
        var vm = this;
        vm.news = {
            title: 'eCold',
            description: 'Sistema para controle de sorveterias'
        };
        var dataset = DataserviseProvider.getPrmWebService()
        vm.messageCount = 0;
        vm.empresa = [];
        vm.title = 'Dashboard';
        vm.periodoChart = ['hora','dia','semana','mes','ano'];
        vm.opitionChartColor = ['#99e699', '#FF5252'];

        vm.chart = {
          dataIni:'',
          dataFim:'',
          dataGr:'',
          periodo:'hora'
        }

        vm.chartCx = {
          dataIni:'',
          dataFim:'',
        }
        vm.chartIm = {
          dataIni:'',
          dataFim:'',
        }        

        vm.vender = vender;
        vm.comprar = comprar;
        vm.movimentarCaixa = movimentarCaixa;
        vm.dadosChartMov = dadosChartMov;
        vm.dadosChartCaixa = dadosChartCaixa;
        vm.dadosChartIm = dadosChartIm;
        activate();

        function activate() {
            var promises = [
              getEmpresa(),
              dataPadrao(),
              dadosChartMov(),
              dadosChartCaixa(),
              dadosChartIm()
            ];
            return $q.all(promises).then(function() {
                logger.info('Janela Principal Ativa');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getEmpresa() {
            EmpresaService.load().then(function (data) {
                vm.empresa = data['reg'][0];
            });
        }

        function vender () {
            var args = 1;
            var modalInstance = $modal.open({
              templateUrl:"app/movest/movest-saida.html",
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
        function comprar () {
            var args = 1;
            var modalInstance = $modal.open({
              templateUrl:"app/movest/movest-entrada.html",
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

         function movimentarCaixa() {
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

              })
            });
        }

        function dataPadrao () {
          var dtIni = new Date();
          var dtFim = new Date();
          dtIni.setDate(1);
          vm.chart.dataIni = dtIni;
          vm.chart.dataFim = dtFim;
          vm.chartCx.dataIni = dtIni;
          vm.chartCx.dataFim = dtFim;
          vm.chartIm.dataIni = dtIni;
          vm.chartIm.dataFim = dtFim;          
        }

        function dadosChartMov() {
          switch(vm.chart.periodo){
            case 'hora':
              vm.chart.dataGr = "DATE_FORMAT(m.data,'%d %b %Y %H')";
              vm.chart.data = "DATE_FORMAT(m.data,'%d %b %H hr') as data";
              break;
            case 'dia':
              vm.chart.dataGr = "DATE_FORMAT(m.data,'%d %b %Y')";
              vm.chart.data = "DATE_FORMAT(m.data,'%d %b') as data";
              break;
            case 'semana':
              vm.chart.dataGr = "DATE_FORMAT(m.data,'%U %b %Y')";
              vm.chart.data = "DATE_FORMAT(m.data,'%U %b') as data";
              break;
            case 'mes':
              vm.chart.dataGr = "DATE_FORMAT(m.data,'%b %Y')";
              vm.chart.data = "DATE_FORMAT(m.data,'%b') as data";
              break;
            case 'ano':
              vm.chart.dataGr = "DATE_FORMAT(m.data,'%Y')";
              vm.chart.data = "DATE_FORMAT(m.data,'%Y') as data";
              break;

          }
          vm.chartlabel = [];
          vm.chartSeries = ['Vendas','Compras'];
          vm.chartData = [];
          var vendas = [], compras = [], dados = [];
          MovEstService.readDataChart(vm.chart).then(function(res){
            angular.forEach(res['reg'], function(value, key){
              if (!existe(value.data)) {
                vm.chartlabel.push(value.data);
              }
              dados.push(value);
            });
            for (var i = 0; i < vm.chartlabel.length; i++) {
              for (var x = 0; x < dados.length; x++) {
                if (vm.chartlabel[i] == dados[x].data) {
                  if (dados[x].tipo == 0) {
                    vendas[i] = dados[x].total;
                  } else {
                    compras[i] = dados[x].total;
                  }
                }
              }
              if (!vendas[i]) {vendas[i]=0;}
              if (!compras[i]) {compras[i]=0;}
            }
            vm.chartData.push(vendas);
            vm.chartData.push(compras);             

          });

        }

        function dadosChartIm() {
          vm.chartLabelIm = [];
          vm.chartSerieIm = ['Vendidos'];
          vm.chartDataIm = [];
          var dados = [];
          MovEstService.readDataImChart(vm.chartIm).then(function(res){
            angular.forEach(res['reg'], function(value, key){
              vm.chartLabelIm.push(value.descricao);
              dados.push(value.qt_vendido);
            });
            vm.chartDataIm.push(dados);
          });
        }

        function dadosChartCaixa() {
          vm.chartLabelCx = [];
          vm.chartDataCx = [];
          var entradas = [], saidas = [], dados = [];
          MovCaixaService.readDataChart(vm.chartCx).then(function(res){
            angular.forEach(res['reg'], function(value, key){
              if (value.tipo == 0) {
                vm.chartLabelCx.push('Entradas');
              } else {
                vm.chartLabelCx.push('Saidas');
              }
              vm.chartDataCx.push(value.valor);
            });
            var entradas = false,saidas = false;
            for (var i = 0; i < vm.chartLabelCx.length; i++) {
              if (vm.chartLabelCx[i]=='Entradas') {entradas=true}
              if (vm.chartLabelCx[i]=='Saidas') {saidas=true}
            }
            if (!entradas) {
              vm.chartLabelCx.push('Entradas');
              vm.chartDataCx.push(0);
            }
            if (!saidas) {
              vm.chartLabelCx.push('Saidas');
              vm.chartDataCx.push(0);
            }
          });
        }

        function existe(index) {
          var x = false;
          for (var i = 0; i < vm.chartlabel.length; i++) {
            if (vm.chartlabel[i] == index) {
              return true;
            }
          }
          return x;
        }

    }
})();
