OPENAPI_TS := ./node_modules/.bin/openapi-typescript

.PHONY: generate-api

generate-api:
	@echo "Removing /api from openapi.yaml..."
	sed 's|/api||g' openapi.yaml > openapi.tmp.yaml
	mv openapi.tmp.yaml openapi.yaml

	@echo "Generating TypeScript types..."
	$(OPENAPI_TS) openapi.yaml -o src/Global/API.ts

	@echo "Removing openapi.yaml..."
	rm openapi.yaml

	@echo "Done."