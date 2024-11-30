-- người dùng đã đặt sân theo ngày và phone
-- in: ngày, phone number
SELECT u.full_name, u.phone_number, pp.pitch_name, pp.location,
    b.start_time, b.end_time, b.price
FROM Users u
JOIN Bookings b ON b.user_id = u.user_id
JOIN Pitches pp ON  pp.pitch_id = b.pitch_id
WHERE u.phone_number = 'inputPhone'
    and b.booking_date = 'inputDate'


-- tìm sân còn trống vào khoảng thời gian
-- in: ngày (inpDate), time start (inpTimeStart), time end (inpTimeEnd)
SELECT pp.pitch_id, pp.pitch_name 
FROM Pitches pp
WHERE pitch_id not IN (
                SELECT pitch_id
                FROM Bookings b
                WHERE b.booking_date = inpDate
                    and (
                        inpTimeStart BETWEEN b.start_time and b.end_time
                        or inpTimeEnd BETWEEN b.start_time and b.end_time
                        or b.start_time BETWEEN inpTimeStart and inpTimeEnd
                        or b.end_time BETWEEN inpTimeStart and inpTimeEnd
                    )
            )

SELECT pp.pitch_id, pp.pitch_name
FROM Pitches pp
WHERE NOT EXISTS (
    SELECT 1 
    FROM Bookings b
    WHERE b.pitch_id = pp.pitch_id 
        AND (
            inpTimeStart BETWEEN b.start_time AND b.end_time
            OR inpTimeEnd BETWEEN b.start_time AND b.end_time
            OR b.start_time BETWEEN inpTimeStart AND inpTimeEnd
            OR b.end_time BETWEEN inpTimeStart AND inpTimeEnd
        )
);


SELECT pp.pitch_id, pp.pitch_name
FROM Pitches pp
LEFT JOIN Bookings b 
    ON pp.pitch_id = b.pitch_id 
        AND (inpTimeStart BETWEEN b.start_time AND b.end_time
            OR inpTimeEnd BETWEEN b.start_time AND b.end_time
            OR b.start_time BETWEEN inpTimeStart AND inpTimeEnd
            OR b.end_time BETWEEN inpTimeStart AND inpTimeEnd)
WHERE b.booking_id IS NULL;

-- giải đấu


-- 