const ClothingItem = require('../models/clothingItem');


const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageURL } = req.body;
    const newItem = new ClothingItem({ name, weather, imageURL });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'createItems error' });
  }
};

const getClothingItems = async (_req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'getItems error' });
  }
};

const updateClothingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weather, imageURL } = req.body;
    const updatedItem = await ClothingItem.findByIdAndUpdate( 
      id,
      { name, weather, imageURL },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'updateItems error' });
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    const { id } = req.params;
    await ClothingItem.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'deleteItems error' });
  }
};

module.exports = {
  createClothingItem,
  getClothingItems,
  updateClothingItem,
  deleteClothingItem
};