export const errorHandler = (err, req, res, next) => {
  console.error(`Error => ${err.stack}`)
  res.status(500).json({
    error: {
      message: err.message,
    }
  })
}