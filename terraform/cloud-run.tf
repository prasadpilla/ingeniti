data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service" "ingeniti-api-server" {
  name     = "ingeniti-api-server"
  location = var.region

  template {
    metadata {
      labels = {
        "run.googleapis.com/startupProbeType" = "Default"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "10"
        "run.googleapis.com/cloudsql-instances" = var.app_db_instance
        "run.googleapis.com/startup-cpu-boost"  = "true"
      }
    }

    spec {
      container_concurrency = 80
      timeout_seconds       = 300
      service_account_name  = google_service_account.ingeniti_api_server.email

      containers {
        image = "asia-south1-docker.pkg.dev/${var.project_id}/ingeniti-api-server/image"

        ports {
          name           = "http1"
          container_port = 8080
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "TASK_WORKER_URL"
          value = google_cloud_run_service.ingeniti-task-worker.status[0].url
        }
        env {
          name  = "RUNNER_SERVICE_BASE_URL"
          value = google_cloud_run_service.ingeniti-runner.status[0].url
        }
        env {
          name  = "GCP_PROJECT_ID"
          value = var.project_id
        }
        env {
          name  = "GCP_LOCATION"
          value = var.region
        }
        env {
          name  = "GCP_TASK_QUEUE_ID"
          value = google_cloud_tasks_queue.test-runs.name
        }
        env {
          name  = "PROD_DB_PORT"
          value = "5432"
        }
        env {
          name  = "CLERK_PUBLISHABLE_KEY"
          value = "pk_live_Y2xlcmsuc3VwYXRlc3QuYWkk"
        }
        env {
          name  = "FRONTEND_URL"
          value = "https://app.ingeniti.ai"
        }
        env {
          name  = "GPT_3_5_AZURE_OPENAI_DEPLOYMENT_NAME"
          value = "gpt-35-turbo"
        }
        env {
          name  = "GPT_4_AZURE_OPENAI_API_VERSION"
          value = "2024-02-01"
        }
        env {
          name  = "GPT_4_AZURE_OPENAI_DEPLOYMENT_NAME"
          value = "gpt-4o"
        }
        env {
          name  = "GPT_4_AZURE_OPENAI_ENDPOINT"
          value = "https://ai-gpt4ohub151613536224.openai.azure.com/"
        }
        env {
          name = "DB_HOST"
          value_from {
            secret_key_ref {
              name = "PROD_DB_HOST"
              key  = "latest"
            }
          }
        }
        env {
          name = "DB_USER"
          value_from {
            secret_key_ref {
              name = "PROD_DB_USER"
              key  = "latest"
            }
          }
        }
        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = "PROD_DB_PASSWORD"
              key  = "latest"
            }
          }
        }
        env {
          name = "CLERK_SECRET_KEY"
          value_from {
            secret_key_ref {
              name = "PROD_CLERK_SECRET_KEY"
              key  = "latest"
            }
          }
        }
        env {
          name = "DB_DATABASE"
          value_from {
            secret_key_ref {
              name = "PROD_DB_NAME"
              key  = "latest"
            }
          }
        }
        env {
          name = "PORTKEY_API_KEY"
          value_from {
            secret_key_ref {
              name = "PROD_PORTKEY_API_KEY"
              key  = "latest"
            }
          }
        }
        env {
          name = "PORTKEY_GPT_3_5_VIRTUAL_KEY"
          value_from {
            secret_key_ref {
              name = "PROD_PORTKEY_GPT_3_5_VIRTUAL_KEY"
              key  = "latest"
            }
          }
        }
        env {
          name = "GPT_4_AZURE_OPENAI_API_KEY"
          value_from {
            secret_key_ref {
              name = "PROD_GPT_4_AZURE_OPENAI_API_KEY"
              key  = "latest"
            }
          }
        }
        env {
          name = "BROWSERBASE_PROJECT_ID"
          value_from {
            secret_key_ref {
              name = "BROWSERBASE_PROJECT_ID"
              key  = "latest"
            }
          }
        }
        env {
          name = "BROWSERBASE_API_KEY"
          value_from {
            secret_key_ref {
              name = "BROWSERBASE_API_KEY"
              key  = "latest"
            }
          }
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_policy" "ingeniti-api-server-noauth" {
  location = google_cloud_run_service.ingeniti-api-server.location
  project  = google_cloud_run_service.ingeniti-api-server.project
  service  = google_cloud_run_service.ingeniti-api-server.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_service_iam_policy" "ingeniti-runner-noauth" {
  location = google_cloud_run_service.ingeniti-runner.location
  project  = google_cloud_run_service.ingeniti-runner.project
  service  = google_cloud_run_service.ingeniti-runner.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_service" "ingeniti-task-worker" {
  name     = "ingeniti-task-worker"
  location = var.region

  template {
    metadata {
      labels = {
        "run.googleapis.com/startupProbeType" = "Default"
      }
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "10"
        "run.googleapis.com/cloudsql-instances" = var.app_db_instance
        "run.googleapis.com/startup-cpu-boost"  = "true"
      }
    }
    spec {
      container_concurrency = 80
      timeout_seconds       = 300
      service_account_name  = google_service_account.ingeniti_api_server.email

      containers {
        image = "asia-south1-docker.pkg.dev/${var.project_id}/ingeniti-task-worker/image"

        ports {
          name           = "http1"
          container_port = 8082
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }

        env {
          name  = "IS_TASK_WORKER"
          value = "true"
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "RUNNER_SERVICE_BASE_URL"
          value = google_cloud_run_service.ingeniti-runner.status[0].url
        }
        env {
          name  = "DB_PORT"
          value = "5432"
        }
        env {
          name = "DB_USER"
          value_from {
            secret_key_ref {
              name = "PROD_DB_USER"
              key  = "latest"
            }
          }
        }
        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = "PROD_DB_PASSWORD"
              key  = "latest"
            }
          }
        }
        env {
          name = "DB_HOST"
          value_from {
            secret_key_ref {
              name = "PROD_DB_HOST"
              key  = "latest"
            }
          }
        }
        env {
          name = "DB_DATABASE"
          value_from {
            secret_key_ref {
              name = "PROD_DB_NAME"
              key  = "latest"
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_policy" "ingeniti-task-worker-noauth" {
  location = google_cloud_run_service.ingeniti-task-worker.location
  project  = google_cloud_run_service.ingeniti-task-worker.project
  service  = google_cloud_run_service.ingeniti-task-worker.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_v2_job" "run-ingeniti-migrations" {
  name     = "run-ingeniti-migrations"
  location = var.region

  template {
    template {
      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [var.app_db_instance]
        }
      }
      containers {
        name  = "run-ingeniti-migrations"
        image = "asia-south1-docker.pkg.dev/${var.project_id}/ingeniti-migration-job/image"
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
        env {
          name  = "DB_PORT"
          value = "5432"
        }
        env {
          name = "DB_HOST"
          value_source {
            secret_key_ref {
              secret  = "PROD_DB_HOST"
              version = "latest"
            }
          }
        }
        env {
          name = "DB_PASSWORD"
          value_source {
            secret_key_ref {
              secret  = "PROD_DB_PASSWORD"
              version = "latest"
            }
          }
        }
        env {
          name = "DB_DATABASE"
          value_source {
            secret_key_ref {
              secret  = "PROD_DB_NAME"
              version = "latest"
            }
          }
        }
        env {
          name = "DB_USER"
          value_source {
            secret_key_ref {
              secret  = "PROD_DB_USER"
              version = "latest"
            }
          }
        }
        volume_mounts {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }
      max_retries     = 1
      timeout         = "60s"
      service_account = google_service_account.ingeniti_api_server.email
    }
    task_count = 1
  }
}
