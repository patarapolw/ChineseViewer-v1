from flask import Flask

from webapp.blueprints import blueprint

app = Flask(__name__)
app.register_blueprint(blueprint)

from webapp.views import hanzi, utils, vocab, item
