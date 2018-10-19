const HTMLTemplate = '<div class="entry">'
+ '<a class="float-left deleter" href="#">x</a> '
+ '<div class="entry-content ellipsis multiline">{0}</div>'
+ '</div>';

$(document).ready(function() {
  setInputBoxListener();
  loadRecent();

  const $recent = $('#recent-items');

  $recent.on('click', '.deleter', function(){
    const $item = $(this).parent();
    let chineseViewerItems = localStorage.getObject('ChineseViewerItems');
    const itemIndex = chineseViewerItems.indexOf($item.children('.entry-content').first().text());
    if(itemIndex > -1){
      chineseViewerItems.splice(itemIndex, 1);
    }
    localStorage.setObject('ChineseViewerItems', chineseViewerItems);

    $item.remove();
  });

  $recent.on('click', '.entry-content', function(){
    viewItem($(this).text());
  });

  // $recent.contextMenu({
  //   selector: ".entry",
  //   build: function($trigger, e) {
  //     return contextMenuBuilder($trigger, e, $trigger.data('type'), 'div');
  //   }
  // });

  $('#itemShowarea').contextMenu({
    selector: ".entry",
    trigger: 'hover',
    delay: 500,
    autoHide: true,
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
  $('#itemButton').click(function(event) {
    const itemValue = $('#itemInput').val();
    saveToLocalStorageAndView(itemValue);

    $('#recent-items').prepend(HTMLTemplate.format(itemValue));
  });

  $('#itemInput').on('paste', function(e) {
    viewItem(e.originalEvent.clipboardData.getData('text'))
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

function saveToLocalStorageAndView(item){
  let chineseViewerItems = localStorage.getObject('ChineseViewerItems') || [];
  chineseViewerItems.push(item);
  localStorage.setObject('ChineseViewerItems', chineseViewerItems);
  viewItem(item);
}

function loadRecent(){
  const chineseViewerItems = localStorage.getObject('ChineseViewerItems') || [];
  const $recent = $('#recent-items');

  for(let i=0; i<chineseViewerItems.length; i++){
    $recent.prepend(HTMLTemplate.format(chineseViewerItems[i]));
  }
}
