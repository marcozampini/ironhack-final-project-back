module.exports = (app) => {
  /**
   * Last middleware to be access if no error object is passed, allow to
   * generate a default 404 error in case no other match is found
   * for the request path
   */
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ errorMessage: "This route does not exist" });
  });

  /**
   * Last middleware to be access if error object is passed, allow to
   * generate a default 500 error in case something goes wrong in any controller
   */
  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (err.status === 401 &&
      err.code.includes('invalid_token')) {
      return res.status(err.status).send('Wrong Token')
    }
    if (!res.headersSent) {
      res.status(500).json({
        errorMessage: "Internal server error. Check the server console",
      });
    }
  });
};
