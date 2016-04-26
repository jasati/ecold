(function () {
    'use strict';

    angular
        .module('app.item')
        .controller('ItemController', ItemController);

    ItemController.$inject = ['$q', '$modal', 'logger', 'ItemService', 'routerHelper'];
    /* @ngInject */
    function ItemController($q, $modal, logger, ItemService, routerHelper) {
        var vm = this;

        vm.title = 'Item';
        vm.itens = [];
        vm.consulta = {descricao:"",status:"", codigo:""}
        
        vm.getItem = getItem;
        vm.editItem = editItem;
        vm.newItem = newItem;
        vm.deleteItem = deleteItem;
        vm.setPage = setPage;
        vm.optionConsulta = [
                {valor:"0",desc:"Inativo"},
                {valor:"1",desc:"Ativo"}
        ];
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
            var promises = [ItemService.startDataset(), getItem()];
            return $q.all(promises).then(function() {
                logger.info('Janela Item Ativada');
            });            
            
        }

        function getItem() {
            ItemService.read(vm.consulta,getLimite()).then(function(data){
              vm.itens = data['reg'];
              vm.totalReg = data['qtde'];              
            });            
        } 

         function newItem() {
            var item = {};
            item.id_emp = 0;
            var modalInstance = $modal.open({
              templateUrl: 'app/item/item-cadastro.html',
              controller: 'ItemModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Item: function () {
                  return item;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
              ItemService.create(save).then(function(data){
                getItem();
              })
            });
        }   

         function editItem(index) {
            var modalInstance = $modal.open({
              templateUrl: 'app/item/item-cadastro.html',
              controller: 'ItemModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Item: function () {
                  return index;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
              ItemService.update(save).then(function(data){

              })
            });
        }


         function deleteItem(index) {
            var modalInstance = $modal.open({
              templateUrl: 'delete.html',
              controller: 'ItemModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:true,
              resolve: {
                Item: function () {
                  return index;
                }
              }              
            });
            
            modalInstance.result.then(function (del) {
              ItemService.deletar(del).then(function(data){
                getItem();
              })
            });
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
