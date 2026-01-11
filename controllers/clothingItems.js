const ClothingItem = require('../models/clothingItem');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// ================================
// GET /items — public
// ================================
module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

// ================================
// POST /items — protected
// ================================
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
        return next(new BadRequestError('Invalid item data'));
      }
      return next(err);
    });
};

// ================================
// DELETE /items/:itemId — protected
// Only owner can delete
// ================================
module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError('Item not found'))
    .then((item) => {
      if (String(item.owner) !== String(req.user._id)) {
        throw new ForbiddenError('You do not have permission to delete this item');
      }

      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: 'Item deleted' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID format'));
      }
      return next(err);
    });
};

// ================================
// PUT /items/:itemId/likes — protected
// ================================
module.exports.likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Item not found'))
    .then((updatedItem) => res.status(200).send(updatedItem))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID format'));
      }
      return next(err);
    });
};

// ================================
// DELETE /items/:itemId/likes — protected
// ================================
module.exports.dislikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Item not found'))
    .then((updatedItem) => res.status(200).send(updatedItem))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID format'));
      }
      return next(err);
    });
};
