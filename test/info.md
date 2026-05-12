# Các loại test nên có cho Express
Unit test -> Jest
API test -> Supertest
Integration -> Jest + DB
E2E (end to end)-> Playwright
Load (performance) -> k6

# cần test
✅ Test route + middleware + service
✅ Tách business logic ra service
✅ Test rollback / transaction
✅ Test security
✅ Chạy test trong CI/CD

