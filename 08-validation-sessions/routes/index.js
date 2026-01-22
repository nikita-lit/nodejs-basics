var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Form Validation', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});

router.post('/submit', [
  check('email', 'Invalid email address').isEmail(),
  check('password', 'Password must be at least 4 characters').isLength({ min: 4 }),
  check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password)
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    // save errors in session
    req.session.errors = errors.array();
    req.session.success = false;
  }
  else
    req.session.success = true;

  return res.redirect('/');
});

module.exports = router;
