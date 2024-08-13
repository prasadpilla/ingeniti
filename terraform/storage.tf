resource "google_storage_bucket" "test-recordings" {
  name                        = "ingeniti-${var.environment}-recordings"
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

resource "google_storage_bucket" "test-traces" {
  name                        = "ingeniti-${var.environment}-traces"
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

  cors {
    origin          = ["https://trace.playwright.dev"]
    method          = ["GET"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket" "test-html-snapshots" {
  name                        = "ingeniti-${var.environment}-html-snapshots"
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
  bucket = google_storage_bucket.test-recordings.name
  role   = "roles/storage.admin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_creator_binding" {
  bucket = google_storage_bucket.test-recordings.name
  role   = "roles/storage.objectCreator"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_admin_binding" {
  bucket = google_storage_bucket.test-recordings.name
  role   = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_admin_binding_traces" {
  bucket = google_storage_bucket.test-traces.name
  role   = "roles/storage.admin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_creator_binding_traces" {
  bucket = google_storage_bucket.test-traces.name
  role   = "roles/storage.objectCreator"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_admin_binding_traces" {
  bucket = google_storage_bucket.test-traces.name
  role   = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_admin_binding_html_snapshots" {
  bucket = google_storage_bucket.test-html-snapshots.name
  role   = "roles/storage.admin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_creator_binding_html_snapshots" {
  bucket = google_storage_bucket.test-html-snapshots.name
  role   = "roles/storage.objectCreator"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}

resource "google_storage_bucket_iam_binding" "storage_object_admin_binding_html_snapshots" {
  bucket = google_storage_bucket.test-html-snapshots.name
  role   = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.storage_admin.email}",
  ]
}


resource "google_storage_bucket_iam_binding" "public_access_traces" {
  bucket = google_storage_bucket.test-traces.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

resource "google_storage_bucket_iam_binding" "public_access" {
  bucket = google_storage_bucket.test-recordings.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

resource "google_storage_bucket_iam_binding" "public_access_html_snapshots" {
  bucket = google_storage_bucket.test-html-snapshots.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}
