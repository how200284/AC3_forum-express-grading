const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()

    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    const urlUserId = Number(req.params.id)
    if (helpers.getUser(req).id === urlUserId) return next()

    res.redirect(`/users/${urlUserId}`)
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
