import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";
import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";
import Error from "./ErrorMessage";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = (props) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      const page = props.page;
      return (
        <PaginationStyles data-test="pagination">
          <Head>
            <title>
              Tiendapp! — Página {page} de {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ← Anterior
            </a>
          </Link>
          <p>
            Página {props.page} de
            <span className="totalPages">{pages}</span>!
          </p>
          <p>{count} productos</p>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Siguiente →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
export { PAGINATION_QUERY };
