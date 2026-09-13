# QuickFix Desk — small data and code fixes

One small deliverable, a fixed price and a result you can check before paying.

Current availability ends September 13, 2026 at 09:44 UTC. I will only confirm work that leaves enough time for delivery, one correction and your review before that time.

| Service | Starting fixed price | Example deliverable |
|---|---:|---|
| One CSV import repair | US$20 | One file, agreed column rules, corrected export and a rejected-row report |
| One reproducible Python bug | US$35 | Focused patch, one agreed regression check and run instructions |
| One CSS layout fix | US$35 | One element at agreed screen sizes, with before/after evidence |
| English / Simplified Chinese UI text | US$25 | Up to 300 source words, with your glossary or one agreed terminology list |

Please send the following together in one message, using your existing conversation or [a repository issue](https://github.com/449693691/quickfix-desk-demos/issues/new):

- A small sanitized sample and the relevant tool/version.
- The exact result you need, preferably an example or a check that should pass.
- The required output format, deadline and who will review it.
- Your budget and whether you can review and pay through PayPal within the available window.

I will confirm the fixed price, included work and delivery time before starting. Please keep private client data out of public issues. Small, self-contained fixes are the focus; full redesigns and ongoing support are outside this availability window.

One consolidated correction within the agreed scope is included. Please combine feedback into one message. Extra pages, formats, data sources or a changed design direction need a separate agreement; defects in the agreed work will be corrected. PayPal goods/services is accepted after you check the result; the payment address is shared privately.

Work and communication are AI-assisted. Each delivery includes the relevant tests or a before/after comparison and brief usage notes, so you can check the result.

## Recent open-source submissions

These contributions were submitted on September 12–13, 2026 and are awaiting review. Each PR explains the implementation, checks and limits of the validation.

- [Gambit thread-interruption fix](https://github.com/gambit/gambit/pull/1047): a focused runtime correction with a bounded regression test and comparisons between the original and patched versions.
- [Gatus deployment catalog for Plural](https://github.com/pluralsh/scaffolds/pull/83): persistent health-check history, configuration templates, three contract fixtures and Helm rendering checks.
- [Private ntfy catalog for Plural](https://github.com/pluralsh/scaffolds/pull/87): persistent notification/account storage, authenticated setup, three contract fixtures and checks against the actual Helm chart.
- [Private Memos catalog for Plural](https://github.com/pluralsh/scaffolds/pull/98): persistent notes, admin bootstrap and registration policy, three contract fixtures, Kubernetes schema checks and native application restart tests.
- [Authenticated Pushgateway catalog for Plural](https://github.com/pluralsh/scaffolds/pull/111): existing-Secret authentication, persistent batch metrics, three contract fixtures and a reproducible native authentication/update/restart check.
- [Internal Apache Tika catalog for Plural](https://github.com/pluralsh/scaffolds/pull/112): bounded document extraction, namespace-and-pod network policy, three contract fixtures and native Unicode/document/limit checks.

## New demonstrations

An original [interactive notes interface, Mojian / 木间](https://449693691.github.io/quickfix-desk-demos/), includes working editing, search, favorites, archive/undo and local storage, with desktop and narrow-screen layouts. [Source and verification notes](docs/README.md).

The interface supports [English](https://449693691.github.io/quickfix-desk-demos/?lang=en) and [Chinese](https://449693691.github.io/quickfix-desk-demos/?lang=zh). Switching interface language preserves existing notes as written.

An original [12-second atmospheric video study and portrait advertisement](atmospheric-video-demo/README.md) show warm storybook visuals, restrained motion, gentle typography and a newly synthesized ambient cue. The 1080×1350 static layout reuses the same scene with a clear viewing action. These are AI-assisted portfolio samples.

An additional [portrait background-editing demonstration](photo-editing-demo/README.md) uses a fictional AI-generated subject and shows the input beside the edited result.

### CSV validation and export

`csv_guard.py` converts a CSV into JSON while refusing to silently discard values from malformed rows. It preserves leading-zero IDs and raw values, reports duplicate column names, and quarantines rows with too many or too few columns. It takes an explicit encoding instead of guessing. Existing output files are never overwritten.

Run the tests with Python 3.9 or later:

```text
python -m unittest -v test_csv_guard.py
```

Run on a copy of a file:

```text
python csv_guard.py input.csv output.json --encoding utf-8-sig
python csv_guard.py input.csv output.json --encoding gb18030
```

Exit status: `0` for a clean conversion, `2` if rows were quarantined (the report is still saved), `1` for an invalid input, encoding, or output error. A structural error such as an unclosed quote produces no new output file. This tool checks CSV structure; it does not guess date formats, deduplicate records, validate business rules or edit the source file.

### Synthetic example

Input:

```csv
id,name,note
001,Aster,"alpha,beta"
002,Birch
003,Cedar,ok,unexpected
004,松木,ready
```

Accepted IDs: `001` and `004`, including the leading zeros. The comma in the quoted note and the Chinese text are preserved. The two malformed rows are returned in `rejected` with their original values and line numbers.

License: MIT for the demonstration code. Prices refer to new work agreed with a client; this public demonstration is free.
