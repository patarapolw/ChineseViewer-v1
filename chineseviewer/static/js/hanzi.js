let charList = sessionStorage.getObject('allHanzi') || [];
let charNumber = sessionStorage.getObject('allHanziNumber') || 0;

$(document).ready(function() {
  renderChar();

  $("#sentence").keypress(function(event) {
    if (event.which == 13) {
      charList = $('#sentence').val().split('');
      charNumber = 0;
      renderChar();
    }
  });

  $('#vocab').contextMenu({
    selector: ".entry",
    trigger: 'hover',
    delay: 500,
    autoHide: true,
    build: function($trigger, e) {
      return contextMenuBuilder($trigger, e, 'vocab', 'a')
    }
  });

  $('#sentences').contextMenu({
    selector: ".entry",
    trigger: 'hover',
    delay: 500,
    autoHide: true,
    build: function($trigger, e) {
      return contextMenuBuilder($trigger, e, 'sentence', 'a')
    }
  });

  $('#more-sentences').click(function(event) {
    event.preventDefault();
    const win = window.open('https://tatoeba.org/eng/sentences/search?from=cmn&to=eng&query=' + $('#character').text(), '_blank');
    win.focus();
  });

  setCharacterHoverListener($('#compositions'));
  setCharacterHoverListener($('#supercompositions'));
  setCharacterHoverListener($('#variants'));
});

function previousChar(){
  if(charNumber > 0){
    charNumber--;
    renderChar();
  }
}

function nextChar(){
  if(charNumber < charList.length - 1){
    charNumber++;
    renderChar();
  }
}

function renderChar(){
  charList = charList.filter((x, pos, self) => (hasHanzi(x) && self.indexOf(x) == pos));

  const currentChar = charList[charNumber];

  if(isNaN(parseInt(currentChar))){
    $('#character').html(currentChar)
  } else {
    $('#character').html(`<div class="big-number">${currentChar}</div>`);
    $('.big-number').position({
      my: 'center bottom',
      at: 'center bottom-30',
      of: '.big-character'
    });
  }

  if(charNumber > 0){
    $('#previousChar').removeAttr('disabled');
  } else {
    $('#previousChar').attr('disabled', true);
  }
  if(charNumber < charList.length - 1){
    $('#nextChar').removeAttr('disabled');
  } else {
    $('#nextChar').attr('disabled', true);
  }

  $.post('/post/hanzi/getInfo', {character: currentChar}, function(content) {
    renderContent('#compositions', content.compositions);
    renderContent('#supercompositions', content.supercompositions);
    renderContent('#variants', content.variants);

    const $vocab = $('#vocab');
    $vocab.text('');
    for(let i=0; i<content.vocab.length; i++){
      // const vTrad = content.vocab[i].traditional;
      const vSimp = content.vocab[i].simplified;
      const vPinyin = content.vocab[i].pinyin;
      const vEnglish = content.vocab[i].english;

      $vocab.append(
        `<div class='entry container'>
          <a href='#' onclick='speak("${vSimp.addSlashes()}"); return false;' 
            title='${vPinyin}'>${vSimp}</a> 
          ${vEnglish}
        </div>`
      )
    }
  });

  $.post('/post/hanzi/getSentences', {character: currentChar}, function(content) {
    const $sentences = $('#sentences');
    $sentences.text('');
    for(let i=0; i<content.sentences.length; i++){
      const sSentence = content.sentences[i].sentence;
      const sEnglish = content.sentences[i].english;

      $sentences.append(
        `<div class='entry container'>
          <a href='#' onclick='speak("${sSentence.addSlashes()}"); return false;'>
            ${sSentence}</a>
          ${sEnglish}
        </div>`
      );
    }
  });
}

function renderContent(selector, contentList){
  $(selector).text('');
  for(let i=0; i<contentList.length; i++){
    const className = isNaN(parseInt(contentList[i])) ? 'character' : 'number';
    $(selector).append(
      `<div class='${className}'>${contentList[i]}</div>`
    );
  }
}
