function popup(id, event){
    const popupid = document.getElementById('catsetpop'+id);
    popupid.style.display = 'flex';
    setTimeout(function () {
        popupid.style.visibility = '1';
        popupid.style.opacity = '1';
    }, 1);
    event.stopPropagation();
}

function closepopupSide(id){
    const popupid = document.getElementById('catsetpop'+id);
    popupid.style.visibility = '0';
    popupid.style.opacity = '0';
    setTimeout(function () {
        popupid.style.display = 'none';
    }, 250);
}

function closepopupIcon(id, event){
    const popupid = document.getElementById('catsetpop'+id);
    popupid.style.visibility = '0';
    popupid.style.opacity = '0';
    setTimeout(function () {
        popupid.style.display = 'none';
    }, 250);
}

function dontclosepopupCont(id, event){
    const popupcont = document.getElementById('popupCont'+id);
    event.stopPropagation();
}

//
function popupdeleteAlert(id, event){
    const popupalertid = document.getElementById('catsetpopalert'+id);
    popupalertid.style.display = 'flex';
    setTimeout(function () {
        popupalertid.style.visibility = '1';
        popupalertid.style.opacity = '1';
    }, 1);
    event.stopPropagation();
}

function closepopupalertSide(id){
    const popupalertid = document.getElementById('catsetpopalert'+id);
    popupalertid.style.visibility = '0';
    popupalertid.style.opacity = '0';
    setTimeout(function () {
        popupalertid.style.display = 'none';
    }, 250);
}

function closepopupalertCancel(id, event){
    const popupalertid = document.getElementById('catsetpopalert'+id);
    popupalertid.style.visibility = '0';
    popupalertid.style.opacity = '0';
    setTimeout(function () {
        popupalertid.style.display = 'none';
    }, 250);
}

function dontclosepopupalertCont(id, event){
    const popupcont = document.getElementById('popupalertCont'+id);
    event.stopPropagation();
}

function openCategory(id){
    document.forms['openCategoryForm'+id].submit()
}  