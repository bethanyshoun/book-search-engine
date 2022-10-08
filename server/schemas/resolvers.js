const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({name: context.user.username })
          .select('-__v -password')
          .populate('bookCount')
          .populate('savedBooks');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('bookCount')
        .populate('savedBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('bookCount')
        .populate('savedBooks');
    }
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

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.book) {
        const book = await Book.create({ ...args, bookId: context.bookId });

        await Book.findByIdAndUpdate(
          { bookId: context.bookId},
          { $push: { books:  book.bookId } },
          { new: true }
        );

        return book;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async({ book, params }, res) => {
        const updatedBook = await Book.findOneAndUpdate(
          { _id: bookId },
          { $pull: { savedBooks: { bookId: params.bookId } } },
          { new: true }
        );
        if (!updatedBook) {
          return res.status(404).json({ message: "Couldn't find a book with this id!" });
        }
        return res.json(updatedBook);
      }
  }
};

module.exports = resolvers;