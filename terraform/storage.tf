resource "google_storage_bucket" "assets" {
  name                        = "ingeniti-assets"
  location                    = var.region
  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket_iam_binding" "storage_admin_binding" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.admin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_creator_binding" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectCreator"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}
