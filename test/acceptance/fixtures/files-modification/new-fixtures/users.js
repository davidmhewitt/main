/*
Copyright 2019 Javier Brea

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const INITIAL_USERS = [
  {
    id: 1,
    name: "John Doe new"
  },
  {
    id: 2,
    name: "Jane Doe new"
  }
];

const getNewUsers = {
  url: "/api/new-users",
  method: "GET",
  response: {
    status: 200,
    body: INITIAL_USERS
  }
};

const getNewUser = {
  url: "/api/new-users/:id",
  method: "GET",
  response: {
    status: 200,
    body: INITIAL_USERS[0]
  }
};

module.exports = {
  getNewUsers,
  getNewUser
};
