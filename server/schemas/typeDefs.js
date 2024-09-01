const typeDefs = `
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    officeLocation: String!
    isAdmin: Boolean!
    formattedCreatedAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Task {
    description: String
    isCompleted: Boolean
  }

  type CheckPoint {
    id: ID!
    focusArea: String!
    userId: ID!
    tasks: [Task]
    createdAt: String
    completedAt: String
  }


  type Query {
    users: [User]
    user(email: String!): User
    userById(id: ID!): User
    checkPoints: [CheckPoint]
    checkPoint(id: ID!): CheckPoint
  }

  input NewUserInput {
    firstName: String!
    lastName: String!
    password: String!
    email: String!
    officeLocation: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    officeLocation: String
  }

  input NewTaskInput {
    description: String
    isCompleted: Boolean
  }

  input NewCheckPointInput {
    focusArea: String!
    userId: ID!
    tasks: [NewTaskInput]
  }


  type Mutation {
    addUser(userData: NewUserInput!): Auth
    login(email: String!, password: String!): Auth
    removeUser(userId: ID!): User
    updateUser(userId: ID!, updateData: UpdateUserInput!): User
    addCheckPoint(input: NewCheckPointInput!): CheckPoint
  }
`;

module.exports = typeDefs;