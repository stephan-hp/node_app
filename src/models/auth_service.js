const bcrypt = require('bcrypt');

async function authenticate(req, res) {
    let username = req.body.username;
    const passw = req.body.passw;
    if (username && passw) {
        db.all('SELECT userid as user_session_id, username, passw, nombre, apellidos, rol FROM user WHERE username = ? limit 1', [username], async function(error, results) {
            if (error) {
                throw error;
            }
            if (results.length > 0) {
                const hash = results[0]['passw'];
                bcrypt.compare(passw, hash, (err, result) => {
                    if (err) {
                        console.error(err);
                    } else {
                        if (!result) {
                            res.render('index', {
                                user_error: true
                            });
                        } else {
                            req.session.loggedin = true;
                            req.session.user = results[0];
                            if (results[0]['rol'] == 'Profesor Principal') res.redirect('/profesor_principal');
                            else if (results[0]['rol'] == 'Estudiante') res.redirect('/estudiante_graduado');
                            else if (results[0]['rol'] == 'Decano') res.redirect('/decano');
                            else if (results[0]['rol'] == 'Asesor') res.redirect('/asesor');
                            else res.render('index', {
                                user_error: true
                            });
                        }
                    }
                });
            } else {
                res.render('index', {
                    user_error: true
                });
            }
        });
    }
}

function logout(req, res, next) {
    req.session.user = null
    req.session.save(function(err) {
        if (err) next(err)
        req.session.regenerate(function(err) {
            if (err) next(err)
            res.render('index', {
                title: 'Iniciar sesión',
                user_error: false
            });
        })
    })
}


module.exports = {
    authenticate,
    logout
}