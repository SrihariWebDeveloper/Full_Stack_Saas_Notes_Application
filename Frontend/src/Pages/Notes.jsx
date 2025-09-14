import React, { useEffect, useState } from "react";
import axios from "axios";
import Upgrade from "./Upgrade.jsx";
import Invite from "./Invite.jsx";
import { toast } from "react-toastify";
const API_URL = "http://localhost:5000/api";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
};

const Notes = ({ token}) => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [limitReached, setLimitReached] = useState(3);
  const [tenantSlug, setTenantSlug] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const payload = decodeJWT(token);
    setTenantSlug(payload.tenantId);
    setRole(payload.role);

    axios
      .get(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setNotes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNotes([]));
  }, [token]);

  const createNote = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/notes`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Note created:", res.data);
      setNotes([...notes, res.data]);
      setContent("");
      toast.success("Note added!", "success");
      setLimitReached(false);
    } catch (err) {
      console.error("Error creating note:", err);
      if (err.response && err.response.status === 403) {
        setLimitReached(true);
        toast.error(err.response.data.error || "Note limit reached! Upgrade to Pro.", "error");
      } else {
        toast.error("Failed to add note.", "error");
      }
    }
  };

  const deleteNote = async id => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter(n => n._id !== id));
      toast.success("Note deleted!", "success");
    } catch {
      toast.error("Failed to delete note.", "error");
    }
  };

  const updateNote = async (id, newContent) => {
    try {
      const res = await axios.put(
        `${API_URL}/notes/${id}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(notes.map(n => (n._id === id ? res.data : n)));
      toast.success("Note updated!", "success");
    } catch {
      toast.error("Failed to update note.", "error");
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">Your Notes</h2>

      {/* Admin-only features */}
      {role == "admin" && (
        <>
          <Invite token={token} tenantSlug={tenantSlug}/>
          <Upgrade token={token} tenantSlug={tenantSlug} />
        </>
      )}

      {/* Member and Admin can view/create/delete/update notes */}
      <ul className="mb-4 mt-04">
        {notes.map(n => (
          <li key={n._id} className="flex justify-between items-center mb-2 mt-4">
            <span>{n.content}</span>
            <div className="flex gap-2">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => deleteNote(n._id)}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => {
                  const newContent = prompt("Edit note:", n.content);
                  if (newContent && newContent !== n.content) {
                    updateNote(n._id, newContent);
                  }
                }}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
      <input
        className="border p-2 mb-2 w-full"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="New note"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={createNote}
      >
        Add Note
      </button>
      
      {limitReached && (
        <div className="mt-4">
          <strong className="text-red-600">Upgrade to Pro to add more notes!</strong>
        </div>
      )}
    </div>
  );
};

export default Notes;