import { gql } from '@apollo/client';

// exported me query that connect to server me query
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;