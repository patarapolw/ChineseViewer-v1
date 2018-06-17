from flask import request, jsonify

from webapp import app

from CJKhyperradicals.decompose import Decompose
from CJKhyperradicals.dict import Cedict
from CJKhyperradicals.frequency import ChineseFrequency
from CJKhyperradicals.variant import Variant

from ChineseViewer.vocab import vocab_to_sentences

decompose = Decompose()
variant = Variant()
cedict = Cedict()
sorter = ChineseFrequency()


@app.route('/post/hanzi/getInfo', methods=['POST'])
def get_info():
    if request.method == 'POST':
        current_char = request.form.get('character')

        return jsonify({
            'compositions': decompose.get_sub(current_char),
            'supercompositions': sorter.sort_char(decompose.get_super(current_char)),
            'variants': variant.get(current_char),
            'vocab': sorter.sort_vocab([list(item) for item in cedict.search_hanzi(current_char)])[:10]
        })

    return '0'


@app.route('/post/hanzi/getSentences', methods=['POST'])
def from_hanzi_get_sentences():
    if request.method == 'POST':
        current_char = request.form.get('character')

        if not current_char.isdigit():
            sentences = list(vocab_to_sentences(current_char))
        else:
            sentences = []

        return jsonify({
            'sentences': sentences
        })
