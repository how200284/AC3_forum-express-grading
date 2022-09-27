const { Restaurant, Category } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const restController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
          // The sever will process Ternary operator, and then spread operator.
          // The reason we have to put spread operator ahead is that categoryId and {} are OBJECT, but what we need to put inside "where: { }" is a STRING.
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        // Will proceed req.user?.FavoritedRestaurants first to make user the object "req.user" exist, and then do the ternary operator behind.
        const likedRestaurantId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        // Same here, will proceed req.user?.LikedRestaurants first to make user the object "req.user" exist, and then do the ternary operator behind.
        const data = restaurant.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantId.includes(r.id)
        }))
        return res.json({
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurant.count)
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restController
