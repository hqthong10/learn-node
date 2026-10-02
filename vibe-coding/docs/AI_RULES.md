# AI Development Rules

## 1. General Principles

- Read the relevant documentation and existing code before making changes.
- Do not modify unrelated files.
- Do not rewrite working code unnecessarily.
- Prefer simple solutions over complex abstractions.
- Follow existing project conventions.
- Do not introduce a new dependency unless there is a clear reason.
- Keep changes small and focused.
- Ask for clarification when requirements are ambiguous.

## 2. Before Coding

Before implementing a non-trivial feature:

1. Understand the requirement.
2. Inspect the existing architecture.
3. Identify affected files and modules.
4. Propose an implementation plan.
5. Explain important trade-offs.
6. Wait for approval before making large changes.

For small, obvious changes, implementation can proceed directly.

## 3. Backend Rules

- Use NestJS conventions.
- Controllers handle HTTP concerns.
- Business logic belongs in services/use cases.
- Validate external input.
- Use DTOs for request validation.
- Keep database access isolated from controllers.
- Never expose passwords, tokens, secrets, or other sensitive data.
- Handle authentication and authorization explicitly.
- Return consistent API responses.
- Handle expected errors properly.

## 4. Frontend Rules

- Use Next.js conventions.
- Use TypeScript strictly.
- Reuse existing components before creating new ones.
- Use shadcn/ui when an appropriate component exists.
- Handle loading, error, empty, and success states.
- Keep business logic out of presentation components when practical.
- Do not introduce global state management unless there is a real need.

## 5. Database Rules

- Use migrations for schema changes.
- Do not modify the production database manually.
- Define appropriate indexes.
- Use foreign keys where appropriate.
- Avoid unnecessary denormalization.
- Consider query performance for large datasets.
- Never store passwords as plain text.

## 6. Security Rules

- Never hard-code secrets.
- Never commit `.env` files containing real secrets.
- Validate and sanitize external input.
- Apply authentication and authorization where required.
- Use rate limiting where appropriate.
- Do not trust data coming from the client.

## 7. Testing Rules

For important business logic:

- Add unit tests where appropriate.
- Add API/integration tests for important endpoints.
- Test error cases, not only happy paths.
- Do not remove tests just to make the build pass.

## 8. Code Quality

Before considering a feature complete:

- Run TypeScript checks.
- Run lint.
- Run relevant tests.
- Check for unnecessary dependencies.
- Check for security issues.
- Review the final diff.

## 9. AI Behavior

Claude should:

- Explain assumptions.
- Point out risks.
- Tell the developer when a requested approach is unnecessarily complex.
- Prefer existing project patterns.
- Never silently change architecture.
- Never invent APIs or libraries.
- Clearly identify generated code that has not been tested.

## 10. Important Rule

The developer makes architectural decisions.

Claude assists with:

- analysis
- design
- implementation
- testing
- debugging
- refactoring
- documentation

Claude should not make major architectural decisions silently.