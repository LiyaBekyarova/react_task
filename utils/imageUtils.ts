
interface ResizeImageOptions {
  maxWidth?: number;
  maxSizeKB?: number;
}

export const resizeImage = (file: File, options: ResizeImageOptions = {}): Promise<string> => {
  const { maxWidth = 800, maxSizeKB = 300 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length / 1024 > maxSizeKB && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image. Ensure it's a valid image file."));
      };
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File, maxInitialSizeMB: number = 5): boolean => {
  if (!file) return false;

  if (!file.type.startsWith('image/')) {
    alert('Моля, изберете валиден файлов тип за изображение (напр. .jpg, .png).');
    return false;
  }

  if (file.size > maxInitialSizeMB * 1024 * 1024) {
    alert(`Файлът е твърде голям (над ${maxInitialSizeMB}MB). Опитвам да го оразмеря, но може да не се побере.`);
  }
  return true;
};