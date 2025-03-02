const express = require('express')
const app = express()
const port = 3000

// Static
app.use(express.static(__dirname + "/public/"));

// Set Views
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

// Routes
app.get('', (req, res) => {
    res.render('3Dmap');
});
app.get('/index', (req, res) => {
    res.render('index');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/black', (req, res) => {
    res.render('black');
});
app.get('/navy', (req, res) => {
    res.render('navy');
});
app.get('/orange', (req, res) => {
    res.render('orange');
});
app.get('/pink', (req, res) => {
    res.render('pink');
});
app.get('/turquoise', (req, res) => {
    res.render('turquoise');
});
app.get('/3Dmap', (req, res) => {
    res.render('3Dmap');
});
app.get('/navy/3dBuilding_H', (req, res) => {
    res.render('3d_views/3dBuilding_H');
});
app.get('/green/3dBuilding_AG', (req, res) => {
    res.render('3d_views/3dBuilding_AG');
});
app.get('/black/3dBuilding_M', (req, res) => {
    res.render('3d_views/3dBuilding_M');
});
app.get('/turquoise/3dBuilding_I', (req, res) => {
    res.render('3d_views/3dBuilding_I');
});
app.get('/orange/3dBuilding_IA', (req, res) => {
    res.render('3d_views/3dBuilding_IA');
});

// Listen
app.listen(port, () => console.info(`Listening on port ${port}`));
