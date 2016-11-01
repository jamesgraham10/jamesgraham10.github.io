(function(document) {

  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');
  var content = document.querySelector('.wrap');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if (checkbox.checked) { content.classList.add('content-blur'); }
    else { content.classList.remove('content-blur'); }

    if (target == content) { content.classList.remove('content-blur'); }

    if(!checkbox.checked || sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);

})(document);
