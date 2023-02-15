import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const GRAPH_BOND_EXPIRY_API =
  "https://api.thegraph.com/subgraphs/name/nuoanunu/expiry-event";
const GRAPH_BOND_TERM_API =
  "https://api.thegraph.com/subgraphs/name/nuoanunu/term-event";

const GRAPH_BOND_1155_API =
  "https://api.thegraph.com/subgraphs/name/nuoanunu/1155-event";

const clientExpiryBond = new ApolloClient({
  uri: GRAPH_BOND_EXPIRY_API,
  cache: new InMemoryCache(),
});
const client1155 = new ApolloClient({
  uri: GRAPH_BOND_1155_API,
  cache: new InMemoryCache(),
});
const clientTermBond = new ApolloClient({
  uri: GRAPH_BOND_TERM_API,
  cache: new InMemoryCache(),
});

export const fetchBondedTxs = async (id: number) => {
  const query = `
        query {
          bondeds(orderBy: timeStamp, orderDirection: desc, where: {marketId: "${id}"}) {
            id
            amount
            payout
            referrer
            timeStamp
            transactionHash
            marketId
          }
        }
    `;
  const data = await clientExpiryBond.query({
    query: gql(query),
    fetchPolicy: "no-cache",
  });

  return data;
};

export const fetchTermBondedTxs = async (id: number) => {
  const query = `
      query {
        bondeds(orderBy: timestamp, orderDirection: desc, where: {marketId: "${id}"}) {
          id
          amount
          payout
          referrer
          timestamp
          transactionHash
          marketId
        }
      }
    `;
  const data = await clientTermBond.query({
    query: gql(query),
    fetchPolicy: "no-cache",
  });

  return data;
};

export const fetch1155Txs = async (to: string) => {
  const query = `
        query {
          transferSingles(orderBy: blockNumber, orderDirection: asc where: {to: "${to}"} ) {
            amount
            blockNumber
            blockTimestamp
            from
            id
            operator
            to
            transactionHash
            tokenId
          }
        }
    `;
  const data = await client1155.query({
    query: gql(query),
    fetchPolicy: "no-cache",
  });

  return data;
};
