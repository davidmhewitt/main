/*
Copyright 2022 Javier Brea

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

"use strict";

class Json {
  static get id() {
    return "json";
  }

  static get version() {
    return "4";
  }

  static get validationSchema() {
    return {
      type: "object",
      properties: {
        headers: {
          type: "object",
        },
        status: {
          type: "number",
        },
        body: {
          oneOf: [
            {
              type: "object",
            },
            {
              type: "array",
            },
          ],
        },
      },
      required: ["status", "body"],
      additionalProperties: false,
    };
  }

  constructor(response, core) {
    this._response = response;
    this._logger = core.logger;
    this._core = core;
  }

  middleware(req, res) {
    if (this._response.headers) {
      this._logger.debug(`Setting headers | req: ${req.id}`);
      res.set(this._response.headers);
    }
    res.status(this._response.status);
    this._logger.verbose(`Sending response | req: ${req.id}`);
    res.send(this._response.body);
  }

  get preview() {
    return {
      body: this._response.body,
      status: this._response.status,
    };
  }
}

module.exports = Json;
