function setupHead(){
  var head_page = document.createElement('link');
  head_page.href = 'css/agid-spid-enter.css';
  head_page.rel  = 'stylesheet';
  head_page.type = 'text/css';
  $("head").append(head_page);
}
function generateButton(size=null,obj_agid=null,lang){
  if(obj_agid!==undefined || obj_agid!==null){
    if(size === undefined || size === null) size="m";
    obj_agid.html('<button class="'+agid_spid_config["btn_agid"]["class"]+size+'" onclick="showPanel()">\
      <span class="'+agid_spid_config["btn_agid"]["class_enter_icon"]+'"><img aria-hidden="true"  src="'+agid_spid_config["btn_agid"]["img"]+'" onerror="this.src=\''+agid_spid_config["btn_agid"]["img"]+'\'; this.onerror=null;" alt="'+agid_spid_lang[lang]["btn_spid"]["title"]+'" /></span>\
      <span class="'+agid_spid_config["btn_agid"]["class_enter_text"]+'">'+agid_spid_lang[lang]["btn_spid"]["title"]+'</span>\
    </button>');
  }
}
function createListHtmlProviders(lang){
  var list_providers="";
  $.each(Object.keys(agid_spid_config["providers"]), function( key, value  ) {
    if (agid_spid_config["providers"][value]["url"]) list_providers += '<span class="'+agid_spid_config["btn_provider"]["class"]+'" role="button"><a href="'+agid_spid_config["providers"][value]["url"][lang]+'" class="'+agid_spid_config["btn_provider"]["class_ahref"]+'" title="'+agid_spid_config["providers"][value]["title"][lang]+'" style="background-image: url(\' '+agid_spid_config["btn_provider"]["root_img"] + agid_spid_config["providers"][value]["logo"] + '\')"></a></span>';
  });
  return list_providers;
}
function createContent(lang) {
  var panel_html = '\
    <div id="'+agid_spid_config["info_modal"]["id"]+'" class="'+agid_spid_config["info_modal"]["class"]+'"></div>\
    <div id="'+agid_spid_config["agid_enter_conent"]["id"]+'" class="'+agid_spid_config["agid_enter_conent"]["class"]+'">\
  		<div id="agid-spid-button-anim">\
  			<div id="agid-spid-button-anim-base"></div>\
        <div id="agid-spid-button-anim-icon"></div>\
  		</div>	\
  		<section id="'+agid_spid_config["agid_enter_conent"]["section"]["id"]+'" class="'+agid_spid_config["agid_enter_conent"]["section"]["class"]+'" aria-labelledby="agid-spid-enter-title-page" hidden>\
  			<header id="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["id"]+'" class="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["class"]+'">\
          <nav class="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["nav"]["class"]+'" aria-controls="'+agid_spid_config["agid_enter_conent"]["section"]["id"]+'">\
    				<div role="button">	\
              <a href="#" onclick="hidePanel()" class="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["nav"]["back_btn"]["class"]+'" >\
    						<img src="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["nav"]["back_btn"]["img"]+'" alt="'+agid_spid_lang[lang]["title_back"]+'">\
    					</a>\
    				</div>\
          </nav>\
  				<div class="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["logo"]["class"]+'">\
  					<img aria-hidden="true" src="'+agid_spid_config["agid_enter_conent"]["section"]["header"]["logo"]["img"]+'" alt="'+agid_spid_lang[lang]["title"]+'">\
  				</div>\
        </header>\
  			<div id="'+agid_spid_config["agid_enter_conent"]["section"]["content"]["id"]+'" class="'+agid_spid_config["agid_enter_conent"]["section"]["content"]["class"]+'">\
          <div id="'+agid_spid_config["agid_enter_conent"]["section"]["content"]["id_div_title"]+'"><h1 id="'+agid_spid_config["agid_enter_conent"]["section"]["content"]["id_title"]+'">'+agid_spid_lang[lang]["agid_content"]["title"]+'</h1></div> \
					<div id="'+agid_spid_config["agid_enter_conent"]["section"]["list_providers"]["id"]+'" class="'+agid_spid_config["agid_enter_conent"]["section"]["list_providers"]["class"]+'">'
            panel_html+=createListHtmlProviders(lang);
            panel_html += '\
					</div>\
  				<div id="'+agid_spid_config["agid_enter_conent"]["section"]["div_cancel"]["id"]+'">\
  					<a href="#" onclick="hidePanel('+agid_spid_config["agid_enter_conent"]["section"]["div_cancel"]["id"]+')"><div id="'+agid_spid_config["agid_enter_conent"]["section"]["div_cancel"]["id_btn"]+'" class="'+agid_spid_config["agid_enter_conent"]["section"]["div_cancel"]["class_btn"]+'" role="button" onclick="hidePanel()"><span>'+agid_spid_lang[lang]["agid_content"]["cancel_access"]+'</span></div></a>\
  				</div > \
          <div id="agid-logo-container" aria-hidden="true">\
  					<img id="agid-logo" class="agid-logo" src="./img/agid-logo-bb-short.png" aria-hidden="true"/>\
  				</div > \
        </div>\
  			<footer id="agid-spid-panel-footer">\
          <div id="agid-action-button-container">\
            <a href="#"> <div id="nospid" class="agid-action-button" role="button"><span>'+agid_spid_lang[lang]["txt_footer_nospid"]+'</span></div></a>\
            <a href="#"> <div id="cosaspid" class="agid-action-button" role="button"><span>'+agid_spid_lang[lang]["txt_footer_cosaspid"]+'</span></div></a>\
          </div>\
        </footer>\
  	  </section>\
    </div>';
  $("body").append(panel_html);
}
function showPanel() {
  shuffleIdp();
  toshow = $("#"+agid_spid_config["agid_enter_conent"]["section"]["id"]).get(0);
  toshow.removeAttribute("hidden");
  toshow.style.display = "block";
  buttons = document.getElementsByClassName("agid-spid-enter-button");
  for (z = 0; z < buttons.length; z++) {
    buttons[z].style.display = "none";
    hiddenattribute = document.createAttribute("hidden");
    buttons[z].setAttributeNode(hiddenattribute);
  }
  animate_element_in("agid-spid-button-anim");
  animate_element_in("agid-spid-button-anim-base");
  animate_element_in("agid-spid-button-anim-icon");
  animate_element_in(agid_spid_config["agid_enter_conent"]["section"]["id"]);
  var base = document.getElementById("agid-spid-button-anim-base");
  var panel = document.getElementById("agid-spid-button-anim");
  base.addEventListener("animationstart", function(e){
    panel.style.display = "block";
    base.style.display = "block";
  }, true);
  base.addEventListener("animationend", function(e){
    panel.style.display = "block";
    base.style.display = "block";
  }, true);
}
function hidePanel() {
  tohide = $("#"+agid_spid_config["agid_enter_conent"]["section"]["id"]).get(0);
  hiddenattribute = document.createAttribute("hidden");
  tohide.setAttributeNode(hiddenattribute);
  tohide.style.display = "none";
  buttons = document.getElementsByClassName("agid-spid-enter-button");
  for (z = 0; z < buttons.length; z++) {
    buttons[z].style.display = "block";
    buttons[z].removeAttribute("hidden");
  };
  animate_element_out("agid-spid-button-anim");
  animate_element_out("agid-spid-button-anim-base");
  animate_element_out("agid-spid-button-anim-icon");
  animate_element_out(agid_spid_config["agid_enter_conent"]["section"]["id"]);
  var base = document.getElementById("agid-spid-button-anim-base");
  var panel = document.getElementById("agid-spid-button-anim");
  base.addEventListener("animationstart", function(e){
    panel.style.display = "block";
    base.style.display = "block";
  }, true);
  base.addEventListener("animationend", function(e){
    panel.style.display = "none";
    base.style.display = "none";
    var newone = base.cloneNode(true);
    base.parentNode.replaceChild(newone, base);
  }, true);
}
function animate_element_in(e) {
  element=$("#"+e).get(0);
  element.style.display = "block";
  element.classList.remove(e + "-anim-in");
  element.classList.remove(e + "-anim-out");
  element.classList.add(e + "-anim-in");
}
function animate_element_out(e) {
  element=$("#"+e).get(0);
  element.classList.remove(e + "-anim-in");
  element.classList.remove(e + "-anim-out");
  element.classList.add(e + "-anim-out");
}
function shuffleIdp() {
  if(agid_spid_config["config"]["shuffle"]===true){
    var ul = document.querySelector('#'+agid_spid_config["agid_enter_conent"]["section"]["list_providers"]["id"]);
    for (var i = ul.children.length; i >= 0; i--)
      ul.appendChild(ul.children[Math.random() * i | 0]);
  }
}
function openmodal(title,content){
  var modal = $("#"+agid_spid_config["info_modal"]["id"]);
  modal.html('<div id="'+agid_spid_config["agid_spid"]["id_modal_content"]+'" class="modal-content"><div><span id="'+agid_spid_config["agid_spid"]["id_modal_close"]+'" class="close">&times;</span><p>' + title + '</p></div><div>'+content+'</div></div>');
  modal.css("display","block");
  var span = $("#"+agid_spid_config["agid_spid"]["id_modal_close"]);
  span.click(function(){ closemodal(); });
};
function closemodal() {
  var modal = $("#"+agid_spid_config["info_modal"]["id"]);
  modal.css("display","none");
  modal.html("");
}
function checkLanguage(lang){
  if(agid_spid_lang[lang]===undefined || agid_spid_lang[lang]===null) lang="it";
  return lang;
}
function setupAgidSpidEnter(){
  //Ripulisco eventuali caratteri all'interno del nostro div
  $("agid-div").html("");
  //Imposto le risorse css nell'head
  setupHead();
  //Creo i componenti AGID
  $('agid-div').each(function(i, obj) {
    agid_lang=checkLanguage($(this).attr("agid-lang"));
    generateButton($(this).attr("agid-size"),$(this),agid_lang);
  });
  //Creo il contenuto del div di AGID
  createContent(agid_lang);
  //Chiamate funzioni al modal nospid e cosaspid
  $("#nospid").click(function(){ openmodal(agid_spid_lang[agid_lang]["txt_title_modal_nospid"],agid_spid_lang[agid_lang]["txt_content_modal_cosaspid"]); });
  $("#cosaspid").click(function(){ openmodal(agid_spid_lang[agid_lang]["txt_title_modal_cosaspid"],agid_spid_lang[agid_lang]["txt_content_modal_cosaspid"]); });
  //Richiamare la funzione hidePanel() e closemodal() la quale alla pressione del tasto ESC chiude sia il pannello AGID sia l'eventuale modal
  $(document).keydown(function(e) {
    if(e.keyCode == 27){
      hidePanel();
      closemodal();
    }
  });
  //Richiamare la funzione closemodal() la quale chiude il modal nel momento in cui clicchiamo con il mouse fuori dal modal
  $(document).mouseup(function(e){
    var modal_cont = $("#"+agid_spid_config["agid_spid"]["id_modal_content"]);
    if (!modal_cont.is(e.target) && modal_cont.has(e.target).length === 0) closemodal();
  });
}
$(document).ready(function() {
  setupAgidSpidEnter();
});
