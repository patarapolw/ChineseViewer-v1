if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if(!String.prototype.addSlashes) {
    String.prototype.addSlashes = function()
    {
       //no need to do (str+'') anymore because 'this' can only be a string
       return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }
}

function stripHtml(html){
   var doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

function isOverlap(el0, el1) {
  var elY0 = (el0.offset.top < el1.offset.top)? el0 : el1;
  var elY1 = (el0 != elY0)? el0 : el1;
  var yInstersection = (elY0.offset.top + elY0.height) - elY1.offset.top > 0;

  var elX0 = (el0.offset.left < el1.offset.left)? el0 : el1;
  var elX1 = (el0 != elX0)? el0 : el1;
  var xInstersection = (elX0.offset.left + elX0.width) - elX1.offset.left > 0;

  return (yInstersection && xInstersection);
}

function contextMenuBuilder($trigger, e, itemType, dataOrSelector) {
  const itemId = parseInt($trigger.data('itemId')) || 1;
  let data, childrenType;

  if(typeof dataOrSelector == 'string' || dataOrSelector instanceof String){
    data = $trigger.children(dataOrSelector).first().text();
    childrenType = dataOrSelector
  } else {
    data = dataOrSelector.data;
    childrenType = dataOrSelector.selector;
  }

  const postJson = {
    item: data
  };

  let audio = document.createElement('AUDIO');
  $.post('/post/speak', { item: data }, function(base64) {
    audio.src = 'data:audio/mp3;base64,' + base64;
  });

  return {
    items: {
      speak: {
        name: "Speak",
        callback: function(key, opt){
          audio.play();
        }
        // ,disabled: true
      },
      viewHanzi: {
        name: "View Hanzi in this item",
        callback: function(key, opt){
          sessionStorage.setObject('allHanzi', data.replace(/\d/g, '').split(''));
          sessionStorage.setObject('allHanziNumber', 0)
          const win = window.open('/hanzi', '_blank');
          win.focus();
        }
      },
      viewVocab: {
        name: "View vocab in this item",
        callback: function(key, opt){
          const win = window.open('about:blank', '_blank');

          loadVocabFromItem(itemType, data).then(function(){
            win.location.href = '/vocab';
            win.focus();
          });
        }
      }
    }
  };
}

async function loadVocabFromItem(itemType, item){
  let allVocab;

  if(itemType === 'vocab'){
    allVocab = [item];
  } else {
    allVocab = await $.post('/post/vocab/fromSentence', {sentence: item});
  }

  localStorage.setObject('allVocab', allVocab);
}

function setCharacterHoverListener($showPanel){
  $showPanel.on('mouseenter', '.character, .number', function(){
    if($('.hoverElement').length === 0){
      const $this = $(this);
      const hoverElement = $('<div class="hoverElement">');

      hoverElement.appendTo($showPanel);
      hoverElement.append($this.clone());
      hoverElement.position({
        my: 'center',
        at: 'center',
        of: $this
      });
    }
  });

  $showPanel.on('mouseleave', '.hoverElement', function() {
    const hoverElement = $(this);

    if(!hoverElement.hasClass('context-menu-active')){
      hoverElement.remove();
    }
  });

  $showPanel.contextMenu({
    selector: '.hoverElement',
    items: {
      viewHanzi: {
        name: 'View Hanzi info',
        callback: function(key, opt){
          let allHanzi = [];
          $showPanel.children('div').each(function(index, el) {
            allHanzi.push($(el).text());
          });
          allHanzi.pop();

          sessionStorage.setObject('allHanzi', allHanzi);
          sessionStorage.setObject('allHanziNumber', allHanzi.indexOf($(this).text()));
          const win = window.open('/viewHanzi', '_blank');
          win.focus();
        }
      }
    },
    events: {
      hide: function(options){
        $(this).remove();
        return true;
      }
    }
  });
}

function speak(item){
  // fetch(
  //   window.location.origin +
  //   '/gtts/zh-cn/' +
  //   String(item)
  // ).then(function(r){
  //   return r.json();
  // }).then(function(j){
  //   let a = document.createElement('AUDIO');
  //   a.src = window.location.origin + j.mp3;
  //   a.play();
  // }).catch(function(e){
  //   console.warn(e);
  // });
  // $.post('/post/speak', { item: item }, function(data, textStatus, xhr) {
  //   let a = document.createElement('AUDIO');
  //   a.src = 'data:audio/mp3;base64,' + data;
  //   a.play();
  // });
}

function hasHanzi(item){
  return item.search(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) !== -1;
}

function removeAscii(item){
  return item.replace(/[0-9A-Za-zāáǎàēéěèōóǒòīíǐìūúǔùǖǘǚǜ. \n]/g, '');
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
}

(function($) {
    $.fn.ellipsis = function()
    {
        return this.each(function()
        {
            var el = $(this);

            if(el.css("overflow") == "hidden")
            {
                var text = el.html();
                var multiline = el.hasClass('multiline');
                var t = $(this.cloneNode(true))
                    .hide()
                    .css('position', 'absolute')
                    .css('overflow', 'visible')
                    .width(multiline ? el.width() : 'auto')
                    .height(multiline ? 'auto' : el.height())
                    ;

                el.after(t);

                function height() { return t.height() > el.height(); };
                function width() { return t.width() > el.width(); };

                var func = multiline ? height : width;

                while (text.length > 0 && func())
                {
                    text = text.substr(0, text.length - 1);
                    t.html(text + "...");
                }

                el.html(t.html());
                t.remove();
            }
        });
    };
})(jQuery);
