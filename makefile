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
MIGRATIONS_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/migrations/image
TASK_WORKER_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/task-worker/image
API_SERVICE_NAME := api
MIGRATIONS_JOB_NAME := run-migrations
TASK_WORKER_SERVICE_NAME := task-worker

set-config:
	gcloud auth activate-service-account $(ACCOUNT) --key-file=$(KEY_FILE)
	gcloud config set project $(PROJECT_ID)
	gcloud config set account $(ACCOUNT)

db-proxy:
	cloud-sql-proxy --port 5430 --credentials-file=api/db-svc-acc.json $(PROJECT_ID):$(REGION):ingeniti-staging


build-api:
	docker build -f Dockerfile --target server --tag $(API_IMAGE) --platform linux/amd64 .

build-migrations:
	docker build -f Dockerfile --target migrate --tag $(MIGRATIONS_IMAGE) --platform linux/amd64 .

build-task-worker:
	docker build -f Dockerfile --target task-worker --tag $(TASK_WORKER_IMAGE) --platform linux/amd64 .

push-api:
	docker push $(API_IMAGE)

push-migrations:
	docker push $(MIGRATIONS_IMAGE)

push-task-worker:
	docker push $(TASK_WORKER_IMAGE)

run-migrations: set-config
	gcloud run jobs execute $(MIGRATIONS_JOB_NAME) --region $(REGION) --wait

deploy-api: set-config
	gcloud run deploy $(API_SERVICE_NAME) --image $(API_IMAGE) --region $(REGION)

deploy-task-worker: set-config
	gcloud run deploy $(TASK_WORKER_SERVICE_NAME) --image $(TASK_WORKER_IMAGE) --region $(REGION)

release-migrations: set-config build-migrations push-migrations run-migrations

release-api: set-config build-api push-api deploy-api

release-task-worker: set-config build-task-worker push-task-worker deploy-task-worker

release-backend: release-migrations release-api release-runner release-task-worker

release-frontend: 
	pnpm --filter=frontend build-deploy:$(ENV)

release-all: release-backend release-frontend