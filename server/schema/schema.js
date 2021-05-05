const graphql = require("graphql");
const _ = require("lodash");
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
        // return _.filter(postsData, { userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return _.filter(hobbiesData, { userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hoddy",
  description: "Hobby desc",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId });
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
        // return _.find(usersData, { id: parent.userId });
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
        return _.find(usersData, { id: args.id });
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return usersData;
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(hobbiesData, { id: args.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbiesData;
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(postsData, { id: args.id });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return postsData;
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
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        const user = new User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        user.save();
        return user;
      },
    },

    createPost: {
      type: PostType,
      args: {
        comment: { type: GraphQLString },
        userId: { type: GraphQLID },
      },

      resolve(parent, args) {
        const post = new Post({
          comment: args.comment,
          userId: args.userId,
        });

        post.save();
        return post;
      },
    },

    createHobby: {
      type: HobbyType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID },
      },

      resolve(parent, args) {
        const hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });

        hobby.save();
        return hobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
