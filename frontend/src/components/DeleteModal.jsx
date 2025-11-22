import React from "react";
import { useLinkStore } from "../store/links";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const DeleteModal = () => {
  const {
    deleteId,
    deleteLink,
    getLinks,
    toggleDeleteModal,
    showDeleteModal,
    loading,
  } = useLinkStore();

  const handleDelete = async () => {
    if (!deleteId) return;

    const res = await deleteLink(deleteId);

    if (res.data) {
      getLinks();
      toggleDeleteModal();
    }
  };

  const handleClose = () => {
    toggleDeleteModal();
  };

  return (
    showDeleteModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-[90%] max-w-sm">
          <div className="border-b border-blue-900/10 pb-2">
            <h2 className="text-lg font-bold text-blue-900">Delete Link</h2>
          </div>

          <p className="mt-4 text-sm text-gray-700">
            Are you sure you want to delete this link? This action cannot be
            undone.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleClose}
              className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {loading ? (
                <div className="w-full flex items-center justify-center">
                  <AiOutlineLoading3Quarters
                    className="animate-spin text-blue-500"
                    size={20}
                  />
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteModal;
