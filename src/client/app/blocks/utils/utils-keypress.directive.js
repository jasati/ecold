// (function() {
//     'use strict';
//     angular
//         .module('blocks.utils')
//         .directive('dlEnterKey', dlEnterKey);
//     dlEnterKey.$inject = [];
//     /* @ngInject */
//     function dlEnterKey () {
//         var directive = {
//             link: link
//         };
//         return directive;
//         function link(scope, element, attrs) {
// 	        element.bind("keydown keypress", function(event) {
// 	            var keyCode = event.which || event.keyCode;

// 	            // If enter key is pressed
// 	            if (keyCode === 13) {
// 	                scope.$apply(function() {
// 	                        // Evaluate the expression
// 	                    scope.$eval(attrs.dlEnterKey);
// 	                });

// 	                event.preventDefault();
// 	            }
// 	        });
//         }
//     }

// })();


angular.module("blocks.utils").directive('dlEnterKey', function() {
    return function(scope, element, attrs) {

        element.bind("keydown keypress", function(event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {
                scope.$apply(function() {
                        // Evaluate the expression
                    scope.$eval(attrs.dlEnterKey);
                });

                event.preventDefault();
            }
        });
    };
});