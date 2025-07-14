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
      status
      createdAt
      updatedAt
    }
  }
`;
export const CLIENTS_PAGINATED_LIST = gql`
  query usersPaginatedList(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $name: String
    $type: String
  ) {
    usersPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
      type: $type
    ) {
      users {
        id
        firstName
        lastName
        email
        avatarUrl
        phone
        status
        createdAt
      }
      filteredCount
    }
  }
`;
