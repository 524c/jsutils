/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import Redis from './redis';
import encoding from './encoding';
import logger from './logger';
import fetch, { Fetch } from './customFetch';
import { setCookie, sanitizeHtml } from './customFetch/helpers';
import {
  deepCopy,
  sleep,
  timeoutFnRun,
  raceFnRun,
  isNumber
} from './misc/helpers.js';
import { encode, decode } from './jwt';

import type { FnResult, CallbackFunction } from './misc/helpers';
import type { Response } from './customFetch';

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
  Response,
  encode,
  decode
};
