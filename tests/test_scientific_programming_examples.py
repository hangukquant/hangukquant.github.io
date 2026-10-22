"""Smoke checks for the public ring-buffer examples; no quantpylib access needed.

Requires NumPy, Cython, and a C compiler. Run from this repository with:
    python -m unittest discover -s tests -v
Set QUANTPYLIB_DOCS_ROOT to check a different generated-docs tree.
"""

from collections import deque
from html.parser import HTMLParser
import importlib
import os
from pathlib import Path
import sys
import tempfile
import unittest

import numpy as np
import pyximport


class CodeBlocks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.blocks = []
        self.current = None

    def handle_starttag(self, tag, attrs):
        if tag == "pre":
            self.current = []

    def handle_endtag(self, tag):
        if tag == "pre" and self.current is not None:
            self.blocks.append("".join(self.current))
            self.current = None

    def handle_data(self, text):
        if self.current is not None:
            self.current.append(text)


root = Path(os.environ.get("QUANTPYLIB_DOCS_ROOT", Path(__file__).resolve().parents[1]))
parser = CodeBlocks()
parser.feed((root / "learn/scientific_programming/index.html").read_text())
python_code, declarations, cython_code = parser.blocks[:3]


class PythonExample(unittest.TestCase):
    def test_copy_pasted_example_imports_and_wraps(self):
        namespace = {}
        exec(compile(python_code, "public-python-example", "exec"), namespace)
        buffer = namespace["RingBuffer"](3)
        expected = deque(maxlen=3)
        for value in range(6):
            buffer.append(value)
            expected.append(value)
            self.assertEqual(np.asarray(buffer).tolist(), list(expected))
            self.assertEqual(buffer.shape, (len(expected),))


class CythonExample(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workdir = tempfile.TemporaryDirectory(prefix="quantpylib-docs-")
        directory = Path(cls.workdir.name)
        (directory / "docs_ringbuffer.pxd").write_text(declarations)
        (directory / "docs_ringbuffer.pyx").write_text(cython_code)
        pyximport.install(
            build_dir=str(directory / "build"),
            setup_args={"include_dirs": np.get_include()},
            language_level=3,
        )
        sys.path.insert(0, str(directory))
        cls.RingBuffer = importlib.import_module("docs_ringbuffer").RingBuffer

    @classmethod
    def tearDownClass(cls):
        sys.path.remove(cls.workdir.name)
        cls.workdir.cleanup()

    def test_shape_tracks_logical_length_through_wraps_and_pops(self):
        buffer = self.RingBuffer(3)
        expected = deque(maxlen=3)
        operations = [("append", x) for x in range(6)]
        operations += [("popleft", None), ("appendleft", 9), ("pop", None)]
        self.assertEqual(buffer.shape, np.asarray(buffer).shape)
        for operation, value in operations:
            if value is None:
                self.assertEqual(getattr(buffer, operation)(), getattr(expected, operation)())
            else:
                getattr(buffer, operation)(value)
                getattr(expected, operation)(value)
            self.assertEqual(np.asarray(buffer).tolist(), list(expected))
            self.assertEqual(buffer.shape, (len(expected),))

    def test_shape_preserves_element_dimensions(self):
        buffer = self.RingBuffer(3, dtype=np.dtype((np.float64, 2)))
        buffer.append((1, 2))
        self.assertEqual(buffer.shape, (1, 2))
        self.assertEqual(buffer.shape, np.asarray(buffer).shape)


if __name__ == "__main__":
    unittest.main()
