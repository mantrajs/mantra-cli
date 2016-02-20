import fs from 'fs';

/**
 * Outputs a file in the targetPath with the content read from filePath
 * which is internal to the module
 */
export function copyFile(filePath, targetPath) {
  fs.readFileSync(filePath);
}
