/*
 NO_NAME Code inside

    Ranset M. Velázquez
    Osmani Bravo Morell
    Stephan Herrera

 EGREX, Derechos del Equipo de ISW II
 */

const express = require("express");
const { engine } = require("express-handlebars");
const session = require('express-session');
const bodyParser = require("body-parser");
const path = require('path');
//const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const auth_controller = require('./controllers/auth_controller');
const desemp_lab_controller = require('./controllers/desemp_lab_controller');
const ubic_lab_controller = require('./controllers/ubic_lab_controller');
const db = new sqlite3.Database('./src/db/egrex.sqlite');
const router = express.Router();
const app = express();

// Configuración de multer para guardar el archivo en el servidor
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/public/upload/informes');
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            // Utilizar el valor del input con el nombre del archivo
            const fileName = 'plantilla_' + req.body.a_userid + ext;
            cb(null, fileName);
        }
    })
});

app.set('port', 4000);
app.set('views', __dirname + '/views');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configurar sqlite para usarlo en toda la app si no se utiliza MySQL
global.db = db;

app.listen(app.get('port'), () => {
    console.log('Ejecutando en la dirección http://localhost:4000');
});

router.get('/', auth_controller.logout);
router.get('/logout', auth_controller.logout);
router.post('/access', auth_controller.master_auth);

router.get('/profesor_principal', ubic_lab_controller.getPP_PrincipalHome);
router.get('/profesor_principal_asignar', ubic_lab_controller.getPP_AsignarHome);
router.get('/profesor_principal_inconformidades', ubic_lab_controller.getPP_InconfHome);
router.post('/profesor_principal_asignar', ubic_lab_controller.PP_save);
router.post('/profesor_principal_inconformidades', ubic_lab_controller.PP_save_inconf);

router.get('/estudiante_graduado', ubic_lab_controller.getEST_PrincipalHome);
router.get('/estudiante_graduado_asignar', ubic_lab_controller.getEST_AsignarHome);
router.post('/estudiante_graduado_asignar', ubic_lab_controller.EST_save);

router.get('/asesor', desemp_lab_controller.asesor);
router.get('/asesor_evaluar', desemp_lab_controller.asesor_pr);
router.post('/asesor_evaluar', upload.single('archivoPDF'), desemp_lab_controller.asesor_pr_save);

router.get('/decano', ubic_lab_controller.getDEC_PrincipalHome);
router.get('/decano_asignar', ubic_lab_controller.getDEC_AsignarHome);
router.get('/decano_evaluar', desemp_lab_controller.dec_desemp);

//router.get('*', auth_controller.logout);

app.use('/', router);

module.exports = app;