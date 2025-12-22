import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddBlog from "./pages/AddBlog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import Blog from "./pages/Blogs";
import Layout from "./pages/Layout";
import EditBlog from "./pages/EditBlog";

function App() {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/add-blog"
              element={
                <ProtectedRoute>
                  <AddBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  {" "}
                  <Blog />{" "}
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
