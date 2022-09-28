const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userController = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('This email had already signed up!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(registeredUser => cb(null, { registeredUser }))
      .catch(err => cb(err))
  }
}

module.exports = userController
