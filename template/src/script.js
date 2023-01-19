(function(){
  
  var menuElement = document.querySelector('header .menu-icon');
  var bodyElement = document.querySelector('body');
  
  bodyElement.onclick = function(e){
    document.querySelector('.side-bar').classList.remove('side-bar-visible');
        document.querySelector('.overlay').classList.remove('visible');
  }
  
  menuElement.onclick = function(e){
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.side-bar').classList.add('side-bar-visible');
    document.querySelector('.overlay').classList.add('visible');
  }
  
})();