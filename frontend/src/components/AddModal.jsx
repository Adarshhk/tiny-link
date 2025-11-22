import React, { useState } from "react";
import { useLinkStore } from "../store/links";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddModal = () => {
  const { addLink, getLinks, toggleModal, showModal, loading } = useLinkStore();

  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      short_code: shortCode,
      redirect_url: redirectUrl,
    };

    if (redirectUrl == "") {
      setError("Please enter redirect url.");
      return;
    }

    try {
      const res = await addLink(payload);
      if (res.data) {
        setError("");
        getLinks();
        handleClose();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleClose = () => {
    toggleModal();
    setShortCode("");
    setError("");
    setRedirectUrl("");
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-3 w-[90%] max-w-md">
          <div className="border-b border-blue-900/10">
            <h2 className="text-xl font-bold text-blue-900 py-2">
              Create New Link
            </h2>
            {error && <p className="text-red-500 text-xs ">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Redirect URL
              </label>
              <input
                type="url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full text-[13.33px] px-3 py-2 border rounded-md outline-none focus:ring-2 mt-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Short Code{" "}
                <span className="text-[12px] text-black/60 italic">{`(optional)`}</span>
              </label>
              <input
                type="text"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder="ex: yt123"
                className="w-full mt-1 text-[13.33px] px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={handleClose}
                className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Close
              </button>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-2 bg-blue-600 text-center text-white rounded-md hover:bg-blue-700 transition"
              >
                {loading ? (
                  <div className="w-full flex items-center justify-center">
                    <AiOutlineLoading3Quarters
                      className="animate-spin text-blue-500"
                      size={20}
                    />
                  </div>
                ) : (
                  "Create Link"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddModal;
