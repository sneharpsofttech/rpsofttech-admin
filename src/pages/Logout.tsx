import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login"); // back to login page
    } catch (error) {
      if (error) toast.error("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#077FF9] text-white px-4 py-2 rounded-lg cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
