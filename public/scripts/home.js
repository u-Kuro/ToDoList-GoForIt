var CSPinuse;
var CSPAinuse;
var TSPAinuse;
var ATPinuse;
var TPSinuse;
var DFTPinuse;

// Auto Reload Update Dates
setInterval(function () {
    var inuse =
        document.getElementById("inputcategoryName") === document.activeElement
        || document.getElementById("inputcategoryName").value != ''
        || CSPinuse
        || CSPAinuse
        || TSPAinuse
        || ATPinuse
        || TPSinuse
        || DFTPinuse
        || (document.body.clientWidth<785 && document.getElementById("categoriesMenu").style.display == 'block')
    if(!inuse){
        document.getElementById('refreshTask').submit();   
        return document.getElementById('refreshTask').stopPropagation();
    }
}, 60000);

//Logout
function logout(){
    document.getElementById("logout").submit();
    return document.getElementById("logout").stopPropagation();
}

//Reload when Timezone Changes
var postoffset = ((new Date().getTimezoneOffset())*-1)/60;
var tzisReloaded = false;
var tzreload = setInterval(function () {
    var preoffset = ((new Date().getTimezoneOffset())*-1)/60;
    console.log(postoffset+' '+preoffset);
    if(postoffset===preoffset && !tzisReloaded) return;
    tzisReloaded = true;
    // Send Client's Timezone
    var houroffset = Math.floor(preoffset);
    var minoffset = 60*(preoffset - houroffset);
    document.getElementById('ctoh').value = houroffset;
    document.getElementById('ctom').value = minoffset;
    document.getElementById("tzisChanged").submit();
    return clearinterval(tzreload);
}, 1000);



//Add Category
function addCategory(){
    const inputcatname = document.getElementById("inputcategoryName");
    const inputcatnameval = document.getElementById("inputcategoryName").value;
    if(inputcatnameval==''){
        inputcatname.setCustomValidity("Category Name can't be Empty")
        return inputcatname.reportValidity();
    } else if(inputcatnameval.length>50){
        inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
        return inputcatname.reportValidity();
    } else {
        inputcatname.setCustomValidity("")
        document.getElementById("addcategoryForm").submit();
        return document.getElementById("addcategoryForm").stopPropagation();
    }
}

function addCategoryEnter(event){
    if(event.keyCode == 13) {
        const inputcatname = document.getElementById("inputcategoryName");
        const inputcatnameval = document.getElementById("inputcategoryName").value;
        if(inputcatnameval==''){
            inputcatname.setCustomValidity("Category Name can't be Empty");
            event.preventDefault();
            return inputcatname.reportValidity();
            
        } else if(inputcatnameval.length>50){
            inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
            event.preventDefault();
            return inputcatname.reportValidity();
        } else {
            document.getElementById("addcategoryForm").submit();
            return document.getElementById("addcategoryForm").stopPropagation();
        }
    }
}

//Open Category Settings
function openCSP(id,event){
    CSPinuse = true;
    const CSP = document.getElementById('CSP'+id)
    CSP.style.display = 'flex';
    setTimeout(function () {
        CSP.style.visibility = '1';
        CSP.style.opacity = '1';
    }, 100);
    return event.stopPropagation();
}

//Close Category Settings
function closeCSP(id,event){
    CSPinuse = false;
    const CSP = document.getElementById('CSP'+id);
    CSP.style.visibility = '0';
    CSP.style.opacity = '0';
    setTimeout(function () {
        return CSP.style.display = 'none';
    }, 100);
}

function dontcloseCSP(event){
    return event.stopPropagation();
}

//Open Category Settings Delete Validation
function openCSPA(id){
    CSPAinuse = true;
    const CSP = document.getElementById('CSP'+id);
    CSP.style.visibility = '0';
    CSP.style.opacity = '0';
    CSP.style.display = 'none';
    //
    const CSPA = document.getElementById('CSPA'+id);
    CSPA.style.display = 'flex';
    setTimeout(function () {
        CSPA.style.visibility = '1';
        return CSPA.style.opacity = '1';
    }, 100);
}

//Closing Category Settings Delete Validation
function closeCSPA(id,event){
    CSPAinuse = false;
    const CSPA = document.getElementById('CSPA'+id);
    CSPA.style.display = 'none';
    CSPA.style.visibility = '0';
    CSPA.style.opacity = '0';
    //
    const CSP = document.getElementById('CSP'+id);
    CSP.style.display = 'flex';
    setTimeout(function () {
        CSP.style.visibility = '1';
        return CSP.style.opacity = '1';
    }, 100);
}

function dontcloseCSPA(event){
    return event.stopPropagation();
}
/////////////
//Open Delete All Finished Tasks Validation
function openDFTP(){
    DFTPinuse = true;
    const DFTP = document.getElementById('DFTP');
    DFTP.style.display = 'flex';
    setTimeout(function () {
        DFTP.style.visibility = '1';
        return DFTP.style.opacity = '1';
    }, 100);
}

//Closing Category Settings Delete Validation
function closeDFTP(){
    DFTPinuse = false;
    const DFTP = document.getElementById('DFTP');
    DFTP.style.visibility = '0';
    DFTP.style.opacity = '0';
    setTimeout(function () {
        return DFTP.style.display = 'none';
    }, 100);
}

function dontcloseDFTP(event){
    return event.stopPropagation();
}

function deleteAFTasks(){
    document.getElementById('deleteAllFinishedTask').submit();
}

/////////////
//Delete Category
function deleteCategory(id){
    document.getElementById("deleteCategory"+id).submit();
    document.getElementById("deleteCategory"+id).stopPropagation();
}

//Edit Category
function saveCategoryEnter(id,event){
    if(event.keyCode == 13) {
        const inputcatname = document.getElementById("editcategory"+id);
        const inputcatnameval = document.getElementById("editcategory"+id).value;
        if(inputcatnameval==''){
            inputcatname.setCustomValidity("Category Name can't be Empty")
            return inputcatname.reportValidity();
            
        } else if(inputcatnameval.length>50){
            inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
            return inputcatname.reportValidity();
        } else {
            inputcatname.setCustomValidity("");
            document.getElementById("editcategoryForm"+id).submit();
            return document.getElementById("editcategoryForm"+id).stopPropagation();
        }
    }
}

function saveCategory(id){
    const inputcatname = document.getElementById("editcategory"+id);
    const inputcatnameval = document.getElementById("editcategory"+id).value;
    if(inputcatnameval==''){
        inputcatname.setCustomValidity("Category Name can't be Empty")
        return inputcatname.reportValidity();
    } else if(inputcatnameval.length>50){
        inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
        return inputcatname.reportValidity();
    } else {
        inputcatname.setCustomValidity("");
        document.getElementById("editcategoryForm"+id).submit();
        return document.getElementById("editcategoryForm"+id).stopPropagation();
    }
}

//Open Category
function openCategory(id){
    document.getElementById("opencategory"+id).submit();
    return document.getElementById("opencategory"+id).stopPropagation();
}

//Open Task Settings Delete Validation
function openTPSA(id){
    TSPAinuse = true;
    const TPS = document.getElementById('TPS'+id);
    TPS.style.visibility = '0';
    TPS.style.opacity = '0';
    TPS.style.display = 'none';
    //
    const TPSA = document.getElementById('TPSA'+id);
    TPSA.style.display = 'flex';
    setTimeout(function () {
        TPSA.style.visibility = '1';
        return TPSA.style.opacity = '1';
    }, 100);
}

//Closing Task Settings Delete Validation
function closeTPSA(id,event){
    TSPAinuse = false;
    const TPSA = document.getElementById('TPSA'+id);
    TPSA.style.display = 'none';
    TPSA.style.visibility = '0';
    TPSA.style.opacity = '0';
    //
    const TPS = document.getElementById('TPS'+id);
    TPS.style.display = 'flex';
    setTimeout(function () {
        TPS.style.visibility = '1';
        return TPS.style.opacity = '1';
    }, 100);
}

function dontcloseTPSA(event){
    return event.stopPropagation();
}

// Add Task
function addtask(){
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    const taskname = document.getElementById('taskname').value;
    const description = document.getElementById('descriptions').value;
    if(startdate!='' && enddate!='' && taskname!='' && description!=''){
        if(startdate<enddate){
            document.getElementById('addtaskForm').submit();
            return document.getElementById('addtaskForm').stopPropagation();
        }
    }
    return true;
}

// Check Add Task Form's Input for Dates
function checkDate(event){
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    if(startdate!='' && enddate!=''){
        if(startdate>=enddate){
            event.target.setCustomValidity("Start Date should before the End Date");
            event.target.reportValidity();
            return event.target.value = '';
        } else {
            event.target.setCustomValidity("");
            return event.target.reportValidity();
        }
    }
    return true;
}

//Open Add Task Form
function openATP() {
    ATPinuse = true;
    const addtaskpopup = document.getElementById('ATP');
    addtaskpopup.style.display = 'flex';
    setTimeout(function () {
        addtaskpopup.style.visibility = '1';
        return addtaskpopup.style.opacity = '1';
    }, 100);
}

//Close Add Task Form
function closeATP() {
    ATPinuse = false;
    const addtaskpopup = document.getElementById('ATP');
    addtaskpopup.style.visibility = '0';
    addtaskpopup.style.opacity = '0';
    setTimeout(function () {
        return addtaskpopup.style.display = 'none';
    }, 100);
}

function dontcloseATP(event) {
    return event.stopPropagation();
}

//Open Task Settings
function opentaskSettings(id){
    TPSinuse = true;
    const TPS = document.getElementById('TPS'+id);
    TPS.style.display = 'flex';
    setTimeout(function () {
        TPS.style.visibility = '1';
        return TPS.style.opacity = '1';
    }, 100);
}

//Check Task Setting's Form's Input for Dates to be Valid
function TPScheckDate(id,event){
    const startdate = document.getElementById('startdate'+id).value;
    const enddate = document.getElementById('enddate'+id).value;
    if(startdate!='' && enddate!=''){
        if(startdate>=enddate){
            event.target.setCustomValidity("Start Date should before the End Date")
            event.target.reportValidity();
            return event.target.value = '';
        } else {
            event.target.setCustomValidity("")
            return event.target.reportValidity();
        }
    }
    return true;
}

//Close the Task Settings
function closeTPS(id) {
    TPSinuse = false;
    const addtaskpopup = document.getElementById('TPS'+id);
    addtaskpopup.style.visibility = '0';
    addtaskpopup.style.opacity = '0';
    setTimeout(function () {
        return addtaskpopup.style.display = 'none';
    }, 100);
}

function dontcloseTPS(event) {
    return event.stopPropagation();
}

function validateEdit(id){
    return document.getElementById("edittaskbutton"+id).click();
}

function editTask(id){
    const startdate = document.getElementById('startdate'+id).value;
    const enddate = document.getElementById('enddate'+id).value;
    const taskname = document.getElementById('taskname'+id).value;
    const description = document.getElementById('descriptions'+id).value;
    if(startdate!='' && enddate!='' && taskname!='' && description!=''){
        if(startdate<enddate){
            document.getElementById("editTask"+id).submit();
            return document.getElementById("editTask"+id).stopPropagation();
        }
    }
    return true;
}

function deleteTask(id){
    document.getElementById("deleteTask"+id).submit();
    return document.getElementById("deleteTask"+id).stopPropagation();
}

//Task Status by Checkbox 
function checktaskStatus(id,event){
    if(event.target.checked){
        document.getElementById('taskcheckbox'+id).value = 1;
        document.getElementById('changetaskstatus'+id).submit(); 
        return document.getElementById('changetaskstatus'+id).stopPropagation();
    } else{
        document.getElementById('taskcheckbox'+id).value = 0;   
        document.getElementById('changetaskstatus'+id).submit(); 
        return document.getElementById('changetaskstatus'+id).stopPropagation();      
    }
}

//Open Category (small screen)
function opencategoryMenu(){
    const catmenu = document.getElementById('categoriesMenu');
    if(catmenu.style.display == 'block'){
        return catmenu.style.display = 'none'
    }
    return catmenu.style.display = 'block'
}

//Close Category Menu 
function closecategoriesMenu(){
    if(document.body.clientWidth<785){
        const catmenu = document.getElementById('categoriesMenu');
        return catmenu.style.display = 'none';
    }
}

//Fix Categories menu after resize 
window.addEventListener("resize", function(event) {
    if(document.body.clientWidth>=785){
        const catmenu = document.getElementById('categoriesMenu');
        const mainmenu = document.getElementById('main-contents');
        const caticon = document.getElementById('category-icon');
        caticon.style.display = 'none';
        mainmenu.style.margin = '1em';
        mainmenu.style.marginLeft = '16.5em';
        mainmenu.style.paddingTop = '4em';
        return catmenu.style.display = 'block'
    } else if(document.body.clientWidth<785 && document.getElementById('categoriesMenu').style.display=='block') {
        const mainmenu = document.getElementById('main-contents');
        const caticon = document.getElementById('category-icon');
        caticon.style.display = 'flex';
        mainmenu.style.margin = '0.25em';
        return mainmenu.style.paddingTop = '3em';
    } else {
        const catmenu = document.getElementById('categoriesMenu');
        const mainmenu = document.getElementById('main-contents');
        const caticon = document.getElementById('category-icon');
        caticon.style.display = 'flex';
        mainmenu.style.margin = '0.25em';
        mainmenu.style.paddingTop = '3em';
        return catmenu.style.display = 'none'
    }
});

// Change Categories Scroll Max Height
window.addEventListener('load', function(event) {
    return document.getElementById('categoriesul').style.maxHeight = document.body.clientHeight-162+'px';
});

window.addEventListener('resize', function(event) {
    return document.getElementById('categoriesul').style.maxHeight = document.body.clientHeight-162+'px';
});
