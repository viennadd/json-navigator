// Define a generic type for the JSON content
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type JsonField = {
  title: string;
  type: string;
  value: JsonValue;
};

export const isAggregatedType = (field: JsonField): boolean => {
  return field.type === "object" || field.type === "array";
};

// Helper function to determine JSON type
export const getJsonType = (value: JsonValue): string => {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
};

export const JSON_DEMO_VALUE = `{
  "null_value": null,
  
  "boolean_values": {
    "true_value": true,
    "false_value": false
  },
  
  "number_values": {
    "integer": 42,
    "negative": -17,
    "float": 3.14159,
    "scientific": 1.23e-4,
    "zero": 0
  },
  
  "string_values": {
    "simple": "Hello, World!",
    "empty": "",
    "escaped_characters": "Line 1\\nLine 2\\tTabbed\\r\\nWindows line\\u2665",
    "special_characters": "£€$¥",
    "quotes": "She said \\"Hello\\" to me"
  },
  
  "array_values": {
    "empty_array": [],
    "number_array": [1, 2, 3, 4, 5],
    "string_array": ["apple", "banana", "cherry"],
    "mixed_array": [1, "two", true, null, 3.14],
    "nested_array": [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]
  },
  
  "object_values": {
    "empty_object": {},
    "nested_object": {
      "name": "John Doe",
      "age": 30,
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "country": "USA"
      }
    }
  },
  
  "complex_nested_structure": {
    "users": [
      {
        "id": 1,
        "name": "Alice",
        "active": true,
        "permissions": ["read", "write"],
        "metadata": {
          "last_login": "2024-01-01",
          "settings": {
            "theme": "dark",
            "notifications": true
          }
        }
      },
      {
        "id": 2,
        "name": "Bob",
        "active": false,
        "permissions": ["read"],
        "metadata": null
      }
    ]
  }
}`;
