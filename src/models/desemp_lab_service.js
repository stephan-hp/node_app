const path = require('path');
const fs = require('fs');

function dec_desemp(req, res) {
    db.all("SELECT * FROM `user` rigth join ubicacion_laboral USING(userid) left join desempeno_laboral USING(userid) where rol='Estudiante' and ubicacion_laboral <> 'No asignada' and not ubicacion_laboral is null", (error, table, fields) => {
        if (error) {
            console.log(error);
        } else {
            table.forEach(function(dato) {
                if (dato.evaluacion == null) {
                    dato.evaluacion = 'Ninguna';
                    dato.Informe = 'No archivado';
                }
            });
            res.render('dec_desemp', {
                title: 'Análisis del desempeño laboral de los egresados',
                user: req.session.user,
                table: table
            });
        }
    });
}

//Funciones del Asesor
function asesor(req, res) {
    res.render('asesor', {
        title: 'Pantalla Principal',
        user: req.session.user
    });
}

function asesor_pr(req, res) {
    db.all("SELECT * FROM `user` rigth join ubicacion_laboral USING(userid) left join desempeno_laboral USING(userid) where rol='Estudiante' and ubicacion_laboral <> 'No asignada' and not ubicacion_laboral is null", (error, table, fields) => {
        if (error) {
            console.log(error);
        } else {
            table.forEach(function(dato) {
                if (dato.evaluacion == null) {
                    dato.evaluacion = 'Ninguna';
                    dato.Informe = 'No archivado';
                }
            });
            res.render('asesor_pr', {
                title: 'Gestión del desempeño laboral de los egresados',
                user: req.session.user,
                table: table
            });
        }
    });
}

function asesor_pr_save(req, res) {
    let data = req.body;
    const archivoPDF = req.file;
    if (data) {
        if (data.delete === 'true') {
            db.all('SELECT * FROM desempeno_laboral where userid = ?', [data.userid], (error, table) => {
                if (error) {
                    console.log(error);
                } else {
                    if (table.length > 0) {
                        db.run("DELETE from desempeno_laboral where userid = ?", [data.userid], (error) => {
                            if (error) {
                                showDialog(res, true, '/asesor_evaluar');
                                console.log(error);
                            } else {
                                const filePath = path.join(__dirname, `../public/upload/informes/plantilla_${data.userid}.pdf`);
                                // Borra el archivo
                                fs.unlink(filePath, (err) => {
                                    if (err) {
                                        showDialog(res, true, '/asesor_evaluar');
                                        console.error(err);
                                        return;
                                    }
                                    showDialog(res, false, '/asesor_evaluar');
                                });
                            }
                        });
                    } else { showDialog(res, true, '/asesor_evaluar'); }
                }
            });
        } else {
            db.all('SELECT * FROM desempeno_laboral where userid = ?', [data.userid], (error, table) => {
                if (error) {
                    console.log(error);
                } else {
                    if (table.length > 0) {
                        db.run("UPDATE desempeno_laboral SET evaluacion = ?, informe = 'Archivado' where userid = ?", [data.evaluacion, data.userid], (error) => {
                            if (error) {
                                showDialog(res, true, '/asesor_evaluar');
                                console.log(error);
                            } else {
                                //fs.renameSync(archivoPDF.path, `../public/upload/informes/plantilla_${data.userid}.pdf`);
                                showDialog(res, false, '/asesor_evaluar');
                            }
                        });
                    } else {
                        db.run("INSERT into desempeno_laboral VALUES(? , ? , 'Archivado')", [data.userid, data.evaluacion], (error) => {
                            if (error) {
                                showDialog(res, true, '/asesor_evaluar');
                                console.log(error);
                            } else {
                                //fs.renameSync(archivoPDF.path, `src/public/uploads/informes/plantilla_${data.userid}.pdf`);
                                showDialog(res, false, '/asesor_evaluar');
                            }
                        });
                    }
                }
            });
        }
    } else {
        res.redirect('/asesor_evaluar');
    }
}

//Extra Alerts

function showDialog(res, Is_error, redirect_to) {
    if (!Is_error) {
        res.send(`
        <html> <head> <title>Guardando</title>
        <link rel="stylesheet" href="/css/sweetalert2.min.css">
        </head> <body> <script src="/js/sweetalert2.min.js"></script>
        <script>
        Swal.fire({
        title: 'Cambios guardados',
        text: '',
        icon: 'success',
        confirmButtonText: 'Aceptar'
            }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '` + redirect_to + `';
        }
    });
    </script> </body> </html> `);
    } else {
        res.send(`
        <html>  <head> <title>Guardando</title>
        <link rel="stylesheet" href="/css/sweetalert2.min.css">
        </head> <body>  <script src="/js/sweetalert2.min.js"></script>
        <script>
        Swal.fire({
        title: 'Se ha producido un error al guardar los cambios!',
        text: '',
        icon: 'error',
        confirmButtonText: 'Aceptar'
            }).then((result) => {
            if (result.isConfirmed) {
               window.location.href =  '` + redirect_to + `';
            }
        });
        </script>  </body> </html>  `);
    }
}

module.exports = {

    dec_desemp,

    asesor,
    asesor_pr,
    asesor_pr_save
}