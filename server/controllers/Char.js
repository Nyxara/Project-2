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
  // gets components of charSchema and makes them usable by rest of code
  if (!req.body.name || !req.body.level || !req.body.class) {
    return res.status(400).json({ error: 'All fields are required' }); // writes error message
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
      return res.status(400).json({ error: 'Character already exists.' }); // writes error message
    }

    return res.status(400).json({ error: 'An error occurred.' }); // writes error message
  });

  return charPromise;
};

const getChars = (request, response) => { // allows for retrieval of characters
  const req = request;
  const res = response;

  return Char.CharModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' }); // writes error message
    }
    return res.json({ chars: docs });
  });
};

/* const getRef = () => {   //supposed to let you go to the ref sheet links, but it never worked
  const URL = ref;

  term = encodeURIComponent(term.trim());
  if (term.length < 2) return;

  const url = `${URL}`;

  const xhr = new XMLHttpRequest();

  xhr.onerror = (e) => console.log('XHR error');

  xhr.onload = (e) => {
    const jsonString = e.target.response;
    const json = JSON.parse(jsonString);

    // TODO
    // update `results` array an the UI
  }; // end xhr.onload

  xhr.open('GET', url);
  xhr.send();
}; */

module.exports.makerPage = makerPage;
module.exports.getChars = getChars;
module.exports.make = makeChar;
// module.exports.getRef = getRef;
