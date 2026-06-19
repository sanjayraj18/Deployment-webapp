import axios from "axios";
import Express from "express";
import config from "./config/config";

const app = Express();

const S3_BASE_URL =
  "https://your-s3-bucket-name.s3.ap-south-1.amazonaws.com/deployments";

app.use(async (req, res) => {
  try {
    const hostname = req.hostname;

    const subdomain = hostname.split(".")[0];

    if (
      !subdomain ||
      subdomain === "sanjay" ||
      subdomain === "localhost" ||
      subdomain === "127.0.0.1"
    ) {
      return res.status(400).send("Please use a valid deployment subdomain.");
    }

    const requestPath = req.path === "/" ? "/index.html" : req.path;
    const s3Url = `${S3_BASE_URL}/${subdomain}${requestPath}`;

    console.log(`[Proxy] Fetching from S3: ${s3Url}`);

    const response = await axios.get(s3Url, { responseType: "arraybuffer" });

    const contentType: any = response.headers["content-type"];
    if (contentType) {
      res.set("Content-Type", contentType);
    }

    return res.send(response.data);
  } catch (error) {
    console.error("[Proxy] S3 fetch error or file not found.");
    return res
      .status(404)
      .send("404 - Deployment not found or still building.");
  }
});

app.listen(config.PORT, () => {
  console.log("reverse proxy started");
});
