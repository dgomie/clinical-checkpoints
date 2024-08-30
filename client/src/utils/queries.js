import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users {
    users {
      _id
      username
    }
  }
`;

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      firstName
      lastName
      profilePicture
      formattedCreatedAt
      numVotes
      numSongs
      numLegions
      numVictories
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query userByIdId($id: ID!) {
    userById(id: $id) {
      _id
      username
      email
      firstName
      lastName
      profilePicture
      formattedCreatedAt
    
    }
  }
`;

export const GET_LEGIONS = gql`
  query legions {
    legions {
      _id
      name
      description
      adminUser
      numPlayers
      maxPlayers
      players 
      isActive
      numRounds
      voteTime
      submitTime
      rounds {
        _id
        roundNumber
        isComplete
      }
    }
  }
`;

export const GET_LEGION = gql`
  query legion($id: ID!) {
    legion(id: $id) {
      _id
      name
      description
      adminUser
      numPlayers
      maxPlayers
      players
      isActive
      numRounds
      voteTime
      submitTime
      standings {
        userId
        totalScore
      }
      rounds {
        _id
        roundNumber
        isComplete
        prompt
        submissionDeadline
        voteDeadline
        submissions {
          title
          artist
          url
          userId
          _id
        }
        votes {
          userId
          songId
          points
        }
        isComplete
      }
    }
  }
`;

export const GET_STANDINGS = gql`
  query standings($legionId: ID!) {
    standings(legionId: $legionId) {
      userId
      totalScore
    }
  }
`;