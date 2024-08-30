import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
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
        username
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
      username
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($userId: ID!, $updateData: UpdateUserInput!) {
    updateUser(userId: $userId, updateData: $updateData) {
      _id
      username
      numLegions
    }
  }
`;

export const ADD_LEGION = gql`
  mutation addLegion($legionData: NewLegionInput!) {
    addLegion(legionData: $legionData) {
      _id
      name
      description
      maxPlayers
      numRounds
      voteTime
      submitTime
    }
  }
`;

export const UPDATE_LEGION = gql`
  mutation updateLegion($legionId: ID!, $updateData: UpdateLegionInput!) {
    updateLegion(legionId: $legionId, updateData: $updateData) {
      _id
      name
      description
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
      }
    }
  }
`;

export const REMOVE_LEGION = gql`
  mutation removeLegion($legionId: ID!) {
    removeLegion(legionId: $legionId) {
      _id
    }
  }
`;

export const CREATE_ROUND = gql`
  mutation createRound($legionId: ID!, $roundData: NewRoundInput!) {
    createRound(legionId: $legionId, roundData: $roundData) {
      _id
      rounds {
        _id
        roundNumber
        prompt
        submissionDeadline
        voteDeadline
        isComplete
      }
    }
  }
`;

export const UPDATE_ROUND = gql`
  mutation updateRound(
    $legionId: ID!
    $roundId: ID!
    $roundData: UpdateRoundInput!
  ) {
    updateRound(legionId: $legionId, roundId: $roundId, roundData: $roundData) {
      _id
      rounds {
        _id
        roundNumber
        prompt
        submissionDeadline
        voteDeadline
        isComplete
      }
    }
  }
`;

export const ADD_SONG_TO_ROUND = gql`
  mutation addSongToRound(
    $legionId: ID!
    $roundNumber: Int!
    $songInput: SongInput!
  ) {
    addSongToRound(
      legionId: $legionId
      roundNumber: $roundNumber
      songInput: $songInput
    ) {
      _id
      rounds {
        _id
        roundNumber
        submissions {
          _id
          title
          artist
          url
        }
      }
    }
  }
`;

export const UPDATE_SONG = gql`
  mutation updateSong(
    $legionId: ID!
    $roundNumber: Int!
    $songId: ID!
    $updateData: UpdateSongInput!
  ) {
    updateSong(
      legionId: $legionId
      roundNumber: $roundNumber
      songId: $songId
      updateData: $updateData
    ) {
      _id
      rounds {
        _id
        roundNumber
        submissions {
          _id
          title
          artist
          url
        }
      }
    }
  }
`;

export const INCREMENT_NUM_SONGS = gql`
  mutation incrementNumSongs($userId: ID!) {
    incrementNumSongs(userId: $userId) {
      _id
      numSongs
    }
  }
`;

export const INCREMENT_NUM_VOTES = gql`
  mutation incrementNumVotes($userId: ID!) {
    incrementNumVotes(userId: $userId) {
      _id
      numVotes
    }
  }
`;

export const INCREMENT_NUM_VICTORIES = gql`
  mutation incrementNumVictories($userId: ID!) {
    incrementNumVictories(userId: $userId) {
      _id
      numVictories
    }
  }
`;

export const INCREMENT_NUM_LEGIONS = gql`
  mutation incrementNumLegions($userId: ID!) {
    incrementNumLegions(userId: $userId) {
      _id
      numLegions
    }
  }
`;

export const DECREMENT_NUM_LEGIONS = gql`
  mutation decrementNumLegions($userId: ID!) {
    decrementNumLegions(userId: $userId) {
      _id
      numLegions
    }
  }
`;

export const UPDATE_STANDINGS = gql`
  mutation updateStandings($legionId: ID!, $userId: ID!, $score: Int!) {
    updateStandings(legionId: $legionId, playerId: $userId, score: $score) {
      userId
      totalScore
    }
  }
`;
