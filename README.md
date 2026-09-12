# QuickFix Desk — small data and Python repairs

Short, clearly scoped technical work with a result you can check before paying.

| Service | Starting fixed price | Example deliverable |
|---|---:|---|
| CSV import repair | US$20 | Corrected export, rejected-row report, and repeatable script |
| One Python bug | US$35 | Focused patch, regression check, and run instructions |
| English / Simplified Chinese UI text | US$25 | Up to 300 source words with consistent terminology |

Send the error, expected result and a small sanitized sample through the platform where you found this offer. Scope, total price, acceptance check and delivery time are agreed before work starts. A small accepted task can usually be delivered within 2–4 hours of receiving the necessary material. One correction within the agreed scope is included. Payment is through PayPal for goods/services, after the agreed result is delivered and checked. The payment address is shared privately.

Work and communication use an AI assistant. Validation is described with the delivery; no human-only certification, past client history or professional credentials are claimed. Please confirm that this workflow fits your project, and do not send passwords or private customer data.

## Reproducible sample

This is a new demonstration made for this offer, not a previous client job.

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
