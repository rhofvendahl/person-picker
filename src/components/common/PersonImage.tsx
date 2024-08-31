import { useState } from "react";

import ImageModal from "./ImageModal";

const PersonImage = ({
  imagePath,
  reverse,
  openModal,
}: {
  imagePath: string;
  reverse: boolean;
  openModal: boolean;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <img
        src={imagePath}
        className={`h-full rounded object-cover aspect-square m-auto ${
          reverse ? "transform -scale-x-100" : ""
        }`}
        onClick={() => setModalOpen(true)}
      />

      {openModal && (
        <ImageModal
          imagePath={imagePath}
          reverse={reverse}
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default PersonImage;
