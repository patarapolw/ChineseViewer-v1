$(document).ready(function() {
  setInputBoxListener();

  const $recent = $('#recent-items');

  $recent.on('click', '.deleter', function(){
    const $item = $(this).parent();
    $item.remove();
  });

  $recent.on('click', '.speak', function(){
    speak($(this).text());
  });

  $recent.contextMenu({
    selector: ".entry",
    build: function($trigger, e) {
      return contextMenuBuilder($trigger, e, $trigger.data('type'), 'div');
    }
  });

  $('#itemShowarea').contextMenu({
    selector: ".entry",
    build: function($trigger, e) {
      return contextMenuBuilder($trigger, e, 'sentence', 'div');
    }
  });

  // $.contextMenu({
  //   selector: '#itemShowarea',
  //   trigger: 'none',
  //   build: function($trigger, e) {
  //     dataOrSelector = {
  //       data: $trigger.data('value'),
  //       selector: 'div'
  //     };
  //     console.log(dataOrSelector.data);
  //
  //     return contextMenuBuilder($trigger, e, 'sentence', dataOrSelector);
  //   }
  // })
  //
  // $('#itemShowarea').mouseover(function(event) {
  //   let selectionText = getSelectionText();
  //
  //   if(selectionText !== ''){
  //     setTimeout(function(){
  //       console.log('hover')
  //       selectionText = getSelectionText();
  //
  //       if(selectionText !== ''){
  //         const position = {
  //           x: event.clientX,
  //           y: event.clientY
  //         };
  //         $('#itemShowarea').data('value', selectionText).contextMenu(position);
  //       }
  //     }, 2000);
  //   }
  // });
});

function setInputBoxListener(){
  $('button').click(function(event) {
    const itemValue = $('#itemInput').val();
    viewItem(itemValue);

    const HTMLTemplate = '<div class="entry">'
    + '<a class="float-left deleter" href="#">x</a> '
    + '<div class="speak ellipsis multiline">{0}</div>'
    + '</div>';

    const $item = $(HTMLTemplate.format(itemValue));
    $('#recent-items').prepend($item);
    $item.ellipsis();
  });

  $('#itemInput').on('paste', function(e) {
    viewItem(e.originalEvent.clipboardData.getData('text'));
  }).on('input', function(e) {
    viewItem($(this).val());
  })
}

async function viewItem(itemValue){
  $.post('/post/item/cut', { item: itemValue }, function(data, textStatus, xhr) {
    const $showarea = $('#itemShowarea');

    $showarea.html('');
    let $line = $('<div />');
    for(let i=0; i<data.length; i++){
      if(data[i] === '\n'){
        $showarea.append($line);
        $line = $('<div />');
      } else {
        if(hasHanzi(data[i])){
          $line.append('<div class="entry inline"><div onclick="speak(\'{0}\')">{1}</div>'.format(stripHtml(data[i]), data[i]));
        } else {
          $line.append(data[i]);
        }
      }
    }
    $showarea.append($line);
  });
}
