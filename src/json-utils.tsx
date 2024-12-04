import { ParserTracerEvent } from "./lib/generated-json-parser";

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

interface ASTNode {
  type: string;
  location: {
    start: { offset: number; line: number; column: number };
    end: { offset: number; line: number; column: number };
  };
  [key: string]: any;
}

export const createJsonTracer = () => {
  interface ParserState {
    nodeStack: ASTNode[];
    rootNode: ASTNode | null;
  }

  const internalState: ParserState = {
    nodeStack: [],
    rootNode: null,
  };

  return {
    trace: (event: ParserTracerEvent) => {
      switch (event.type) {
        case "rule.enter":
          {
            // When entering a rule, create a new node with initial location
            const node: ASTNode = {
              type: event.rule,
              location: event.location,
            };
            internalState.nodeStack.push(node);
          }
          break;

        case "rule.match":
          {
            // When entering a rule, create a new node with initial location
            const node: ASTNode = {
              type: event.rule,
              location: event.location,
            };
            internalState.nodeStack.push(node);

            const matchedRule = event.rule;
            // When a rule matches, complete the node with result and location

            const matchedNode = internalState.nodeStack.pop();
            if (matchedNode) {
              // Update end location
              matchedNode.location.end = event.location.end;

              // Add the parsed value to the node
              if (typeof event.result === "object") {
                Object.assign(matchedNode, event.result);
              } else {
                matchedNode.value = event.result;
              }

              // For specific rules, add extra properties
              switch (event.rule) {
                case "array":
                  matchedNode.elements = Array.isArray(event.result)
                    ? event.result
                    : [];
                  break;
                case "object":
                  matchedNode.properties = Array.isArray(event.result)
                    ? event.result
                    : {};
                  break;
                case "string":
                  matchedNode.value = event.result;
                  break;
                case "number":
                  matchedNode.value = Number(event.result);
                  break;
              }

              // If there's a parent node, store this as a child
              if (internalState.nodeStack.length > 0) {
                const parent =
                  internalState.nodeStack[internalState.nodeStack.length - 1];
                if (!parent.children) parent.children = [];
                parent.children.push(matchedNode);
              }

              // If this is the root node, store it for later access
              if (internalState.nodeStack.length === 0) {
                internalState.rootNode = matchedNode;
              }
            }
          }
          break;

        case "rule.fail":
          // On failure, remove the node from the stack
          internalState.nodeStack.pop();
          break;
      }
    },

    // Method to get the final AST
    getAST: () => internalState.rootNode,
  };
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
