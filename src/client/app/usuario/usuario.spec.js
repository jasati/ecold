/* jshint -W117, -W030 */
describe('UsuarioController', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.usuario');
        bard.inject('$controller', '$log', '$rootScope');
    });

    beforeEach(function () {
        controller = $controller('UsuarioController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Usuario controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Usuario', function() {
                expect(controller.title).to.equal('Usuario');
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });
        });
    });
});
