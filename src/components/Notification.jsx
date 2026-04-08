import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Bell } from "lucide-react";
import { useRef } from "react";

function Notification({ isDropdown = false }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.5;
    const socket = new SockJS("https://euphoria-be.onrender.com/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        stompClient.subscribe("/topic/orders", (message) => {
          const data = JSON.parse(message.body);

          setNotifications((prev) => [
            { id: data.id, message: data.message },
            ...prev,
          ]);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        });
      },
    });

    stompClient.activate();

    const handleClickOutside = () => {
      setOpen(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      stompClient.deactivate();
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={isDropdown ? "notif-inline" : "notification-container"}>
      <div className="notif-wrapper">

        {/* 🔔 Bell */}
        <div
          className="notif-bell"
          onClick={(e) => {
            e.stopPropagation(); // ✅ prevent closing immediately
            setOpen(!open);
          }}
        >
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="notif-count">{notifications.length}</span>
          )}
        </div>

        {/* 📦 Dropdown */}
        {open && (
          <div
            className="notif-dropdown"
            onClick={(e) => e.stopPropagation()} // ✅ prevent outside click trigger
          >
            {notifications.length === 0 ? (
              <p className="empty">No new orders</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="notif-item"
                  onClick={() => {
                    removeNotification(n.id);
                    navigate(`/orders/${n.id}`);
                  }}
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;