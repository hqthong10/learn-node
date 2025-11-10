#
int a = 10;
double b = 5.5;
String name = 'Flutter';
bool isLoggedIn = true;

var x = 123; // Dart tự suy đoán kiểu
final y = 'Không thể gán lại';
const z = 'Hằng số compile-time';

🔹 var = khai báo linh hoạt
🔹 final = gán 1 lần, runtime
🔹 const = gán 1 lần, compile time

#
if (a > 10) {
  print('Lớn hơn 10');
} else {
  print('Nhỏ hơn hoặc bằng 10');
}

#
switch (a) {
  case 1:
    print('1');
    break;
  case 2:
    print('2');
    break;
  default:
    print('Khác');
}

# for
for (var i = 0; i < 10; i++) {
  print(i);
}

# while
while (a < 10) {
  a++;
}

# do-while
do {
  print(a);
} while (a < 10);

# function
int cong(int a, int b) {
  return a + b;
}

// Arrow function
int nhan(int a, int b) => a * b;

// Hàm có tham số mặc định
void hello({String name = 'bạn'}) {
  print('Xin chào $name');
}

# class
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void sayHello() {
    print('Xin chào, tôi là $name');
  }
}

// Khởi tạo
var person = Person('Flutter', 10);
person.sayHello();

# list
var list = [1, 2, 3, 4, 5];
list.add(6);
list.remove(1);
list.forEach((element) {
  print(element);
});

# Set (không trùng lặp)
Set<String> names = {'A', 'B'};
names.add('C');

# map
Map<String, int> scores = {'Nam': 10, 'Linh': 8};
print(scores['Nam']);

# Null Safety
String? name; // biến có thể null

if (name != null) {
  print(name.length);
}

// Toán tử an toàn:
print(name?.length); // nếu null => null
print(name ?? 'Chưa có tên'); // nếu null => dùng mặc định

# Future, async/await
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 1));
  return 'Dữ liệu đã tải';
}

void main() async {
  String data = await fetchData();
  print(data);
}

# Enum
enum Status { loading, success, error }

Status s = Status.loading;

# Extension
extension StringExtension on String {
  String toCapitalize() => '${this[0].toUpperCase()}${substring(1)}';
}

print('flutter'.toCapitalize()); // Flutter


# Optional Chaining
var person = Person('Flutter', 10);
print(person?.name);

# Spread Operator
var list1 = [1, 2, 3];
var list2 = [4, 5, 6];
var list3 = [...list1, ...list2];
print(list3);

# Cascade Notation
var person = Person('Flutter', 10);
person
  ..name = 'Flutter'
  ..age = 10
  ..sayHello();