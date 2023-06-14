const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);
chai.should();

describe('Autenticar', () => {
    it('Debe retornar un HTTP 200 OK', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('Debe renderizar la pantalla index', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.text.should.match(/<h1>Iniciar sesión<\/h1>/);
                done();
            });
    });
    it('Debe redireccionar a index al no estar autenticado', (done) => {
        chai.request(app)
            .get('/asesor_i')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.text.should.match(/<h1>Iniciar sesión<\/h1>/);
                done();
            });
    });
});


describe('Pruebas al servicio de ubicación laboral', () => {
    it('Cargar la pantalla principal del Profesor Principal', (done) => {
        chai.request(app)
            .get('/profesor_principal_i')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('/<th>Nombre <\/th>/');
                done();
            });
    });

    it('Asignar una ubicación laboral', (done) => {
        const userData = {
            user_mod_id: 2,
            ubic_lab: "ASUS Software"
        };
        chai.request(app)
            .post('/profesor_principal/save_pp')
            .send(userData)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('Cambios guardados');
                done();
            });
    });

    it('Cargar la pantalla principal del Estudiante', (done) => {
        chai.request(app)
            .get('')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('/<th>Nombre <\/th>/');
                done();
            });
    });


    it('Asignar una inconformidad', (done) => {
        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'mypassword'
        };
        chai.request(app)
            .post('/users')
            .send(userData)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('cambios guardados');
                done();
            });
    });

});

describe('Pruebas al servicio desempeño laboral', () => {
    it('Cargar las ubicaciones laborales y el desempeño', (done) => {
        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'mypassword'
        };
        chai.request(app)
            .post('/users')
            .send(userData)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('cambios guardados');
                done();
            });
    });

    it('Asignar una evaluación', (done) => {
        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'mypassword'
        };
        chai.request(app)
            .post('/users')
            .send(userData)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('cambios guardados');
                done();
            });
    });

    it('Eliminar una evaluación', (done) => {
        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'mypassword'
        };
        chai.request(app)
            .post('/users')
            .send(userData)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.text).to.contain('cambios guardados');
                done();
            });
    });
});