export default async function uploadImages(fileArray, imageUp) {
  if (!Array.isArray(fileArray)) {
    fileArray = [fileArray];
  }

  if (fileArray.length === 0) {
    return [];
  }

  const images = [];

  for (const fileData of fileArray) {
    try {
      const file = await imageUp(fileData?.path);
      images.push(file);
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  }

  return images;
}
