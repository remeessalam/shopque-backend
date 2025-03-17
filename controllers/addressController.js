import Address from "../models/Address.js";
import User from "../models/User.js";

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(req.body.address);
    const { name, mobile, address, area, city, zip, state, defaultAddress } =
      req.body.address;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, error: "User ID is required" });
    }

    const newAddress = new Address({
      name,
      mobile,
      address,
      area,
      city,
      zip,
      state,
      defaultAddress,
    });
    await newAddress.save();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { addresses: newAddress._id },
      },
      { new: true }
    ).populate("addresses");
    res.status(201).json({ status: true, address: user.addresses });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

export const getAllAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("addresses");
    if (!user)
      return res.status(404).json({ status: false, error: "User not found" });
    res.status(200).json({ status: true, address: user.addresses });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress)
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    res.status(200).json({
      status: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address)
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
    await User.updateMany({}, { $pull: { addresses: req.params.id } });
    const user = await User.findById(userId).populate("addresses");

    res.status(200).json({
      status: true,
      address: user.addresses,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
