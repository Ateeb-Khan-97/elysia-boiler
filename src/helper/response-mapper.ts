import { HttpStatus } from './http-status.constant';

export class ResponseMapper {
  static map(response: any, set: { status?: number | string }) {
    const RESPONSE = {
      status: HttpStatus.OK,
      message: HttpStatus.OK_MESSAGE,
      data: null as any,
      success: true,
    };

    switch (typeof response) {
      case 'bigint':
      case 'boolean':
      case 'function':
      case 'number':
      case 'string':
      case 'symbol':
      case 'undefined': {
        RESPONSE['data'] = { data: response };
        break;
      }
      case 'object': {
        if (Array.isArray(response)) {
          RESPONSE['data'] = response;
          break;
        }

        RESPONSE['status'] = response?.status ?? HttpStatus.OK;
        RESPONSE['message'] = response?.message ?? HttpStatus.OK_MESSAGE;
        RESPONSE['data'] = response?.data ?? null;
        RESPONSE['success'] =
          RESPONSE.status >= HttpStatus.OK && RESPONSE.status < HttpStatus.MULTIPLE_CHOICES;
      }
    }

    set.status = RESPONSE.status;
    return RESPONSE;
  }
}
