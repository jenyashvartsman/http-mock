# ui-http-mock

A lightweight CLI tool for mocking HTTP API endpoints during UI development. Define JSON response files in a simple directory structure and spin up a mock server instantly — no backend required.

## Installation

```bash
npm install -g ui-http-mock
```

Or use it without installing via `npx`:

```bash
npx ui-http-mock
```

## Usage

```bash
ui-http-mock [options]
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `--port` | number | `8080` | Port to listen on |
| `--mock-dir` | path | `mocks` | Directory containing mock files |
| `--prefix` | string | _(none)_ | URL prefix for all routes |
| `--delay` | number | `0` | Max random response delay in ms |
| `--help` | — | — | Show help message |

### Examples

```bash
ui-http-mock                              # Start on port 8080, load ./mocks
ui-http-mock --port 3000                  # Start on port 3000
ui-http-mock --mock-dir ./data            # Load mocks from ./data
ui-http-mock --prefix /api               # All routes prefixed with /api
ui-http-mock --delay 500                  # Add up to 500ms random delay
```

## Mock File Structure

Organize mock files by route path and HTTP method. Each file is named after the HTTP method (lowercase) and contains the JSON response body.

```
mocks/
├── users/
│   ├── get.json          # GET /users
│   ├── post.json         # POST /users
│   └── [id]/
│       ├── get.json      # GET /users/:id
│       └── patch.json    # PATCH /users/:id
└── posts/
    └── get.json          # GET /posts
```

### Dynamic Routes

Use `[paramName]` folder names to match dynamic URL segments:

```
mocks/
└── products/
    └── [id]/
        ├── get.json       # matches GET /products/1, /products/abc, etc.
        └── delete.json    # matches DELETE /products/1, etc.
```

### Example Mock File

`mocks/users/get.json`:

```json
[
  { "id": "1", "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com" },
  { "id": "2", "firstName": "Jane", "lastName": "Smith", "email": "jane.smith@example.com" }
]
```

## Supported HTTP Methods

`GET` `POST` `PUT` `DELETE` `PATCH`

## License

ISC
