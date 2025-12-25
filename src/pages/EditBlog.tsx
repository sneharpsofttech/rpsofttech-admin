import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../lib/firebase";
import { UploadToCloudinary } from "../components/UploadImage";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    // banner: "",
    category: "",
    author: "",
    readingTime: "",
    tags: "",
    created_at:"",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const snap = await getDoc(doc(db, "blogs", id));
        if (!snap.exists()) {
          toast.error("Blog not found");
          return;
        }

        const data: any = snap.data();
        setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          author: data.author,
          readingTime: data.readingTime,
          tags: data.tags.join(", "), 
          created_at: data.created_at,
        });

        setPreview(data.banner); 
      } catch (err) {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
      if (!form.tags) newErrors.tags = "Tags are required.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      let imageUrl = preview; 

      // upload only if new image selected
      if (image) {
        if (image.size > 10 * 1024 * 1024) {
          toast.error("Image too large (max 10MB)");
          setLoading(false);
          return;
        }
        imageUrl = await UploadToCloudinary(image);
      }

      await updateDoc(doc(db, "blogs", id!), {
        title: form.title,
        description: form.description,
        banner: imageUrl,
        category: form.category,
        author: form.author,
        readingTime: form.readingTime,
        tags: form.tags.split(",").map((tag) => tag?.trim()),
        updated_at: Date.now(), 
      });

      toast.success("Blog updated successfully");
      navigate("/blogs");
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow  justify-start">
      <section className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

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
                {preview && !image && (
                  <img
                    src={preview}
                    alt="existing"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                )}

                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="new"
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
            className="w-full bg-black text-white py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {loading ? "Saving..." : "Edit Blog"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditBlog;
