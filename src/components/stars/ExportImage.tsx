import { useEffect, useRef, useState } from "react";

import { PickImage } from "../../services/personService";

const ExportImage = ({ pickImages }: { pickImages: PickImage[] }) => {
  const [canvasImageUrl, setCanvasImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas === null) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (ctx === null) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    if (pickImages.length === 0) {
      setCanvasImageUrl(null);
      clearCanvas();
      return;
    }

    // items in array can be null or HTMLImageElement, but it's a pain
    // convincing ts that it's a pure HTMLImageElement once loaded
    const imageElements = Array(pickImages.length).fill(null);

    const updateCanvas = () => {
      if (imageElements.filter((img) => img === null).length !== 0) {
        return;
      }

      const canvas = canvasRef.current;
      if (canvas === null) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (ctx === null) {
        return;
      }

      // Determine the tile size based on the max dimensions of all images
      const tileSize = Math.max(
        ...imageElements.map((img) => Math.min(img.width, img.height))
      );

      const totalWidth = tileSize * imageElements.length;
      const totalHeight = tileSize;

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      imageElements.forEach((img, i) => {
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate the largest cropped tile
        const cropWidth = Math.min(imgWidth, imgHeight);
        const cropHeight = cropWidth;
        const cropX = (imgWidth - cropWidth) / 2;
        const cropY = (imgHeight - cropHeight) / 2;

        ctx.save();

        // Reverse images as appropriate
        if (pickImages[i].reverse) {
          ctx.translate(tileSize * (i + 1), 0);
          ctx.scale(-1, 1);
        } else {
          ctx.translate(tileSize * i, 0);
        }

        // Draw the cropped image centered
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          tileSize,
          tileSize
        );

        ctx.restore();
      });

      const dataURL = canvas.toDataURL();
      setCanvasImageUrl(dataURL);
    };

    pickImages.forEach((pickImage, i) => {
      const imageElement = new Image();
      imageElement.src = pickImage.path;
      imageElement.onload = () => {
        console.log(`Image loaded: ${pickImage.path}`);
        imageElements[i] = imageElement;
        if (imageElements.filter((img) => img === null).length === 0) {
          console.log("All images loaded, updating export image");
          updateCanvas();
        }
      };
    });
  }, [pickImages, setCanvasImageUrl]);

  return (
    <div className="h-full">
      {canvasImageUrl && (
        <img src={canvasImageUrl} className="rounded h-full" />
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default ExportImage;
