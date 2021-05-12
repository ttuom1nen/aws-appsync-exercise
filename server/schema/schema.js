const graphql = require("graphql");
const User = require("../models/user");
const Hobby = require("../models/hobby");
const Post = require("../models/post");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Create types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "User desc",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby desc",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post desc",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

// RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return Hobby.findById(args.id);
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({});
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return Post.findById(args.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        const user = new User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        return user.save();
      },
    },

    // Update user
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true } // Send back the updated objectType
        ));
      },
    },

    removeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();

        if (!removedUser) {
          throw new "Error"();
        }

        return removedUser;
      },
    },

    createPost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        const post = new Post({
          comment: args.comment,
          userId: args.userId,
        });

        return post.save();
      },
    },

    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true }
        ));
      },
    },

    removePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(args.id).exec();

        if (!removedPost) {
          throw new "Error"();
        }

        return removedPost;
      },
    },

    createHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        const hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });

        return hobby.save();
      },
    },

    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updatedPost = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        ));
      },
    },

    removeHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();

        if (!removedHobby) {
          throw new "Error"();
        }

        return removedHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
