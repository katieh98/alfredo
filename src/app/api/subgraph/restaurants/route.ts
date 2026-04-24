import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { TinyFish } from "@tiny-fish/sdk";
import { NextRequest } from "next/server";

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Restaurant {
    id: ID!
    name: String!
    cuisine: String!
    priceRange: String!
    rating: Float!
    phone: String
    openTableId: String
    availableSlots: [TimeSlot!]!
    enrichment: RestaurantEnrichment!
  }

  type TimeSlot {
    date: String!
    time: String!
  }

  type RestaurantEnrichment {
    topDishes: [String!]!
    vibeSummary: String!
    transitInfo: String!
  }

  input TimeSlotInput {
    date: String!
    startTime: String!
    endTime: String!
  }

  type Query {
    restaurants(
      near: String!
      partySize: Int!
      availableIn: [TimeSlotInput!]!
    ): [Restaurant!]!
  }
`;

interface YelpBusiness {
  id: string;
  name: string;
  categories: Array<{ title: string }>;
  price?: string;
  rating: number;
  phone?: string;
  url: string;
  location: { display_address: string[]; city: string };
}

async function searchYelp(location: string): Promise<YelpBusiness[]> {
  const res = await fetch(
    `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(location)}&categories=restaurants&limit=10&sort_by=rating`,
    {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Yelp API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return data.businesses ?? [];
}

function yelpPriceToRange(price?: string): string {
  if (!price) return "mid";
  if (price.length <= 1) return "budget";
  if (price.length === 2) return "mid";
  return "upscale";
}

const resolvers = {
  Query: {
    restaurants: async (
      _: unknown,
      {
        near,
        partySize,
        availableIn,
      }: {
        near: string;
        partySize: number;
        availableIn: Array<{
          date: string;
          startTime: string;
          endTime: string;
        }>;
      },
    ) => {
      const yelpResults = await searchYelp(near);
      const tf = new TinyFish({ apiKey: process.env.TINYFISH_API_KEY });

      const sfOnly = yelpResults.filter((b) => b.location.city === "San Francisco");
      const shuffled = sfOnly.sort(() => Math.random() - 0.5);
      const top5 = shuffled.slice(0, 5);

      const enriched = await Promise.all(
        top5.map(async (biz) => {
          let enrichment = {
            topDishes: [] as string[],
            vibeSummary: biz.categories.map((c) => c.title).join(", "),
            transitInfo: biz.location.display_address.join(", "),
          };

          const openTableSlug = biz.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

          try {
            const page = await tf.fetch.getContents({
              urls: [
                `https://www.opentable.com/r/${openTableSlug}`,
              ],
              format: "json",
            });

            if (page.results && page.results.length > 0) {
              const result = page.results[0];
              if ("data" in result && result.data) {
                const data = result.data as Record<string, unknown>;
                enrichment = {
                  topDishes: Array.isArray(data.popularDishes)
                    ? (data.popularDishes as string[]).slice(0, 3)
                    : [],
                  vibeSummary:
                    typeof data.description === "string"
                      ? data.description
                      : enrichment.vibeSummary,
                  transitInfo:
                    typeof data.address === "string"
                      ? data.address
                      : enrichment.transitInfo,
                };
              }
            }
          } catch {
            // TinyFish enrichment is best-effort
          }

          return {
            id: biz.id,
            name: biz.name,
            cuisine: biz.categories[0]?.title ?? "Restaurant",
            priceRange: yelpPriceToRange(biz.price),
            rating: biz.rating,
            phone: biz.phone ?? null,
            openTableId: openTableSlug,
            availableSlots: availableIn.map((slot) => ({
              date: slot.date,
              time: slot.startTime,
            })),
            enrichment,
          };
        }),
      );

      return enriched;
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
