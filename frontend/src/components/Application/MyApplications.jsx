import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length <= 0 ? (
            <>
              {" "}
              <h4>No Applications Found</h4>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length <= 0 ? (
            <>
              <h4>No Applications Found</h4>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span>
            <div className="cover-letter-content">
              {element.coverLetter}
            </div>
          </p>

        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal }) => {
  const [showForm, setShowForm] = useState(false);
  const [emailData, setEmailData] = useState({ to: "", subject: "", text: "" });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmailData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleApprove = (id) => {
    const requestBody = {
      id: id,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text
    };
    axios
      .post(
        `http://localhost:4000/api/v1/application/approve/${id}`,
        requestBody,
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Email sent successfully");
        // Hide the form after approval
        setShowForm(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        toast.error("Failed to send email");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call handleApprove function with the application ID
    handleApprove(element._id);
    // Reset emailData
    setEmailData({ to: "", subject: "", text: "" });
  };

  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span>
            <div className="cover-letter-content">
              {element.coverLetter}
            </div>
            </p>
            {element.approved && (
            <p>
              <span>Approved:</span>{" "}
              <span style={{ color: "green" }}>✓</span>
            </p>
          )}
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
      </div>
         
      {!element.approved && (
          <div className="approve">
            <button
              onClick={toggleForm}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>
            {showForm && (
              <form onSubmit={handleSubmit}>
                <label htmlFor="to">To:</label>
                <input
                  type="email"
                  name="to"
                  placeholder="To"
                  value={emailData.to}
                  onChange={handleChange}
                  className="form-input"
                  disabled={element.approved}
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={emailData.subject}
                  onChange={handleChange}
                  className="form-input"
                  disabled={element.approved}
                />
                <textarea
                  name="text"
                  placeholder="Message"
                  value={emailData.text}
                  onChange={handleChange}
                  className="form-textarea"
                  disabled={element.approved}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        )}
    </>
  );
};
   
