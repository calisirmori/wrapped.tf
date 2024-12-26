import * as express from 'express';
import type { Request, Response, Router } from 'express';
import axios from 'axios'; // To make the API call to download the zip file
import * as unzipper from 'unzipper'; // To unzip the downloaded file
import * as fs from 'fs';
import * as path from 'path';
import { parseLogFile } from '../parsers/mainParser';

const router: Router = express.Router();

// Define the base log ID and API URLs
const START_ID = 3554498;
const API_URL = "http://logs.tf/api/v1/log/";
const ZIP_URL = "https://logs.tf/logs/log_"; // URL to fetch the zipped log file

// Parse and retrieve log data via GET request
router.get('/parse-log', async (req: Request, res: Response) => {
    try {
        const logId = req.query.logId || START_ID; // Default to START_ID if no logId is provided
        const zipFileUrl = `${ZIP_URL}${logId}.log.zip`;

        console.log(`Downloading log file: ${zipFileUrl}`);

       // Step 1: Download the zip file
       const response = await axios.get(zipFileUrl, { responseType: 'stream' });

       const tempDirectory = path.join(__dirname, '../temp'); // Define the temp directory path

       // Check if the temp directory exists, create if it doesn't
       if (!fs.existsSync(tempDirectory)) {
           fs.mkdirSync(tempDirectory, { recursive: true });
       }

        const downloadPath = path.join(__dirname, `../temp/log_${logId}.zip`);
        const filePath = path.join(__dirname, `../temp/log_${logId}.log`);

        // Save the downloaded zip file
        const writer = fs.createWriteStream(downloadPath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            console.log('File downloaded successfully.');

            // Step 2: Unzip the downloaded file
            try {
                await fs.createReadStream(downloadPath)
                    .pipe(unzipper.Extract({ path: path.dirname(filePath) })) // Extract the file to temp folder
                    .on('close', async () => {
                        console.log('File unzipped successfully.');

                        // Step 3: Parse the unzipped log file
                        const parsedData = await parseLogFile(filePath);

                        // Clean up: Delete the downloaded zip and unzipped log file
                        fs.unlinkSync(downloadPath);
                        fs.unlinkSync(filePath);

                        // Step 4: Return the parsed data
                        res.status(200).json({
                            message: 'Log file parsed successfully',
                            data: parsedData,
                        });
                    });
            } catch (error) {
                console.error('Error unzipping the log file:', error);
                res.status(500).json({ error: 'Failed to unzip the log file' });
            }
        });

        writer.on('error', (error) => {
            console.error('Error downloading the file:', error);
            res.status(500).json({ error: 'Failed to download the log file' });
        });
        
    } catch (error) {
        // Handle errors gracefully
        console.error('Error parsing the log file:', error);
        res.status(500).json({ error: 'Failed to parse the log file' });
    }
});

// Health check route
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'API is working' });
});

export default router;
