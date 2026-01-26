const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator');
const { getNews, getNewsById, deleteNews, createNews, updateNews } = require('./database');
const { upload } = require('./middleware');
const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    const news = await getNews();

    res.render('index', {
        title: 'Avaleht',
        news: news,
        msg: req.query.msg
    });
});

// -------------------------------------------
// Uudise kustutamine
app.post('/news/delete', async (req, res) => {
    const { id } = req.body;

    // loeme enne kustutamist uudise
    const news = await getNewsById(id);

    // kustutame pildi, kui see on olemas
    if (news && news.image)
        fs.unlinkSync(path.join('uploads', news.image));

    const deleted = await deleteNews(id);

    if (deleted)
        res.redirect('/?msg=deleted');
    else
        res.redirect('/?msg=delete_failed');
});

app.get('/news/delete/:id', async (req, res) => {
    const id = req.params.id;
    await deleteNews(id);
    res.redirect('/');
});

// -------------------------------------------
app.get('/search', async (req, res) => {
    res.redirect('/news/' + req.query.q);
});

// -------------------------------------------
app.get('/news/create', (req, res) => {
    res.render('news_create', {title: 'Lisa uudis', errors: [], values: {}});
});

// Uudise lisamine
app.post(
'/news/create',

//andmete valideerimine
upload.single('image'),
body('title').trim().notEmpty().withMessage('Pealkiri on kohustuslik'),
body('content').trim().notEmpty().withMessage('Sisu on kohustuslik'),

async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        // kui fail juba salvestati, kustutame selle
        if (req.file)
        {
            fs.unlinkSync(path.join('uploads', req.file.filename));
        }

        return res.render('news_create', {
            title: 'Lisa uudis',
            errors: errors.array(),
            values: req.body
        });
    }

    const { title, content } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    await createNews(title, content, imagePath);
    res.redirect('/');
});

// -------------------------------------------
app.get('/news/:id/edit', async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);
    res.render('edit', {
        title: 'Muuda uudist',
        errors: [],
        values: {},
        news
    });
});

app.post(
    '/news/:id/edit',
    upload.single('image'),

    body('title').trim().notEmpty().withMessage('Pealkiri on kohustuslik'),
    body('content').trim().notEmpty().withMessage('Sisu on kohustuslik'),

    async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const news = await getNewsById(id);

        if (!errors.isEmpty())
        {
            // kui uus pilt juba salvestati, kustutame selle
            if (req.file)
            {
                fs.unlinkSync(path.join('uploads', req.file.filename));
            }

            return res.render('edit', {
                title: 'Muuda uudist',
                errors: errors.array(),
                values: req.body,
                news: news
            });
        }

        let image = news.image;
        const filePath = news.image ? path.join('uploads', news.image) : null;

        if (req.file)
        {
            // uus pilt lisati
            if (filePath && fs.existsSync(filePath))
                fs.unlinkSync(filePath);

            image = req.file.filename;
        }
        else
        {
            // uut pilti ei lisatud, aga vana on kadunud
            if (filePath && !fs.existsSync(filePath))
                image = null;
        }

        const { title, content } = req.body;
        await updateNews(id, title, content, image);

        res.redirect(`/news/${id}`);
    }
);

// -------------------------------------------
app.get('/news/:id', async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);
    if (!news)
    {
        res.redirect('/404');
        return;
    }

    res.render('news', {
        title: news.title,
        image: news.image,
        news
    });
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Lehte ei leitud' });
});

app.listen(3000);