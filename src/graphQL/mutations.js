import { gql } from '@apollo/client';

export const ADD_CLIENT = gql`
  mutation AddUser($userDetails: userDetails, $file: Upload) {
    addUser(userDetails: $userDetails, file: $file) {
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

// You can add more mutations below as your project grows
export const EDIT_CLIENT = gql`
  mutation EditUser($userDetails: userDetails, $file: Upload, $id: String) {
    editUser(userDetails: $userDetails, file: $file, id: $id) {
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
export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword(
    $updateUserPasswordId: String
    $newPassword: String
    $oldPassword: String
  ) {
    updateUserPassword(
      id: $updateUserPasswordId
      newPassword: $newPassword
      oldPassword: $oldPassword
    ) {
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
