$('#toc > p.explain > a.hide-diff-stats').after(
    '<a href="#" id="show-side-diffs" class="minibutton">Show Side-By-Side Diffs</a>' +
    '<a href="#" id="hide-side-diffs" class="minibutton">Show Unified Diffs</a>');

console.log('start');


function show() {
  $(this).css('display', 'block');
}

function hide() {
  $(this).css('display', 'none');
}

$('#show-side-diffs').bind('click', function() {
  console.log('show');

  $('.unified-diff').each(hide);
  $('.side-by-side-diff').each(show);

  $('#js-repo-pjax-container').css('width', '90%');

  $(this).each(hide);
  $('#hide-side-diffs').each(show);
});
$('#hide-side-diffs').bind('click', function() {
  console.log('hide');

  $('.unified-diff').each(show);
  $('.side-by-side-diff').each(hide);

  $('#js-repo-pjax-container').css('width', '');

  $(this).each(hide);
  $('#show-side-diffs').each(show);
}).each(hide);


$(".diff-table").each(function() {
  var left = $(this).clone();//.addClass('side-left');
  var right = $(this).clone();//.addClass('side-right');
  $(this).after('<div class="side-by-side-diff" style="display:none"><div class="side-left"></div><div class="side-right"></div></div>');
  $(this).siblings().find('.side-left').append(left);
  $(this).siblings().find('.side-right').append(right);

  $(this).addClass('unified-diff');

  var lines_deleted = 0;
  left.find('tr').each(function () {
    $(this).children()[1].remove();
    if ($(this).find('.gd').length == 1) {
      lines_deleted++;
    } else if ($(this).find('.gi').length == 1) {
      if (lines_deleted > 0) {
        lines_deleted--;
        $(this).remove();
      } else {
        //clear the line
        $(this).find('.diff-line').empty().append('&nbsp;').
            removeClass('gi').addClass('empty-line');
      }
    } else {
      // reset
      removed = 0;
    }
  });

  var lines_added = 0;
  right.find('tr').each(function () {
    $(this).children()[0].remove();
    var rightNumber = $(this).find('.line_numbers').detach();


    $(this).append(rightNumber);
    if ($(this).find('.gi').length == 1) {
      lines_added++;
    } else if ($(this).find('.gd').length == 1) {
      if (lines_added > 0) {
        lines_added--;
        $(this).remove();
      } else {
        //clear the line
        $(this).find('.diff-line').empty().append('&nbsp;').
        removeClass('gd').addClass('empty-line');;
      }
    } else {
      // reset
      removed = 0;
    }
  });
});