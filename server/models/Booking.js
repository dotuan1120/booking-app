const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["Health Talk", "Wellness Events", "Fitness Activities"],
  },
  location: {
    type: String,
    required: true,
  },
  proposedDate1: {
    type: Date,
    required: true,
  },
  proposedDate2: {
    type: Date,
    required: true,
  },
  proposedDate3: {
    type: Date,
    required: true,
  },
  selectedProposedDate: {
    type: Date,
  },
  rejectedReason: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending Review", "Approved", "Rejected"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("bookings", BookingSchema);
