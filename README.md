# QuickFix Desk — small data, code and image edits

Short, clearly scoped technical work with a result you can check before paying.

| Service | Starting fixed price | Example deliverable |
|---|---:|---|
| CSV import repair | US$20 | Corrected export, rejected-row report, and repeatable script |
| One Python bug | US$35 | Focused patch, regression check, and run instructions |
| English / Simplified Chinese UI text | US$25 | Up to 300 source words with consistent terminology |
| Portrait background replacement | US$50 | One agreed edit, with a preview to check the details |

Send a small sanitized sample, the result you want and your deadline. I will confirm a fixed price and delivery time before work starts. Suitable small tasks can be scoped for a 2–4 hour delivery window after the material is reviewed. One correction within the agreed scope is included. PayPal goods/services is accepted after you check the delivered result; the payment address is shared privately.

Work and communication are AI-assisted. Each delivery includes the relevant tests or a before/after comparison and brief usage notes, so you can check the result.

## Recent open-source submissions

These contributions were submitted on September 12, 2026 and are awaiting review. Each PR explains the implementation, checks and limits of the validation.

- [Gambit thread-interruption fix](https://github.com/gambit/gambit/pull/1047): a focused runtime correction with a bounded regression test and comparisons between the original and patched versions.
- [Gatus deployment catalog for Plural](https://github.com/pluralsh/scaffolds/pull/83): persistent health-check history, configuration templates, three contract fixtures and Helm rendering checks.
- [Private ntfy catalog for Plural](https://github.com/pluralsh/scaffolds/pull/87): persistent notification/account storage, authenticated setup, three contract fixtures and checks against the actual Helm chart.

## New demonstrations

An original [12-second atmospheric video study](atmospheric-video-demo/README.md) shows warm storybook visuals, restrained motion, gentle typography and a newly synthesized ambient cue. It is a new AI-assisted portfolio sample.

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
