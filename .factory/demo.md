# Demo contract

- Browser demo: open `/demo` or `/?demo=1`. It immediately shows the completed `checkout-v2` sample result. On phones, the result and **Edit sample inputs** action appear before the form. The banner says that sample data stays in this tab; **Reset demo** restores the bundled inputs and **Start for real** discards the `demo:flag-removal-map` session key before returning home.
- CLI demo: run `flag-removal-map demo` (or `flag-removal-map --demo`). It copies the bundled `examples/` fixture into a newly-created system temporary directory, writes `removal-plan.md` there, and prints the exact path. It never reads the working directory.
- Sample: a completed, disabled `checkout-v2` flag; a 30-day zero-evaluation report ending today; and exact source, deployment-config, and test references.
- Storage: only the browser demo may set `sessionStorage["demo:flag-removal-map"]`; production pages do not read or write that namespace. No input is persisted across browser sessions.
