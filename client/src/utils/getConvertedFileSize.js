export const getConvertedFileSize = (fileSize) => {
  const units = ["Б", "КБ", "МБ", "ГБ"];
  let convertedSize = fileSize;
  let unitIndex = 0;

  while (convertedSize >= 1024 && unitIndex < units.length - 1) {
    convertedSize /= 1024;
    unitIndex++;
  }
  if (typeof convertedSize === 'number') {
    convertedSize = convertedSize.toFixed(2);
  }
  return `${convertedSize} ${units[unitIndex]}`;
};