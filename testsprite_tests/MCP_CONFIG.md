# TestSprite MCP Server Configuration

## API Key Configuration

The TestSprite MCP server has been configured with the following API key:

```
sk-user-faqbWfTdOHDUdAyGckNuAEMV-mYTxu01Gw0S0jsHUCrb0J7D0ICSJejqEmH7lplQOurq7m5wAZA5FzhZzE5-sdXuZphRwefxp60VCEyy5bPOPYC0KSSYkqoSb-lWV4dBq7Y
```

## Configuration Location

The API key is stored in:
- `testsprite_tests/tmp/config.json` - TestSprite configuration file

## Usage

The TestSprite MCP server can be used to:
1. Generate automated test plans
2. Execute frontend tests
3. Generate test reports
4. Run tests via MCP tools

## MCP Tools Available

- `testsprite_bootstrap` - Initialize TestSprite for a project
- `testsprite_generate_code_summary` - Generate code summary for testing
- `testsprite_generate_frontend_test_plan` - Generate frontend test plan
- `testsprite_generate_code_and_execute` - Generate and execute tests

## Environment Variables

The API key is automatically included in the `envs.API_KEY` field when running tests.

## Notes

- Keep the API key secure and do not commit it to public repositories
- The API key is used for authentication with TestSprite services
- Ensure you have sufficient credits in your TestSprite account to run tests
