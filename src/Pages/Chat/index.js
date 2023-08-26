import React from "react";
import { useState } from "react";
import MobSearchIcon from "../../assets/Images/MobSearch";
import User from "../../assets/Images/sidelink-user.svg";
import DashboardLogo from "../../assets/Images/DashboardLogo";
import LogoIcon from "../../assets/Images/Logo";
import SideLinkSettings from "../../assets/Images/sideLinkSettings";
import { Link, useNavigate, useParams } from "react-router-dom";
import CrossIcon from "../../assets/Images/Cross";
import { useEffect } from "react";
import MenuBarIcon from "../../assets/Images/MenuBar";
import AppFooter from "../../Components/Footer";
import { toast } from "react-toastify";
import Hooks from "../../hooks";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useRef } from "react";
import { PostMedia, PostMessage } from "../../Api";
import Socket from "../../Socket";
import GoBackIcon from "../../assets/Images/GoBack";
import ChatCameraIcon from "../../assets/Images/ChatCamera";
import SendMessageChatIcon from "../../assets/Images/SendMessage";
import axios from "axios";
import EmptyDataImage from "../../assets/Images/EmptyData";
import { Row } from "react-bootstrap";
import Premiumicon from "../../assets/Images/PremiumIcon";

const Chat = () => {
  const [responsiveChat, setResponsiveChat] = useState(false);
  const [recentChats, setrecentChats] = useState(true);
  const [chat, setChat] = useState(false);
  const [recentChatsData, setrecentChatsData] = useState([]);
  const [selectedChatData, setSelectedChatData] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversationType, setconversationType] = useState("");
  const [currentUserData, setcurrentUserData] = useState([]);
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const params = useParams();
  const { Logout } = Hooks();
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [sendMessage, setSendMessage] = useState({
    conversationId: "",
    sender: "",
    message: "",
  });
  const [currentChat, setCurrentChat] = useState(null);
  const scrollRef = useRef(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatData]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    if (windowSize[0] >= 768) {
      setResponsiveChat(true);
      setrecentChats(true);
    }
    if (windowSize[0] <= 767 && recentChats) {
      setResponsiveChat(false);
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize, recentChats]);

  useEffect(() => {
    const type = localStorage.getItem("platform");
    setconversationType(type);
    Socket.on("getMessage", (data) => {
      const newmessage = {
        receiverId: data.receiverId,
        sender: data.senderId,
        message: data.message,
      };
      setArrivalMessage(newmessage);
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      selectedChatData !== undefined &&
      selectedChatData[0]?.conversationId.members.includes(
        arrivalMessage.sender
      ) &&
      setSelectedChatData((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, selectedChatData]);

  const GetRecentChats = async (GetRecentChatsUrl) => {
    console.log(GetRecentChatsUrl);
    try {
      const fetchData = await axios.get(GetRecentChatsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setrecentChatsData(fetchData.data.userConversations);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const GetSelectedChat = async (GetSelectedChatUrl) => {
    try {
      const fetchData = await axios.get(GetSelectedChatUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedChatData(fetchData?.data.messages);
      console.log(fetchData?.data.messages[0].conversationId.members);
      const UserId = fetchData?.data.messages[0].conversationId.members[1];
      let GetUserUrl = `${process.env.REACT_APP_API_URI}users/${UserId}`;
      GetUser(GetUserUrl);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  const [selectedChatUser, setSelectedChatUser] = useState();
  const GetUser = async (GetUserUrl) => {
    try {
      const fetchData = await axios.get(GetUserUrl);
      setSelectedChatUser(fetchData?.data?.data?.doc);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("userdata");
    let data = JSON.parse(currentUser);
    setcurrentUserData(data);

    const currentUserToken = localStorage.getItem("user-token");
    setToken(currentUserToken);

    const type = localStorage.getItem("platform");
    setconversationType(type);

    let GetRecentChatsUrl = `${process.env.REACT_APP_API_URI}conversations/${params.id}/${type}`;
    setSendMessage((prevState) => ({
      ...prevState,
      sender: data._id,
    }));
    GetRecentChats(GetRecentChatsUrl);
  }, [params.id]);

  const GetChatData = (id) => {
    let GetSelectedChatUrl = `${process.env.REACT_APP_API_URI}messages/${id}`;
    GetSelectedChat(GetSelectedChatUrl);
  };

  const PostMessage = async (
    sendMessage,
    token,
    PostMessageUrl,
    messageData
  ) => {
    try {
      console.log(sendMessage);
      await axios.post(PostMessageUrl, sendMessage, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedChatData((pre) => [...pre, messageData]);
      setMessage("");

      const receiverId =
        (await selectedChatData) !== undefined &&
        selectedChatData[0]?.userConversations?.members?.find(
          (member) => member !== currentUserData._id
        );
      Socket.emit("sendMessage", {
        senderId: sendMessage?.sender,
        receiverId: receiverId,
        message: message,
        createdAt: new Date(),
      });
      let GetRecentChatsUrl = `${process.env.REACT_APP_API_URI}conversations/${params.id}/${conversationType}`;
      GetRecentChats(GetRecentChatsUrl);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  const SendMessageHandler = async () => {
    if (currentChat !== null) {
      if (message !== "") {
        const messageData = {
          conversationId: sendMessage?.conversationId,
          sender: sendMessage?.sender,
          message: sendMessage?.message,
          createdAt: new Date(),
          platform: conversationType,
        };
        setSendMessage((prevState) => ({
          ...prevState,
          message: "",
        }));
        const PostMessageUrl = `${process.env.REACT_APP_API_URI}messages`;

        PostMessage(messageData, token, PostMessageUrl, messageData);
      }
    } else {
      toast.error("Please select a chat");
    }
  };

  const SendMediaHandler = async () => {
    if (currentChat !== null) {
      if (mediaFile !== null) {
        var objectUrl = URL.createObjectURL(mediaFile);
        const messageData = {
          conversationId: sendMessage?.conversationId,
          sender: sendMessage?.sender,
          message: objectUrl,
          createdAt: new Date(),
          platform: conversationType,
        };
        const sendMedia = new FormData();
        sendMedia.append("chat_img", mediaFile);
        sendMedia.append("conversationId", sendMessage?.conversationId);
        sendMedia.append("sender", sendMessage?.sender);
        PostMedia(sendMedia, token);

        setSelectedChatData((pre) => [...pre, messageData]);

        const receiverId =
          (await selectedChatData) !== undefined &&
          selectedChatData[0]?.userConversations?.members?.find(
            (member) => member !== currentUserData._id
          );
        Socket.emit("sendMessage", {
          senderId: sendMessage?.sender,
          receiverId: receiverId,
          message: objectUrl,
          createdAt: new Date(),
        });
        setMediaFile(null);
        let GetRecentChatsUrl = `${process.env.REACT_APP_API_URI}conversations/${params.id}/${conversationType}`;
        GetRecentChats(GetRecentChatsUrl);
      }
    } else {
      toast.error("Please select a chat");
    }
  };

  const sideLinks =
    currentUserData?.userType === "retailer"
      ? [
          {
            name: "Home",
            link: "/home/retailer-dashboard",
          },
        ]
      : [
          {
            name: "Home",
            link: "/home",
          },
          {
            name: "Seed / Bud Swap",
            link: "/home/seed",
          },
          // {
          //   name: "Seed Store",
          //   link: "/home/seed",
          // },

          // {
          //   name: "Dispensary",
          //   link: "/home/dispensaries",
          // },
          // {
          //   name: "Cannabis Lounge",
          //   link: "/home/cannabis",
          // },
          // {
          //   name: "Head Store",
          //   link: "/home/headshops",
          // },
          {
            name: "Favourites",
            link: "/favourite",
          },
        ];

  return (
    <>
      <div className={`app-header ${!recentChats ? "d-none" : ""}`}>
        <div className="container px-4 mx-auto d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            {true && (
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className="d-md-none d-block"
              >
                <GoBackIcon />
              </div>
            )}
            <DashboardLogo />
            <h3 className="app-heading">GROW AND SHARE</h3>
          </div>
          <span onClick={() => setIsOpen(!isOpen)} className="cr-p">
            <MenuBarIcon />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className={`app-menu`}>
          <div>
            <div className="d-flex justify-content-end align-items-center">
              <span onClick={() => setIsOpen(!isOpen)} className="cr-p mb-4">
                <CrossIcon />
              </span>
            </div>
            <div className="d-flex align-items-center gap-2  mb-4 pb-3">
              <DashboardLogo />
              <div>
                <h3 className="font-18 font-weight-700">GROW AND SHARE</h3>
                <p className="font-10">
                  Cannabis Connections, Infinite Selections.
                </p>
              </div>
            </div>

            <div className="d-flex flex-column  side-links-main">
              {sideLinks.map((data, index) => {
                return (
                  <Link
                    onClick={() => setIsOpen(!isOpen)}
                    key={index}
                    to={data.link}
                    className={`${
                      data.link === Location.pathname ? "side-link-active" : ""
                    }  side-link`}
                  >
                    {data.icon} {data.name}
                  </Link>
                );
              })}
              <Link
                to={"/home/subscription"}
                className={`${
                  "/home/subscription" === Location.pathname
                    ? "text-primary-green"
                    : ""
                }  side-link d-flex justify-content-start align-items-center gap-2`}
              >
                Premium
                <Premiumicon />
              </Link>
              <p
                className="side-link border-0 cr-p"
                onClick={() => Logout(navigate)}
              >
                Logout
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-2 pt-4 section-2">
            <div className="dropdown">
              <div className="d-flex align-items-center gap-2" type="button">
                <img
                  src={
                    currentUserData.photo
                      ? `${process.env.REACT_APP_PORT}/${currentUserData.photo}`
                      : User
                  }
                  alt=""
                  className="side-link-user-img"
                />
                <div>
                  <h3 className="font-18 font-weight-700">
                    {currentUserData.fullName}
                  </h3>
                  <p className="font-10">{currentUserData.userType}</p>
                </div>
              </div>
            </div>
            <Link to={"/myaccount"}>
              <SideLinkSettings />
            </Link>
          </div>
        </div>
      )}

      <div
        className={`${
          !recentChats ? "chat-screen-content" : "chat-screen-content-footer"
        }`}
      >
        <div className={`${!recentChats ? "h-100" : ""} chat-screen `}>
          <div
            className={`${!recentChats ? "h-100" : ""} container mx-auto px-12`}
          >
            <div className={`${!recentChats ? "h-100" : ""}`}>
              <div className="row m-0 h-100">
                {recentChats && (
                  <div className="col-md-5 col-12 px-12">
                    <div className="seed-card flex-column px-0">
                      <div className="recent-chats-header mx-4 pb-4">
                        <div className="search-product">
                          <input
                            placeholder="Search User "
                            className="w-75 border-0 outline-0 bg-transparent"
                          />
                          <span className="icon-green-bg">
                            <MobSearchIcon />
                          </span>
                        </div>
                      </div>
                      <div className="recent-chats-detail">
                        <div
                          className="nav flex-column nav-pills"
                          id="v-pills-tab"
                          role="tablist"
                          aria-orientation="vertical"
                        >
                          {recentChatsData?.length !== 0 ? (
                            (recentChatsData || [])?.map((data, index) => {
                              return (
                                <>
                                  <button
                                    onClick={() => {
                                      GetChatData(data.conversation?._id);
                                      setSendMessage((prevState) => ({
                                        ...prevState,
                                        conversationId: data?.conversation?._id,
                                      }));
                                      setCurrentChat(data.conversation);
                                      setChat(true);
                                    }}
                                    key={index}
                                    className={`nav-link w-100  product-item   w-100 justify-content-start h-auto`}
                                    id={`v-pills-${data._id}-tab`}
                                    data-toggle="pill"
                                    href={`#v-pills-${data._id}`}
                                    role="tab"
                                    aria-controls={`v-pills-${data._id}`}
                                    aria-selected="true"
                                  >
                                    {data?.conversation?.members?.map(
                                      (user, index) => {
                                        if (user._id !== currentUserData._id) {
                                          return (
                                            <>
                                              <div
                                                className="d-md-flex d-none align-items-center w-100 gap-2"
                                                type="button"
                                              >
                                                <img
                                                  src={
                                                    user.photo
                                                      ? `${process.env.REACT_APP_PORT}/${user.photo}`
                                                      : User
                                                  }
                                                  alt=""
                                                  className="side-link-user-img border-0"
                                                />
                                                <div className="user-name py-4 w-100 d-flex flex-column gap-2 justify-content-start align-items-start">
                                                  <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                                                    <h3 className="font-18 font-weight-700">
                                                      {user.fullName ||
                                                        user.storeName}
                                                    </h3>
                                                    <p className="font-12 font-weight-500 d-lg-block d-md-none d-block">
                                                      {data.message
                                                        ? timeAgo.format(
                                                            new Date(
                                                              data.message?.createdAt
                                                            )
                                                          )
                                                        : ""}
                                                    </p>
                                                  </div>
                                                  <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                                                    <p className="font-14 font-weight-500">
                                                      {data.message
                                                        ? data.message?.message.includes(
                                                            "uploads"
                                                          )
                                                          ? "Image"
                                                          : data.message?.message.includes(
                                                              "interested"
                                                            )
                                                          ? "Interested in sharing product"
                                                          : data.message
                                                              ?.message
                                                        : ""}
                                                    </p>
                                                    <p className="font-12 font-weight-500 d-lg-none d-md-block d-none">
                                                      {data.message
                                                        ? timeAgo.format(
                                                            new Date(
                                                              data.message?.createdAt
                                                            )
                                                          )
                                                        : ""}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="d-md-none d-flex align-items-center w-100 gap-2"
                                                type="button"
                                                onClick={() => {
                                                  setResponsiveChat(true);
                                                  setrecentChats(false);
                                                }}
                                              >
                                                <img
                                                  key={index}
                                                  src={
                                                    user.photo
                                                      ? `${process.env.REACT_APP_PORT}/${user.photo}`
                                                      : User
                                                  }
                                                  alt=""
                                                  className="side-link-user-img border-0"
                                                />
                                                <div className="user-name py-4 w-100 d-flex flex-column gap-2 justify-content-start align-items-start">
                                                  <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                                                    <h3 className="font-18 font-weight-700">
                                                      {user.fullName ||
                                                        user.storeName}
                                                    </h3>
                                                    <p className="font-12 font-weight-500">
                                                      {data.message
                                                        ? timeAgo.format(
                                                            new Date(
                                                              data.message?.createdAt
                                                            )
                                                          )
                                                        : ""}
                                                    </p>
                                                  </div>
                                                  <p className="font-14 font-weight-500">
                                                    <p className="font-14 font-weight-500">
                                                      {data.message
                                                        ? data.message?.message.includes(
                                                            "uploads"
                                                          )
                                                          ? "Image"
                                                          : data.message?.message.includes(
                                                              "interested"
                                                            )
                                                          ? "Interested in sharing product"
                                                          : data.message
                                                              ?.message
                                                        : ""}
                                                    </p>
                                                  </p>
                                                </div>
                                              </div>
                                            </>
                                          );
                                        }
                                      }
                                    )}
                                  </button>
                                </>
                              );
                            })
                          ) : (
                            <div className="d-flex justify-content-center p-5 h-100 svg-100 ">
                              <EmptyDataImage />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {responsiveChat &&
                  (chat ? (
                    <div className="col-md-7 col-12 px-12">
                      <div className="seed-card h-100 px-0 py-sm-3 py-0">
                        <div className="w-100  chat-detail">
                          <div
                            className="d-flex align-items-center justify-content-enduser-name pb-4 mb-4 chat-detail-header pt-sm-0 pt-4 px-4"
                            type="button"
                          >
                            <div
                              onClick={() => {
                                setResponsiveChat(false);
                                setrecentChats(true);
                              }}
                              className="d-md-none d-block"
                            >
                              <GoBackIcon />
                            </div>

                            <img
                              src={
                                selectedChatUser?.photo
                                  ? `${process.env.REACT_APP_PORT}/${selectedChatUser?.photo}`
                                  : User
                              }
                              alt=""
                              className="side-link-user-img border-0"
                            />
                            <div className="w-100 d-flex flex-column justify-content-start align-items-start">
                              <h3 className="font-18 font-weight-700">
                                {currentChat
                                  ? selectedChatUser?.fullName ||
                                    selectedChatUser?.storeName
                                  : "Username"}
                              </h3>

                              <div className="w-100 d-flex flex-column justify-content-start align-items-start">
                                <h3 className="font-18 font-weight-700">
                                  {currentChat
                                    ? currentChat?.conversation?.members.map(
                                        (user, index) => {
                                          if (
                                            user._id !== currentUserData._id
                                          ) {
                                            return (
                                              <p key={index}>
                                                {user.fullName ||
                                                  user.storeName}
                                              </p>
                                            );
                                          }
                                        }
                                      )
                                    : "Username"}
                                </h3>

                                <div className="d-flex justify-content-start align-items-center gap-2">
                                  <svg
                                    width="9"
                                    height="9"
                                    viewBox="0 0 9 9"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="4.29825"
                                      cy="4.29825"
                                      r="4.29825"
                                      fill="#5D8B2F"
                                    />
                                  </svg>
                                  <p className="font-14 font-weight-400 text-grey">
                                    {" "}
                                    Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="chat-detail-body px-4 ">
                            <div className="new-msg d-flex flex-column gap-3 ">
                              {selectedChatData?.length > 0 &&
                                (selectedChatData || [])?.map((chat, index) => {
                                  return (
                                    <div
                                      ref={scrollRef}
                                      key={index}
                                      className={`${
                                        chat.sender === currentUserData._id
                                          ? "send-msg"
                                          : "rcv-msg"
                                      }`}
                                    >
                                      <div className="msg h-100">
                                        {chat.message.includes(
                                          "uploads\\chat\\"
                                        ) || chat.message.includes("blob") ? (
                                          <img
                                            className="w-100 chat-image mb-2 rounded-3"
                                            src={`${
                                              chat.message.includes("blob")
                                                ? ""
                                                : `${process.env.REACT_APP_PORT}/`
                                            }${
                                              Array.isArray(chat.message)
                                                ? chat.message[0]
                                                : chat.message
                                            }`}
                                            alt=""
                                          />
                                        ) : (
                                          chat.message
                                        )}

                                        <span className="d-flex justify-content-end font-12 pt-1 text-grey">
                                          {timeAgo.format(
                                            new Date(chat.createdAt)
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>

                          <div className="chatbox-footer px-4 mb-sm-0 mb-3 pb-sm-0 pb-1 mt-2 bg-white">
                            <div className="row m-0">
                              <div className="col-lg-2 col-md-3 col-sm-2 col-3 p-0 d-flex justify-content-sm-start justify-content-around">
                                <label className="bg-primary-green w-max-content p-3 rounded-4 cr-p">
                                  <ChatCameraIcon />
                                  <input
                                    className="d-none"
                                    type="file"
                                    accept="image/png, image/jpg, image/jpeg"
                                    onChange={(e) =>
                                      setMediaFile(e.target.files[0])
                                    }
                                  />
                                </label>
                              </div>
                              <div className="col-lg-10 col-md-9 col-sm-10 col-9 p-0">
                                <div className="send-message-box w-100">
                                  {typeof mediaFile === "undefined" ||
                                  mediaFile === null ? (
                                    <>
                                      <textarea
                                        onChange={(e) => {
                                          setSendMessage((prevState) => ({
                                            ...prevState,
                                            message: e.target.value,
                                          }));
                                          setMessage(e.target.value);
                                        }}
                                        value={sendMessage.message}
                                        onKeyDown={(e) => {
                                          if (e.keyCode === 13) {
                                            SendMessageHandler();
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }
                                        }}
                                        placeholder="Type a message"
                                        className="chatbox w-100"
                                        name="chatbox"
                                        minLength="2"
                                      ></textarea>
                                      <span
                                        onClick={() => SendMessageHandler()}
                                        className="cr-p"
                                      >
                                        <SendMessageChatIcon />
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {mediaFile && (
                                    <div className="send-message-box w-100 py-2 my-1">
                                      <p className="m-0 p-0 cut-text">
                                        {mediaFile.name}
                                      </p>
                                      {mediaFile && (
                                        <span
                                          onClick={() => SendMediaHandler()}
                                          className="cr-p"
                                        >
                                          <SendMessageChatIcon />
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-7 col-12 px-12">
                      <div className="seed-card h-100 px-0 py-sm-3 py-0">
                        <div className="w-100 h-100 chat-detail">
                          <Row className="w-100 h-100">
                            <div className="custom-msg-text">
                              <div className="!w-100 ">
                                <span className="custom-msg-img">
                                  <LogoIcon />
                                </span>
                                <h1 className="custom-msg-heading">
                                  Grow And Share
                                </h1>
                                <p className="text-center">
                                  Send and Receive messages without keeping your
                                  phone online
                                </p>
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="d-md-block d-none">
          <AppFooter />
        </div>
      </div>
    </>
  );
};

export default Chat;
