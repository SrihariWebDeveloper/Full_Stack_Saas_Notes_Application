import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Upgrade = ({ token, tenantSlug }) => {
  const [plane,setPlan] = useState("free");
  const handleUpgrade = async () => {
    try {
      const res = await axios.post(
        `https://full-stack-saas-notes-application.onrender.com/api/tenants/${tenantSlug}/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url; 
      if(res.status === 200) setPlan(res.data.tenantData);
      toast.success("Redirecting to payment...", "success");
    } catch {
      toast.error("Payment failed!");
    }
  };
  return(
    <>
    <div className="flex flex-row justify-around items-center gap-4">
    <button
      className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
    >
      Free Plan
    </button>
    <button
      className={`${plane === 'pro' ? ' bg-green-600 text-white' : ' bg-white border px-4 py-2 cursor-pointer' } rounded`}
      onClick={handleUpgrade}
    >
      Upgrade to Pro
    </button>
    </div>
    </>
  )
};

export default Upgrade;
