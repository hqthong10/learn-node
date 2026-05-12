package main

// import "fmt"
// import "time"
import (
	"fmt"
	"time"
)
 
const FLag = 3

func add(a, b int) int {
	return a + b + FLag
}

type error interface {
	Error() string
}

type Profile struct {
	Address string
	Phone   string
}

type User struct {
	ID    int64
	Name  string
	Email string
	Age   int
}

func (u User) IsAdult() bool {
	return u.Age >= 18
}

func (u *User) Validate() error {
	if u.Email == "" {
		return errors.New("email is required")
	}
	if u.Age < 18 {
		return errors.New("under age")
	}
	return nil
}

func (u *User) UpdateAge(age int) {
	u.Age = age
}

func NewUser(name, email string) *User {
	return &User{
		Name:  name,
		Email: email,
	}
}

func main() {
	// var x int = 3
	age := 20

	now := time.Now()

	// var b byte = 'a'
	// var r rune = 'あ'

	t := add(1, 2)

	fmt.Println("Time", now)
	fmt.Println("Age", age)
	fmt.Println("Add", t)

	if age >= 18 {
		fmt.Println("Già")
	} else {
		fmt.Println("Còn teen")
	}

	numbers := []int{10, 20, 30}

	for index, value := range numbers {
		fmt.Println(index, value)
	}

	for i := 1; i <= 6; i++ {
		if i == 3 {
			continue
		}
		if i == 4 {
			return
		}
		if i == 6 {
			break
		}
		fmt.Println(i)
	}

	user := User{
		ID:    1,
		Name:  "Admin",
		Email: "admin@example.com",
		Age:   30,
	}

	fmt.Println(user.Name)

	if user.IsAdult() {
		fmt.Println("Adult")
	}
	
	user.UpdateAge(15)
	if user.IsAdult() {
		fmt.Println("Adult")
	} else {
		fmt.Println("Not Adult")
	}

	user2 := NewUser("Admin", "admin@example.com")
	fmt.Println(user2)
}

