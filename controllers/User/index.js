const User = require("./../../models/user.model");
const Room = require("./../../models/room.model");

const createUser = async (req, res) => {
  console.log(req.body);
  const { uid, displayName, photoURL, email } = req.body;
  const user = {
    uid,
    displayName,
    photoURL,
    email,
  };
  try {
    const userRes = await User.create(user);
    res.json({ success: true, user: userRes }).status(201);
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
};
const getUser = async (req, res) => {
  console.log(req.body);

  let query = {};
  const { email, uid } = req.body;
  if (uid) query["uid"] = uid;
  if (email) query["email"] = email;
  console.log(query);

  try {
    const user = await User.findOne(query).populate("rooms");

    return res.json({ success: true, user }).status(200);
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "User not found" }).status(404);
  }
};

const addRooms = async (req, res) => {
  console.log(req.body);
  const { email, roomId } = req.body;
  let room;
  try {
    room = await Room.findOne({ roomID: roomId });
    console.log(room);
  } catch (error) {
    return res.json({ success: false, message: "Room not found" }).status(404);
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { rooms: room._id } }
    );
    if (user.rooms.length >= 7) {
      user = await User.findOneAndUpdate({ email }, { $pop: { rooms: -1 } });
    }
    return res.json({ success: true, user: user }).status(200);
  } catch (err) {
    console.error(err);
    return res
      .json({ success: false, message: "Something went wrong" })
      .status(500);
  }
};

module.exports = {
  createUser,
  getUser,
  addRooms,
};
