const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "your_password",
    database: "your_database_name",
    synchronize: true, // Tự động tạo/cập nhật bảng (chỉ nên bật khi dev)
    logging: false,
    // Trỏ đến thư mục chứa các file Entity của bạn
    entities: [require("./entity/UserSchema"), require("./entity/OrderSchema")],
    migrations: [],
    subscribers: [],
});

module.exports = { AppDataSource };
