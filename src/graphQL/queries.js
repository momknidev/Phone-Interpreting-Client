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

export const GROUPS_PAGINATED_LIST = gql`
  query GroupsPaginatedList(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $name: String
  ) {
    groupsPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
    ) {
      filteredCount
      groups {
        id
        groupName
        status
        user
        mediatorCount
        createdAt
        updatedAt
      }
    }
  }
`;

export const MEDIATOR_BY_ID = gql`
  query MediatorById($id: String!) {
    mediatorById(id: $id) {
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
      groupIDs
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
export const ALL_MEDIATOR_LIST = gql`
  query AllMediatorList {
    mediatorList {
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
export const MEDIATORS_PAGINATED_LIST = gql`
  query MediatorsPaginatedList(
    $offset: Int
    $order: String
    $limit: Int
    $orderBy: String
    $name: String
    $targetLanguage: String
    $status: String
  ) {
    mediatorsPaginatedList(
      offset: $offset
      order: $order
      limit: $limit
      orderBy: $orderBy
      name: $name
      targetLanguage: $targetLanguage
      status: $status
    ) {
      filteredCount
      mediators {
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
        groupIDs
      }
    }
  }
`;
export const ALL_LANGUAGES = gql`
  query AllLanguages {
    allLanguages {
      id
      language_code
      language_name
      created_at
      updated_at
    }
  }
`;
export const LANGUAGES = gql`
  query Languages($offset: Int, $limit: Int, $order: String, $orderBy: String, $search: String) {
    languages(offset: $offset, limit: $limit, order: $order, orderBy: $orderBy, search: $search) {
      filteredCount
      languages {
        id
        language_code
        userID
        language_name
        created_at
        updated_at
      }
    }
  }
`;
export const LANGUAGE_BY_ID = gql`
  query Language($id: ID!) {
    language(id: $id) {
      id
      language_code
      userID
      language_name
      created_at
      updated_at
    }
  }
`;

export const ALL_GROUPS = gql`
  query AllGroups {
    allGroups {
      id
      groupName
      status
      user
      userID
      createdAt
      updatedAt
    }
  }
`;
