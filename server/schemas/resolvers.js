const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// Resolvers to run Queries and Mutations
const resolvers = {
    Query: { 
        // me
        me: async (parent, args, context) => {
            if (context.user){
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('books');
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    }
}

module.exports = resolvers; 