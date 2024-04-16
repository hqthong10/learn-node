// processor.js
module.exports = function (job, done) {
  console.log(`Processing job: ${job.id}, Data: ${job.data}`);
  // Thực hiện công việc và trả kết quả nếu cần
  const result = job.data + " processed";
  done(null, " ok");
  // return result;
};

// export default {
//   process: async (job) => {
//     console.log(`Processing job: ${job.id}, Data: ${job.data}`);
//     // Thực hiện công việc và trả kết quả nếu cần
//     const result = job.data + " processed";
//     return result;
//   },
// };
