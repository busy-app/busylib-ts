.PHONY: generate-api generate-proto

# --- API Generation ---
OPENAPI_TS := ./node_modules/.bin/openapi-typescript
generate-api:
	@echo "Removing /api from openapi.yaml..."
	@sed 's|/api||g' openapi.yaml > openapi.tmp.yaml
	@mv openapi.tmp.yaml openapi.yaml

	@echo "Generating TypeScript types..."
	@$(OPENAPI_TS) openapi.yaml --default-non-nullable false -o src/Global/API.ts

	@echo "Removing openapi.yaml..."
	@rm openapi.yaml

	@echo "Done."

# --- Protobuf Generation ---
PBJS := ./node_modules/.bin/pbjs
PBTS := ./node_modules/.bin/pbts

STATE_PROTO_DIR := src/StateStream/proto
STATE_TYPES_DIR := src/StateStream/types
STATE_PROTO := $(STATE_PROTO_DIR)/state.proto
BUNDLE_JSON := $(STATE_TYPES_DIR)/bundle.json
SCHEMA_TS := $(STATE_TYPES_DIR)/schema.ts

generate-proto:
	@echo "Creating directories..."
	@mkdir -p $(STATE_TYPES_DIR)

	@echo "Generating Protobuf JSON bundle..."
	@$(PBJS) -t json -p $(STATE_PROTO_DIR) -o $(BUNDLE_JSON) $(STATE_PROTO)

	@echo "Generating Protobuf TypeScript types (clean)..."
# Generate full definition to a temporary file
	@$(PBJS) -t static-module -p $(STATE_PROTO_DIR) $(STATE_PROTO) | $(PBTS) -o $(SCHEMA_TS) -

	@echo "Cleaning up schema.ts..."
# 1. Remove all lines from "class" until "}" (safe removal of class bodies)
	@sed -i '' '/^[ ]*class /,/^[ ]*}/d' $(SCHEMA_TS)

# 2. Remove "Represents a..." lines left over from classes
	@sed -i '' '/Represents a/d' $(SCHEMA_TS)
	
# 3. Clean BSB_ namespace and interface names (preserving IpProtocol, InputEvent)
	@sed -i '' 's/interface I\([A-Z]\)/interface \1/g' $(SCHEMA_TS)
	@sed -i '' 's/\.I\([A-Z]\)/.\1/g' $(SCHEMA_TS)
	@sed -i '' 's/: I\([A-Z]\)/: \1/g' $(SCHEMA_TS)
	
# 4. Remove protobufjs-specific imports
	@sed -i '' '/import \* as \$$protobuf/d' $(SCHEMA_TS)

# 5. Convert to valid ES module syntax and export internal types
	@sed -i '' 's/import Long = require("long");/import Long from "long";/g' $(SCHEMA_TS)
	@sed -i '' 's/^\([ ]*\)interface/\1export interface/g' $(SCHEMA_TS)
	@sed -i '' 's/^\([ ]*\)enum/\1export enum/g' $(SCHEMA_TS)
	@sed -i '' 's/^\([ ]*\)namespace/\1export namespace/g' $(SCHEMA_TS)
	
	@echo "Protobuf generation done."