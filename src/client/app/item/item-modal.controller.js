(function(){
    'use strict';

    angular
        .module('app.item')
        .controller('ItemModalController', ItemModalController);
    ItemModalController.$inject = ['Item', '$modalInstance', '$scope', '$modal', 'config', 'ItemService'];
    /* @ngInject */
    function ItemModalController(Item, $modalInstance, $scope, $modal, config, ItemService) {
        var vm = this;
        vm.title = 'Cadastro Item';
        vm.urlImagem = config.urlImagem;
        vm.item = Item;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.selectImagem = selectImagem;

        function selectImagem () {
            var modalInstance = $modal.open({
              templateUrl: 'app/galeria/galeria-select.html',
              controller: 'GaleriaModalController',
              controllerAs: 'vm',
              size: 'lg',
              backdrop:true
              });              
            
            modalInstance.result.then(function (img) {
                vm.item.id_galeria = img.id_galeria;
                vm.item.imagem = img.imagem;
            });
        }

        function ok(data) {
            $modalInstance.close(data);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();