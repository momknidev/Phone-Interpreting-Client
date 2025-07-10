// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from '@apollo/client';

export const LOGIN = gql`
  query login($email: String, $password: String) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      avatarUrl
      phone
      role
      type
      token
      createdAt
      updatedAt
    }
  }
`;
export const CLIENT_BY_ID = gql`
  query ClientByID($id: String) {
    clientByID(id: $id) {
      id
      firstName
      lastName
      email
      avatarUrl
      phone
      role
      type
      token
      createdAt
      updatedAt
    }
  }
`;
