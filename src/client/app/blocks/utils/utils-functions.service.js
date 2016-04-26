(function() {
    'use strict';
    angular
        .module('blocks.utils')
        .factory('UtilsFunctions', UtilsFunctions);
    UtilsFunctions.$inject = [];
    /* @ngInject */
    function UtilsFunctions() {
        var service = {
            formatData: formatData,
            removeCamposInvalidos:removeCamposInvalidos
        };
        return service;
        ////////////////
        function formatData (data, hora) {
            var d, m, y,hr, dt;
            hr = hora;
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            dt = y+'-'+m+'-'+d+' '+hr;  
            return dt;              
        }

        function removeCamposInvalidos (dados,camposInv) {
          for (var i = 0; i < camposInv.length; i++) {
            delete dados[camposInv[i]];
          };
          return dados;
        }        
    }
})();