var filters = require('../lib/filters');

/**
 * Actions
 */
exports = module.exports = {

  // Landing page
  index: [
    filters.require_user,
    function(req, res, next) {
      res.render('stacks/index');
    }
  ]
  
};
