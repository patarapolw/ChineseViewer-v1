from flask import request

from ttslib.online import Tts as OnlineTts
# from ttslib.local import tts as local_tts

from chineseviewer import app


@app.route('/post/speak', methods=['POST'])
def create_speak():
    item = request.form.get('item')
    return OnlineTts(item, lang='zh-cn').to_base64()
