/**
 * Self-test suites for handoff and interrupt record validators.
 */

/**
 * @param {(envelope: unknown) => string[]} validateHandoff
 * @returns {string[]}
 */
export function handoffSelfTests(validateHandoff) {
  const failures = [];

  const ghost = validateHandoff({
    id: "card-self-ghost",
    from: "the agent",
    to: "Engineering",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "draft",
    done_when: "PR ref exists.",
  });
  if (!ghost.some((error) => error.includes("role"))) {
    failures.push("ghost owner must be rejected");
  }

  const invented = validateHandoff({
    id: "card-self-decision",
    from: "Chief-of-staff",
    to: "Engineering",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "draft",
    done_when: "PR ref exists.",
    decision: "approve",
    decided_by: "Engineering",
  });
  if (!invented.some((error) => error.includes("decision"))) {
    failures.push("invented decision on the hop must be rejected");
  }

  const blobRefs = validateHandoff({
    id: "card-self-refs",
    from: "Chief-of-staff",
    to: "Engineering",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: "Host chat. Engineering: LGTM.",
    write_policy: "draft",
    done_when: "PR ref exists.",
  });
  if (!blobRefs.some((error) => error.includes("refs"))) {
    failures.push("string refs blob must be rejected");
  }

  const badPolicy = validateHandoff({
    id: "card-self-policy",
    from: "Chief-of-staff",
    to: "Engineering",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "approve",
    done_when: "PR ref exists.",
  });
  if (!badPolicy.some((error) => error.includes("write_policy"))) {
    failures.push("write_policy approve must be rejected");
  }

  const missingDone = validateHandoff({
    id: "card-self-done",
    from: "Chief-of-staff",
    to: "Engineering",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "draft",
  });
  if (!missingDone.some((error) => error.includes("done_when"))) {
    failures.push("missing done_when must be rejected");
  }

  const ok = validateHandoff({
    id: "card-self-ok",
    from: "Chief-of-staff",
    to: "Engineering",
    kind: "assign",
    goal: "Ship a docs heading.",
    refs: ["docs/crew/handoffs.md"],
    write_policy: "hitl:merge",
    done_when: "PR ref exists; merge stays an interrupt.",
  });
  if (ok.length > 0) {
    failures.push(`valid envelope must be accepted (${ok.join("; ")})`);
  }

  return failures;
}

/**
 * @param {(record: unknown) => string[]} validateInterrupt
 * @param {Iterable<string>} specialistRoles
 * @returns {string[]}
 */
export function interruptSelfTests(validateInterrupt, specialistRoles) {
  const failures = [];

  for (const actor of specialistRoles) {
    const errors = validateInterrupt({
      id: "role-denial",
      gate: "merge",
      asked_at: "2026-09-10T14:02:00Z",
      asked_by: "Engineering",
      summary: "Fictional review request",
      refs: [],
      default_on_timeout: "wait",
      decision: "approve",
      decided_by: actor,
      decided_at: "2026-09-10T14:03:00Z",
    });
    if (!errors.some((error) => error.includes("decided_by"))) {
      failures.push(`role ${actor} must not be accepted as a human approver`);
    }
  }

  const timeoutApprove = validateInterrupt({
    id: "interrupt-self-timeout",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Engineering",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "approve",
  });
  if (!timeoutApprove.some((error) => error.includes("default_on_timeout"))) {
    failures.push("default_on_timeout approve must be rejected");
  }

  const missingGate = validateInterrupt({
    id: "interrupt-self-gate",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Engineering",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
  });
  if (!missingGate.some((error) => error.includes("gate"))) {
    failures.push("missing gate must be rejected");
  }

  const invented = validateInterrupt({
    id: "interrupt-self-decider",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Engineering",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
    decision: "approve",
    decided_by: "Engineering",
    decided_at: "2026-09-10T14:03:00Z",
  });
  if (!invented.some((error) => error.includes("decided_by"))) {
    failures.push("specialist decided_by must be rejected");
  }

  const emptyHuman = validateInterrupt({
    id: "interrupt-self-empty-human",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Engineering",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
    decision: "approve",
    decided_by: "",
    decided_at: "2026-09-10T14:03:00Z",
  });
  if (!emptyHuman.some((error) => error.includes("decided_by"))) {
    failures.push("empty decided_by with a decision must be rejected");
  }

  const openOk = validateInterrupt({
    id: "interrupt-self-open",
    gate: "merge",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Engineering",
    summary: "Merge a docs PR.",
    refs: ["pr://example/1"],
    default_on_timeout: "wait",
    decision: "",
    decided_by: "",
    decided_at: "",
  });
  if (openOk.length > 0) {
    failures.push(`open interrupt must be accepted (${openOk.join("; ")})`);
  }

  const closedOk = validateInterrupt({
    id: "interrupt-self-closed",
    gate: "messaging-as-user",
    asked_at: "2026-09-10T14:02:00Z",
    asked_by: "Inbox",
    summary: "Send a draft as the user.",
    refs: ["mail://drafts/d-1"],
    default_on_timeout: "wait",
    decision: "reject",
    decided_by: "user",
    decided_at: "2026-09-10T16:40:00Z",
  });
  if (closedOk.length > 0) {
    failures.push(`human resume must be accepted (${closedOk.join("; ")})`);
  }

  return failures;
}
