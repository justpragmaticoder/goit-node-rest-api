import { promises as fs } from 'fs';
import path from 'path';

export async function moveTempFile(tempFilePath, destinationFolder) {
    try {
        await fs.mkdir(destinationFolder, { recursive: true });

        const fileName = path.basename(tempFilePath);
        const destinationPath = path.join(destinationFolder, fileName);

        await fs.rename(tempFilePath, destinationPath);
    } catch (error) {
        console.error('Error moving file:', error);

        // Attempt to delete the temp file if it exists
        try {
            await fs.unlink(tempFilePath);
        } catch (deleteError) {
            console.error(`Failed to delete temp file: ${tempFilePath}`, deleteError);
        }

        throw error;
    }
}
