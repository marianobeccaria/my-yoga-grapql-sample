import { makeExecutableSchema } from '@graphql-tools/schema';
import { Users } from './dummydata.js'
import { Posts } from './dummydata.js'

// Define Types, Queries, and Mutations
const types = `
  type User {
    id:     ID
    name:   String!
    email:  String!
    posts:  [Post!]
  }

  type Post {
    id:     ID
    title:  String!
    authorId: ID!
    author: User!
  }
`

const queries = `
  type Query {
    users: [User!]!
    posts: [Post!]!
    userById(id: ID!): User!
  }
`

const mutations = `
  type Mutation {
    addUser(name:String!, email:String!): User
    deleteUser(id:ID!): User
    addPost(title:String!, authorId:ID!): Post
    deletePost(id:ID!): Post
  }
`

//console.log(Posts.filter((post) => post.userId === 1))

const resolvers = {
  Query: {
    users: (parent, args, context, info) => context.db.user.findMany({}),
    posts: (parent, args, context, info) => context.db.post.findMany({}),
    //userById: (parent, args) => Users.find((user) => String(user.id) === args.id),
    userById: async (parent, args, context, info) => {
      console.log(args)
      return await context.db.user.findUnique({
        where: { 
          id: parseInt(args.id)
        }
      })
    } 
  },
  Post: {
    author: async (parent, args, context, info) => {
      console.log("Posts: ", parent)
      return await context.db.user.findUnique({
        where: {
          id: parseInt(parent.authorId)
        }
      })
//      await Users.find((user) => {
//        if(String(user.id) === parent.authorId) {
//          console.log("author is: ", user)
//        }
//      })
    }
  },
  User: {
    posts: async (parent, args, context, info) => {
      console.log("Users: ", parent);
      //return await Posts.filter((post) => String(post.authorId) === parent.id);
      return await context.db.post.findMany({
        where: {
          authorId: parseInt(parent.id)
        }
      })

    }
  },
  Mutation: {
    addUser: async (parent,args, context, info) => {
      console.log("Creating a new user")
      
      //Users.push(newUser);
      const newUser = await context.db.user.create({
        data: {
          name:   args.name,
          email:  args.email,
        }

      }); 
      console.log(JSON.stringify(newUser));
      
      return newUser;
    },
    deleteUser: async (parent, args, context, info) => {
      await context.db.user.delete({
        where: {
          id: parseInt(args.id)
        }
      })
    },
    addPost: async (parent, args, context, info) => {
      console.log("Creating a new Post: ", args)
      
      //Posts.push(newPost);
      const newPost = await context.db.post.create({
        data: {
          title:     args.title,
          authorId:  args.authorId,
        }

      }); 
      console.log(JSON.stringify(newPost));
      
      return newPost;
    },
    deletePost: async (parent, args, context, info) => {
      await context.db.post.delete({
        where: {
          id: parseInt(args.id)
        }
      })
    },
  },
}

export const user_schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [types, queries, mutations]
})