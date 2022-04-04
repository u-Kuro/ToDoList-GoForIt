//Logout
function logout(){
    document.getElementById("logout").submit();
}

//Add Category
function addCategory(){
    const inputcatname = document.getElementById("inputcategoryName");
    const inputcatnameval = document.getElementById("inputcategoryName").value;
    if(inputcatnameval==''){
        inputcatname.setCustomValidity("Category Name can't be Empty")
        return inputcatname.reportValidity();
        
    }
    if(inputcatnameval.length>50){
        inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
        return inputcatname.reportValidity();
    }
    inputcatname.setCustomValidity("Category Name can't be Empty")
    inputcatname.reportValidity();
    return document.getElementById("addcategoryForm").submit();
}

function addCategoryEnter(event){
    if(event.keyCode == 13) {
        const inputcatname = document.getElementById("inputcategoryName");
        const inputcatnameval = document.getElementById("inputcategoryName").value;
        if(inputcatnameval==''){
            inputcatname.setCustomValidity("Category Name can't be Empty");
            event.preventDefault();
            return inputcatname.reportValidity();
            
        }
        if(inputcatnameval.length>50){
            inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
            event.preventDefault();
            return inputcatname.reportValidity();
        }
        inputcatname.setCustomValidity("Category Name can't be Empty")
        inputcatname.reportValidity();
        event.preventDefault();
        return document.getElementById("addcategoryForm").submit();
    }
}

//Open Category Settings
function openCSP(id,event){
    const CSP = document.getElementById('CSP'+id)
    CSP.style.display = 'flex';
    setTimeout(function () {
        CSP.style.visibility = '1';
        CSP.style.opacity = '1';
    }, 100);
    event.stopPropagation();
}

//Close Category Settings
function closeCSP(id,event){
    const CSP = document.getElementById('CSP'+id);
    CSP.style.visibility = '0';
    CSP.style.opacity = '0';
    setTimeout(function () {
        CSP.style.display = 'none';
    }, 100);
}

function dontcloseCSP(event){
    event.stopPropagation();
}

//Open Category Settings Delete Validation
function openCSPA(id){
    const CSP = document.getElementById('CSP'+id);
    CSP.style.visibility = '0';
    CSP.style.opacity = '0';
    CSP.style.display = 'none';
    //
    const CSPA = document.getElementById('CSPA'+id);
    CSPA.style.display = 'flex';
    setTimeout(function () {
        CSPA.style.visibility = '1';
        CSPA.style.opacity = '1';
    }, 100);
}

//Closing Category Settings Delete Validation
function closeCSPA(id,event){
    const CSPA = document.getElementById('CSPA'+id);
    CSPA.style.display = 'none';
    CSPA.style.visibility = '0';
    CSPA.style.opacity = '0';
    //
    const CSP = document.getElementById('CSP'+id);
    CSP.style.display = 'flex';
    setTimeout(function () {
        CSP.style.visibility = '1';
        CSP.style.opacity = '1';
    }, 100);
}

function dontcloseCSPA(event){
    event.stopPropagation();
}

//Delete Category
function deleteCategory(id){
    document.getElementById("deleteCategory"+id).submit();
}

//Edit Category
function saveCategoryEnter(id,event){
    if(event.keyCode == 13) {
        const inputcatname = document.getElementById("editcategory"+id);
        const inputcatnameval = document.getElementById("editcategory"+id).value;
        if(inputcatnameval==''){
            inputcatname.setCustomValidity("Category Name can't be Empty")
            return inputcatname.reportValidity();
            
        }
        if(inputcatnameval.length>50){
            inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
            return inputcatname.reportValidity();
        }
        inputcatname.setCustomValidity("Category Name can't be Empty")
        inputcatname.reportValidity();
        return document.getElementById("editcategoryForm"+id).submit();
    }
}

function saveCategory(id){
    const inputcatname = document.getElementById("editcategory"+id);
    const inputcatnameval = document.getElementById("editcategory"+id).value;
    if(inputcatnameval==''){
        inputcatname.setCustomValidity("Category Name can't be Empty")
        return inputcatname.reportValidity();
        
    }
    if(inputcatnameval.length>50){
        inputcatname.setCustomValidity("Category Name can't be Longer than 50 Characters")
        return inputcatname.reportValidity();
    }
    inputcatname.setCustomValidity("Category Name can't be Empty")
    inputcatname.reportValidity();
    return document.getElementById("editcategoryForm"+id).submit();
}

//Open Category
function openCategory(id){
    document.getElementById("opencategory"+id).submit();
}

//Open Task Settings Delete Validation
function openTPSA(id){
    const TPS = document.getElementById('TPS'+id);
    TPS.style.visibility = '0';
    TPS.style.opacity = '0';
    TPS.style.display = 'none';
    //
    const TPSA = document.getElementById('TPSA'+id);
    TPSA.style.display = 'flex';
    setTimeout(function () {
        TPSA.style.visibility = '1';
        TPSA.style.opacity = '1';
    }, 100);
}

//Closing Task Settings Delete Validation
function closeTPSA(id,event){
    const TPSA = document.getElementById('TPSA'+id);
    TPSA.style.display = 'none';
    TPSA.style.visibility = '0';
    TPSA.style.opacity = '0';
    //
    const TPS = document.getElementById('TPS'+id);
    TPS.style.display = 'flex';
    setTimeout(function () {
        TPS.style.visibility = '1';
        TPS.style.opacity = '1';
    }, 100);
}

function dontcloseTPSA(event){
    event.stopPropagation();
}

// Check Add Task Form's Input for Dates
function checkDate(event){
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    if(startdate!='' && enddate!=''){
        if(startdate>enddate){
            event.target.setCustomValidity("Start Date should be greater than End Date")
            event.target.reportValidity();
            event.target.value = '';
        }
        return false;
    }
    return true;
}

//Open Add Task Form
function openATP() {
    const addtaskpopup = document.getElementById('ATP');
    addtaskpopup.style.display = 'flex';
    setTimeout(function () {
        addtaskpopup.style.visibility = '1';
        addtaskpopup.style.opacity = '1';
    }, 100);
}

//Close Add Task Form
function closeATP() {
    const addtaskpopup = document.getElementById('ATP');
    addtaskpopup.style.visibility = '0';
    addtaskpopup.style.opacity = '0';
    setTimeout(function () {
        addtaskpopup.style.display = 'none';
    }, 100);
}

function dontcloseATP(event) {
    event.stopPropagation();
}

//Open Task Settings
function opentaskSettings(id){
    const TPS = document.getElementById('TPS'+id);
    TPS.style.display = 'flex';
    setTimeout(function () {
        TPS.style.visibility = '1';
        TPS.style.opacity = '1';
    }, 100);
}

//Check Task Setting's Form's Input for Dates to be Valid
function TPScheckDate(event){
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    if(startdate!='' && enddate!=''){
        if(startdate>enddate){
            event.target.setCustomValidity("Start Date should be greater than End Date")
            event.target.reportValidity();
            event.target.value = '';
        }
        return false;
    }
    return true;
}

//Close the Task Settings
function closeTPS(id) {
    const addtaskpopup = document.getElementById('TPS'+id);
    addtaskpopup.style.visibility = '0';
    addtaskpopup.style.opacity = '0';
    setTimeout(function () {
        addtaskpopup.style.display = 'none';
    }, 100);
}

function dontcloseTPS(event) {
    event.stopPropagation();
}

function addtask(){
    document.getElementById("addtaskForm").submit();
}

function editTask(id){
    document.getElementById("editTask"+id).submit();
}

function deleteTask(id){
    document.getElementById("deleteTask"+id).submit();
}

//Task Status by Checkbox 
function checktaskStatus(id,event){
    if(event.target.checked){
        document.getElementById('taskcheckbox'+id).value = 1;
    } else{
        document.getElementById('taskcheckbox'+id).value = 0;   
    }
    document.getElementById('changetaskstatus'+id).submit();         
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
        catmenu.style.display = 'none';
        console.log('isclicked')
    }
}

//Fix Categories menu after resize 
window.addEventListener("resize", function(event) {
    if(document.body.clientWidth>=785){
        const catmenu = document.getElementById('categoriesMenu');
        const mainmenu = document.getElementById('main-contents');
        const caticon = document.getElementById('category-icon');
        caticon.style.display = 'none'
        mainmenu.style.marginLeft = '15.5em';
        mainmenu.style.paddingTop = '4em';
        return catmenu.style.display = 'block'
    }
    const catmenu = document.getElementById('categoriesMenu');
    const mainmenu = document.getElementById('main-contents');
    const caticon = document.getElementById('category-icon');
    caticon.style.display = 'flex';
    mainmenu.style.margin = '0.25em';
    mainmenu.style.paddingTop = '3em';
    return catmenu.style.display = 'none'
})