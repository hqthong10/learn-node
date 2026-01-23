const RoomTypeSchema = new Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  maxGuests: Number,
  amenities: [String],
  description: String
}, { timestamps: true });

const RoomSchema = new Schema({
  roomNumber: { type: String, unique: true },
  roomTypeId: { type: Schema.Types.ObjectId, ref: "RoomType" },
  status: { type: String, enum: ["available", "maintenance"], default: "available" }
}, { timestamps: true });
RoomSchema.index({ roomTypeId: 1 });

const CustomerSchema = new Schema({
  name: String,
  phone: { type: String, unique: true },
  email: String,
  passportNumber: String
}, { timestamps: true });

const BookingSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },

  checkInDate: Date,
  checkOutDate: Date,

  totalPrice: Number,

  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled", "completed"],
    default: "pending"
  }
}, { timestamps: true });

BookingSchema.pre("save", async function(next) {
  const exists = await mongoose.model("Booking").findOne({
    roomId: this.roomId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      { checkInDate: { $lt: this.checkOutDate }, checkOutDate: { $gt: this.checkInDate } }
    ]
  });

  if (exists) return next(new Error("Room already booked for these dates"));
  next();
});

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  method: { type: String, enum: ["cash", "card", "momo", "bank"] },
  status: { type: String, enum: ["pending", "paid", "refund"], default: "pending" }
}, { timestamps: true });
