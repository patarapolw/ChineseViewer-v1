from flask import request, jsonify

from chineseviewer.util import cut_sentence
from chineseviewer import app


@app.route('/post/item/cut', methods=['POST'])
def cut_item():
    item = request.form.get('item')
    return jsonify(list(cut_sentence(item)))
