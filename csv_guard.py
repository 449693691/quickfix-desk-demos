"""CSV-to-JSON structural validation demo. No third-party dependencies."""

import argparse
import csv
import json
import sys
from pathlib import Path


def inspect_csv(stream):
    reader = csv.reader(stream, strict=True)
    header = next(reader, None)
    if not header:
        raise ValueError("CSV needs a non-empty header")
    if any(not name.strip() for name in header):
        raise ValueError("Column names must not be blank")
    if len(set(header)) != len(header):
        raise ValueError("Duplicate column names would discard data")

    accepted, rejected = [], []
    previous_end = reader.line_num
    for row in reader:
        first_line, last_line = previous_end + 1, reader.line_num
        previous_end = last_line
        if len(row) != len(header):
            rejected.append({
                "line_start": first_line,
                "line_end": last_line,
                "reason": "Expected {} fields; got {}".format(len(header), len(row)),
                "values": row,
            })
        else:
            accepted.append(dict(zip(header, row)))
    return {"columns": header, "accepted": accepted, "rejected": rejected}


def convert(source, destination, encoding="utf-8-sig"):
    source, destination = Path(source), Path(destination)
    if source.resolve() == destination.resolve():
        raise ValueError("Output must be a different file")
    with source.open("r", encoding=encoding, errors="strict", newline="") as stream:
        report = inspect_csv(stream)
    payload = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    # Exclusive creation protects an existing output even if another process
    # creates it between validation and writing.
    with destination.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(payload)
    return report


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--encoding", default="utf-8-sig")
    args = parser.parse_args(argv)
    try:
        report = convert(args.source, args.destination, args.encoding)
    except (OSError, UnicodeError, LookupError, ValueError, csv.Error) as exc:
        print("Conversion failed: {}".format(exc), file=sys.stderr)
        return 1
    print("Accepted: {}; quarantined: {}".format(
        len(report["accepted"]), len(report["rejected"])))
    return 2 if report["rejected"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
