import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UploadToCloudinary } from "../components/UploadImage";
import { toast } from "react-toastify";

const AddBlog = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    // banner: "",
    category: "",
    author: "",
    readingTime: "",
    tags: "",
    created_at: Date.now(),
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newErrors: any = {};

      if (!form.title.trim()) newErrors.title = "Title is required.";

      if (!form.description.trim())
        newErrors.description = "Description is required.";

      if (!form.category.trim()) newErrors.category = "Category is required.";

      if (!form.author.trim()) newErrors.author = "Author is required.";

      if (!form.readingTime.trim())
        newErrors.readingTime = "Reading Time is required.";

      if (!form.tags.trim()) newErrors.tags = "Tags are required.";

      if (!image) newErrors.image = "Image is required.";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      if (!image) {
        // alert("Please upload a banner image");
        toast.warning("Please upload a banner image");
        setLoading(false);
        return;
      }
      if (image.size > 10 * 1024 * 1024) {
        toast.error("Image too large");
      }

      const imageUrl = await UploadToCloudinary(image);

      await addDoc(collection(db, "blogs"), {
        title: form.title,
        description: form.description,
        banner: imageUrl,
        category: form.category,
        author: form.author || "Admin",
        readingTime: form.readingTime,
        tags: form.tags.split(",").map((t) => t.trim()),
        created_at: Date.now(),
      });

      // alert("Blog added successfully");
      toast.success("Blog added successfully");
      setForm({
        title: "",
        description: "",

        category: "",
        author: "",
        readingTime: "",
        tags: "",
        created_at: Date.now(),
      });
      setImage(null);
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow  justify-start">
      <section className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title *
            </label>
            <input
              name="title"
              placeholder="Blog Title"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Blog Description"
              value={form.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows={5}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blog Banner Image *
              </label>

              <div
                onClick={() =>
                  document.getElementById("blog-image-input")?.click()
                }
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition
      hover:border-blue-700 hover:bg-blue-50
      border-gray-300 bg-gray-50 ${
        errors.image ? "border-red-500" : "border-gray-300"
      }`}
              >
                {!image ? (
                  <>
                    <svg
                      className="w-10 h-10 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4l-4-4m0 0l-4 4m4-4v9"
                      />
                    </svg>

                    <p className="text-sm text-gray-600">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WEBP (max 2MB)
                    </p>
                  </>
                ) : (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              <input
                id="blog-image-input"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // 10 MB limit
                  if (file.size > 10 * 1024 * 1024) {
                    // toast.error("Image size must be less than 10MB");
                    setErrors((prev: any) => ({
                      ...prev,
                      image: "Image size must be less than 10MB",
                    }));
                    e.target.value = ""; // reset input
                    return;
                  }

                  setErrors((prev: any) => ({ ...prev, image: "" }));
                  setImage(file);
                }}
              />

              {/* {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Remove image
                </button>
              )} */}
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category *
            </label>
            <input
              name="category"
              placeholder="Category (Tech, AI, Design)"
              value={form.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Author *
            </label>
            <input
              name="author"
              placeholder="Author Name"
              value={form.author}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.author ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.author && (
              <p className="text-red-500 text-xs mt-1">{errors.author}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Reading Time *
            </label>
            <input
              name="readingTime"
              placeholder="Reading Time (e.g. 5)"
              value={form.readingTime}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300`}
            />
            {/* {errors.readingTime && (
              <p className="text-red-500 text-xs mt-1">{errors.readingTime}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tags *
            </label>
            <input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.tags ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
            )}
          </div>
          {/* <input
            name="created_at"
            placeholder="Created At"
            value={form.created_at}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />  */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Saving..." : "Add Blog"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddBlog;
