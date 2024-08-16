resource "google_secret_manager_secret" "prod_db_host" {
  secret_id = "PROD_DB_HOST"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "prod_db_name" {
  secret_id = "PROD_DB_NAME"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "prod_db_user" {
  secret_id = "PROD_DB_USER"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "prod_db_password" {
  secret_id = "PROD_DB_PASSWORD"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "prod_clerk_secret_key" {
  secret_id = "PROD_CLERK_SECRET_KEY"

  replication {
    automatic = true
  }
}