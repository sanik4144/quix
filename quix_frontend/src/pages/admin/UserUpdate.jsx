import { Briefcase, Mail, User } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect } from "react";
import api from "../../services/api";
import { Navigate, useParams } from "react-router-dom";

const UserUpdate = () => {
  const [loading, setLoading] = useState(false);
  const {id} = useParams()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async ()=>{
    try {
      await api.put(`admin/users/${id}/update`, formData);
      setLoading(false);
      alert("Updated Successfully");
    } catch (error) {
      alert("Failed to Update");
    }
  }

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}/fetch`);
      const user = res.data.user;

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        remarks: user.remarks || "",
      });
    } catch (error) {
      alert("User not found");
    }
  };

  fetchUser();
}, [id]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage users, approve registrations, and assign roles.</p>
      </div>

      <form onSubmit={() => {}} className="auth-form">
        <div className="input-group">
          <label>Full Name</label>
          <div className="input-wrapper">
            <User className="input-icon" size={20} />
            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Remarks</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              name="remarks"
              type="text"
              placeholder="Your new remark"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
        </div>

        <button 
          onClick={()=>{ updateUser()}} 
          type="submit" 
          className="btn-primary" 
          disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default UserUpdate;
