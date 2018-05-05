const router = (app) => {
  app.get('/', (req, res) => res.render('home'));
};

module.exports = router;
