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

function toEnsp() {
  $(this).html($(this).html().replace(/&nbsp;/g, '&ensp;'));
}

$(".diff-table").each(function() {
  var copy = $(this).clone();
  $(this).addClass('unified-diff');
  var new_table = $('<table class="side-by-side-diff diff-table line-number-attrs"></table>');
  $(new_table).each(hide);

  $(this).after(new_table);

  var lines_deleted = 0;
  var lines_added = 0;
  var line_rows = [];
  copy.find('tr').each(function () {
    var lineNumbers = $(this).find('.line_numbers').clone();
    if ($(this).find('.gd').length == 1) {
      lines_deleted++;

      var line_row = $('<tr></tr>');
      line_rows.push(line_row);
      $(line_row).append(lineNumbers[0]).
                  append($(this).find('.diff-line').addClass('side-left').each(toEnsp)).
                  append('<td class="empty-line side-right diff-line line">&nbsp;</td>').
                  append(lineNumbers[1]);
    } else if ($(this).find('.gi').length == 1) {
      lines_added++;

      var line_row;
      if (lines_deleted > 0) {
        line_row = line_rows[line_rows.length - lines_deleted];
        lines_deleted--;
      } else {
        line_row = $('<tr><td></td><td></td><td></td><td></td></tr>');
        line_rows.push(line_row);

        $(':nth-child(1)', line_row).replaceWith(lineNumbers[0]); // empty line number
        $(':nth-child(2)', line_row).replaceWith('<td class="empty-line side-left diff-line line">&nbsp;</td>');
      }
      $(':nth-child(3)', line_row).replaceWith($(this).find('.diff-line').addClass('side-right').each(toEnsp));
      $(':nth-child(4)', line_row).replaceWith(lineNumbers[1]);
    } else {
      // reset
      lines_added = 0;
      lines_deleted = 0;

      var line_row = $('<tr></tr>');
      $(line_row).append(lineNumbers[0]).
                  append($(this).find('.diff-line').clone().addClass('side-left').each(toEnsp)).
                  append($(this).find('.diff-line').clone().addClass('side-right').each(toEnsp)).
                  append(lineNumbers[1]);
      line_rows.push(line_row);
    }
  });

  for (var i in line_rows) {
    $(new_table).append($(line_rows[i]));
  }

});

$(".disabled-diff-table").each(function() {
  var left = $(this).clone();
  var right = $(this).clone();
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
      lines_removed = 0;
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
      lines_added = 0;
    }
  });
});