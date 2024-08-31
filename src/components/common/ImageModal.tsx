import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import PersonImage from "./PersonImage";
import { useEffect } from "react";

const ImageModal = ({
  imagePath,
  reverse,
  open,
  handleClose,
}: {
  imagePath: string;
  reverse: boolean;
  open: boolean;
  handleClose: () => void;
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Remove handler on unmount
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    open &&
    createPortal(
      <div
        className="fixed inset-0 p-10 flex flex-col justify-center items-center"
        onClick={() => handleClose()}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="relative max-h-full"
        >
          <PersonImage
            imagePath={imagePath}
            reverse={reverse}
            openModal={true}
          />
          <div
            className="cursor-pointer absolute top-1 right-1 bg-gray-600 text-gray-200 w-10 h-10 rounded-full flex flex-col justify-center text-3xl"
            onClick={() => handleClose()}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </div>,
      document.body
    )
  );
};

export default ImageModal;
