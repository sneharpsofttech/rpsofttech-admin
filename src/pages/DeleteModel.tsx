import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface DeleteModelProps {
  selectedBlogId: string | null;
  onClose: () => void;
}

const DeleteModel = ({ selectedBlogId, onClose }: DeleteModelProps) => {
  const handleDelete = async () => {
    if (!selectedBlogId) return;

    try {
      await deleteDoc(doc(db, "blogs", selectedBlogId));
      onClose();
      window.location.reload(); // simple & safe
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mt-24 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Delete Blog
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this blog? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteModel;
