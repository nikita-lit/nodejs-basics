var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
const schema = mongoose.Schema;

const userDataSchema = new schema({
    title: { type: String, required: true },
    content: String,
    author: String,
})

const userData = mongoose.model('UserData', userDataSchema, 'user-data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello World!', condition: true, anyArray: [1, 2, 3] });
});

router.get('/get-data', async function(req, res, next) {
    try
    {
        const result = await userData.find().lean();
        res.render('index', { items: result });
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/insert', async function(req, res, next) {
    try
    {
        const user = new userData({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });

        await user.save();
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
        await userData.findByIdAndUpdate(req.body.id, {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });

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
        await userData.findByIdAndDelete(req.body.id);
        res.redirect('/get-data');
    }
    catch (err)
    {
        next(err);
    }
});

module.exports = router;
