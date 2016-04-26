(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger', '$cookies'];
    /* @ngInject */
    function ShellController($rootScope, $timeout, config, logger, $cookies) {
        var vm = this;
        vm.busyMessage = 'Aguarde ...';
        vm.isBusy = true;
        vm.logado = false;
        vm.usuario = {
            login : '',
            senha : '',
            nome : ''
        };

        $rootScope.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Created by Jasati',
        };

        activate();

        function activate() {
            logger.success(config.appTitle + 'Carregado!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                $rootScope.showSplash = false;
            }, 1000);
        }
       

    }
})();
