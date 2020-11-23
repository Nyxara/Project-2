const models = require('../models');

const { Char } = models;

const makerPage = (req, res) => {
  Char.CharModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), chars: docs });
  });
  // res.render('app');
};

const makeChar = (req, res) => {
  if (!req.body.name || !req.body.level || !req.body.class) {
    return res.status(400).json({ error: 'RAWR X3 || Both name, level, and class are required UwU' });
  }

  const charData = {
    name: req.body.name,
    level: req.body.level,
    class: req.body.class,
    owner: req.session.account._id,
    race: req.body.race,
    ref: req.body.ref,
  };

  const newChar = new Char.CharModel(charData);

  const charPromise = newChar.save();

  charPromise.then(() => res.json({ redirect: '/maker' }));

  charPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Character already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return charPromise;
};

const getChars = (request, response) => {
  const req = request;
  const res = response;

  return Char.CharModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ chars: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getChars = getChars;
module.exports.make = makeChar;
