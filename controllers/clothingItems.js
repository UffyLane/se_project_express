

const ClothingItem = require('../models/clothingItem');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  FORBIDDEN,
} = require('../utils/errors');

// GET /items — return all clothing items
const getClothingItems = async (_req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch clothing items' });
  }
};

// POST /items — create a new clothing item
const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    const newItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,   // FIXED
    });

    return res.status(201).json(newItem);
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Invalid clothing item data' });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating clothing item' });
  }
};

// DELETE /items/:itemId — delete a clothing item
const deleteClothingItem = async (req, res) => {
  try {
    const { itemId } = req.params;  // FIXED

    const item = await ClothingItem.findById(itemId).orFail(() => {
      const error = new Error('Item not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    // Only owner can delete
    if (String(item.owner) !== String(req.user._id)) {  // FIXED
      return res
        .status(FORBIDDEN)
        .json({ message: 'You are not allowed to delete this item' });
    }

    await item.deleteOne();
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error deleting clothing item' });
  }
};

// PUT /items/:itemId/likes — add a like
const likeClothingItem = async (req, res) => {
  try {
    const { itemId } = req.params;  // FIXED
    const userId = req.user._id;    // FIXED

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(() => {
      const error = new Error('Item not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error liking clothing item' });
  }
};

// DELETE /items/:itemId/likes — remove a like
const dislikeClothingItem = async (req, res) => {
  try {
    const { itemId } = req.params;   // FIXED
    const userId = req.user._id;     // FIXED

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => {
      const error = new Error('Item not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error disliking clothing item' });
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
