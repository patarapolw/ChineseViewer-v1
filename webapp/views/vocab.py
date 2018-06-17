import json

from flask import request, jsonify

from ChineseViewer.vocab import get_vocab_array_info, vocab_to_sentences, sentence_to_vocab
from webapp import app


@app.route('/post/vocab/getListInfo', methods=['POST'])
def get_array_info():
    if request.method == 'POST':
        return jsonify(list(get_vocab_array_info(json.loads(request.form.get('list')))))

    return '0'


@app.route('/post/vocab/getSentences', methods=['POST'])
def get_sentences():
    if request.method == 'POST':
        return jsonify(list(vocab_to_sentences(request.form.get('vocab'))))

    return '0'


@app.route('/post/vocab/fromSentence', methods=['POST'])
def from_sentence():
    if request.method == 'POST':
        return jsonify(list(sentence_to_vocab(request.form.get('sentence'))))

    return '0'
