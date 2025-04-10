import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios"
const socket = io("http://localhost:8081", { withCredentials: true });

const Chat = ({ initialUser }) => {

    const user = initialUser;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [file, setFile] = useState(null);


    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const sendMessage = () => {
        if (!message.trim() || !selectedUser) return;
        
        const data = {
            senderId: user.id,
            receiverId: selectedUser,
            text: message,
        };

        socket.emit("sendMessage", data);

        setMessages((prev) => ({
            ...prev,
            [selectedUser]: [...(prev[selectedUser] || []), data],
        }));

        setMessage("");
    };
    const filteredUsers = userList.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected || !selectedUser) return;

        setFile(selected);

        const formData = new FormData();
        formData.append("file", selected);
        formData.append("senderId", user.id);
        formData.append("receiverId", selectedUser);

        try {
            const res = await axios.post("http://localhost:8081/api/attach", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const messageData = res.data.data;
            

            socket.emit("sendMessage", {
                senderId: user.id,
                receiverId: selectedUser,
                file: messageData.file,
            });
            setMessages((prev) => ({
                ...prev,
                [selectedUser]: [...(prev[selectedUser] || []), messageData],
            }));
        } catch (err) {
            console.error("Error uploading file", err);
        }
    };




    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:8081/api/auth/user");
                const data = (await res.json()).data;
                const filtered = data.filter((u) => u.id !== user.id);
                setUserList(filtered);
            } catch (err) {
                console.error("Error fetching user list", err);
            }
        };

        fetchUsers();
        console.log("Emitting registerUser:", user.id);
        socket.emit("registerUser", user.id);

        const handleReceiveMessage = (data) => {
            const senderId = data.senderId;
            setMessages((prev) => ({
                ...prev,
                [senderId]: [...(prev[senderId] || []), data],
            }));
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            // socket.disconnect();
        };
    }, [user.id]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            try {
                const res = await fetch(
                    `http://localhost:8081/api/chat-history?user1=${user.id}&user2=${selectedUser}`
                );
                const data = await res.json();
                setMessages((prev) => ({
                    ...prev,
                    [selectedUser]: data,
                }));
            } catch (err) {
                console.error("Failed to fetch chat history", err);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    const currentMessages = messages[selectedUser] || [];

    return (
        <div className="w-full  mx-auto h-[36rem] flex border rounded-xl overflow-hidden shadow-md">
            {/* Sidebar - Users List */}
            <div className="w-1/3 border-r bg-gray-100 flex flex-col">
                {/* Current User Info */}
                <div className="p-4 border-b bg-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-2">
                    <h3 className="font-bold text-lg mb-2">Chats</h3>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search user..."
                        className="mb-3 w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ul className="space-y-2">
                        {filteredUsers.map((u) => (
                            <li
                                key={u.id}
                                onClick={() => setSelectedUser(u.id)}
                                className={`cursor-pointer flex items-center gap-3 p-2 rounded transition-colors ${selectedUser === u.id
                                    ? "bg-blue-200 font-semibold"
                                    : "hover:bg-gray-200"
                                    }`}
                            >
                                <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                                    {u.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Selected User Info */}
                <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm">
                    {selectedUser ? (
                        <>
                            <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                                {
                                    userList.find((u) => u.id === selectedUser)?.name
                                        ?.charAt(0)
                                }
                            </div>
                            <div>
                                <p className="font-bold text-sm">
                                    {
                                        userList.find((u) => u.id === selectedUser)
                                            ?.name
                                    }
                                </p>
                                <p className="text-xs text-gray-500">
                                    {
                                        userList.find((u) => u.id === selectedUser)
                                            ?.email
                                    }
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400 italic p-2">Select a user to chat</p>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 scrollbar-hide">
                    {currentMessages.length === 0 && selectedUser && (
                        <p className="text-center text-gray-400 italic">
                            No messages yet
                        </p>
                    )}
                    {currentMessages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.senderId === user.id
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg shadow-sm break-words text-sm ${msg.senderId === user.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {msg.text && (
                                    <div>{msg.text}</div>
                                )}
                                {msg.file && (
                                    msg.file.includes(".jpg") || msg.file.includes(".png") || msg.file.includes(".jpeg") ? (
                                        <img src={msg.file} className="max-w-[200px] rounded" alt="sent" />
                                    ) : (
                                        <a href={msg.file} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                                            📎 Download file
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white flex gap-2">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 transition">
                        📎 Attach
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf,.doc,.docx"
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={sendMessage}
                        disabled={!selectedUser}
                        className={`px-4 py-2 rounded text-white ${!selectedUser
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Chat;
