const connection = require('../config/connection');
const { Thought, User } = require('../models');

connection.once('open', async () => {
