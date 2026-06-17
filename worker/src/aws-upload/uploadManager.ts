import { PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import fs from "node:fs/promises";
import path from "node:path";
import s3Client from "../config/awss3";

async function uploadManager(localFolderPath: string, deploymentId: string) {
  try {
    //Opens the dist folder and gets a list of every file (even in subfolders).
    const files = await fs.readdir(localFolderPath, { recursive: true });

    for (const file of files) {
      // Combines the folder path and filename so the computer can find the file on your disk.
      const filePath = path.join(localFolderPath, file.toString());

      const stats = await fs.stat(filePath);

      //We only want to upload files (images, JS, CSS). We skip empty folders.
      if (stats.isDirectory()) continue;

      const s3Key = `deployments/${deploymentId}/${file.toString()}`;

      //Opens the file and reads the raw data into memory so we can send it.
      const fileContent = await fs.readFile(filePath);

      //post office
      await s3Client.send(
        //parcel
        new PutObjectCommand({
          Bucket: "your-deployment-bucket",
          Key: s3Key,
          Body: fileContent,
          ContentType: mime.lookup(filePath) || "application/octet-stream",
        }),
      );

      console.log(`[Worker] Uploaded file: ${s3Key}`);
    }
  } catch (e) {
    console.warn("Error in uploading the file to s3", e);
  }
}

export default uploadManager;
