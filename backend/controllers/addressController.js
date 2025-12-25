const Address = require("../models/Address");

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  const { name, street, city, state, postalCode, country, phone, isDefault } =
    req.body;

  try {
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = new Address({
      user: req.user._id,
      name,
      street,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    });

    const createdAddress = await address.save();
    res.status(201).json(createdAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  const { name, street, city, state, postalCode, country, phone, isDefault } =
    req.body;

  try {
    const address = await Address.findById(req.params.id);

    if (address) {
      if (address.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      if (isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
      }

      address.name = name || address.name;
      address.street = street || address.street;
      address.city = city || address.city;
      address.state = state || address.state;
      address.postalCode = postalCode || address.postalCode;
      address.country = country || address.country;
      address.phone = phone || address.phone;
      address.isDefault =
        isDefault !== undefined ? isDefault : address.isDefault;

      const updatedAddress = await address.save();
      res.json(updatedAddress);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (address) {
      if (address.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      await Address.deleteOne({ _id: address._id });
      res.json({ message: "Address removed" });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
