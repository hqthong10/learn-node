// Lấy danh sách phòng trống theo ngày
db.rooms.aggregate([
  {
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "roomId",
      as: "booking"
    }
  },
  {
    $match: {
      $or: [
        { "booking": { $size: 0 } },
        {
          $and: [
            { "booking.checkInDate": { $gte: ISODate("2025-01-10") } },
            { "booking.checkOutDate": { $lte: ISODate("2025-01-12") } }
          ]
        }
      ]
    }
  }
]);

// Tìm booking theo khách hàng
Booking.find({ customerId })
       .populate("roomId")
       .populate("customerId");

// Doanh thu theo tháng
db.bookings.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: { $month: "$checkInDate" },
      totalRevenue: { $sum: "$totalPrice" }
    }
  },
  { $sort: { "_id": 1 } }
]);

// Top 5 loại phòng được đặt nhiều nhất
db.bookings.aggregate([
  { $group: { _id: "$roomId", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 }
]);