import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($userData: NewUserInput!) {
    addUser(userData: $userData) {
      token
      user {
        _id
        email
        __typename
      }
      __typename
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($userId: ID!) {
    removeUser(userId: $userId) {
      _id
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($userId: ID!, $updateData: UpdateUserInput!) {
    updateUser(userId: $userId, updateData: $updateData) {
      _id
      email
    }
  }
`;

export const ADMIN_UPDATE_USER = gql`
  mutation adminUpdateUser($userId: ID!, $updateData: AdminUpdateUserInput!) {
    adminUpdateUser(userId: $userId, updateData: $updateData) {
      _id
      email
    }
  }
`;

export const ADD_CHECKPOINT = gql`
  mutation AddCheckPoint($input: NewCheckPointInput!) {
    addCheckPoint(input: $input) {
      id
      focusArea
      userId
      tasks {
        description
        taskCompleted
      }
      createdAt
      completedAt
      checkpointCompleted
    }
  }
`;

export const UPDATE_CHECKPOINT = gql`
  mutation UpdateCheckPoint($checkPointId: ID!, $updateData: UpdateCheckPointInput!) {
    updateCheckPoint(checkPointId: $checkPointId, updateData: $updateData) {
      id
      focusArea
      userId
      tasks {
        description
        taskCompleted
      }
      createdAt
      completedAt
      checkpointAssigned
      checkpointCompleted
    }
  }
`;
