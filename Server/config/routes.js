const {
    UserRoute,
    DocsRoute
} = require("../routes");

module.exports = function (app) {
    app.use("/api/user", UserRoute);
    app.use("/api/docs", DocsRoute)
}