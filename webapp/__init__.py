from flask import Flask
from flask_gtts import gtts

from webapp.blueprints import blueprint

app = Flask(__name__)
gtts(app, route=True)
app.register_blueprint(blueprint)

from webapp.views import hanzi, utils, vocab, item
