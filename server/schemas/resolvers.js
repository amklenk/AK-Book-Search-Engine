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
                .populate('savedBooks');
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
            addUser: async (parent, args) => {
                const user = await User.create(args);
                const token = signToken(user);
    
                return { token, user };
            },
            login: async (parent, { email, password }) => {
                const user = await User.findOne({ email });
    
                if (!user) {
                    throw new AuthenticationError('Incorrect credentials');
                }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
    
            const token = signToken(user);
            return { token, user };
            },
            saveBook: async (parent, args, context) => {
                if (context.user) {
                  const book = await Book.create({ ...args, username: context.user.username });

                  await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book.BookInput } },
                    { new: true }
                  );
              
                  return book;
                }
              
                throw new AuthenticationError('You need to be logged in!');
              },
            removeBook: async (parent, args) => {
                    if (context.user) {
                      await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: book.bookId } },
                        { new: true }
                      );
                  
                      return user;
                    }
                  
                    throw new AuthenticationError('You need to be logged in!');
              }
        },
    };

module.exports = resolvers;