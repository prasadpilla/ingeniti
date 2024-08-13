.PHONY: build push run-migrations deploy-api release db-proxy set-config

ENV ?= staging

ifeq ($(ENV),staging)
PROJECT_ID := chatcare-co
ACCOUNT := prasad@chatcare.co
else ifeq ($(ENV),prod)
PROJECT_ID := ingeniti-ai
ACCOUNT := prasad@ingeniti.ai
else
$(error Invalid ENV value. Must be 'staging' or 'prod')
endif

REGION := asia-south1
API_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/ingeniti-api-server/image
MIGRATIONS_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/ingeniti-migration-job/image
RUNNER_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/ingeniti-runner/image
TASK_WORKER_IMAGE := asia-south1-docker.pkg.dev/$(PROJECT_ID)/ingeniti-task-worker/image
API_SERVICE_NAME := ingeniti-api-server
RUNNER_SERVICE_NAME := ingeniti-runner
MIGRATIONS_JOB_NAME := run-ingeniti-migrations
TASK_WORKER_SERVICE_NAME := ingeniti-task-worker

set-config:
	gcloud config set project $(PROJECT_ID)
	gcloud config set account $(ACCOUNT)

db-proxy:
	cloud-sql-proxy --port 5430 --credentials-file=api/db-svc-acc.json $(PROJECT_ID):$(REGION):chatcare-prod

build-api:
	docker build -f Dockerfile.api --target server --tag $(API_IMAGE) --platform linux/amd64 .

build-migrations:
	docker build -f Dockerfile.api --target migrate --tag $(MIGRATIONS_IMAGE) --platform linux/amd64 .

build-runner:
	docker build -f Dockerfile.runner --tag $(RUNNER_IMAGE) --platform linux/amd64 .

build-task-worker:
	docker build -f Dockerfile.api --target task-worker --tag $(TASK_WORKER_IMAGE) --platform linux/amd64 .

push-api:
	docker push $(API_IMAGE)

push-migrations:
	docker push $(MIGRATIONS_IMAGE)

push-runner:
	docker push $(RUNNER_IMAGE)

push-task-worker:
	docker push $(TASK_WORKER_IMAGE)

run-migrations: set-config
	gcloud run jobs execute $(MIGRATIONS_JOB_NAME) --region $(REGION) --wait

deploy-api: set-config
	gcloud run deploy $(API_SERVICE_NAME) --image $(API_IMAGE) --region $(REGION)

deploy-runner: set-config
	gcloud run deploy $(RUNNER_SERVICE_NAME) --image $(RUNNER_IMAGE) --region $(REGION)

deploy-task-worker: set-config
	gcloud run deploy $(TASK_WORKER_SERVICE_NAME) --image $(TASK_WORKER_IMAGE) --region $(REGION)

release-api: set-config build-api push-api build-migrations push-migrations run-migrations deploy-api

release-runner: set-config build-runner push-runner deploy-runner

release-task-worker: set-config build-task-worker push-task-worker deploy-task-worker

release-backend: release-api release-runner release-task-worker

release-web: 
	pnpm --filter=web build-deploy:$(ENV)

release-all: release-api release-web release-runner