const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

/* const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
}; */

const logout = (req, res) => { // allows user to log out
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => { // allows user to login
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' }); // writes error message
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' }); // writes error message
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => { // allows the users to sign in,
// but I don't think the error things work
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' }); // writes error message
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' }); // writes error message
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' }); // writes error message
      }

      return res.status(400).json({ error: 'An error occurred' }); // writes error message
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const getUsers = (request, response) => {
  const req = request;
  const res = response;

  // res.json([{ username: 'bob', createdDate: '3/22/2000' }]);
  return Account.AccountModel.findAll((err, docs) => {
    // actually gets all users from the AccountModel
    console.log(req.session.account._id);
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' }); // writes error message
    }
    return res.json({ users: docs });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.getUsers = getUsers;
