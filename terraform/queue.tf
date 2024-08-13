resource "google_cloud_tasks_queue" "test-runs" {
  name     = "test-runs"
  location = var.region

  rate_limits {
    max_concurrent_dispatches = 2
    max_dispatches_per_second = 2
  }

  retry_config {
    max_attempts       = 1
    max_retry_duration = "4s"
    max_backoff        = "3s"
    min_backoff        = "2s"
    max_doublings      = 1
  }

  stackdriver_logging_config {
    sampling_ratio = 0.9
  }
}
