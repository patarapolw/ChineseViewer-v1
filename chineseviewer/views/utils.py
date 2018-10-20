from flask import request

from chineseviewer.tts import Tts

from chineseviewer import app


@app.route('/post/speak', methods=['POST'])
def create_speak():
    item = request.form.get('item')
    return Tts(item, lang='zh-cn').to_base64()
