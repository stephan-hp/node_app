const desemp_lab_service = require('../models/desemp_lab_service');

function dec_desemp(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Decano') {
        desemp_lab_service.dec_desemp(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

//asesor

function asesor(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Asesor') {
        desemp_lab_service.asesor(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }

}

function asesor_pr(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Asesor') {
        desemp_lab_service.asesor_pr(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }

}

function asesor_pr_save(req, res) {
    if (req.session.loggedin && req.session.user['rol'] == 'Asesor') {
        desemp_lab_service.asesor_pr_save(req, res);
    } else {
        // Not logged in
        res.redirect('/logout');
    }
}

module.exports = {

    dec_desemp,

    asesor,
    asesor_pr,
    asesor_pr_save
}