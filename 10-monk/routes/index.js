var express = require('express');
var router = express.Router();
const db = require('monk')('localhost:27017/test');
const userData = db.get('user-data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello World!', condition: true, anyArray: [1, 2, 3] });
});

router.get('/get-data', async function(req, res, next) {
    try
    {
        const docs = await userData.find({});
        res.render('index', { items: docs });
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/insert', async function(req, res, next) {
    try
    {
        await userData.insert(req.body);
        res.redirect('/get-data');
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/update', async function(req, res, next) {
    try
    {
        const { id, ...rest } = req.body;
        await userData.update({ _id: id }, { $set: rest });
        res.redirect('/get-data');
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/delete', async function(req, res, next) {
    try
    {
        await userData.remove({ _id: req.body.id });
        res.redirect('/get-data');
    }
    catch (err)
    {
        next(err);
    }
});

module.exports = router;
