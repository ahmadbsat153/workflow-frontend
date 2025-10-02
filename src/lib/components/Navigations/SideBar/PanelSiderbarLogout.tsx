"use client";
import { LogOut } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { useAuth } from "@/lib/context/AuthContext";

const PanelSidebarLogout = () => {
  const { logout } = useAuth();
  return (
    <div className="w-full">
      <Button color="primary" onClick={logout} className="w-full">
        <LogOut color="white"/> Logout
      </Button>
    </div>
  );
};
export default PanelSidebarLogout;
