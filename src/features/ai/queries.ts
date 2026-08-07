import { gql } from "@apollo/client";

export const GET_OUTFIT_RECOMMENDATION = gql`
  query GetOutfitRecommendation(
    $occasion: String!
    $budget: Float!
    $gender: String!
  ) {
    getOutfitRecommendation(
      occasion: $occasion
      budget: $budget
      gender: $gender
    ) {
      recommendation
    }
  }
`;

export const GET_SIZE_RECOMMENDATION = gql`
  query GetSizeRecommendation(
    $height: Float!
    $weight: Float!
    $gender: String!
    $category: String!
  ) {
    getSizeRecommendation(
      height: $height
      weight: $weight
      gender: $gender
      category: $category
    ) {
      recommendation
    }
  }
`;
