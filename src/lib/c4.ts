// Generates a C4-style Mermaid container-diagram stub reflecting the chosen D1 deployment style
// (Build Spec Phase 5). It is a starting sketch, not a generated production diagram.

export function generateC4(d1OptionId: string): string {
  switch (d1OptionId) {
    case 'microservices':
      return `graph TD
  user["User"] --> gw["API Gateway"]
  gw --> svcA["Service A"]
  gw --> svcB["Service B"]
  gw --> svcC["Service C"]
  svcA --> dbA[("DB A")]
  svcB --> dbB[("DB B")]
  svcC --> dbC[("DB C")]`;
    case 'serverless':
      return `graph TD
  user["User"] --> gw["API Gateway"]
  gw --> fnA["Function: command"]
  gw --> fnB["Function: query"]
  fnA --> store[("Managed store")]
  fnB --> store`;
    case 'modular-monolith':
      return `graph TD
  user["User"] --> app["Web App (Modular Monolith)"]
  subgraph app_modules["Modules (clear boundaries)"]
    m1["Module A"]
    m2["Module B"]
    m3["Module C"]
  end
  app --> app_modules
  app_modules --> db[("Shared Database")]`;
    case 'layered':
      return `graph TD
  user["User"] --> pres["Presentation tier"]
  pres --> biz["Business tier"]
  biz --> data["Data tier"]
  data --> db[("Database")]`;
    case 'monolith':
    default:
      return `graph TD
  user["User"] --> app["Web App (Monolith)"]
  app --> db[("Database")]`;
  }
}
