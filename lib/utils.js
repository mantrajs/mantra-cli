import fs from 'fs';
import editer from 'editer';

/**
 * Writes a string on the file at the given path, at a location specified by
 * options. Uses 'editer' module under the hood the find the exact location of
 * the insertion.
 *
 * @param pathToFile {String} - the path to the file. Can be either absolute or
 *        relative.
 */
export function writeToFile(pathToFile, string, options) {
  let fileContent = fs.readFileSync(pathToFile, {encoding: 'utf-8'});
  let updatedContent = editer.insert(string, fileContent, options);

  fs.writeFileSync(pathToFile, updatedContent);
}

/**
 * Checks if a file or directory exists at the given path
 * @param path {String} - the path to the file or directory. Can be either
 *        absolute or relative.
 * @return Boolean - true if the file or directory exists. Otherwise false.
 */
export function checkFileExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }

  return true;
}
