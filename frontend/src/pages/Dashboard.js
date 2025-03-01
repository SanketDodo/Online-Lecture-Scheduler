import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [lectures, setLectures] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    meetingLink: "",
  });
  const [editLectureId, setEditLectureId] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(""); // Store user role
  const token = localStorage.getItem("token");

  // 🔹 Fetch Lectures & User Role
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/lectures", {
        headers: { Authorization: token },
      })
      .then((res) => setLectures(res.data))
      .catch((err) => console.log("Failed to load lectures", err));

    axios
      .get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log("User role:", res.data.role); // Debugging
        setUserRole(res.data.role);
      })
      .catch((err) => {
        console.error("Error fetching user role:", err.response?.data || err);
        setError("Failed to get user role");
      });
  }, []);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Form Submit (Create/Update Lecture)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLectureId) {
        // Update Lecture
        await axios.put(
          `http://localhost:5000/api/lectures/${editLectureId}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        // Create New Lecture
        await axios.post("http://localhost:5000/api/lectures/create", formData, {
          headers: { Authorization: token },
        });
      }

      // Refresh lectures after create/update
      const res = await axios.get("http://localhost:5000/api/lectures", {
        headers: { Authorization: token },
      });
      setLectures(res.data);

      // Reset form
      setFormData({ title: "", date: "", time: "", meetingLink: "" });
      setEditLectureId(null);
    } catch (err) {
      console.error("Failed to create/update lecture:", err);
      setError("Failed to create or update lecture");
    }
  };

  // 🔹 Handle Edit Lecture
  const handleEdit = (lecture) => {
    setFormData({
      title: lecture.title,
      date: lecture.date,
      time: lecture.time,
      meetingLink: lecture.meetingLink,
    });
    setEditLectureId(lecture._id);
  };

  // 🔹 Handle Delete Lecture
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/lectures/${id}`, {
        headers: { Authorization: token },
      });

      // Refresh lectures after delete
      setLectures(lectures.filter((lecture) => lecture._id !== id));
    } catch (err) {
      console.error("Failed to delete lecture:", err);
      setError("Failed to delete lecture");
    }
  };

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <h2>Upcoming Lectures</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <ul>
        {lectures.map((lecture) => (
          <li key={lecture._id}>
            <b>{lecture.title}</b> - {lecture.date} at {lecture.time}
            <br />
            <a href={lecture.meetingLink} target="_blank" rel="noopener noreferrer">
              Join
            </a>
            {(userRole === "teacher" || userRole === "admin") && (
              <>
                <button className="edit-btn" onClick={() => handleEdit(lecture)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(lecture._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
  
      {(userRole === "teacher" || userRole === "admin") && (
        <>
          <h3>{editLectureId ? "Edit Lecture" : "Create a New Lecture"}</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            <input type="text" name="meetingLink" placeholder="Meeting Link" value={formData.meetingLink} onChange={handleChange} required />
            <button type="submit">{editLectureId ? "Update Lecture" : "Create Lecture"}</button>
          </form>
        </>
      )}
  
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
  

  // return (
  //   <div>
  //     <h2>Upcoming Lectures</h2>
  //     {error && <p style={{ color: "red" }}>{error}</p>}

  //     {/* Lecture List */}
  //     <ul>
  //       {lectures.map((lecture) => (
  //         <li key={lecture._id}>
  //           <b>{lecture.title}</b> - {lecture.date} at {lecture.time}
  //           <br />
  //           <a href={lecture.meetingLink} target="_blank" rel="noopener noreferrer">
  //             Join
  //           </a>
  //           {userRole === "teacher" || userRole === "admin" ? (
  //             <>
  //               <button onClick={() => handleEdit(lecture)}>Edit</button>
  //               <button onClick={() => handleDelete(lecture._id)}>Delete</button>
  //             </>
  //           ) : null}
  //         </li>
  //       ))}
  //     </ul>

  //     {/* Create/Update Lecture Form (Only for Teachers/Admins) */}
  //     {(userRole === "teacher" || userRole === "admin") && (
  //       <>
  //         <h3>{editLectureId ? "Edit Lecture" : "Create a New Lecture"}</h3>
  //         <form onSubmit={handleSubmit}>
  //           <input
  //             type="text"
  //             name="title"
  //             placeholder="Title"
  //             value={formData.title}
  //             onChange={handleChange}
  //             required
  //           />
  //           <input
  //             type="date"
  //             name="date"
  //             value={formData.date}
  //             onChange={handleChange}
  //             required
  //           />
  //           <input
  //             type="time"
  //             name="time"
  //             value={formData.time}
  //             onChange={handleChange}
  //             required
  //           />
  //           <input
  //             type="text"
  //             name="meetingLink"
  //             placeholder="Meeting Link"
  //             value={formData.meetingLink}
  //             onChange={handleChange}
  //             required
  //           />
  //           <button type="submit">{editLectureId ? "Update Lecture" : "Create Lecture"}</button>
  //         </form>
  //       </>
  //     )}

  //     <button onClick={handleLogout}>Logout</button>
  //   </div>
  // );


}

export default Dashboard;
