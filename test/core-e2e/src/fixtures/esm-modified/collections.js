export default [
  {
    "id": "base",
    "routes": ["add-headers:enabled", "get-users:success", "get-user:success", "get-users-new:success"]
  },
  {
    "id": "no-headers",
    "from": "base",
    "routes": ["add-headers:disabled"]
  },
  {
    "id": "user-real",
    "from": "no-headers",
    "routes": ["get-user:real"]
  },
]
