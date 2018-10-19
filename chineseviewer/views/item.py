from flask import request

from chineseviewer.util import cut_sentence, my_jsonify
from chineseviewer import app


@app.route('/post/item/cut', methods=['POST'])
def cut_item():
    item = request.form.get('item')
    return my_jsonify(list(cut_sentence(item)))
