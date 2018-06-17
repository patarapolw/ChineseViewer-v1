import jieba
import regex

from CJKhyperradicals.dict import Cedict
from CJKhyperradicals.sentence import SpoonFed, jukuu

cedict = Cedict()
spoon_fed = SpoonFed()


def get_vocab_array_info(vocab_list):
    for vocab in vocab_list:
        for entry in cedict.search_vocab(vocab):
            yield entry


def vocab_to_sentences(vocab):
    sentences = list(spoon_fed.get_sentence(vocab))[:10]
    if len(sentences) == 0:
        sentences = list(jukuu(vocab))

    return sentences


def sentence_to_vocab(sentence):
    for vocab in jieba.cut_for_search(sentence):
        if regex.match(r'[\p{IsHan}\p{InCJK_Radicals_Supplement}\p{InKangxi_Radicals}]', vocab):
            yield vocab
