const express = require("express");
const PORT = process.env.PORT || 3500;
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const app = express();

app.use(logger);

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "Not found" });
  } else {
    res.type("txt").send("Not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
