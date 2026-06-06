# IDEP — Kafka Integration Test Framework

Validates that when a document is uploaded, it is correctly classified.

---

## Clone

Always clone recursively — this repository uses submodules:

```bash
git clone --recurse-submodules <repository-url>
```

---

## Local Setup

Set the following environment variable before running tests locally.

**System Environment Variable (Windows):**
```
setx KAFKA_PASSWORD your-kafka-password
```

**PowerShell:**
```powershell
$env:KAFKA_PASSWORD = "your-kafka-password"
```

**Bash:**
```bash
export KAFKA_PASSWORD=your-kafka-password
```

> **Temporary:** `KAFKA_PASSWORD` will be removed once Vault integration is enabled.



> Restart your terminal after setting via `setx`.

---

## Run Tests

Run smoke tests:

```bash
npx cucumber-js --tags "@Smoke"
```


---

## Configuration

All configuration is in `config.ts`. Values are read from environment variables with sensible defaults. Override by setting environment variables locally or in the pipeline.

---

## Pipeline

| Trigger | Jobs | Description |
|---|---|---|
| Every MR | Lint + syntax check | Fast validation — no test execution |
| Nightly / Release tag | Full test run + Xray publish | Scheduled — once regression is implemented |

---

## Xray Integration

Xray integration runs in the scheduled pipeline only — not in local development runs.

Feature files are uploaded to Jira, tests execute against the downloaded files with Jira keys, and results are published back to Xray. See [arc42.md](docs/arc42.md) Section 7 for the full flow.

---

## Architecture

Full architecture documentation including design decisions, risks and pipeline view:

[docs/arc42.md](docs/arc42.md)