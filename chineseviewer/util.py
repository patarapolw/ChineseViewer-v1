import string


def cut_sentence(item):
    sentence = ''
    for char in item:
        if char == '\n':
            yield char
        else:
            if char in string.ascii_letters:
                yield sentence
                sentence = ''

            sentence += char
            if char in '。？！' + string.punctuation:
                yield sentence
                sentence = ''

    yield sentence
