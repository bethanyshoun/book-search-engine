import { gql } from '@apollo/client';
// LOGIN_USER will execute the loginUser mutation set up using Apollo Server.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
// ADD_USER will execute the addUser mutation.
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


// SAVE_BOOK will execute the saveBook mutation.
export const SAVE_BOOk = gql`
  mutation saveBook($authors: String, $description: String, $title: String, $bookId: String!, $image: String, $link: String) {
  }
`;
// REMOVE_BOOK will execute the removeBook mutation.
export const REMOVE_BOOk = gql`
  mutation saveBook($_id: bookId) {

  }
`;