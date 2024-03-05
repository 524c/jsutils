/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import Redis from './redis/index.js';
import encoding from './encoding/index.js';
import logger from './logger/index.js';
import fetch, { Fetch } from './customFetch/index.js';
import { setCookie, sanitizeHtml } from './customFetch/helpers.js';
import {
  deepCopy,
  sleep,
  timeoutFnRun,
  raceFnRun,
  isNumber
} from './misc/helpers.js';

import type { FnResult, CallbackFunction } from './misc/helpers.js';
import type { Response } from './customFetch/index.js';

export {
  Redis,
  encoding,
  logger,
  Fetch,
  fetch,
  setCookie,
  sanitizeHtml,
  deepCopy,
  sleep,
  timeoutFnRun,
  raceFnRun,
  isNumber,
  FnResult,
  CallbackFunction,
  Response
};
