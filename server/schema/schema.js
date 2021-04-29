const graphql = require("graphql");
const _ = require("lodash");

// Dummy data
const usersData = [
  { id: "1", name: "Bond", age: 33, profession: "" },
  { id: "2", name: "Nannie", age: 18, profession: "" },
  { id: "3", name: "Nicholas", age: 65, profession: "" },
  { id: "4", name: "Elsie", age: 94, profession: "" },
  { id: "5", name: "Kyle", age: 28, profession: "" },
];

const hobbiesData = [
  { id: "1", title: "Lebanon", description: "", userId: "1" },
  { id: "2", title: "Tajikistan", description: "", userId: "2" },
  { id: "3", title: "Niue", description: "", userId: "3" },
  { id: "4", title: "South Sudan", description: "", userId: "4" },
];

const postsData = [
  {
    id: "1",
    comment:
      "card bank particles hunter bigger next adventure opinion active top split level castle member during condition cattle knife cook room guard sport did gray",
    userId: "1",
  },
  {
    id: "2",
    comment:
      "thread never planet catch husband kill plane dog gravity today wonder two audience sing child describe subject passage few done earlier western therefore pink",
    userId: "1",
  },
  {
    id: "3",
    comment:
      "pay height company central police but mathematics ball zero within warn have sum jack coach chemical range flow plane cowboy volume swung movement stream",
    userId: "2",
  },
  {
    id: "4",
    comment:
      "terrible heavy rate machine coach behind aloud medicine corner desk alone wooden roof pupil hope thrown born than student sum here chosen principle straw",
    userId: "3",
  },
];

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
        return _.filter(postsData, { userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return _.filter(hobbiesData, { userId: parent.id });
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
        return _.find(usersData, { id: parent.userId });
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
        return _.find(usersData, { id: parent.userId });
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

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(hobbiesData, { id: args.id });
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(postsData, { id: args.id });
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
        //id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        let user = {
          name: args.name,
          age: args.age,
          profession: args.profession,
        };

        return user;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
