import contextlib
import csv
import io
import json
import tempfile
import unittest
from pathlib import Path

from csv_guard import convert, inspect_csv, main


class CsvGuardTests(unittest.TestCase):
    def read(self, text):
        return inspect_csv(io.StringIO(text, newline=""))

    def test_preserves_values(self):
        report = self.read('id,name,note\n001,松木,"alpha,beta"\n')
        self.assertEqual(report["accepted"], [
            {"id": "001", "name": "松木", "note": "alpha,beta"}])
        self.assertEqual(report["rejected"], [])

    def test_does_not_silently_normalize_values(self):
        report = self.read('id,note\n 001 ,  value  \n')
        self.assertEqual(report["accepted"][0], {"id": " 001 ", "note": "  value  "})

    def test_missing_and_extra_fields_are_preserved(self):
        report = self.read('id,name\n1\n2,Birch,extra\n3,Cedar\n')
        self.assertEqual(report["accepted"], [{"id": "3", "name": "Cedar"}])
        self.assertEqual([x["values"] for x in report["rejected"]], [["1"], ["2", "Birch", "extra"]])
        self.assertEqual([x["line_start"] for x in report["rejected"]], [2, 3])

    def test_blank_row_is_reported(self):
        report = self.read('id,name\n\n1,Aster\n')
        self.assertEqual(report["rejected"][0]["values"], [])
        self.assertEqual(report["rejected"][0]["line_start"], 2)

    def test_multiline_field_line_numbers(self):
        report = self.read('id,note\n1,"two\nlines"\n2\n')
        self.assertEqual(report["accepted"][0]["note"], "two\nlines")
        self.assertEqual(report["rejected"][0]["line_start"], 4)

    def test_invalid_headers(self):
        for text in ['', '\n', 'id,id\n1,2\n', 'id, \n1,2\n']:
            with self.subTest(text=text), self.assertRaises(ValueError):
                self.read(text)

    def test_quoted_empty_field_is_valid(self):
        self.assertEqual(self.read('id,name\n001,""\n')["accepted"][0]["name"], "")

    def test_file_safety_and_encodings(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as task_dir:
            root = Path(task_dir)
            source, target = root / 'input.csv', root / 'result.json'
            original = 'id,name\r\n001,松木\r\n'.encode('gb18030')
            source.write_bytes(original)
            convert(source, target, 'gb18030')
            self.assertEqual(json.loads(target.read_text(encoding='utf-8'))["accepted"][0]["id"], '001')
            self.assertEqual(source.read_bytes(), original)
            saved = target.read_bytes()
            with self.assertRaises(FileExistsError):
                convert(source, target, 'gb18030')
            self.assertEqual(target.read_bytes(), saved)
            with self.assertRaises(ValueError):
                convert(source, source, 'gb18030')

    def test_cli_exit_codes_and_invalid_encoding(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as task_dir:
            root = Path(task_dir)
            source = root / 'input.csv'
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                source.write_text('id,name\n001,Aster\n', encoding='utf-8-sig')
                self.assertEqual(main([str(source), str(root / 'ok.json')]), 0)
                source.write_text('id,name\n001\n', encoding='utf-8')
                self.assertEqual(main([str(source), str(root / 'reject.json')]), 2)
                self.assertEqual(main([str(source), str(root / 'bad.json'), '--encoding', 'not-an-encoding']), 1)
                self.assertFalse((root / 'bad.json').exists())

    def test_malformed_quotes_do_not_create_output(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as task_dir:
            root = Path(task_dir)
            source, target = root / 'input.csv', root / 'output.json'
            source.write_text('id,name\n1,"unterminated\n', encoding='utf-8')
            with self.assertRaises(csv.Error):
                convert(source, target)
            self.assertFalse(target.exists())


if __name__ == '__main__':
    unittest.main()
