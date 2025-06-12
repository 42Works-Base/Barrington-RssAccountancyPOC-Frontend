import { useEffect, useState } from "react";
import "./Dashboard.css"; // We'll create this CSS file next
import loading from "../../assets/Rolling@1x-1.0s-200px-200px.gif";
import Popup from "../../Components/popup/Popup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BankStatements from "./BankStatement";
const VITE_API_URL = import.meta.env.VITE_API_URL;
export default function Dashboard() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isbuttonLoading, setIsButtonLoading] = useState(null);
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState({
    name: localStorage.getItem("firstName"),
    gender: localStorage.getItem("gender"), // can be "male", "female", or "other"
    role: "Employee",
    notifications: 5,
    tasks: 8,
  });

  const [isConnected, setIsConnected] = useState(false);

  // Toggle gender for demonstration purposes
  const toggleGender = () => {
    const genders = ["male", "female", "other"];
    const currentIndex = genders.indexOf(user.gender);
    const nextIndex = (currentIndex + 1) % genders.length;
    setUser({ ...user, gender: genders[nextIndex] });
  };

  const getAvatarByGender = () => {
    switch (user.gender) {
      case "male":
        return (
          <div className="avatar-container male">
            <img
              src="https://avatar.iran.liara.run/public/boy"
              alt=""
              style={{ width: "-webkit-fill-available" }}
            />
            {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21v-2a7 7 0 0 0-7-7h-2a7 7 0 0 0-7 7v2" />
            </svg> */}
          </div>
        );
      case "female":
        return (
          <div className="avatar-container female">
            <img
              src="https://avatar.iran.liara.run/public/girl"
              alt=""
              style={{ width: "-webkit-fill-available" }}
            />
            {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="5" />
              <path d="M12 21v-5m-4 1h8" />
              <path d="M12 16v-3" />
            </svg> */}
          </div>
        );
      case "others":
        return (
          <div className="avatar-container other">
            <img
              src="https://avatar.iran.liara.run/public"
              alt=""
              style={{ width: "-webkit-fill-available" }}
            />
            {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="5" />
              <path d="M12 21v-3m-3-2h6" />
            </svg> */}
          </div>
        );
    }
  };

  const handleLogout = async () => {
    console.log("handle")
    const response = await axios.post(
      `${VITE_API_URL}/onboarding/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response);
    if (response.data.success) {
      toast.success(response.data.message);
      setIsPopupOpen(false);
      navigate("/login");
      localStorage.clear();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          `${VITE_API_URL}/onboarding/getuserdetails`,
          {},
          {
            withCredentials: true, // Needed to include session cookie
          }
        );

        setUsers(response.data.data);
        console.log("User data:", response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Optional: Redirect to login or show error message
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Check local storage for existing valid token
    const storedToken = localStorage.getItem('access_token');
    const storedExpirationTime = localStorage.getItem('expiration_time');
    const currentTime = Date.now();

    if (storedToken && storedExpirationTime && currentTime < parseInt(storedExpirationTime)) {
      setIsConnected(true);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expiration_time');
      setIsConnected(false);
    }

    // Listen for message from the authentication window
    const handleMessage = (event) => {
      console.log("event id her", event)
      if (event.origin === `${import.meta.env.VITE_API_ORIGIN}`) {
        console.log("event id her 2", event)
        const { access_token, expiration_time } = event.data;
        if (access_token && expiration_time) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('expiration_time', expiration_time);
          setIsConnected(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleConnect = () => {
    // window.open('http://localhost:3000/auth', '_blank');

    // const authUrl = 'http://localhost:3000/auth';
    const authUrl = `${VITE_API_URL}/auth`;
    const popup = window.open(authUrl, 'authPopup', 'width=500,height=600');

    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      return;
    }
  
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        // handleAuthCompletion();
      }
    }, 500);
  };

  return (
    <div className="dashboard-container">
      {isPopupOpen && (
        <Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen}>
          <div className="add-emp-pop-msg">
            Are you sure you want to logout ?
          </div>
          <div className="add-emp-btns">
            <button
              className={`${
                isbuttonLoading ? "disabled-btn" : ""
              } confirm-btn `}
              onClick={() => handleLogout()}
            >
              {isbuttonLoading ? (
                <img className="loading-image" src={loading} alt="loading..." />
              ) : (
                <p>Yes</p>
              )}
            </button>
            <button
              className="cancel-btn"
              onClick={() => setIsPopupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Popup>
      )}
      {/* <button className="connect-btn">Connect to your bank account!</button> */}
     <div className="p-4 d-flex">
     <div className="btn-table-container">
     <div >
      {isConnected ? (
        <button disabled className="connect-btn btn-success btn" b>Connected</button>
      ) : (
        <button onClick={handleConnect} className="connect-btn">Connect to your bank</button>
      )}
    </div>
   
      <BankStatements/>
     </div>
      <div className="logout-btn-container">
      <button className="logout-btn" onClick={() => setIsPopupOpen(true)}>
        <svg
          className="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </button>
      </div>
     </div>
      
      {/*
      <div className="sidebar">
        <div className="logo">
          <h1>Dashboard</h1>
        </div>

        <div className="user-profile">
          {user.gender && getAvatarByGender()}
          {!user.gender && <img src={`https://avatar.iran.liara.run/username?username=${users?.user?.firstName}+${users?.user?.lastName}]`} alt="" style={{width:'60px'}}/>}
      
          <div className="user-name">
            {users?.user?.firstName} {users?.user?.lastName}
          </div>
          <div className="user-role">{user.role}</div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item active">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Projects</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Analytics</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Calendar</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Messages</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
              </a>
            </li>
          </ul>

          <button className="logout-btn" onClick={() => setIsPopupOpen(true)}>
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      </div>

  
      <div className="main-content">
  
        <header className="header">
          <h1>Welcome Back, {users?.user?.firstName}!</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {user.notifications > 0 && (
                <span className="notification-badge">{user.notifications}</span>
              )}
            </button>
            <button className="settings-btn">
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </header>


        <div className="dashboard-content">

          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-title">Total Projects</div>
              <div className="stat-value">
                <span className="stat-number">24</span>
                <span className="stat-change positive">+12%</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Pending Tasks</div>
              <div className="stat-value">
                <span className="stat-number">{user.tasks}</span>
                <span className="stat-change negative">+2</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Team Members</div>
              <div className="stat-value">
                <span className="stat-number">17</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Completed</div>
              <div className="stat-value">
                <span className="stat-number">86%</span>
                <span className="stat-change positive">+4%</span>
              </div>
            </div>
          </div>

     
          <div className="chart-activity-container">
            <div className="chart-container">
              <h2>Weekly Progress</h2>
              <div className="chart">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => {
                    const heights = [
                      "20%",
                      "40%",
                      "50%",
                      "30%",
                      "60%",
                      "25%",
                      "45%",
                    ];
                    return (
                      <div key={day} className="chart-column">
                        <div
                          className="chart-bar"
                          style={{ height: heights[index] }}
                        ></div>
                        <div className="chart-label">{day}</div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="activity-container">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {[
                  { text: "Design team meeting", time: "10:00 AM" },
                  { text: "Project review", time: "11:30 AM" },
                  { text: "Client presentation", time: "2:00 PM" },
                  { text: "Weekly report due", time: "5:00 PM" },
                ].map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-text">{activity.text}</div>
                      <div className="activity-time">
                        Today at {activity.time}
                      </div>
                    </div>
                    <div className="activity-status"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

  
          <div className="tasks-container">
            <div className="tasks-header">
              <h2>Current Tasks</h2>
              <button className="add-task-btn">Add Task</button>
            </div>
            <div className="tasks-content">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      task: "Design homepage mockup",
                      priority: "High",
                      date: "Apr 25",
                      status: "In Progress",
                    },
                    {
                      task: "User research analysis",
                      priority: "Medium",
                      date: "Apr 26",
                      status: "To Do",
                    },
                    {
                      task: "Content review",
                      priority: "Low",
                      date: "Apr 30",
                      status: "To Do",
                    },
                    {
                      task: "Release planning",
                      priority: "High",
                      date: "Apr 24",
                      status: "Completed",
                    },
                  ].map((task, index) => {
                    let priorityClass;
                    switch (task.priority) {
                      case "High":
                        priorityClass = "priority-high";
                        break;
                      case "Medium":
                        priorityClass = "priority-medium";
                        break;
                      case "Low":
                        priorityClass = "priority-low";
                        break;
                    }

                    let statusClass;
                    switch (task.status) {
                      case "In Progress":
                        statusClass = "status-progress";
                        break;
                      case "To Do":
                        statusClass = "status-todo";
                        break;
                      case "Completed":
                        statusClass = "status-completed";
                        break;
                    }

                    return (
                      <tr key={index}>
                        <td>{task.task}</td>
                        <td>
                          <span className={`priority ${priorityClass}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.date}</td>
                        <td>
                          <span className={`status ${statusClass}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}


    </div>
  );
}

{
  /* <button 
          onClick={toggleGender} 
          className="change-avatar-btn">
            Change Avatar- {user.gender}
          </button> */
}
