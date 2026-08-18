import imageCompression from "browser-image-compression";

//prettier-ignore
export const convertImageWebpPWithCompression = async (file: File, tamaño? : number ):Promise<File>=> {    
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight:tamaño? tamaño:  1024,
            useWebWorker: true,
            fileType: "image/webp",
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return Promise.resolve(compressedFile);
        } catch (error) {
            return Promise.reject(error);
        }    
};

export const ConvertImageTojpeg = async (file: File) => {
  let Archivo: File = file;
  const imgname = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result as string;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = Math.max(img.width, img.height);
      canvas.width = maxSize;
      canvas.height = maxSize;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], imgname, {
                type: "image/png",
                lastModified: Date.now(),
              });
              Archivo = newFile;
              //   setItem(newFile, 'foto');
            }
          },
          "image/jpeg",
          0.8
        );
      }
    };
  };
  return Archivo;
};

//prettier-ignore
export function renameFile(originalFile: File, newName: string , type: string = 'image/webp'): File {
  const fileType = originalFile.type;
  const renamedFile = new File([originalFile], newName, { type: type});
  return renamedFile;
}

//prettier-ignore
export const convertirBase64AFile = (base64String: string,fileName: string = "Image"): File => {  
  const cleanedBase64 = base64String.replace(/\s/g, "");
  const arr = cleanedBase64.split(",");

  if (arr.length < 2) {
    throw new Error("Formato Base64 inválido. Debe incluir cabecera y datos.");
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("No se pudo obtener el tipo MIME del Base64.");
  }
  const mimeType = mimeMatch[1];

  let byteString: string;
  try {
    byteString = atob(arr[1]);
  } catch (error) {
    throw new Error("Base64 inválido. No se pudo decodificar.");
  }

  const u8arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    u8arr[i] = byteString.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mimeType });
};