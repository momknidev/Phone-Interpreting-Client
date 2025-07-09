// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from '@apollo/client';

export const LOGIN = gql`
  query ClientLogin($email: String, $password: String, $recaptcha: String) {
    clientLogin(email: $email, password: $password, recaptcha: $recaptcha) {
      id
      email
      role
      firstName
      lastName
      avatarUrl
      phone
      department
      token
      createdAt
      updatedAt
      displayName
    }
  }
`;
export const CLIENT_BY_ID = gql`
  query ClientByID($id: String) {
    clientByID(id: $id) {
      id
      email
      role
      firstName
      lastName
      displayName
      avatarUrl
      phone
      department
      createdAt
      updatedAt
      customer
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
    usersPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
      type: $type
    ) {
      filteredCount
      users {
        id
        email
        role
        firstName
        lastName
        displayName
        avatarUrl
        phone
        department
        createdAt
        updatedAt
        customer
      }
    }
  }
`;

export const REQUEST_BY_ID = gql`
  query RequestById($id: ID!) {
    requestById(id: $id) {
      id
      customer
      userId
      user {
        firstName
        lastName
        id
      }
      dateOfRequestCompletion
      applicantFirstName
      applicantLastName
      applicantEmail
      applicantPhone
      applicantOtherEmail
      structurePavilionAddress
      requestId
      operationalUnits
      status
      expectedDuration
      floor
      office
      dateOfIntervention
      mediationType
      mediationCategory
      patientIndication
      targetLanguage
      motivation
      otherMotivation
      notes
      createdAt
      updatedAt
      applicantOtherPhone
      mediatorInfo
      preferredMediator
      patientFirstName
      patientLastName
    }
  }
`;
export const REQUESTS_PAGINATED_LIST = gql`
  query RequestsPaginatedList(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $requestId: String
    $status: [String!]!
    $createdAt: [String]
    $dateOfIntervention: [String]
  ) {
    requestsPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      requestID: $requestId
      status: $status
      createdAt: $createdAt
      dateOfIntervention: $dateOfIntervention
    ) {
      filteredCount
      requests {
        id
        customer

        user {
          firstName
          lastName
          id
        }
        dateOfRequestCompletion
        applicantFirstName
        applicantLastName
        applicantEmail
        applicantPhone
        applicantOtherEmail
        structurePavilionAddress
        requestId
        operationalUnits
        status
        expectedDuration
        floor
        dateOfIntervention
        mediationType
        patientIndication
        targetLanguage
        motivation
        otherMotivation
        notes
        createdAt
        updatedAt
        mediationCategory
        applicantOtherPhone
        mediatorInfo
        preferredMediator
        patientFirstName
        patientLastName
      }
    }
  }
`;

// Intranet Queries
export const GET_BOOKING_BY_REQUEST_ID = gql`
  query GetBookingByRequestId($requestId: ID!) {
    getBookingByRequestId(requestId: $requestId) {
      id
      requestId
      mediatorId
      status
      deliveryDate
      language
      minutes
      formUrl
      amount
      notes
      createdAt
      updatedAt
      firstName
      lastName
      addedBy {
        firstName
        lastName
      }
    }
  }
`;
export const INTRANET_USER_LOGIN = gql`
  query IntranetLogin($email: String, $password: String, $recaptcha: String) {
    intranetLogin(email: $email, password: $password, recaptcha: $recaptcha) {
      id
      email
      role
      firstName
      lastName
      displayName
      avatarUrl
      phone
      department
      type
      token
      createdAt
      updatedAt
      customer
    }
  }
`;
export const MEDIATOR_BY_ID = gql`
  query MediatorById($id: String!) {
    mediatorById(id: $id) {
      id
      firstName
      lastName
      email
      phone
      address
      domicileAddress
      sourceLanguage1
      targetLanguage1
      sourceLanguage2
      targetLanguage2
      sourceLanguage3
      targetLanguage3
      sourceLanguage4
      targetLanguage4
      cv
      personalCalendar
      mediationCard
      notes
      createdAt
      updatedAt
      isActive
      role
      token
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
export const MEDIATORS_LIST = gql`
  query MediatorsPaginatedList(
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
    $name: String
    $isActive: Boolean
    $targetLanguage: String
  ) {
    mediatorsPaginatedList(
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
      name: $name
      isActive: $isActive
      targetLanguage: $targetLanguage
    ) {
      filteredCount
      mediators {
        id
        firstName
        lastName
        email
        phone
        address
        sourceLanguage1
        targetLanguage1
        targetLanguage2
        targetLanguage3
        targetLanguage4
        cv
        mediationCard
      }
    }
  }
`;

// Mediator Queries

export const MEDIATOR_LOGIN = gql`
  query MediatorLogin($email: String!, $password: String!) {
    mediatorLogin(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      phone
      address

      sourceLanguage1
      targetLanguage1
      cv

      mediationCard
      notes

      createdAt
      updatedAt
      isActive
      role
      token
    }
  }
`;

export const GET_BOOKINGS_BY_MEDIATOR = gql`
  query GetBookingsByMediator(
    $mediatorId: String
    $status: [String]
    $request: String
    $offset: Int
    $limit: Int
    $order: String
    $orderBy: String
  ) {
    getBookingsByMediator(
      mediatorId: $mediatorId
      status: $status
      request: $request
      offset: $offset
      limit: $limit
      order: $order
      orderBy: $orderBy
    ) {
      filteredCount
      bookings {
        id
        requestId
        mediatorId
        status
        notes
        deliveryDate
        language
        minutes
        amount
        createdAt
        formUrl
        updatedAt
        firstName
        lastName
        request
      }
    }
  }
`;
export const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    getBooking(id: $id) {
      id
      requestId
      mediatorId
      status
      notes
      deliveryDate
      language
      minutes
      amount
      createdAt
      updatedAt
      firstName
      lastName
      request
      formUrl
    }
  }
`;

export const GET_REQUEST_STATUS_BY_CLIENT = gql`
  query GetRequestStatusByClient($year: String) {
    getRequestStatusByClient(year: $year)
  }
`;
export const GET_REQUEST_STATUS_FOR_INTRANET = gql`
  query GetRequestStatusForIntranet($year: String) {
    getRequestStatusForIntranet(year: $year)
  }
`;
export const GET_REQUESTS_BY_MONTH = gql`
  query GetRequestsByMonth($year: String) {
    getRequestsByMonth(year: $year)
  }
`;
