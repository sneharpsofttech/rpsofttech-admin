import React, { useEffect, useState } from "react";
import { Calendar, Clock, User } from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";

import DeleteModel from "./DeleteModel";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModel, setDeleteModel] = useState(false);
  const [selectBlogId, setSelectBlogId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const q = query(collection(db, "blogs"));

        const snapshot = await getDocs(q);

        const blogsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(blogsData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blogs.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="flex-grow justify-start">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Insights, tips, and stories from the world of technology and
              digital innovation.
            </p>
          </div>
          {loading ? (
            <div className="text-center text-gray-500">Loading blogs...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex flex-col justify-between bg-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div>
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          blog.banner ||
                          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop"
                        }
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {blog.category ||
                            (Array.isArray(blog.tags) && blog.tags.length > 0
                              ? blog.tags[0]
                              : "Blog")}
                        </div>
                      </div>
                    </div>

                    <div className="pb-4 flex flex-col space-y-1.5 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>
                      <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 line-clamp-3 text-sm text-muted-foreground">
                        {blog.description
                          ? blog.description.slice(0, 120) +
                            (blog.description.length > 120 ? "..." : "")
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="pt-0 p-6 pt-0">
                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-4 gap-2">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <User size={16} />
                          <span>
                            {blog.createdBy || blog.author || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>
                            {blog.created_at
                              ? new Date(blog.created_at).toLocaleDateString()
                              : blog.date
                              ? new Date(blog.date).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>
                          {blog.readingTime
                            ? `${blog.readingTime} min read`
                            : blog.readTime || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(blog.tags) && blog.tags.length > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-blue-100 transition">
                          {blog.tags[0]}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex justify-between gap-2">
                      <Link
                        to={`/blog/${blog.id}`}
                        // onClick={() => {
                        //   setDeleteModel(true);
                        //   setSelectBlogId(blog.id);
                        // }}
                        style={{ backgroundColor: "#3b82f6" }}
                        className="w-full flex items-center justify-center  text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 group-hover:bg-blue-600 justify-center"
                      >
                        <span>Edit Blog</span>
                      </Link>{" "}
                      <button
                        onClick={() => {
                          setDeleteModel(true);
                          setSelectBlogId(blog.id);
                        }}
                        style={{ backgroundColor: "#ef4444" }}
                        className="w-full flex items-center justify-center bg-red text-white py-2 px-4 cursor-pointer rounded-md hover:bg-blue-600 transition-colors duration-300 group-hover:bg-blue-600 justify-center"
                      >
                        <span>Delete Blog</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}{" "}
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto hover:text-white transition-colors duration-300">
            Subscribe to our newsletter to get the latest blog posts and tech
            insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300"
            />
            <button
              //   variant="secondary"
              className="hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
      {deleteModel && (
        <div
          className="fixed inset-0 flex items-start justify-center z-30001"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.34)" }}
        >
          <DeleteModel
            selectedBlogId={selectBlogId}
            onClose={() => setDeleteModel(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Blog;
