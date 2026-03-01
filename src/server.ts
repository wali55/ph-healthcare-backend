import app from "./app";
import { envVars } from "./config/env";

const port = envVars.PORT || 5000;

const bootstrap = () => {
  try {
    app.listen(port, () => {
      console.log("server is running on port 5000");
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

bootstrap();
