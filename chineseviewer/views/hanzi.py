from flask import request, jsonify

from cjkradlib import RadicalFinder
from hanzilvlib.dictionary import VocabDict, SentenceDict

from chineseviewer import app

rad_finder = RadicalFinder()
vocab_dict = VocabDict()
sentence_dict = SentenceDict()


@app.route('/post/hanzi/getInfo', methods=['POST'])
def get_info():
    if request.method == 'POST':
        current_char = request.form.get('character')
        rad = rad_finder.search(current_char)

        return jsonify({
            'compositions': rad.compositions,
            'supercompositions': rad.supercompositions,
            'variants': rad.variants,
            'vocab': [v.entry for v in vocab_dict.search_hanzi(current_char)]
        })

    return '0'


@app.route('/post/hanzi/getSentences', methods=['POST'])
def from_hanzi_get_sentences():
    if request.method == 'POST':
        current_char = request.form.get('character')

        if not current_char.isdigit():
            sentences = sentence_dict.search_sentence(current_char)
        else:
            sentences = []

        return jsonify({
            'sentences': [s.entry for s in sentences]
        })
