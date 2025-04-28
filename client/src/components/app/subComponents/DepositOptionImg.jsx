import { useState, useEffect } from "react";
// import useAuth from "../../auth/useAuth";
import fetchImage from "../../auth/apiGetIMG";
import { PlaceholderQrCode } from "../../../assets/utilities";
import PropTypes from "prop-types";

const DepositOptionImg = ({ imageId: _id }) => {
  //   const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [imageId, setimageId] = useState(_id || "");
  useEffect(() => {
    setimageId(_id || "");
  }, [_id]);

  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = await fetchImage(imageId, "/image/qrcode/");
      if (imageUrl !== "Failed to load the image. Please try again.") {
        setImage(imageUrl);
      } else {
        setImage(null);
      }
    };
    loadImage();
  }, [imageId]);
  return (
    <img
      src={image || PlaceholderQrCode}
      alt='QR Code'
      className='h-full w-full object-cover cursor-none'
    />
  );
};

DepositOptionImg.propTypes = {
  imageId: PropTypes.string.isRequired,
};
export default DepositOptionImg;
