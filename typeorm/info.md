SELECT * FROM users WHERE email = 'example@gmail.com' AND status = 'ACTIVE';
=>
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email: 'example@gmail.com' })
  .andWhere('user.status = :status', { status: 'ACTIVE' })
  .getMany();

const users = await this.userRepository.find({
  where: {
    email: 'example@gmail.com',
    status: 'ACTIVE',
  },
});

- 
SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING order_count > 5
ORDER BY order_count DESC
LIMIT 10;

=>

const users = await this.userRepository
  .createQueryBuilder('u')
  .leftJoin('orders', 'o', 'u.id = o.user_id')
  .select(['u.id', 'u.name'])
  .addSelect('COUNT(o.id)', 'order_count')
  .groupBy('u.id')
  .having('COUNT(o.id) > :count', { count: 5 })
  .orderBy('order_count', 'DESC')
  .limit(10)
  .getRawMany();