export type GeocoderResponse = {
  attribution: string;
  features: GeocoderData[];
  query: string[];
  type: string;
};

export type GeocoderData = {
  address: string;
  center: [number, number];
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  id: number;
  matching_place_name: string;
  place_name: string;
  place_name_pl: string;
  relevance: string;
  text: string;
  text_pl: string;
  type: string;
};
