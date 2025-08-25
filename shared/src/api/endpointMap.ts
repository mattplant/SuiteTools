// endpointMap.ts
export const endpointMap = {
  user: "Fetch a single user by ID",
  users: "List users with optional filters",
  optionValues: "Retrieve option values",
} as const;

// Derived type for compile-time safety
export type EndpointName = keyof typeof endpointMap;
