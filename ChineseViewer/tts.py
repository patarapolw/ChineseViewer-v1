from gtts import gTTS
from tempfile import TemporaryFile
import base64
from uuid import uuid4
import os
import atexit


class Tts:
    def __init__(self, word, lang='zh-cn'):
        self.tts = gTTS(word, lang)
        self.name = str(uuid4())

    def to_temp(self):
        temp = os.path.join('tmp', self.name + '.mp3')
        atexit.register(os.remove, temp)
        self.to_file(temp)

    def remove_temp(self):
        os.remove(os.path.join('tmp', self.name + '.mp3'))

    def to_file(self, filename):
        self.tts.save(filename)

        return filename

    def to_bytes(self):
        temp = TemporaryFile()
        self.tts.write_to_fp(temp)
        temp.seek(0)

        return temp.read()

    def to_base64(self):
        return base64.b64encode(self.to_bytes())


if __name__ == '__main__':
    print(Tts('你好', 'zh-cn').to_base64())
