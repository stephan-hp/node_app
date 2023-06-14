const auth_service = require('../models/auth_service');

async function master_auth(req, res) {
    await auth_service.authenticate(req, res);
}

function logout(req, res, next) {
    auth_service.logout(req, res, next);
}

module.exports = {
    master_auth: master_auth,
    logout: logout
}