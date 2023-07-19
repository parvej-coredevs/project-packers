import fs from "fs";
import path from "path";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

export default async function deleteFiles(filenames) {
  if (!Array.isArray(filenames)) filenames = [filenames];

  if (filenames.length < 1) return;

  for (const file of filenames) {
    try {
      const fullpath = path.join(__dirname, "../../", file);
      await unlinkAsync(fullpath);
    } catch (error) {
      throw new Error(`Error deleting ${file}: ${error.message}`);
    }
  }
}
