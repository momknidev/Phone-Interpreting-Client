// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from '@apollo/client';

export const LOGIN = gql`
  query login($email: String, $password: String) {
    login(email: $email, password: $password) {
      id
      first_name
      last_name
      email
      avatar_url
      phone
      role
      type
      token
      created_at
      updated_at
    }
  }
`;
export const CLIENT_BY_ID = gql`
  query ($id: String) {
    clientByID(id: $id) {
      id
      first_name
      last_name
      email
      avatar_url
      phone
      role
      type
      token
      created_at
      updated_at
      status
    }
  }
`;
export const CLIENTS_PAGINATED_LIST = gql`
  query ClientsPaginatedList(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $name: String
    $type: String
  ) {
    clientPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
      type: $type
    ) {
      clients {
        id
        first_name
        last_name
        email
        avatar_url
        phone
        status
        created_at
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
    $phone_number: String!
  ) {
    groupsPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
      phone_number: $phone_number
    ) {
      filteredCount
      groups {
        id
        group_name
        status
        user
        mediatorCount
        created_at
        updated_at
      }
    }
  }
`;

export const MEDIATOR_BY_ID = gql`
  query MediatorById($id: String!, $phone_number: String!) {
    mediatorById(id: $id, phone_number: $phone_number) {
      id
      client_id
      iban
      first_name
      last_name
      email
      phone

      sourceLanguages
      targetLanguages

      created_at
      updated_at
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
      groups
    }
  }
`;
export const ALL_MEDIATOR_LIST = gql`
  query AllMediatorList {
    mediatorList {
      id
      client_id
      iban
      first_name
      last_name
      email
      phone

      created_at
      updated_at
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
    $limit: Int
    $order: String
    $orderBy: String
    $name: String
    $status: String
    $phone_number: String!
  ) {
    mediatorsPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
      status: $status
      phone_number: $phone_number
    ) {
      filteredCount
      mediators {
        id
        client_id
        iban
        first_name
        last_name
        email
        phone
        sourceLanguages

        targetLanguages

        created_at
        updated_at
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
        groups
      }
    }
  }
`;
export const ALL_SOURCE_LANGUAGES = gql`
  query AllLanguages($phone_number: String!) {
    allSourceLanguages(phone_number: $phone_number) {
      id
      language_code
      language_name
      created_at
      updated_at
    }
  }
`;
export const ALL_TARGET_LANGUAGES = gql`
  query AllLanguages($phone_number: String!) {
    allTargetLanguages(phone_number: $phone_number) {
      id
      language_code
      language_name
      created_at
      updated_at
    }
  }
`;
export const LANGUAGES = gql`
  query Languages(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $search: String
    $phone_number: String!
  ) {
    sourceLanguages(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      search: $search
      phone_number: $phone_number
    ) {
      filteredCount
      languages {
        id
        language_code
        client_id
        language_name
        created_at
        updated_at
      }
    }
  }
`;
export const TARGET_LANGUAGES = gql`
  query Languages(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $search: String
    $phone_number: String!
  ) {
    targetLanguages(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      search: $search
      phone_number: $phone_number
    ) {
      filteredCount
      languages {
        id
        language_code
        client_id
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
      client_id
      language_name
      created_at
      updated_at
    }
  }
`;

export const ALL_GROUPS = gql`
  query AllGroups($phone_number: String!) {
    allGroups(phone_number: $phone_number) {
      id
      group_name
      status
      user
      client_id
      created_at
      updated_at
    }
  }
`;
export const GET_CLIENT_CODE_BY_ID = gql`
  query ClientCode($id: ID!) {
    ClientCode(id: $id) {
      id
      client_code
      client_id
      user_name
      created_at
      updated_at
    }
  }
`;
export const PAGINATED_CLIENT_CODES = gql`
  query ClientCodesPaginated(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $search: String
    $phone_number: String!
  ) {
    clientCodesPaginated(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      search: $search
      phone_number: $phone_number
    ) {
      filteredCount
      clientCodes {
        id
        client_code
        status
        client_id
        code_label
        created_at
        credits
        updated_at
      }
    }
  }
`;
export const ALL_CLIENT_CODES = gql`
  query AllClientCodes {
    allClientCodes {
      id
      client_code
      client_id
      code_label
      created_at
      updated_at
    }
  }
`;
export const GROUP_BY_ID = gql`
  query GroupByID($groupByIdId: String, $phone_number: String!) {
    groupByID(id: $groupByIdId, phone_number: $phone_number) {
      id
      group_name
      status
      client_id
      created_at
      updated_at
      mediatorCount
      mediators
    }
  }
`;
export const MEDIATOR_LIST_BASIC = gql`
  query MediatorList($phone_number: String!) {
    mediatorList(phone_number: $phone_number) {
      first_name
      last_name
      id
      email
      phone
      sourceLanguages
      targetLanguages
      groups
    }
  }
`;

export const ALL_PHONE_MEDIATION = gql`
  query AllPhoneMediation {
    allPhoneMediation {
      id
      client_id
      interpreter_id
      interpreter
      caller_phone
      client_code
      source_language_id
      target_language_id
      sourceLanguage
      targetLanguage
      serial_no
      status
      call_date
      call_duration
      amount
      created_at
      updated_at
    }
  }
`;
export const PHONE_MEDIATION_PAGINATED_LIST = gql`
  query PhoneMediationPaginatedList(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $search: String
    $phone_number: String!
  ) {
    phoneMediationPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      search: $search
      phone_number: $phone_number
    ) {
      filteredCount
      callReports {
        id
        client_id
        interpreter_id
        interpreter
        caller_phone
        client_code
        source_language_id
        target_language_id
        source_language
        serial_no
        target_language
        status
        call_date
        call_duration
        amount
        used_credits
        created_at
        updated_at
        response_time
      }
    }
  }
`;
export const GET_CALL_ROUTING_SETTING = gql`
  query GetCallRoutingSettings($phone_number: String!) {
    getCallRoutingSettings(phone_number: $phone_number) {
      id
      client_id
      phone_number
      enable_code
      callingCodePromptText
      askSourceLanguage
      sourceLanguageId
      askTargetLanguage
      targetLanguageId
      sourceLanguagePromptText
      targetLanguagePromptText
      interpreterCallType
      retryAttempts
      inputAttemptsCount
      inputAttemptsMode
      inputAttemptsText
      inputAttemptsFile
      enableFallback
      fallbackNumber
      createdAt
      updatedAt
      callingCodeErrorText
      sourceLanguageErrorText
      targetLanguageErrorText
      fallbackMessage
      fallbackType
      digitsTimeOut
      creditErrorText
      creditErrorMode
      creditErrorFile
      noAnswerMessageText
      language
      welcomeMessageText
      callingCodeErrorMode
      callingCodePromptMode
      noAnswerMessageMode
      sourceLanguageErrorMode
      sourceLanguagePromptMode
      targetLanguageErrorMode
      callingCodeErrorFile
      callingCodePromptFile
      noAnswerMessageFile
      sourceLanguageErrorFile
      sourceLanguagePromptFile
      targetLanguageErrorFile
      targetLanguagePromptFile
      targetLanguagePromptMode
      welcomeMessageFile
      welcomeMessageMode
    }
  }
`;
export const CLIENT_PHONES = gql`
  query ClientPhones($clientId: ID!) {
    clientPhones(clientId: $clientId) {
      id
      client_id
      phone
      label
      created_at
      updated_at
    }
  }
`;
