export class HttpStatus {
  // Informational Responses
  public static readonly CONTINUE = 100;
  public static readonly SWITCHING_PROTOCOLS = 101;
  public static readonly PROCESSING = 102;
  public static readonly CONTINUE_MESSAGE = 'Continue';
  public static readonly SWITCHING_PROTOCOLS_MESSAGE = 'Switching Protocols';
  public static readonly PROCESSING_MESSAGE = 'Processing';

  // Success Responses
  public static readonly OK = 200;
  public static readonly CREATED = 201;
  public static readonly ACCEPTED = 202;
  public static readonly NON_AUTHORITATIVE_INFORMATION = 203;
  public static readonly NO_CONTENT = 204;
  public static readonly RESET_CONTENT = 205;
  public static readonly PARTIAL_CONTENT = 206;
  public static readonly MULTI_STATUS = 207;
  public static readonly ALREADY_REPORTED = 208;
  public static readonly IM_USED = 226;
  public static readonly OK_MESSAGE = 'OK';
  public static readonly CREATED_MESSAGE = 'Created';
  public static readonly ACCEPTED_MESSAGE = 'Accepted';
  public static readonly NON_AUTHORITATIVE_INFORMATION_MESSAGE = 'Non-Authoritative Information';
  public static readonly NO_CONTENT_MESSAGE = 'No Content';
  public static readonly RESET_CONTENT_MESSAGE = 'Reset Content';
  public static readonly PARTIAL_CONTENT_MESSAGE = 'Partial Content';
  public static readonly MULTI_STATUS_MESSAGE = 'Multi-Status';
  public static readonly ALREADY_REPORTED_MESSAGE = 'Already Reported';
  public static readonly IM_USED_MESSAGE = 'IM Used';

  // Redirection Messages
  public static readonly MULTIPLE_CHOICES = 300;
  public static readonly MOVED_PERMANENTLY = 301;
  public static readonly FOUND = 302;
  public static readonly SEE_OTHER = 303;
  public static readonly NOT_MODIFIED = 304;
  public static readonly USE_PROXY = 305;
  public static readonly TEMPORARY_REDIRECT = 307;
  public static readonly PERMANENT_REDIRECT = 308;
  public static readonly MULTIPLE_CHOICES_MESSAGE = 'Multiple Choices';
  public static readonly MOVED_PERMANENTLY_MESSAGE = 'Moved Permanently';
  public static readonly FOUND_MESSAGE = 'Found';
  public static readonly SEE_OTHER_MESSAGE = 'See Other';
  public static readonly NOT_MODIFIED_MESSAGE = 'Not Modified';
  public static readonly USE_PROXY_MESSAGE = 'Use Proxy';
  public static readonly TEMPORARY_REDIRECT_MESSAGE = 'Temporary Redirect';
  public static readonly PERMANENT_REDIRECT_MESSAGE = 'Permanent Redirect';

  // Client Error Responses
  public static readonly BAD_REQUEST = 400;
  public static readonly UNAUTHORIZED = 401;
  public static readonly PAYMENT_REQUIRED = 402;
  public static readonly FORBIDDEN = 403;
  public static readonly NOT_FOUND = 404;
  public static readonly METHOD_NOT_ALLOWED = 405;
  public static readonly NOT_ACCEPTABLE = 406;
  public static readonly PROXY_AUTHENTICATION_REQUIRED = 407;
  public static readonly REQUEST_TIMEOUT = 408;
  public static readonly CONFLICT = 409;
  public static readonly GONE = 410;
  public static readonly LENGTH_REQUIRED = 411;
  public static readonly PRECONDITION_FAILED = 412;
  public static readonly PAYLOAD_TOO_LARGE = 413;
  public static readonly URI_TOO_LONG = 414;
  public static readonly UNSUPPORTED_MEDIA_TYPE = 415;
  public static readonly RANGE_NOT_SATISFIABLE = 416;
  public static readonly EXPECTATION_FAILED = 417;
  public static readonly I_AM_A_TEAPOT = 418;
  public static readonly MISDIRECTED_REQUEST = 421;
  public static readonly UNPROCESSABLE_ENTITY = 422;
  public static readonly LOCKED = 423;
  public static readonly FAILED_DEPENDENCY = 424;
  public static readonly TOO_EARLY = 425;
  public static readonly UPGRADE_REQUIRED = 426;
  public static readonly PRECONDITION_REQUIRED = 428;
  public static readonly TOO_MANY_REQUESTS = 429;
  public static readonly REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
  public static readonly UNAVAILABLE_FOR_LEGAL_REASONS = 451;
  public static readonly BAD_REQUEST_MESSAGE = 'Bad Request';
  public static readonly UNAUTHORIZED_MESSAGE = 'Unauthorized';
  public static readonly PAYMENT_REQUIRED_MESSAGE = 'Payment Required';
  public static readonly FORBIDDEN_MESSAGE = 'Forbidden';
  public static readonly NOT_FOUND_MESSAGE = 'Not Found';
  public static readonly METHOD_NOT_ALLOWED_MESSAGE = 'Method Not Allowed';
  public static readonly NOT_ACCEPTABLE_MESSAGE = 'Not Acceptable';
  public static readonly PROXY_AUTHENTICATION_REQUIRED_MESSAGE = 'Proxy Authentication Required';
  public static readonly REQUEST_TIMEOUT_MESSAGE = 'Request Timeout';
  public static readonly CONFLICT_MESSAGE = 'Conflict';
  public static readonly GONE_MESSAGE = 'Gone';
  public static readonly LENGTH_REQUIRED_MESSAGE = 'Length Required';
  public static readonly PRECONDITION_FAILED_MESSAGE = 'Precondition Failed';
  public static readonly PAYLOAD_TOO_LARGE_MESSAGE = 'Payload Too Large';
  public static readonly URI_TOO_LONG_MESSAGE = 'URI Too Long';
  public static readonly UNSUPPORTED_MEDIA_TYPE_MESSAGE = 'Unsupported Media Type';
  public static readonly RANGE_NOT_SATISFIABLE_MESSAGE = 'Range Not Satisfiable';
  public static readonly EXPECTATION_FAILED_MESSAGE = 'Expectation Failed';
  public static readonly I_AM_A_TEAPOT_MESSAGE = "I'm a teapot";
  public static readonly MISDIRECTED_REQUEST_MESSAGE = 'Misdirected Request';
  public static readonly UNPROCESSABLE_ENTITY_MESSAGE = 'Unprocessable Entity';
  public static readonly LOCKED_MESSAGE = 'Locked';
  public static readonly FAILED_DEPENDENCY_MESSAGE = 'Failed Dependency';
  public static readonly TOO_EARLY_MESSAGE = 'Too Early';
  public static readonly UPGRADE_REQUIRED_MESSAGE = 'Upgrade Required';
  public static readonly PRECONDITION_REQUIRED_MESSAGE = 'Precondition Required';
  public static readonly TOO_MANY_REQUESTS_MESSAGE = 'Too Many Requests';
  public static readonly REQUEST_HEADER_FIELDS_TOO_LARGE_MESSAGE =
    'Request Header Fields Too Large';
  public static readonly UNAVAILABLE_FOR_LEGAL_REASONS_MESSAGE = 'Unavailable For Legal Reasons';

  // Server Error Responses
  public static readonly INTERNAL_SERVER_ERROR = 500;
  public static readonly NOT_IMPLEMENTED = 501;
  public static readonly BAD_GATEWAY = 502;
  public static readonly SERVICE_UNAVAILABLE = 503;
  public static readonly GATEWAY_TIMEOUT = 504;
  public static readonly HTTP_VERSION_NOT_SUPPORTED = 505;
  public static readonly VARIANT_ALSO_NEGOTIATES = 506;
  public static readonly INSUFFICIENT_STORAGE = 507;
  public static readonly LOOP_DETECTED = 508;
  public static readonly NOT_EXTENDED = 510;
  public static readonly NETWORK_AUTHENTICATION_REQUIRED = 511;
  public static readonly INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';
  public static readonly NOT_IMPLEMENTED_MESSAGE = 'Not Implemented';
  public static readonly BAD_GATEWAY_MESSAGE = 'Bad Gateway';
  public static readonly SERVICE_UNAVAILABLE_MESSAGE = 'Service Unavailable';
  public static readonly GATEWAY_TIMEOUT_MESSAGE = 'Gateway Timeout';
  public static readonly HTTP_VERSION_NOT_SUPPORTED_MESSAGE = 'HTTP Version Not Supported';
  public static readonly VARIANT_ALSO_NEGOTIATES_MESSAGE = 'Variant Also Negotiates';
  public static readonly INSUFFICIENT_STORAGE_MESSAGE = 'Insufficient Storage';
  public static readonly LOOP_DETECTED_MESSAGE = 'Loop Detected';
  public static readonly NOT_EXTENDED_MESSAGE = 'Not Extended';
  public static readonly NETWORK_AUTHENTICATION_REQUIRED_MESSAGE =
    'Network Authentication Required';
}
