import { gql } from '@apollo/client';

export const ADD_CLIENT = gql`
  mutation AddClient($clientDetails: clientDetails, $file: Upload) {
    addClient(clientDetails: $clientDetails, file: $file) {
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

// You can add more mutations below as your project grows
export const EDIT_CLIENT = gql`
  mutation EditUser($clientDetails: clientDetails, $file: Upload, $id: String) {
    editClient(clientDetails: $clientDetails, file: $file, id: $id) {
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
export const CHANGE_STATUS = gql`
  mutation ChangeStatus($id: ID!, $status: String) {
    changeStatus(id: $id, status: $status) {
      id
      first_name
      last_name
      email
      avatar_url
      phone
      role
      type
      created_at
      updated_at
      status
    }
  }
`;

export const ADD_GROUP = gql`
  mutation AddGroup($groupInput: groupInput) {
    addGroup(groupInput: $groupInput) {
      id
      group_name
      status
      client_id
      created_at
      updated_at
    }
  }
`;

export const EDIT_GROUP = gql`
  mutation EditGroup($groupInput: groupInput, $id: String) {
    editGroup(groupInput: $groupInput, id: $id) {
      id
      group_name
      status
      client_id
      created_at
      updated_at
    }
  }
`;

export const CHANGE_GROUP_STATUS = gql`
  mutation ChangeGroupStatus($id: ID!, $status: String) {
    changeGroupStatus(id: $id, status: $status) {
      id
      group_name
      status
      client_id
      created_at
      updated_at
    }
  }
`;

export const ADD_MEDIATOR = gql`
  mutation AddMediator($mediatorData: MediatorInput) {
    addMediator(mediatorData: $mediatorData) {
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

export const UPDATE_MEDIATOR = gql`
  mutation UpdateMediator($mediatorData: MediatorInput, $id: String!) {
    updateMediator(mediatorData: $mediatorData, id: $id) {
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

export const CREATE_SOURCE_LANGUAGE = gql`
  mutation CreateLanguage($input: LanguageInput!) {
    createSourceLanguage(input: $input) {
      id
      language_code
      client_id
      language_name
      created_at
      updated_at
    }
  }
`;
export const UPDATE_SOURCE_LANGUAGE = gql`
  mutation UpdateLanguage($input: LanguageInput!, $id: ID!) {
    updateSourceLanguage(input: $input, id: $id) {
      id
      language_code
      client_id
      language_name
      created_at
      updated_at
    }
  }
`;
export const DELETE_SOURCE_LANGUAGE = gql`
  mutation DeleteLanguage($id: ID!) {
    deleteSourceLanguage(id: $id)
  }
`;
export const CREATE_TARGET_LANGUAGE = gql`
  mutation CreateLanguage($input: LanguageInput!) {
    createTargetLanguage(input: $input) {
      id
      language_code
      client_id
      language_name
      created_at
      updated_at
    }
  }
`;
export const UPDATE_TARGET_LANGUAGE = gql`
  mutation UpdateLanguage($input: LanguageInput!, $id: ID!) {
    updateTargetLanguage(input: $input, id: $id) {
      id
      language_code
      client_id
      language_name
      created_at
      updated_at
    }
  }
`;
export const DELETE_TARGET_LANGUAGE = gql`
  mutation DeleteLanguage($id: ID!) {
    deleteTargetLanguage(id: $id)
  }
`;

export const DELETE_MEDIATOR_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

export const UPLOAD_MEDIATOR_FILE = gql`
  mutation UploadMediatorFile($file: Upload!, $phone_number: String!) {
    uploadMediatorFile(file: $file, phone_number: $phone_number)
  }
`;
export const DELETE_CLIENT_CODE = gql`
  mutation DeleteClientCode($id: ID!) {
    deleteClientCode(id: $id)
  }
`;
export const CREATE_CLIENT_CODE = gql`
  mutation CreateClientCode($input: ClientCodeInput!) {
    createClientCode(input: $input) {
      id
      client_code
      client_id
      code_label
      created_at
      updated_at
    }
  }
`;
export const UPDATE_CLIENT_CODE = gql`
  mutation UpdateClientCode($input: ClientCodeInput!, $id: ID!) {
    updateClientCode(input: $input, id: $id) {
      id
      client_code
      client_id
      code_label
      created_at
      updated_at
    }
  }
`;

export const ADD_MEDIATOR_TO_GROUP = gql`
  mutation AddMediatorToGroup($groupId: ID!, $mediator_ids: [ID!]!) {
    addMediatorToGroup(groupID: $groupId, mediatorIDs: $mediator_ids)
  }
`;
export const REMOVE_MEDIATOR_FROM_GROUP = gql`
  mutation RemoveMediatorFromGroup($groupId: ID!, $interpreter_id: ID!) {
    removeMediatorFromGroup(groupID: $groupId, mediatorID: $interpreter_id) {
      id
      group_name
      status
      user
      client_id
      created_at
      updated_at
      mediatorCount
      mediators
    }
  }
`;

export const CREATE_PHONE_MEDIATION = gql`
  mutation CreatePhoneMediation($input: CreatePhoneMediationInput) {
    createPhoneMediation(input: $input) {
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
      status
      call_date
      call_duration
      amount
      created_at
      updated_at
    }
  }
`;
export const UPDATE_PHONE_MEDIATION = gql`
  mutation UpdatePhoneMediation($input: CreatePhoneMediationInput, $id: ID) {
    updatePhoneMediation(input: $input, id: $id) {
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
      status
      call_date
      call_duration
      amount
      created_at
      updated_at
    }
  }
`;

export const SYNC_TARGET_LANGUAGES = gql`
  mutation SyncLanguagesData($phoneNumber: String!) {
    syncTargetLanguagesData(phone_number: $phoneNumber)
  }
`;
export const SYNC_SOURCE_LANGUAGES = gql`
  mutation SyncLanguagesData($phoneNumber: String!) {
    syncSourceLanguagesData(phone_number: $phoneNumber)
  }
`;
export const CREATE_UPDATED_ROUTING_SETTING = gql`
  mutation CreateOrUpdateCallRoutingSettings($input: CallRoutingSettingsInput!) {
    createOrUpdateCallRoutingSettings(input: $input) {
      id
      client_id
      phone_number
      enable_code
      callingCodePrompt
      callingCodePromptURL
      askSourceLanguage
      askTargetLanguage
      sourceLanguagePrompt
      sourceLanguagePromptURL
      targetLanguagePrompt
      targetLanguagePromptURL
      interpreterCallType
      retryAttempts
      enableFallback
      fallbackNumber
      fallbackPrompt
      createdAt
      updatedAt
    }
  }
`;
export const REQUEST_NUMBER = gql`
  mutation RequestNewPhone($description: String) {
    requestNewPhone(description: $description)
  }
`;
