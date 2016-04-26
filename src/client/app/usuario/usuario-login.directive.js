(function() {
    'use strict';
    angular
        .module('app.usuario')
        .directive('usuarioLogin', usuarioLogin);
    usuarioLogin.$inject = ['DataserviseProvider','dataservice', 'logger', '$cookies', 'config'];
    /* @ngInject */
    function usuarioLogin (DataserviseProvider, dataservice, logger, $cookies, config) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: LoginController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'usuario': '=',
                'navline': '=',
                'logado' : '='
            },            
            templateUrl: 'app/usuario/login.html'
        };


	    /* @ngInject */
	    function LoginController () {
	    	var vm = this;
            vm.logar = logar;
            vm.appTitulo = config.appTitle;
            vm.appSubTitulo = config.appSubtitle;
            var consulta = '';
            var servico = 'consulta';
            var msgErro = 'Falha na Consulta do Usuario.';
            var dataset = DataserviseProvider.getPrmWebService();

            activate();

            function activate() {
                prmWeb();
                existeUserLogado();
            }

            function logar () {
                vm.busyMessage = 'Aguarde ...';
                vm.isBusy = true;
                if (consulta == '') {
                    consulta = " and email = '"+vm.usuario.login+"' and senha = '"+vm.usuario.senha+"'";
                };
                DataserviseProvider.setDataset(dataset,'consulta',consulta);
                dataservice.dadosWeb(dataset,servico,msgErro).then(function (data) {
                    if (data) {
                        if (data['reg'].length!==0) {//verifica se achou usuario
                            if (data['reg'][0].status == 1){ //usuario esta ativo
                                setUserLogado(data['reg'][0].nome,data['reg'][0].id_usuario,data['reg'][0].id_emp);
                                DataserviseProvider.indexGeral.id_usuario = data['reg'][0].id_usuario;
                                DataserviseProvider.indexGeral.id_emp = data['reg'][0].id_emp;
                                vm.usuario = data['reg'][0];
                            } else {
                                logger.info('Descupe! seu cadastro está desativado, Entre em contato com o administrador.');
                            }
                        } else {
                            logger.warning("Usuário ou senha inválidos.");
                        }
                    } else {
                        logger.error('O servidor não retornou os dados solicitado.');
                    }
                });
            }  

            function prmWeb() {          
                DataserviseProvider.setDataset(dataset,'id_index_main','1');
                DataserviseProvider.setDataset(dataset,'valor_id_main','1');
                DataserviseProvider.setDataset(dataset,'modulo','usuarios');
                DataserviseProvider.setDataset(dataset,'id_tabela','id_usuario');              
            } 

            function existeUserLogado () {
                if (getUserLogado('idUser')) {
                    consulta = " and id_usuario = "+getUserLogado('idUser');
                    logar();
                    return true;
                } else {
                    return false;
                }
            } 

            function setUserLogado (nome,id,id_emp) {
                $cookies['nomeUser'] = nome;
                $cookies['idUser'] = id;
                $cookies['idEmp'] = id_emp;
                vm.logado = true;
            }

            function getUserLogado (prm) {
                 return $cookies[prm];
            }
           
	    }  
	          
        return directive;
    }

})();