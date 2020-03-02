const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Contact = require("../models/Contact");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("type", "Type must be personal or professional").isIn([
        "personal",
        "professional"
      ])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.name = email;
  if (phone) contactFields.name = phone;
  if (type) contactFields.name = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "contact not found" });

    if (contact.user.toString() !== req.user.id) {
      return res.status(401)({ msg: "not authorised" });
    }
    contact = await Contact.findOneAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "contact not found" });

    if (contact.user.toString() !== req.user.id) {
      return res.status(401)({ msg: "not authorised" });
    }
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "contact Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
