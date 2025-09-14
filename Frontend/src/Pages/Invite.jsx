import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = "https://full-stack-saas-notes-application.onrender.com/api";

const Invite = ({ token, tenantSlug}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const handleInvite = async () => {
    try {
      await axios.post(
        `${API_URL}/users/invite`,
        { email, role, tenantId: tenantSlug },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User invited!", "success");
      setEmail("");
      setRole("member");
    } catch (err) {
      toast.error("Failed to invite user.", "error");
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Invite User</h3>
      <input
        className="border p-2 mb-2 w-full"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="User email"
      />
      <select
        className="border p-2 mb-2 w-full"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleInvite}
      >
        Invite
      </button>
    </div>
  );
};

export default Invite;