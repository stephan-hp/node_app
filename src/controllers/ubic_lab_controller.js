const ubic_lab_service = require('../models/ubic_lab_service');

//para pp
function getPP_PrincipalHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Profesor Principal') {
        ubic_lab_service.renderPP(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

function getPP_AsignarHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Profesor Principal') {
        ubic_lab_service.renderPP_AsignarHome(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

function PP_save(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Profesor Principal') {
        ubic_lab_service.PP_save(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

function PP_save_inconf(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Profesor Principal') {
        ubic_lab_service.PP_save_inconf(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

function getPP_InconfHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Profesor Principal') {
        ubic_lab_service.renderPP_InconfHome(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

//para est
function getEST_PrincipalHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Estudiante') {
        ubic_lab_service.renderEST_PrincipalHome(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

function getEST_AsignarHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Estudiante') {
        ubic_lab_service.renderEST_AsignarHome(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

function EST_save(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Estudiante') {
        ubic_lab_service.EST_save(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}


//decano
function getDEC_PrincipalHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Decano') {
        ubic_lab_service.renderDEC_PrincipalHome(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}


function getDEC_AsignarHome(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Decano') {
        ubic_lab_service.renderDEC_AsignarHome(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}


module.exports = {
    getPP_PrincipalHome,
    getPP_InconfHome,
    getPP_AsignarHome,
    PP_save,
    PP_save_inconf,

    getDEC_PrincipalHome,
    getDEC_AsignarHome,

    getEST_PrincipalHome,
    getEST_AsignarHome,
    EST_save
}