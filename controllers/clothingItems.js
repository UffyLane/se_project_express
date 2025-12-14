const ClothingItem = require('../models/clothingItem');

// Custom Error Classes
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// =========================================
// GET /items — get all clothing items
// =========================================
module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

// =========================================
// POST /items — create new item
// =========================================
module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid clothing item data'));
      }
      return next(err);
    });
};

// =========================================
// DELETE /items/:itemId — delete item
// Only owner can delete
// =========================================
module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError('Item not found'))
    .then((item) => {
      if (String(item.owner) !== String(req.user._id)) {
        throw new ForbiddenError('You are not allowed to delete this item');
      }

      return item.deleteOne().then(() => {
        res.send({ message: 'Item deleted successfully' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID format'));
      }
      return next(err);
    });
};

// =========================================
// PUT /items/:itemId/likes — like an item
// =========================================
module.exports.likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Item not found'))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID format'));
      }
      return next(err);
    });
};

// =========================================
// DELETE /items/:itemId/likes — dislike item
// =========================================
module.exports.dislikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Item not found'))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID format'));
      }
      return next(err);
    });
};
