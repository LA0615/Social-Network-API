const connection = require("../config/connection");
const { Thought, User } = require("../models");
const { thoughts, users } = require("./data");

connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

connection.once("open", async () => {
  console.log("connected to database");

  try {
    //Delete existing collections if they exist
    await Promise.all([User.deleteMany({}), Thought.deleteMany({})]);

      //Seed users
      const createdUsers = await User.insertMany(users);

      for (let user of createdUsers) {
        const createdThoughts = await Thought.insertMany(
          thoughts.map((thought) => ({ ...thought, username: user.username }))
        );
        await User.findByIdAndUpdate(user._id, {
          thoughts: createdThoughts.map((thought) => thought._id),
        });
      }

      //update userIds in thoughts
      const updatedThoughts = thoughts.map((thought) => {
        const user = createdUsers.find(
          ({ username }) => username === thought.username
        );
        return { ...thought, userId: user._id };
      });

      //Seed thoughts
      await Thought.insertMany(updatedThoughts);
      console.log("Seed data successfully added!");

      console.log("All data was successfully seeded!");


  } catch (err) {
    console.error("Error seeding data:", err);
  }

  process.exit(0);
});
