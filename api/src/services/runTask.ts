import { CloudTasksClient } from '@google-cloud/tasks';
import { GCP_LOCATION, GCP_PROJECT_ID, GCP_TASK_QUEUE_ID, IS_PRODUCTION, TASK_WORKER_URL } from '../config';
type HttpMethod = 'HTTP_METHOD_UNSPECIFIED' | 'POST' | 'GET' | 'HEAD' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

const tasksClient = new CloudTasksClient();

export async function runTask(method: HttpMethod, path: string, body: Record<string, string>, id: string) {
  if (IS_PRODUCTION) {
    await enqueueTask(method, path, body, id);
  } else {
    await makeAPIRequest(method, path, body);
  }
}

async function makeAPIRequest(method: HttpMethod, path: string, body: Record<string, string>) {
  console.log('Making API request to', TASK_WORKER_URL + path, 'with body', body);
  const response = await fetch(TASK_WORKER_URL + path, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}

async function enqueueTask(method: HttpMethod, path: string, body: Record<string, string>, id: string) {
  const queuePath: string = tasksClient.queuePath(
    GCP_PROJECT_ID as string,
    GCP_LOCATION as string,
    GCP_TASK_QUEUE_ID as string
  );

  const taskName: string = tasksClient.taskPath(
    GCP_PROJECT_ID as string,
    GCP_LOCATION as string,
    GCP_TASK_QUEUE_ID as string,
    id
  );

  const request = {
    parent: queuePath,
    task: {
      name: taskName,
      httpRequest: {
        httpMethod: method,
        url: TASK_WORKER_URL + path,
        body: Buffer.from(JSON.stringify(body)).toString('base64'),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    },
  };

  const [response] = await tasksClient.createTask(request);
  return response;
}
