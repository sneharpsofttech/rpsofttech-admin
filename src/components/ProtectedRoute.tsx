// src/components/ProtectedRoute.tsx
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20">
        {" "}
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-5000 backdrop-blur-sm">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-[#EEEAEA] border-t-[#077FF9] rounded-full animate-spin"></div>

          {/* Loading Text */}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
