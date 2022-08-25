/*
Copyright 2021 Javier Brea

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const { getUsers } = require("../db/users");

module.exports = async () => {
  const users = await getUsers();
  return [
    {
      id: "get-user",
      url: "/api/users/:id",
      method: "get",
      variants: [
        {
          id: "1",
          type: "json",
          options: {
            status: 200,
            body: users[0],
          },
        },
        {
          id: "2",
          type: "json",
          options: {
            status: 200,
            body: users[1],
          },
        },
        {
          id: "real",
          type: "middleware",
          options: {
            middleware: (req, res) => {
              const userId = req.params.id;
              const user = users.find((userData) => userData.id === Number(userId));
              if (user) {
                res.status(200);
                res.send(user);
              } else {
                res.status(404);
                res.send({
                  message: "User not found",
                });
              }
            }
          },
        },
      ],
    },
  ];
}

