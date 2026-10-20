export async function buildContext({ req }) {
  return {
    user: null,  // đọc token từ req.headers.authorization (xem 05-advanced)
  };
}