module.exports = function (app, http, db) {
    var utils = require('../app/lib/utils')(db);
    function routeController(name, other) {
	    return require('../app/controllers/'+name)(db, utils, other);
    }
    var u = routeController('user');
    var loc = routeController('location');
    // users
    // // app.get("/");
    app.post('/user', utils.body('email password first_name'), utils.validPass, u.create);
    app.post('/:role(client|admin)/login', utils.body('email password'), utils.deauth, u.login);
    app.post('/user/logout', utils.deauth, u.logout);
    app.put('/user/password', utils.auth, utils.validPass, u.password);
    app.get('/user/auth', u.auth);
    app.get('/user/:role(client|trainer|admin)s', utils.auth,u.list);
    app.get('/user/:id([0-9a-f]+)', utils.auth ,u.show);
    app.delete('/user', utils.body('password'), utils.auth, u.delete);

    app.post('/loc', utils.auth, utils.validLoc ,loc.create);
    app.post('/locs', utils.auth, loc.createAll);
    
    app.put('/loc/:id([0-9a-f]+)', utils.auth, loc.update);

    app.get('/:id([0-9a-f]+)/locs', utils.auth, loc.list);
    app.get('/locs', utils.auth, loc.list);
    app.get('/loc', utils.auth, loc.byLastUpdated);
    app.get('/loc/last', utils.auth, loc.byLastUpdated);
    app.get('/loc/:id([0-9a-f]+)', utils.auth, loc.show);
    // catch-all
    //app.get('*', function (req, res) { res.status(404).json({ error:'Invalid GET request' }) });
    app.post('*', function (req, res) { res.status(404).json({ error:'Invalid POST request' }) });
    app.delete('*', function (req, res) { res.status(404).json({ error:'Invalid DELETE request' }) });
};
