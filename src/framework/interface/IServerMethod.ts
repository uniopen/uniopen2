export type HTTP_METHODS_PARTIAL_lowercase = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
export type HTTP_METHODS_PARTIAL = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | HTTP_METHODS_PARTIAL_lowercase;
export type HTTP_METHODS = 'HEAD' | 'head' | HTTP_METHODS_PARTIAL;

export type IServerMethod = HTTP_METHODS_PARTIAL | '*' | Array<HTTP_METHODS_PARTIAL | '*'>;
