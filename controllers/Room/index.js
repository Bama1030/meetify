const Room = require("./../../models/room.model");
const { v4: uuidV4 } = require("uuid");

const createRoom = async (req, res) => {
  console.log(req.body);
  const { email, name } = req.body;
  const roomID = uuidV4();
  room = {
    admin: email,
    name,
    roomID: roomID,
  };
  try {
    const roomRes = await Room.create(room);
    res.json({ success: true, room: roomRes }).status(201);
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
};

const getRoom = async (req, res) => {
  console.log(req.body);

  let { room } = req.body;

  try {
    room = await Room.findOne({ roomID: room }).populate("user");

    return res.json({ success: true, room }).status(200);
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Room not found" }).status(404);
  }
};

const getRoomByUser = async (req, res) => {
  console.log(req.body);

  let { email } = req.body;

  try {
    const rooms = await Room.find({ admin: email });
    console.log(rooms);
    if (!rooms || rooms.length === 0) {
      return res
        .json({ success: false, message: "Room not found" })
        .status(404);
    } else {
      return res.json({ success: true, rooms }).status(200);
    }
  } catch (err) {
    console.error(err);
    return res
      .json({ success: false, message: "Something went wrong" })
      .status(500);
  }
};
const chatRoomMW = async (req, res) => {
  try {
    const room = await Room.findOne({ roomID: req.params.room });
    if (room) {
      return res.render("chatroom", { roomId: req.params.room });
    }
  } catch (err) {
    console.error(err);
    return res.redirect("/home");
  }
  return res.redirect("/home");
};
const roomMW = async (req, res) => {
  try {
    const room = await Room.findOne({ roomID: req.params.room });
    if (room) {
      return res.render("room", { roomId: req.params.room });
    }
  } catch (err) {
    console.error(err);
    return res.redirect("/home");
  }
  return res.redirect("/home");
};
module.exports = {
  createRoom,
  getRoom,
  getRoomByUser,
  chatRoomMW,
  roomMW,
};
