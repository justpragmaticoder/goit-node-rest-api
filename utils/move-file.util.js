import { promises as fs } from 'fs';
import path from 'path';

export async function moveFile(tempFilePath, destinationFolder) {
    try {
        await fs.mkdir(destinationFolder, { recursive: true });

        const fileName = path.basename(tempFilePath);
        const destinationPath = path.join(destinationFolder, fileName);

        await fs.rename(tempFilePath, destinationPath);
    } catch (error) {
        console.error('Error moving file:', error);
        throw error;
    }
}
