import { Card, CardHeader, CardBody, CardFooter } from "@material-tailwind/react";
import {
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "../../layout/NotificationHelper";
import PropTypes from "prop-types";
import FormError from "./FormError";
import { getInitialAccessToken } from "../../auth/authHelpers";
import { useNavigate } from "react-router-dom";
import DepositOptionImg from "./DepositOptionImg";

function DepositCard({ detail }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [copied, setcopied] = useState(false);
  const { addNotification } = useNotification();
  const [showprompt, setshowPrompt] = useState(false);
  const [details, setdetails] = useState(detail);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const maxFileSize = 5 * 1024 * 1024; //5MB in bytes
  const [successful, setsuccessful] = useState(false);
  const copy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(details?.address);
      setcopied(true);
      addNotification("Address copied succesfully", "success");
    } catch (err) {
      console.log(err);
      setcopied(false);
      addNotification("Address not copied, please retry", "warning");
    }
  };
  useEffect(() => {
    setdetails(detail);
  }, [detail]);
  // todo add qrcode fetching when admin updates
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    //   Reset error and file state
    setError("");
    setFile(null);

    if (selectedFile) {
      //  Check file type
      if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
        setError("Only PNG and JPEG files are allowed.");
        return;
      }

      //   Check file size
      if (selectedFile.size > maxFileSize) {
        setError("File size must be less than 5MB.");
        return;
      }

      // If all validations pass, set the file and clear any errors
      setFile(selectedFile);
    }
  };
  useEffect(() => {
    successful && navigate("/app/transaction");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successful]);

  const handleUpload = async () => {
    if (!file) return;

    //  Prepare the form data
    const formData = new FormData();
    formData.append("image", file);
    formData.append("amount", amount);
    formData.append("address", details?.address);
    formData.append("optionRef", details?._id);
    formData.append("option", details?.name);

    try {
      setIsUploading(true);
      // Attach access token if available
      const storedToken = getInitialAccessToken();
      const accessToken = storedToken || null;

      const headers = {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/deposit/`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers, // Ensure headers are passed correctly
      });

      if (!response.ok) {
        addNotification("Deposit failed", "error");
        throw new Error("Deposit failed");
      }

      const data = await response.json();
      data && setsuccessful(true);
      addNotification("Deposit successful", "success");
    } catch (err) {
      addNotification("Deposit failed", "error");
      console.error("Deposit failed:", err);
      setError("Deposit failed. Please try again.");
    } finally {
      setIsUploading(false);
      setFile(null);
      setAmount("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }
    }
  };
  return (
    <Card
      variant='gradient'
      color='gray'
      className='w-full max-w-[96dvh] md:max-w-[26rem] mx-auto md:mx-0'>
      <CardHeader shadow={false} floated={false} className='h-96'>
        <DepositOptionImg imageId={details?.qrCode} />
      </CardHeader>
      <CardBody className='text-text-light flex flex-col space-y-2'>
        <div className='flex justify-between'>
          <h3 className='font-semibold text-2xl capitalize'>{details?.name}</h3>
          <QuestionMarkCircleIcon
            title='Info'
            className='h-5 w-5 hover:scale-110 transition-all delay-100 cursor-help'
            onClick={() => setshowPrompt((prev) => !prev)}
          />
        </div>
        {showprompt && (
          <p className='text-md text-primary-light mb-2'>
            Account will be funded automatically once transaction has been reviewed. Upload the{" "}
            <span className='highlight'>appropriate receipt</span> for this transaction with{" "}
            <span className='highlight'>amount tallying</span> with what you enter below.
          </p>
        )}
        <form>
          <label
            className='flex flex-row justify-between text-sm text-text-light mb-1 font-semibold'
            htmlFor='address'>
            {details.name === "bank" ? "Account number" : "Address"}{" "}
            {copied ? (
              <ClipboardDocumentCheckIcon className='h-7 w-7 text-success-dark' />
            ) : (
              <DocumentDuplicateIcon
                className='h-5 w-5 hover:scale-110 transition-all duration-700 ease-in-out delay-200 cursor-copy'
                onClick={copy}
              />
            )}
          </label>
          <input
            type='text'
            className='form-input w-full'
            value={details?.address}
            readOnly
            id='address'
          />
          <label className='block text-sm font-semibold text-text-light mb-1' htmlFor='amount'>
            Amount
          </label>
          <input
            type='number'
            className='form-input w-full'
            placeholder='$0.00'
            id='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className='block text-sm font-semibold text-text-light mb-1' htmlFor='receipt'>
            Upload Receipt
          </label>
          <input
            type='file'
            className='form-input w-full'
            accept='.png, .jpeg'
            id='receipt'
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {error && <FormError err={error} />}
        </form>
      </CardBody>
      <CardFooter className='pt-0 flex flex-row'>
        <button
          className='accent-btn w-full'
          onClick={handleUpload}
          disabled={!file || isUploading || amount === ""}>
          {isUploading ? "Processing..." : "Deposit"}
        </button>
      </CardFooter>
    </Card>
  );
}
export default DepositCard;
DepositCard.propTypes = {
  detail: PropTypes.object.isRequired,
};
