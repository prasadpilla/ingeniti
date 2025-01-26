.PHONY: build push run-migrations deploy-api release db-proxy set-config

ENV ?= staging

ifeq ($(ENV),staging)
PROJECT_ID := ingeniti-staging
ACCOUNT := staging-deploy@ingeniti-staging.iam.gserviceaccount.com
KEY_FILE := api/staging-deploy-svc-acc.json
else ifeq ($(ENV),prod)
PROJECT_ID := ingeniti
ACCOUNT := ingeniti-prod-deploy@ingeniti.iam.gserviceaccount.com
KEY_FILE := api/prod-deploy-svc-acc.json
else
$(error Invalid ENV value. Must be 'staging' or 'prod')
endif

REGION := asia-south1
API_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/api/image
API_SERVICE_NAME := api
MIGRATIONS_JOB_NAME := run-migrations
TASK_WORKER_SERVICE_NAME := task-worker

set-config:
	gcloud auth activate-service-account $(ACCOUNT) --key-file=$(KEY_FILE)
	gcloud config set project $(PROJECT_ID)
	gcloud config set account $(ACCOUNT)

db-proxy:
	cloud-sql-proxy --port 5430 --credentials-file=api/db-svc-acc.json $(PROJECT_ID):$(REGION):ingeniti-staging

build:
	docker build -f Dockerfile --target app --tag $(API_IMAGE) --platform linux/amd64 .

push:
	docker push $(API_IMAGE)

run-migrations: set-config
	gcloud run jobs execute $(MIGRATIONS_JOB_NAME) \
		--region $(REGION) \
		--wait \
		--args="-r,dotenv/config,/app/dist/src/db/migrate.js"

deploy-api: set-config
	gcloud run deploy $(API_SERVICE_NAME) \
		--image $(API_IMAGE) \
		--region $(REGION) \
		--command="node" \
		--args="-r,dotenv/config,/app/dist/src/server.js"

deploy-task-worker: set-config
	gcloud run deploy $(TASK_WORKER_SERVICE_NAME) \
		--image $(API_IMAGE) \
		--region $(REGION) \
		--command="node" \
		--args="-r,dotenv/config,/app/dist/src/taskWorker.js"

release-migrations: set-config build push run-migrations

release-api: set-config build push deploy-api

release-task-worker: set-config build push deploy-task-worker

release-backend: release-migrations release-api release-task-worker

release-frontend: 
	pnpm --filter=frontend build-deploy:$(ENV)

release-all: release-backend release-frontend