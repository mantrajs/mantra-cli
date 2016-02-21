import fs from 'fs';
import {insert} from 'editer';

export function writeToFile(pathToFile, string, options) {
  let fileContent = fs.readFileSync(pathToFile, {encoding: 'utf-8'});
  let updatedContent = insert(string, fileContent, options);

  fs.writeFileSync(pathToFile, updatedContent);
}
