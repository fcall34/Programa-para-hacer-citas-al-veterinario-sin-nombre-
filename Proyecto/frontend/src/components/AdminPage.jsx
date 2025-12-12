import React, { useState } from "react";
import AdminSideBar from "./adminSideBar";
import AdminAddAdmin from "./AdminAddAdmin";
import AdminViewUsers from "./AdminViewUsers";
import AdminViewServices from "./AdminviewServices";
import "./Admin.css"

export default function AdminPage() {
  const [section, setSection] = useState("users");

  const renderSection = () => {
    switch (section) {
      case "addAdmin":
        return <AdminAddAdmin />;

      case "users":
        return <AdminViewUsers />;

      case "services":
        return <AdminViewServices />;

      default:
        return <AdminViewUsers />;
    }
  };

  return (
    <div style={styles.container}>
      <AdminSideBar onSelect={setSection} />
      <div style={styles.content}>
        {renderSection()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  content: {
    padding: "20px",
    width: "100%",
    overflowY: "auto",
  },
};
