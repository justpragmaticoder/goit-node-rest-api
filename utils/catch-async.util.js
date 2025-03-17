export const catchAsyncUtil = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
