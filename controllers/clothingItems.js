const ClothingItem = require('../models/clothingItem');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../utils/errors');

// GET /items — return all clothing items
const getClothingItems = async (_req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch clothing items' });
  }
};

// POST /items — create a new clothing item
const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const newItem = await ClothingItem.create({ name, weather, imageUrl });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Invalid clothing item data' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating clothing item' });
  }
};

// DELETE /items/:id — delete a clothing item
const deleteClothingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await ClothingItem.findByIdAndDelete(id).orFail(() => {
      const error = new Error('Item not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json({ message: 'Item deleted successfully', deletedItem });
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error deleting clothing item' });
  }
};

// PUT /items/:id/likes — add a like
const likeClothingItem = async (req, res) => {
  try {
    const { id } = req.params;
    // NOTE: Replace "req.user._id" with your real user ID (from auth later)
    const userId = req.user?._id || '000000000000000000000001';

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } }, // prevents duplicate likes
      { new: true }
    ).orFail(() => {
      const error = new Error('Item not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error liking clothing item' });
  }
};

// DELETE /items/:id/likes — remove a like
const dislikeClothingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || '000000000000000000000001';

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => {
      const error = new Error('Item not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }

    res
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
