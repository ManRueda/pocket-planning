var planning = require('../middleware/planning');

module.exports = function(app) {

  app.get('/planning', function(req, res) {
    res.redirect('/planning/create');
  });

  app.get('/planning/create', function(req, res) {
    res.render('planning/create');
  });

  app.post('/planning/create', function(req, res) {
    var plan = planning.create({
      type: req.body.type,
      msg: req.body.name,
      creator: req.session.uuid
    });
    res.redirect('/planning/' + plan.uuid);
  });

  app.get('/planning/:id', function(req, res) {
    var plan = planning.get(req.params.id);
    if (!plan){
      //TODO: go to 404
    }
    res.render('planning/planning', {
      planning: plan,
      isCreator: plan.creator === req.session.uuid
    });
  });
}
