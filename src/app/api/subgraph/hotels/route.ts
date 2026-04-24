import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { TinyFish } from "@tiny-fish/sdk";
import { NextRequest } from "next/server";

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Hotel {
    id: ID!
    name: String!
    category: String!
    priceRange: String!
    rating: Float!
    phone: String
    availableNights: [HotelNight!]!
    enrichment: HotelEnrichment!
  }

  type HotelNight {
    checkIn: String!
    checkOut: String!
  }

  type HotelEnrichment {
    amenities: [String!]!
    vibeSummary: String!
    address: String!
  }

  input HotelSlotInput {
    checkIn: String!
    checkOut: String!
  }

  type Query {
    hotels(near: String!, partySize: Int!, availableIn: [HotelSlotInput!]!): [Hotel!]!
  }
`;

interface YelpBusiness {
  id: string;
  name: string;
  categories: Array<{ title: string }>;
  price?: string;
  rating: number;
  phone?: string;
  location: { display_address: string[]; city: string };
}

const SF_LAT = 37.7749;
const SF_LNG = -122.4194;
const SF_RADIUS_METERS = 8000;

async function searchYelpHotels(): Promise<YelpBusiness[]> {
  const params = new URLSearchParams({
    latitude: String(SF_LAT),
    longitude: String(SF_LNG),
    radius: String(SF_RADIUS_METERS),
    categories: "hotels",
    limit: "20",
    sort_by: "best_match",
  });

  const res = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
    headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` },
  });

  if (!res.ok) {
    console.error("Yelp hotels API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return (data.businesses ?? []).filter(
    (b: YelpBusiness) => b.location.city === "San Francisco",
  );
}

function yelpPriceToRange(price?: string): string {
  if (!price) return "mid";
  if (price.length <= 1) return "budget";
  if (price.length === 2) return "mid";
  return "upscale";
}

const resolvers = {
  Query: {
    hotels: async (
      _: unknown,
      {
        availableIn,
        partySize,
      }: {
        near: string;
        partySize: number;
        availableIn: Array<{ checkIn: string; checkOut: string }>;
      },
    ) => {
      const yelpResults = await searchYelpHotels();
      const tf = new TinyFish({ apiKey: process.env.TINYFISH_API_KEY });

      const shuffled = yelpResults.sort(() => Math.random() - 0.5);
      const top5 = shuffled.slice(0, 5);

      const enriched = await Promise.all(
        top5.map(async (biz) => {
          let enrichment = {
            amenities: [] as string[],
            vibeSummary: biz.categories.map((c) => c.title).join(", "),
            address: biz.location.display_address.join(", "),
          };

          const slug = biz.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          try {
            const page = await tf.fetch.getContents({
              urls: [`https://www.yelp.com/biz/${slug}`],
              format: "json",
            });

            if (page.results && page.results.length > 0) {
              const result = page.results[0];
              if ("data" in result && result.data) {
                const data = result.data as Record<string, unknown>;
                enrichment = {
                  amenities: Array.isArray(data.amenities)
                    ? (data.amenities as string[]).slice(0, 5)
                    : [],
                  vibeSummary:
                    typeof data.description === "string"
                      ? data.description
                      : enrichment.vibeSummary,
                  address:
                    typeof data.address === "string"
                      ? data.address
                      : enrichment.address,
                };
              }
            }
          } catch {
            // TinyFish enrichment is best-effort
          }

          return {
            id: biz.id,
            name: biz.name,
            category: biz.categories[0]?.title ?? "Hotel",
            priceRange: yelpPriceToRange(biz.price),
            rating: biz.rating,
            phone: biz.phone ?? null,
            availableNights: availableIn,
            enrichment,
          };
        }),
      );

      void partySize;
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
