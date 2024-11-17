// apps/api/src/services/tuyaConnector.ts

import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import qs from 'qs';

interface RequestHeaders {
  t: string;
  sign_method: string;
  client_id: string;
  sign: string;
  access_token?: string;
}

interface DeviceInfo {
  id: string;
  name: string;
  status: string;
}

interface AuthTokenResponse {
  result: {
    access_token: string;
  };
}

interface DeviceStateResponse {
  result: {
    state: number;
  };
}

interface FreezeResponse {
  result: boolean;
  success: boolean;
  t: number;
  tid: string;
}

interface RequestHeaders {
  t: string;
  sign_method: string;
  client_id: string;
  sign: string;
  access_token?: string;
  [key: string]: string | undefined;
}

interface EnergyConsumptionResponse {
  result: Array<{
    device_id: string;
    value: number;
  }>;
  success: boolean;
}

export class RequestHelper {
  private clientId: string;
  private secret: string;

  constructor(clientId: string, secret: string) {
    this.clientId = clientId;
    this.secret = secret;
  }

  async getRequestHeaders(
    path: string,
    method: string,
    headers: Record<string, string> = {},
    query: Record<string, string | number | boolean> = {},
    body: string = '',
    token: string | null = null
  ): Promise<RequestHeaders> {
    const timestamp = Date.now().toString();
    const [uri, pathQuery] = path.split('?');
    const queryMerged = { ...query, ...qs.parse(pathQuery) };

    const sortedQuery: Record<string, string | number | boolean> = {};
    Object.keys(queryMerged)
      .sort()
      .forEach((key) => {
        const value = queryMerged[key];
        if (value !== undefined) {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            sortedQuery[key] = value;
          } else if (Array.isArray(value)) {
            sortedQuery[key] = value.join(',');
          }
        }
      });
    const querystring = qs.stringify(sortedQuery, { encode: false });
    const url = querystring ? `${uri}?${querystring}` : uri;
    const bodyStr = body === undefined ? '' : JSON.stringify(body);
    const contentHash = crypto.createHash('sha256').update(bodyStr).digest('hex');
    const stringToSign = [method, contentHash, '', url].join('\n');

    const signStr = token
      ? `${this.clientId}${token}${timestamp}${stringToSign}`
      : `${this.clientId}${timestamp}${stringToSign}`;

    const sign = await this.encryptStr(signStr, this.secret);

    const allHeaders: RequestHeaders = {
      ...headers,
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      client_id: this.clientId,
      sign: sign,
    };

    if (token) {
      allHeaders.access_token = token;
    }

    return allHeaders;
  }

  async encryptStr(str: string, secret: string): Promise<string> {
    return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
  }

  async getDeviceInfo(deviceId: string): Promise<DeviceInfo | undefined> {
    const authToken = await this.getAuthToken();
    const path = `/v2.0/cloud/${deviceId}`;
    const method = 'GET';
    const query: Record<string, string | number | boolean> = {};
    const body = '';

    const requestHeaders = await this.getRequestHeaders(path, method, {}, query, body, authToken);

    console.log('Request Headers for Device Info:', requestHeaders);

    try {
      const response: AxiosResponse<{ result: DeviceInfo }> = await axios.get('https://openapi.tuyain.com' + path, {
        headers: requestHeaders,
      });

      if (response.data && response.data.result) {
        console.log('Received device information:', response.data.result);
        return response.data.result;
      } else {
        console.error('Failed to get device information', response.data);
      }
    } catch (error) {
      console.error('Error making API request for device info:', error);
    }
  }

  async getAuthToken(): Promise<string | undefined> {
    const path = '/v1.0/token?grant_type=1';
    const method = 'GET';
    const query: Record<string, string | number | boolean> = {};
    const body = '';
    const token = null;

    const requestHeaders = await this.getRequestHeaders(path, method, {}, query, body, token);

    console.log('Request Headers:', requestHeaders);

    try {
      const response: AxiosResponse<AuthTokenResponse> = await axios.get('https://openapi.tuyain.com' + path, {
        headers: requestHeaders,
      });

      if (response.data && response.data.result) {
        const authToken = response.data.result.access_token;
        console.log('Received auth_token:', authToken);
        return authToken;
      } else {
        console.error('Failed to get auth_token', response.data);
      }
    } catch (error) {
      console.error('Error making API request:', error);
    }
  }

  async getDeviceState(deviceId: string): Promise<number | undefined> {
    const authToken = await this.getAuthToken();
    const path = `/v2.0/cloud/thing/${deviceId}/state`;
    const method = 'GET';
    const query: Record<string, string | number | boolean> = {};
    const body = '';

    const requestHeaders = await this.getRequestHeaders(path, method, {}, query, body, authToken);

    console.log('Request Headers for Device State:', requestHeaders);

    try {
      const response: AxiosResponse<DeviceStateResponse> = await axios.get('https://openapi.tuyain.com' + path, {
        headers: requestHeaders,
      });

      if (response.data && response.data.result) {
        console.log('Received device state:', response.data.result.state);
        return response.data.result.state;
      } else {
        console.error('Failed to get device state', response.data);
      }
    } catch (error) {
      console.error('Error making API request for device state:', error);
    }
  }

  async freezeDevice(deviceId: string, state: number): Promise<boolean | undefined> {
    const authToken = await this.getAuthToken();
    const path = `/v2.0/cloud/thing/${deviceId}/freeze`;
    const method = 'POST';
    const body = { state };

    const requestHeaders = await this.getRequestHeaders(path, method, {}, {}, JSON.stringify(body), authToken);

    console.log('Request Headers for Freeze Device:', requestHeaders);

    try {
      const response: AxiosResponse<FreezeResponse> = await axios.post('https://openapi.tuyain.com' + path, body, {
        headers: requestHeaders,
      });

      if (response.data && response.data.result !== undefined) {
        console.log('Freeze operation successful:', response.data.result);
        return response.data.result;
      } else {
        console.error('Failed to freeze device', response.data);
      }
    } catch (error) {
      console.error('Error making API request to freeze device:', error);
    }
  }

  async getDeviceEnergy(
    energyType: string,
    energyAction: string,
    statisticsType: string,
    startTime: string,
    endTime: string,
    limit: number = 10,
    containChilds: boolean = true
  ): Promise<EnergyConsumptionResponse | undefined> {
    const authToken = await this.getAuthToken();
    const path = `/v1.0/iot-03/energy/${energyType}/space/statistics/devices-top`;
    const method = 'GET';

    const query = {
      energy_action: energyAction,
      statistics_type: statisticsType,
      start_time: startTime,
      end_time: endTime,
      limit: limit,
      contain_childs: containChilds,
    };

    const requestHeaders = await this.getRequestHeaders(path, method, {}, query, '', authToken);

    console.log('Request Headers for Device Energy:', requestHeaders);

    try {
      const response: AxiosResponse<EnergyConsumptionResponse> = await axios.get('https://openapi.tuyain.com' + path, {
        headers: requestHeaders,
      });

      if (response.data && response.data.result) {
        console.log('Received energy consumption ranking:', response.data.result);
        return response.data;
      } else {
        console.error('Failed to get energy consumption ranking', response.data);
      }
    } catch (error) {
      console.error('Error making API request for energy consumption ranking:', error);
    }
  }
}
