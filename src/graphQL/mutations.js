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
export const CHANGE_STATUS = gql`
  mutation ChangeStatus($id: ID!, $status: String) {
    changeStatus(id: $id, status: $status) {
      id
      firstName
      lastName
      email
      avatarUrl
      phone
      role
      type
      createdAt
      updatedAt
      status
    }
  }
`;

export const ADD_GROUP = gql`
  mutation AddGroup($groupInput: groupInput) {
    addGroup(groupInput: $groupInput) {
      id
      groupName
      status
      userID
      createdAt
      updatedAt
    }
  }
`;

export const EDIT_GROUP = gql`
  mutation EditGroup($groupInput: groupInput, $id: String) {
    editGroup(groupInput: $groupInput, id: $id) {
      id
      groupName
      status
      userID
      createdAt
      updatedAt
    }
  }
`;

export const CHANGE_GROUP_STATUS = gql`
  mutation ChangeGroupStatus($id: ID!, $status: String) {
    changeGroupStatus(id: $id, status: $status) {
      id
      groupName
      status
      userID
      createdAt
      updatedAt
    }
  }
`;

export const ADD_MEDIATOR = gql`
  mutation AddMediator($mediatorData: MediatorInput) {
    addMediator(mediatorData: $mediatorData) {
      id
      userID
      IBAN
      firstName
      lastName
      email
      phone
      sourceLanguage1
      targetLanguage1
      sourceLanguage2
      targetLanguage2
      sourceLanguage3
      targetLanguage3
      sourceLanguage4
      targetLanguage4
      createdAt
      updatedAt
      status
      monday_time_slots
      tuesday_time_slots
      wednesday_time_slots
      thursday_time_slots
      friday_time_slots
      saturday_time_slots
      sunday_time_slots
      availableForEmergencies
      availableOnHolidays
      priority
    }
  }
`;

export const UPDATE_MEDIATOR = gql`
  mutation UpdateMediator($mediatorData: MediatorInput, $id: String!) {
    updateMediator(mediatorData: $mediatorData, id: $id) {
      id
      userID
      IBAN
      firstName
      lastName
      email
      phone
      sourceLanguage1
      targetLanguage1
      sourceLanguage2
      targetLanguage2
      sourceLanguage3
      targetLanguage3
      sourceLanguage4
      targetLanguage4
      createdAt
      updatedAt
      status
      monday_time_slots
      tuesday_time_slots
      wednesday_time_slots
      thursday_time_slots
      friday_time_slots
      saturday_time_slots
      sunday_time_slots
      availableForEmergencies
      availableOnHolidays
      priority
    }
  }
`;
export const DELETE_MEDIATOR = gql`
  mutation DeleteMediator($id: String!) {
    deleteMediator(id: $id)
  }
`;

export const UPDATE_MEDIATOR_STATUS = gql`
  mutation UpdateMediatorStatus($id: String!, $status: String!) {
    updateMediatorStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const CREATE_LANGUAGE = gql`
  mutation CreateLanguage($input: LanguageInput!) {
    createLanguage(input: $input) {
      id
      language_code
      userID
      language_name
      created_at
      updated_at
    }
  }
`;
export const UPDATE_LANGUAGE = gql`
  mutation UpdateLanguage($input: LanguageInput!, $id: ID!) {
    updateLanguage(input: $input, id: $id) {
      id
      language_code
      userID
      language_name
      created_at
      updated_at
    }
  }
`;
export const DELETE_LANGUAGE = gql`
  mutation DeleteLanguage($id: ID!) {
    deleteLanguage(id: $id)
  }
`;

export const DELETE_MEDIATOR_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

export const UPLOAD_MEDIATOR_FILE = gql`
  mutation UploadMediatorFile($file: Upload!) {
    uploadMediatorFile(file: $file)
  }
`;
