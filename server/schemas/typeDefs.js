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
    taskCompleted: Boolean!
  }

  type CheckPoint {
    id: ID!
    focusArea: String!
    userId: ID!
    tasks: [Task]
    createdAt: String
    completedAt: String
    checkpointAssigned: Boolean!
    checkpointCompleted: Boolean!
  }

  type Query {
    users: [User]
    user(email: String!): User
    userById(id: ID!): User
    checkPoints(userId: ID!): [CheckPoint!]!
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

   input AdminUpdateUserInput {
    firstName: String
    lastName: String
    email: String
    officeLocation: String
    isAdmin: Boolean
  }

  input NewTaskInput {
    description: String
    taskCompleted: Boolean
  }

  input NewCheckPointInput {
    focusArea: String!
    userId: ID!
    tasks: [NewTaskInput]
  }

  input UpdateCheckPointInput {
    focusArea: String
    tasks: [NewTaskInput]
    completedAt: String
    checkpointAssigned: Boolean
  }

  type Mutation {
    addUser(userData: NewUserInput!): Auth
    login(email: String!, password: String!): Auth
    removeUser(userId: ID!): User
    updateUser(userId: ID!, updateData: UpdateUserInput!): User
    adminUpdateUser(userId: ID!, updateData: AdminUpdateUserInput!): User
    addCheckPoint(input: NewCheckPointInput!): CheckPoint
    updateCheckPoint(checkPointId: ID!, updateData: UpdateCheckPointInput!): CheckPoint
    updateCheckpointsByFocusArea(focusArea: String!, officeLocation: String!, assign: Boolean!): [CheckPoint]
  }
`;

module.exports = typeDefs;