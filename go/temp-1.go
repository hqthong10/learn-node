package main

import "errors"

type Product struct {
	ID    int64
	Name  string
	Price float64
}

func (p *Product) Validate() error {
	if p.ID <= 0 {
		return errors.New("id is required")
	}
	if p.Name == "" {
		return errors.New("name is required")
	}
	if p.Price < 0 {
		return errors.New("price is invalid")
	}
	return nil
}

func (p *Product) Discount(percent int) error {
	if percent < 0 || percent > 100 {
		return errors.New("invalid discount percent")
	}

	p.Price = p.Price * float64(100-percent) / 100
	return nil
}

func main() {
	product := &Product{
		ID:    1,
		Name:  "Laptop",
		Price: 1000,
	}

	if err := product.Validate(); err != nil {
		panic(err)
	}

	if err := product.Discount(10); err != nil {
		panic(err)
	}

	fmt.Println(product.Price) // 900
}
