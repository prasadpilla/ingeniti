resource "google_artifact_registry_repository" "ingeniti_api_server_repo" {
  location      = var.region
  repository_id = "ingeniti-api-server"
  description   = "API server"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository" "ingeniti_task_worker_repo" {
  location      = var.region
  repository_id = "ingeniti-task-worker"
  description   = "Task worker"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository" "ingeniti_runner_repo" {
  location      = var.region
  repository_id = "ingeniti-runner"
  description   = "Runner"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository" "ingeniti_migration_job_repo" {
  location      = var.region
  repository_id = "ingeniti-migration-job"
  description   = "Migration job"
  format        = "DOCKER"
}
