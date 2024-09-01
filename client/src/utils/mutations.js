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

