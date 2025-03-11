const Address = require("../models/Address");

exports.createAddress = async (req, res) => {
  try {
    const { userId, streetAddress, city, state, zipCode, country } = req.body;
    const newAddress = new Address({
      userId,
      streetAddress,
      city,
      state,
      zipCode,
      country,
    });
    await newAddress.save();
    await User.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });
    res
      .status(201)
      .json({ message: "Address saved successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress)
      return res.status(404).json({ message: "Address not found" });
    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    await User.updateMany({}, { $pull: { addresses: req.params.id } });
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
