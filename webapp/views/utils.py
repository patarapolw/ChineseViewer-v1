from flask import request

from ChineseViewer.tts import Tts
from webapp import app

# tts_processes = list()


@app.route('/post/speak', methods=['POST'])
def create_speak():
    if request.method == 'POST':
        # global tts_processes

        item = request.form.get('item')
        tts = Tts(item)
        # tts_processes.append(tts)

        return tts.to_base64()

    return '0'
