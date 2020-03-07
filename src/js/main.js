$(function () {
  console.log('jQuery is ready!');

  $('.js-accordion-trigger').on('click', function () {
    var target = $(this).attr('data-target');

    $(this).toggleClass('is-active');
    $('#' + target).slideToggle(300);
  });
});
