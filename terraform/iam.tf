resource "google_service_account" "storage_admin" {
  account_id   = "${var.environment}-storage-admin"
  display_name = "Storage Admin Service Account"
}

resource "google_service_account" "ingeniti_api_server" {
  account_id   = "${var.environment}-api-server"
  display_name = "ingeniti API server service account"
}

resource "google_project_iam_member" "cloud_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.ingeniti_api_server.email}"
}

resource "google_project_iam_member" "cloud_tasks_enqueuer" {
  project = var.project_id
  role    = "roles/cloudtasks.enqueuer"
  member  = "serviceAccount:${google_service_account.ingeniti_api_server.email}"
}

resource "google_project_iam_member" "secret_manager_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.ingeniti_api_server.email}"
}
