/**
 * ProfilePic component that displays the user's profile picture.
 * If the user's profile picture is not available, a placeholder image is displayed.
 *
 * @component
 * @example
 * return (
 *   <ProfilePic />
 * )
 *
 * @returns {JSX.Element} The ProfilePic component.
 *
 * @description
 * This component uses the `useAuth` hook to get the current user's information,
 * including the image filename. It then fetches the image using the `fetchImage` function.
 * If the image is successfully fetched, it is displayed; otherwise, a placeholder image is shown.
 *
 * @requires useAuth - Custom hook to get the current user's authentication information.
 * @requires fetchImage - Function to fetch the image from the server.
 * @requires PlaceholderProfile - Placeholder image to be used if the user's profile picture is not available.
 */
import { useState, useEffect } from "react";
import useAuth from "../../auth/useAuth";
import fetchImage from "../../auth/apiGetIMG";
import { PlaceholderProfile } from "../../../assets/utilities";
const ProfilePic = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const imageId = user?.imageFilename;
  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = await fetchImage(imageId, "/image/profile-pic/");
      if (imageUrl !== "Failed to load the image. Please try again.") {
        setImage(imageUrl);
      } else {
        setImage(null);
      }
    };
    loadImage();
  }, [imageId]);
  return (
    <div className='absolute -top-5 left-6'>
      <img
        src={image || PlaceholderProfile}
        alt='Profile picture'
        className='w-24 h-24 rounded-lg shadow-lg hover:scale-105 transition-all duration-500 ease-in-out delay-100'
      />
    </div>
  );
};

export default ProfilePic;
