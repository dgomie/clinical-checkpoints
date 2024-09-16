import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users {
    users {
      _id
      email
      firstName
      lastName
      officeLocation
      isAdmin
    }
  }
`;

export const GET_USER = gql`
  query user($email: String!) {
    user(email: $email) {
      _id
      email
      firstName
      lastName
      officeLocation
      formattedCreatedAt
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query userById($id: ID!) {
    userById(_id: $id) {
      _id
      email
      firstName
      lastName
      officeLocation
      formattedCreatedAt
    }
  }
`;

export const CHECKPOINTS_QUERY = gql`
  query CheckPoints($userId: ID!) {
    checkPoints(userId: $userId) {
      _id
      focusArea
      checkpointAssigned
      checkpointCompleted
      tasks {
        description
        taskCompleted
      }
      completedAt
    }
  }
`;

export const CHECKPOINT_QUERY = gql`
  query GetCheckPoint($_id: ID!) {
    checkPoint(_id: $_id) {
      _id
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

export const GET_CHECKPOINTS_BY_USER = gql`
  query GetCheckpointsByUser($userId: ID!) {
    checkPoints(userId: $userId) {
      _id
      focusArea
      tasks {
        description
        taskCompleted
      }
      checkpointAssigned
      checkpointCompleted
      completedAt
    }
  }
`;