
// Define a generic type for the JSON content
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type JsonField = {
  title: string;
  type: string;
  value: JsonValue;
};

export const isAggregatedType = (field: JsonField): boolean => {
  return field.type === 'object' || field.type === 'array';
};

// Helper function to determine JSON type
export const getJsonType = (value: JsonValue): string => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
};