function renderPP(req, res) {
    res.render('pp', {
        title: 'Pantalla Principal',
        user: req.session.user
    });
}

function renderPP_AsignarHome(req, res) {
    db.all("SELECT * FROM `user` left join ubicacion_laboral USING(userid) where rol='Estudiante'", (error, table) => {
        if (error) console.log(error);
        table.forEach(function(dato) {
            if (dato.ubicacion_laboral == null) {
                dato.ubicacion_laboral = 'No asignada';
                dato.inconforme = 'No';
                dato.planilla_firmada = 'No';
            }
        });
        db.all("select distinct ubicacion_laboral from ubicacion_laboral where not ubicacion_laboral = 'No asignada' ", (error, ubic_fields) => {
            if (error) console.log(error);
            res.render('pp_asignar', {
                title: 'Asignar ubicaciones laborales',
                user: req.session.user,
                table: table,
                ubicaciones: ubic_fields,
            });
        });
    });
}

function renderPP_InconfHome(req, res) {

    db.all("SELECT * FROM `user` join ubicacion_laboral USING(userid) right join inconformidad using (userid) where rol='Estudiante'", (error, table) => {
        if (error) throw error;
        res.render('pp_inconf', {
            title: 'Consultar inconformidades de los egresados',
            user: req.session.user,
            table: table
        });

    });
}

function PP_save(req, res) {
    let ubic_lab = req.body.ubic_lab;
    let id = req.body.user_mod_id;
    if (ubic_lab && id) {
        db.all('SELECT * from ubicacion_laboral where userid = ? ', [id], (err, rows) => {
            if (err) {
                console.log(err);
            } else if (rows.length > 0) {
                db.run("UPDATE ubicacion_laboral SET ubicacion_laboral = ?  where userid = ? ", [ubic_lab, id], (err) => {
                    if (err) {
                        console.log(err);
                    } else { showDialog(res, false, '/profesor_principal_asignar'); }
                });
            } else {
                db.run("INSERT into ubicacion_laboral values ( ? , ? , 'No', 'No') ", [id, ubic_lab], (err) => {
                    if (err) {
                        console.log(err);
                    } else { showDialog(res, false, '/profesor_principal_asignar'); }
                });

            }
            if (ubic_lab === 'No asignada') {
                db.run("DELETE from inconformidad where userid = ? ", [id], (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                db.run("UPDATE ubicacion_laboral SET inconforme = 'No' where userid = ? ", [id], (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });

    } else {
        res.redirect('/profesor_principal_asignar');
    }
}

function PP_save_inconf(req, res) {
    let fields = req.body;
    if (fields.respuesta) {
        db.run("UPDATE inconformidad SET respuesta = ?, nombre_profesor = ?, respondida = 'Si'  where userid = ?", [fields.respuesta, fields.nombre_profesor, fields.userid], (err) => {
            if (err) {
                console.log(err);
                showDialog(res, true, '/profesor_principal_inconformidades');
            } else { showDialog(res, false, '/profesor_principal_inconformidades'); }
        });
    } else { res.redirect('/profesor_principal_inconformidades'); }
}

//para est
function renderEST_PrincipalHome(req, res) {
    res.render('est', {
        title: 'Inicio',
        user: req.session.user
    });
}

function renderEST_AsignarHome(req, res) {

    db.all("SELECT nombre, apellidos, ubicacion_laboral, inconforme from user left join ubicacion_laboral using(userid) where userid = ? LIMIT 1", [req.session.user.user_session_id], (err, table) => {
        if (err) {
            console.log(err);
        } else {
            table.forEach(function(dato) {
                if (dato.ubicacion_laboral == null) {
                    dato.ubicacion_laboral = 'No asignada';
                    dato.inconforme = 'No';
                }
            });
            db.all("SELECT * from user rigth join inconformidad using(userid) where userid = ? LIMIT 1", [req.session.user.user_session_id], (err, inconformidad) => {
                if (err) {
                    console.log(err);
                } else {
                    let respuesta = false;
                    let redactada = false;
                    if (inconformidad.length > 0) {
                        redactada = true;
                        if (inconformidad[0].respondida === 'Si') { respuesta = true; }
                    }
                    res.render('est_principal', {
                        title: 'Gestionar mi ubicación laboral',
                        user: req.session.user,
                        table: table,
                        inconformidad: inconformidad,
                        respuesta: respuesta,
                        redactada: !redactada,
                        non_redactada: redactada
                    });
                }
            });
        }
    });
}

function EST_save(req, res) {
    let fields = req.body;
    if (fields) {
        db.run("insert into inconformidad values ( ? , ? , 'No', '', '' ) ", [fields.userid, fields.inconformidad], (err) => {
            if (err) {
                console.log(err);
                showDialog(res, true, '/estudiante_graduado_asignar');
            } else {
                db.run("update ubicacion_laboral SET inconforme = 'Si' where userid = ?", [fields.userid], (err, table) => {
                    if (err) {
                        console.log(err);
                        showDialog(res, true, '/estudiante_graduado_asignar');
                    } else { showDialog(res, false, '/estudiante_graduado_asignar'); }
                });
            }
        });
    } else { res.redirect('/profesor_principal_inconformidades'); }
}

//decano
function renderDEC_PrincipalHome(req, res) {
    res.render('dec', {
        title: 'Pantalla Principal',
        user: req.session.user,
    });
}

function renderDEC_AsignarHome(req, res) {
    db.all("SELECT * FROM `user` left join ubicacion_laboral USING(userid) left join inconformidad using (userid) where rol='Estudiante'", (error, table, fields) => {
        if (error) {
            throw error;
        } else {
            table.forEach(function(dato) {
                if (dato.ubicacion_laboral == null) {
                    dato.ubicacion_laboral = 'No asignada';
                    dato.inconforme = 'No';
                }
            });
            res.render('dec_ubic_lab', {
                title: 'Análisis de ubicaciones laborales',
                user: req.session.user,
                table: table
            });
        }
    });
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
    renderPP,
    renderPP_InconfHome,
    renderPP_AsignarHome,
    PP_save,
    PP_save_inconf,

    renderDEC_PrincipalHome,
    renderDEC_AsignarHome,

    renderEST_PrincipalHome,
    renderEST_AsignarHome,
    EST_save
}