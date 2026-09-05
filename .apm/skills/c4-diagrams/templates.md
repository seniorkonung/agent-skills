# C4 Diagram Templates

Use these ASCII-only layouts as starting points. Replace generic labels with domain names from the codebase or proposed system, following the label rules in `SKILL.md`. Preserve box alignment and connect arrows to the intended elements when adapting a layout.

## System Context

```text
+----------+        uses        +------------------+
|  Person  | -----------------> | Software System  |
+----------+                    +------------------+
                                      |
                                      | calls
                                      v
                                +------------------+
                                | External System  |
                                +------------------+
```

## Container

```text
+----------+                  +-------------------------------------------+
|  Person  |                  |              Software System              |
+----------+                  |                                           |
     |                        |  +---------+   calls   +---------------+  |
     +------ uses (HTTPS) ------>| Web App | --------> | API Service   |  |
                              |  +---------+           +---------------+  |
                              |                                |          |
                              |                                | reads /  |
                              |                                | writes   |
                              |                                v          |
                              |                        +---------------+  |
                              |                        | Database      |  |
                              |                        +---------------+  |
                              +-------------------------------------------+
```

## Component

```text
Container: API Service

+--------------------------------------------+
|                 API Service                |
|                                            |
|  +------------+  uses   +--------------+   |
|  | Controller | ------> | Application  |   |
|  +------------+         | Service      |   |
|                         +--------------+   |
|                                 | uses     |
|                                 v          |
|                         +--------------+   |
|                         | Repository   |   |
|                         +--------------+   |
+--------------------------------------------+
```

## Dynamic

```text
Person              Web App             API Service         Database
  |                    |                    |                    |
  | 1. Submit request  |                    |                    |
  |------------------->|                    |                    |
  |                    | 2. Send command    |                    |
  |                    |------------------->|                    |
  |                    |                    | 3. Persist data    |
  |                    |                    |------------------->|
  |                    |                    | 4. Confirm write   |
  |                    |                    |<-------------------|
  |                    | 5. Return result   |                    |
  |                    |<-------------------|                    |
  | 6. Show outcome    |                    |                    |
  |<-------------------|                    |                    |
```

## Deployment

```text
+-------------------- Cloud / Network ---------------------+
|                                                          |
|  +--------------+  internal HTTP   +------------------+  |
|  | Web Runtime  | ---------------> | Service Runtime  |  |
|  +--------------+                  +------------------+  |
|                                              |           |
|                                              | DB access |
|                                              v           |
|                                       +------------+     |
|                                       | Managed DB |     |
|                                       +------------+     |
+----------------------------------------------------------+
```
