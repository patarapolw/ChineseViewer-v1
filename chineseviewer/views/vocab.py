from flask import request, jsonify

import json
import regex
import jieba
from hanzilvlib.dictionary import SentenceDict, VocabDict

from chineseviewer import app

sentence_dict = SentenceDict()
vocab_dict = VocabDict()


@app.route('/post/vocab/getListInfo', methods=['POST'])
def get_array_info():
    def _search():
        for v in json.loads(request.form.get('list')):
            search_result = vocab_dict.search_vocab(v)

            if search_result:
                yield search_result[0].entry
            else:
                yield dict()

    return jsonify(list(_search()))


@app.route('/post/vocab/getSentences', methods=['POST'])
def get_sentences():
    return jsonify([s.entry for s in sentence_dict.search_sentence(request.form.get('vocab'))])


@app.route('/post/vocab/fromSentence', methods=['POST'])
def from_sentence():
    return jsonify([x for x in jieba.cut_for_search(request.form.get('sentence'))
                    if regex.search(r'\p{IsHan}', x)])
