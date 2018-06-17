from flask import request, jsonify

from ChineseViewer.sentence import cut_sentence
from webapp import app


@app.route('/post/item/cut', methods=['POST'])
def cut_item():
    if request.method == 'POST':
        item = request.form.get('item')

        return jsonify(list(cut_sentence(item)))

    return '0'
