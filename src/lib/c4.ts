// A C4-style container-diagram stub reflecting the chosen D1 deployment style (Build Spec
// Phase 5 / FR-OUT-5). Modeled as rows of nodes and rendered as deterministic hand-built SVG
// (C4Preview) — no diagram library, so it always renders (see DECISIONS.md).

export type C4NodeKind = 'actor' | 'node' | 'store';
export interface C4Node {
  label: string;
  kind: C4NodeKind;
}
export interface C4Model {
  rows: C4Node[][];
}

const actor = (label: string): C4Node => ({ label, kind: 'actor' });
const node = (label: string): C4Node => ({ label, kind: 'node' });
const store = (label: string): C4Node => ({ label, kind: 'store' });

export function buildC4(d1OptionId: string): C4Model {
  switch (d1OptionId) {
    case 'microservices':
      return {
        rows: [
          [actor('User')],
          [node('API Gateway')],
          [node('Service A'), node('Service B'), node('Service C')],
          [store('DB A'), store('DB B'), store('DB C')],
        ],
      };
    case 'serverless':
      return {
        rows: [
          [actor('User')],
          [node('API Gateway')],
          [node('Function: command'), node('Function: query')],
          [store('Managed store')],
        ],
      };
    case 'modular-monolith':
      return {
        rows: [
          [actor('User')],
          [node('Web App (Modular Monolith)')],
          [node('Module A'), node('Module B'), node('Module C')],
          [store('Shared Database')],
        ],
      };
    case 'layered':
      return {
        rows: [
          [actor('User')],
          [node('Presentation tier')],
          [node('Business tier')],
          [node('Data tier')],
          [store('Database')],
        ],
      };
    case 'monolith':
    default:
      return {
        rows: [[actor('User')], [node('Web App (Monolith)')], [store('Database')]],
      };
  }
}
