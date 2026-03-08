import app from "./app.js";
import { appConfig } from "./config/app.js";

app.listen(appConfig.port, () => {
  console.log(`API listening on http://localhost:${appConfig.port}`);
});
