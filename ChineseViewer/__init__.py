from flask import Flask

from .blueprints import blueprint

app = Flask(__name__)
app.register_blueprint(blueprint)

from .views import hanzi, utils, vocab, item

from threading import Thread
from pathlib import Path
import sys


class ChineseViewer:
    def __init__(self, port=42045, debug=True):
        self.port = port
        self.debug = debug
        self.server = None

        env_python = Path(sys.argv[0]).name

        if 'ipykernel' in env_python:
            self.server = Thread(target=self._runserver)
            self.server.daemon = Thread
            self.server.start()
        else:
            self._runserver()

    def _runserver(self):
        app.run(
            port=self.port,
            debug=self.debug
        )
