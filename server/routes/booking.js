const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Booking = require("../models/Booking");

// @route POST api/bookings
// @desc Create a booking
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const {
    type,
    location,
    proposedDate1,
    proposedDate2,
    proposedDate3,
    selectedProposedDate,
    status,
  } = req.body;

  if (!type)
    return res
      .status(400)
      .json({ success: false, message: "Missing type", data: null });

  if (!location)
    return res
      .status(400)
      .json({ success: false, message: "Missing location", data: null });

  if (!proposedDate1 || !proposedDate2 || !proposedDate3)
    return res.status(400).json({
      success: false,
      message: "Missing proposed date(s)",
      data: null,
    });

  try {
    const newBooking = new Booking({
      type,
      location,
      proposedDate1,
      proposedDate2,
      proposedDate3,
      selectedProposedDate,
      status: status || "Pending Review",
      user: req.userId,
    });
    const savedBooking = await newBooking.save();
    const returnSavedBooking = await Booking.findById(
      savedBooking._id
    ).populate("user", ["username"]);
    res.json({
      success: true,
      message: "The booking is created",
      data: returnSavedBooking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

// @route GET api/bookings
// @desc Get bookings
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.role === "USER") {
      const bookings = await Booking.find({ user: req.userId }).populate(
        "user",
        ["username"]
      );
      res.json({ success: true, message: "Bookings found", data: bookings });
    } else {
      const bookings = await Booking.find({}).populate("user", ["username"]);
      res.json({ success: true, message: "Bookings found", data: bookings });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

// @route PUT api/bookings
// @desc Update a booking
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const {
    type,
    location,
    proposedDate1,
    proposedDate2,
    proposedDate3,
    selectedProposedDate,
    rejectedReason,
    status,
    user,
  } = req.body;

  // Simple validation
  if (!type)
    return res
      .status(400)
      .json({ success: false, message: "Missing type", data: null });

  if (!location)
    return res
      .status(400)
      .json({ success: false, message: "Missing location", data: null });

  if (!proposedDate1 || !proposedDate2 || !proposedDate3)
    return res.status(400).json({
      success: false,
      message: "Missing proposed date(s)",
      data: null,
    });

  if (!status)
    return res
      .status(400)
      .json({ success: false, message: "Missing status", data: null });

  try {
    let updatedBooking = new Booking({
      type,
      location,
      proposedDate1,
      proposedDate2,
      proposedDate3,
      selectedProposedDate,
      rejectedReason,
      status,
      user,
    });

    let bookingUpdateCondition;

    if (req.role === "USER") {
      bookingUpdateCondition = { _id: req.params.id, user: req.userId };
    } else {
      bookingUpdateCondition = { _id: req.params.id };
    }

    // TODO CHeck this knowledge again
    // return updated Booking, if not able to find the Booking, return old Booking
    updatedBooking = await Booking.findOneAndUpdate(
      bookingUpdateCondition,
      {
        $set: {
          type,
          location,
          proposedDate1,
          proposedDate2,
          proposedDate3,
          selectedProposedDate,
          rejectedReason,
          status,
          user,
        },
      },
      { new: true }
    ).populate("user", ["username"]);

    // User not authorized to update Booking
    if (!updatedBooking)
      return res.status(401).json({
        success: false,
        message: "Booking not found or user not authorized",
        data: null,
      });

    res.json({
      success: true,
      message: "The booking is updated",
      data: updatedBooking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

// @route DELETE api/bookings
// @desc Delete a booking
// @access Private

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    let bookingDeleteCondition;
    if (req.role === "USER") {
      bookingDeleteCondition = { _id: req.params.id, user: req.userId };
    } else {
      bookingDeleteCondition = { _id: req.params.id };
    }
    const deletedBooking = await Booking.findOneAndDelete(
      bookingDeleteCondition
    );
    // User unauthorized or booking not found
    if (!deletedBooking)
      return res.status(401).json({
        success: false,
        message: "Booking not found or user unauthorized",
        data: null,
      });

    res.json({
      success: true,
      message: "Booking deleted",
      data: deletedBooking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

module.exports = router;
