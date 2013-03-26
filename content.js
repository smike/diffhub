function trackEvent(event_name) {
  chrome.extension.sendMessage({track_action: event_name});
}

function show() {
  $(this).css('display', 'block');
}

function hide() {
  $(this).css('display', 'none');
}

function toEnsp() {
  $(this).html($(this).html().replace(/&nbsp;/g, '&ensp;'));
}

function evaluatePage() {
  if ($('#toc > p.explain > a.hide-diff-stats').length == 0 || $('#show-side-diffs').length != 0) {
    // Either we've already modified this page, or there's nothing to do.
    return;
  }

  trackEvent('enabled'); // We found a diff on the page, track that.

  $('#toc > p.explain > a.hide-diff-stats').after(
      '<a href="#" id="show-side-diffs" class="minibutton">Show Side-By-Side Diffs</a>' +
      '<a href="#" id="hide-side-diffs" class="minibutton">Show Unified Diffs</a>');

  $('#show-side-diffs').bind('click', function() {
    $(this).each(hide);

    if ($(".side-by-side-diff").length == 0) {
      createSideBySideDiff();
    }
    $('.unified-diff').each(hide);
    $('.side-by-side-diff').each(show);
    $('#js-repo-pjax-container').css('width', '90%');

    $('#hide-side-diffs').each(show);

    trackEvent('show-side-by-side'); // track showing of side-by-side diffs
  });
  $('#hide-side-diffs').bind('click', function() {
    $('.unified-diff').each(show);
    $('.side-by-side-diff').each(hide);

    $('#js-repo-pjax-container').css('width', '');

    $(this).each(hide);
    $('#show-side-diffs').each(show);

    trackEvent('show-unified'); // track going back to regular diffs
  }).each(hide);
}

function createSideBySideDiff() {
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
}

// GitHub uses pjax to to load some pages, which changes the contents and location w/o actually
// reloading the page. Try to detect when the location changes and re-evaluate page contents.
var last_location;
setInterval(function() {
  if (window.location.href != last_location) {
  // The content changes a bit after the location does. Wait until evaluating the page.
    setTimeout(function() {
      evaluatePage();
    }, 500);
    last_location = window.location.href;
  }
}, 100);