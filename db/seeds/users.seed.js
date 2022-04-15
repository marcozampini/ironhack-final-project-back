const connect = require('../index')
const { faker } = require("@faker-js/faker");
const { default: mongoose } = require('mongoose')
const countries = require('./countries.json')

const User = require('../../models/User.model')
const Link = require('../../models/Link.model')

// Create fake users
function generateFakeUsers(quantity) {
  const users = [];
  for (let i = 0; i < quantity; i++) {
    const usernameValue = faker.internet.userName();
    let user = {
      email: faker.internet.email(),
      username: `${usernameValue}_fake`,
      avatarUrl: `https://avatars.dicebear.com/api/adventurer/${usernameValue}.svg`,
      password: "$2b$10$wN27fSja8gOfp.OFfULH9./pUZ0sYjtd2RX10CHT230WbDLo0RfV2",
    };
    users.push(user);
  }
  return users;
}

const perform = async () => {
  try {
    await connect();

    await User.deleteMany({ username: /\_fake$/ });

    const usersBatch = generateFakeUsers(20);
    const fakeUsersInDb = await User.create(usersBatch);

    fakeUsersInDb.forEach(user => console.log(`Seeded user ${user._id} -> ${user}.`))
    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error);
  }
}

perform()
