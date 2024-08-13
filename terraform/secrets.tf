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

resource "google_secret_manager_secret" "prod_portkey_api_key" {
  secret_id = "PROD_PORTKEY_API_KEY"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "prod_portkey_gpt_3_5_virtual_key" {
  secret_id = "PROD_PORTKEY_GPT_3_5_VIRTUAL_KEY"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "prod_gpt_4_azure_openai_api_key" {
  secret_id = "PROD_GPT_4_AZURE_OPENAI_API_KEY"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "browserbase_project_id" {
  secret_id = "BROWSERBASE_PROJECT_ID"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "browserbase_api_key" {
  secret_id = "BROWSERBASE_API_KEY"

  replication {
    automatic = true
  }
}
