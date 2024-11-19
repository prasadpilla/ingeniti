import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import qs from 'qs';

interface Config {
  accessKey: string;
  secretKey: string;
  baseUrl?: string;
}

interface RequestHeaders {
  t: string;
  sign_method: string;
  client_id: string;
  sign: string;
  access_token?: string;
  path: string; // Added this line
}

interface ApiResponse<T> {
  result: T;
  success: boolean;
  msg?: string;
}

export class TuyaConnector {
  private readonly config: Config;
  private token: string | undefined = undefined;
  private httpClient: AxiosInstance;

  constructor(config: Config) {
    this.config = config;
    this.httpClient = axios.create({
      baseURL: config.baseUrl || 'https://openapi.tuyain.com',
    });
  }

  private async encryptStr(str: string, secret: string): Promise<string> {
    return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
  }

  private async getRequestSign(
    path: string,
    method: string,
    headers: { [k: string]: string } = {},
    query: { [k: string]: any } = {},
    body: { [k: string]: any } = {}
  ): Promise<RequestHeaders> {
    const t = Date.now().toString();
    const [uri, pathQuery] = path.split('?');
    const queryMerged = { ...query, ...qs.parse(pathQuery) };
    const sortedQuery: { [k: string]: string } = {};

    Object.keys(queryMerged)
      .sort()
      .forEach((i) => (sortedQuery[i] = queryMerged[i]));

    const querystring = decodeURIComponent(qs.stringify(sortedQuery));
    const url = querystring ? `${uri}?${querystring}` : uri;
    const contentHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
    const stringToSign = [method, contentHash, '', url].join('\n');
    const signStr = this.config.accessKey + this.token + t + stringToSign;

    return {
      ...headers,
      t,
      path: url,
      client_id: this.config.accessKey,
      sign: await this.encryptStr(signStr, this.config.secretKey),
      sign_method: 'HMAC-SHA256',
      access_token: this.token,
    };
  }

  async getToken(): Promise<void> {
    const method = 'GET';
    const timestamp = Date.now().toString();
    const signUrl = '/v1.0/token?grant_type=1';
    const contentHash = crypto.createHash('sha256').update('').digest('hex');
    const stringToSign = [method, contentHash, '', signUrl].join('\n');
    const signStr = this.config.accessKey + timestamp + stringToSign;

    const headers = {
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      client_id: this.config.accessKey,
      sign: await this.encryptStr(signStr, this.config.secretKey),
    };

    const { data: login } = await this.httpClient.get<ApiResponse<{ access_token: string }>>(
      '/v1.0/token?grant_type=1',
      { headers }
    );

    if (!login || !login.success) {
      throw Error(`fetch failed: ${login.msg}`);
    }

    this.token = login.result.access_token;
  }

  async getDeviceInfo(deviceId: string) {
    const query = {};
    const method = 'GET';
    const url = `/v2.0/cloud/thing/${deviceId}`;
    const reqHeaders = await this.getRequestSign(url, method, {}, query);
    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });
    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async getDeviceState(deviceId: string) {
    const query = {};
    const method = 'GET';
    const url = `/v2.0/cloud/thing/${deviceId}/state`;
    const reqHeaders = await this.getRequestSign(url, method, {}, query);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async freezeDevice(deviceId: string, state: number) {
    const method = 'POST';
    const url = `/v2.0/cloud/thing/${deviceId}/freeze`;
    const body = { state };
    const reqHeaders = await this.getRequestSign(url, method, {}, {}, body);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async getDeviceEnergy(
    energyType: string,
    energyAction: string,
    statisticsType: string,
    startTime: string,
    endTime: string,
    limit: number = 10,
    containChilds: boolean = true
  ) {
    const method = 'GET';
    const url = `/v1.0/iot-03/energy/${energyType}/space/statistics/devices-top`;
    const query = {
      energy_action: energyAction,
      statistics_type: statisticsType,
      start_time: startTime,
      end_time: endTime,
      limit,
      contain_childs: containChilds,
    };

    const reqHeaders = await this.getRequestSign(url, method, {}, query);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }
}
