def cut_sentence(item):
    sentence = ''
    for char in item:
        if char == '\n':
            yield char
        else:
            sentence += char
            if char in '。？！.?! ':
                yield sentence
                sentence = ''
    yield sentence
