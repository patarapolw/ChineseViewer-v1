from gtts import gTTS
from tempfile import TemporaryFile
import base64


class Tts:
    def __init__(self, s, lang):
        self.tts = gTTS(s, lang)

    def to_bytes(self):
        temp = TemporaryFile()
        self.tts.write_to_fp(temp)
        temp.seek(0)

        return temp.read()

    def to_base64(self):
        return base64.b64encode(self.to_bytes())
