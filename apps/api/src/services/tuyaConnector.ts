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
  path: string;
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

    console.log('Request Sign:', { t, url, signStr });

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

    console.log('Token Request Headers:', headers);

    const { data: login } = await this.httpClient.get<ApiResponse<{ access_token: string }>>(
      '/v1.0/token?grant_type=1',
      { headers }
    );

    console.log('Token Response:', login);

    if (!login || !login.success) {
      throw Error(`fetch failed: ${login.msg}`);
    }

    this.token = login.result.access_token;
    console.log('Fetched Token:', this.token);
  }

  async getDeviceInfo(deviceId: string) {
    if (!this.token) {
      console.log('Token is not set, fetching token...');
      await this.getToken();
    }

    const query = {};
    const method = 'GET';
    const url = `/v2.0/cloud/thing/${deviceId}`;
    const reqHeaders = await this.getRequestSign(url, method, {}, query);
    console.log('Device Info Request Headers:', reqHeaders);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    console.log('Device Info Response:', data);

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async getDeviceState(deviceId: string) {
    if (!this.token) {
      console.log('Token is not set, fetching token...');
      await this.getToken();
    }

    const query = {};
    const method = 'GET';
    const url = `/v2.0/cloud/thing/${deviceId}/state`;
    const reqHeaders = await this.getRequestSign(url, method, {}, query);
    console.log('Device State Request Headers:', reqHeaders);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    console.log('Device State Response:', data);

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async freezeDevice(deviceId: string, state: number) {
    if (!this.token) {
      console.log('Token is not set, fetching token...');
      await this.getToken();
    }

    const method = 'POST';
    const url = `/v2.0/cloud/thing/${deviceId}/freeze`;
    const body = { state };

    console.log('Current Token:', this.token);
    console.log('Freeze Request Body:', body);

    const reqHeaders = await this.getRequestSign(url, method, {}, {}, body);
    console.log('Freeze Device Request Headers:', reqHeaders);

    const { data } = await this.httpClient.request({
      method,
      data: body, // Ensure the body is sent correctly
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    console.log('Freeze Device Response:', data);

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
    if (!this.token) {
      console.log('Token is not set, fetching token...');
      await this.getToken();
    }
    const query = {
      energy_action: energyAction,
      statistics_type: statisticsType,
      start_time: startTime,
      end_time: endTime,
      limit,
      contain_childs: containChilds,
    };

    const reqHeaders = await this.getRequestSign(url, method, {}, query);
    console.log('Device Energy Request Headers:', reqHeaders);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    console.log('Device Energy Response:', data);

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async deviceEnergyStats(
    deviceId: string,
    indicatorCode: string,
    dateType: string,
    beginDate: string,
    endDate: string,
    aggregationType?: string
  ): Promise<ApiResponse<any>> {
    const method = 'POST';
    const url = '/v1.0/m/energy/statistics/device/datadate';
    if (!this.token) {
      console.log('Token is not set, fetching token...');
      await this.getToken();
    }

    const body = {
      dev_id: deviceId,
      indicator_code: indicatorCode,
      date_type: dateType,
      begin_date: beginDate,
      end_date: endDate,
      aggregation_type: aggregationType,
    };

    const reqHeaders = await this.getRequestSign(url, method, {}, {}, body);
    console.log('Device Energy Stats Request Headers:', reqHeaders);

    const { data } = await this.httpClient.request({
      method,
      data: body,
      params: {},
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    console.log('Device Energy Stats Response:', data);

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async totalEnergyStats(
    energyType: string,
    energyAction: string,
    statisticsType: string,
    startTime: string,
    endTime: string,
    deviceIds: string[],
    containChilds: boolean = true
  ): Promise<ApiResponse<number>> {
    const method = 'GET';
    const url = `/v1.0/iot-03/energy/${energyType}/device/nodes/statistics-sum`;
    if (!this.token) {
      console.log('Token is not set, fetching token...');
      await this.getToken();
    }

    const query = {
      energy_action: energyAction,
      statistics_type: statisticsType,
      start_time: startTime,
      end_time: endTime,
      contain_childs: containChilds,
      device_ids: deviceIds.join(','), // Join device IDs into a comma-separated string
    };

    const reqHeaders = await this.getRequestSign(url, method, {}, query);
    console.log('Total Energy Stats Request Headers:', reqHeaders);

    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: query,
      headers: {
        ...reqHeaders,
      } as { [key: string]: string | undefined },
      url: reqHeaders.path,
    });

    console.log('Total Energy Stats Response:', data);

    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`);
    }

    return data;
  }
}
