(function () {

  window.onload = blur;

  function blur () {
    var menu = document.getElementByTagName('sidebar-checkbox');

    menu.addEventListener('click', function () {
      console.log('hello!');
    });
  }


})();
