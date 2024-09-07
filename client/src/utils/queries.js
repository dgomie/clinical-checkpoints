import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users {
    users {
      _id
      email
      firstName
      lastName
      officeLocation
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
  query userByIdId($id: ID!) {
    userById(id: $id) {
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
      id
      focusArea
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
  query GetCheckPoint($id: ID!) {
    checkPoint(id: $id) {
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