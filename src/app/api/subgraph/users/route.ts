import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { getUsersDb } from "@/lib/db";
import { NextRequest } from "next/server";

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type User @key(fields: "discordId") {
    discordId: ID!
    dietaryRestrictions: [String!]!
    cuisinePreferences: [String!]!
    priceRange: String!
    bookingName: String!
    bookingPhone: String!
    bookingEmail: String!
  }

  type Query {
    users(ids: [ID!]!): [User!]!
  }
`;

const resolvers = {
  Query: {
    users: async (_: unknown, { ids }: { ids: string[] }) => {
      const db = getUsersDb();
      if (!db) throw new Error("Users DB not configured");

      console.log(`[ghost:users-db] querying ${ids.length} user(s): ${ids.join(", ")}`);
      const result = await db.query(
        "SELECT * FROM users WHERE discord_id = ANY($1)",
        [ids],
      );
      console.log(`[ghost:users-db] returned ${result.rows.length} user(s)`);

      return result.rows.map((row: Record<string, unknown>) => ({
        discordId: row.discord_id,
        dietaryRestrictions: row.dietary_restrictions ?? [],
        cuisinePreferences: row.cuisine_preferences ?? [],
        priceRange: row.price_range ?? "mid",
        bookingName: row.booking_name,
        bookingPhone: row.booking_phone,
        bookingEmail: row.booking_email,
      }));
    },
  },
  User: {
    __resolveReference: async (ref: { discordId: string }) => {
      const db = getUsersDb();
      if (!db) return null;
      const result = await db.query(
        "SELECT * FROM users WHERE discord_id = $1",
        [ref.discordId],
      );
      const row = result.rows[0];
      if (!row) return null;
      return {
        discordId: row.discord_id,
        dietaryRestrictions: row.dietary_restrictions ?? [],
        cuisinePreferences: row.cuisine_preferences ?? [],
        priceRange: row.price_range ?? "mid",
        bookingName: row.booking_name,
        bookingPhone: row.booking_phone,
        bookingEmail: row.booking_email,
      };
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const apolloHandler = startServerAndCreateNextHandler<NextRequest>(server);

export async function GET(req: NextRequest) {
  return apolloHandler(req);
}

export async function POST(req: NextRequest) {
  return apolloHandler(req);
}
