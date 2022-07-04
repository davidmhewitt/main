// Use this file only as a guide for first steps using middlewares. Delete it when no more needed.
// For a detailed explanation about using middlewares, visit:
// https://mocks-server.org/docs/guides-using-middlewares

const middlewares = [
  {
    id: "add-headers",
    url: "*",
    method: "GET",
    variants: [
      {
        id: "enabled",
        handler: "middleware",
        response: {
          middleware: (req, res, next, mocksServer) => {
            res.set("x-mocks-server-example", "custom-header");
            mocksServer.tracer.info(
              "Custom header added by add-headers:enabled route variant middleware"
            );
            next();
          }
        },
      },
      {
        id: "disabled",
        handler: "middleware",
        response: {
          middleware: (req, res, next) => next(),
        }
      },
    ],
  },
];

export default middlewares;
