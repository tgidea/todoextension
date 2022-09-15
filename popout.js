var category = 'todo-items';
const first = document.getElementById('1st');
const second = document.getElementById('2nd');
const third = document.getElementById('3rd');

first.style.background = 'white';
second.style.background = 'rgba(24, 151, 143, .7)';
third.style.background = 'rgba(24, 151, 143, .7)';
function focuss() {
    document.getElementById('textBox').focus();
}

// 3 listener for prior , moderate and long handling : ****************

first.addEventListener('click', () => {
    category = 'todo-items';
    first.style.background = 'white';
    second.style.background = 'rgba(24, 151, 143, .7)';
    third.style.background = 'rgba(24, 151, 143, .7)';
    focuss();
    fetchItems();
})
second.addEventListener('click', () => {
    category = 'moderate';
    second.style.background = 'white';
    first.style.background = 'rgba(24, 151, 143, .7)';
    third.style.background = 'rgba(24, 151, 143, .7)';
    focuss();
    fetchItems();
})
third.addEventListener('click', () => {
    category = 'long';
    third.style.background = 'white';
    first.style.background = 'rgba(24, 151, 143, .7)';
    second.style.background = 'rgba(24, 151, 143, .7)';
    focuss();
    fetchItems();
})

// ***********************************************************

document.querySelector('#textBox').addEventListener('keypress', checkUpdate2);
document.querySelector('#btn').addEventListener('click', checkUpdate);
function checkUpdate2(e) {
    if (e.key == 'Enter') {
        checkUpdate();
    }
}

// save new data to local storage 

function checkUpdate() {
    // todo-items
    var itemName = document.querySelector('.new-item input').value;
    if (itemName.trim() != '') {
        var itemsStorage = localStorage.getItem(`${category}`);
        if (itemsStorage == undefined || itemsStorage.length < 1) {
            itemsArr = [];
        }
        else {
            var itemsArr = JSON.parse(itemsStorage);
        }
        itemsArr.push({ "item": itemName, "status": 0 , "priority":"100000"});
        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-item input').value = '';
    }
}

// show content from local storage based on category selected and listener to ul->li

function fetchItems() {
    const itemsList = document.querySelector('ul.todo-items');
    itemsList.innerHTML = '';
    var newItemHTML = '';
    try {
        var itemsStorage = localStorage.getItem(`${category}`);
        var itemsArr
        if (itemsStorage == undefined || itemsStorage.length < 1) {
            itemsArr = [];
        }
        else {
            itemsArr = JSON.parse(itemsStorage);
        }

        // giving color to each li

        var color1 = ['#DEEDF0', '#F4C7AB', ' #D8F8B7', '#29BB89'];
        var color2 = 'white';
        let x = Math.floor(Math.random() * 10);        
        let idx = 0;
        let inc = .1
        for (var i = 0; i < itemsArr.length; i++) {
            var status = '', color = `${color1[idx]};`, text = 'Done', clor = '#212121', opq = 1;
            if (itemsArr[i].status == 1) {
                status = 'class="done"';
                color = `${color2}`;
                text = 'Undo';
                clor = '#958e8e;';
                opq = 1;
            }
            
            newItemHTML += `
            <li style="position:relative; background-color: ${color}; opacity:${opq}; animation: animate ${inc}s forwards" data-itemindex="${i}" ${status}>
                <div class="alert1" id="noti${i}">Number</div>
                <span style="color:${clor};" class="item">${itemsArr[i].item}</span>
                <div class="option">
                    <button id="complete${i}" class="itemComplete">${text}</button>
                    <button class="itemDelete">Delete</button>
                </div>
            </li>`;
            idx = idx + 1;
            idx = idx % 4;
            inc += .1
        }

        itemsList.innerHTML = newItemHTML;
        var itemsListUL = document.querySelectorAll('ul li');

        // setting delete and done button and priority listener
        
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemComplete(index);
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });
            itemsListUL[i].getElementsByTagName('span')[0].addEventListener('click',function(){
                var index = this.parentNode.dataset.itemindex;                
                setPriority(index);
            })
        }
    } catch (e) {
    }
}

//Task completed action(handling click on done and undo)

function itemComplete(index) {
    var itemsStorage = localStorage.getItem(`${category}`);
    var itemsArr = JSON.parse(itemsStorage);
    if (itemsArr[index].status == 1) {
        itemsArr[index].status = 0;
        document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = '';
        document.getElementById(`complete${index}`).innerText = "Done";
    }
    else {
        itemsArr[index].status = 1;
        document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = 'done';
        document.getElementById(`complete${index}`).innerText = "Undo";
    }
    saveItems(itemsArr);
    fetchItems();
}

//Task deleted action(handling click on delete button)

function itemDelete(index) {
    var itemsStorage = localStorage.getItem(`${category}`);
    var itemsArr = JSON.parse(itemsStorage);
    itemsArr.splice(index, 1);
    saveItems(itemsArr);
    fetchItems();
}

// save item to category variable name in local storage.

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem(`${category}`, string);
}
// ****************Notification related functions ****************************

// showing notificaition data in notificaion div
let contestInfo = [];
const showNoti = (platform) => {
    const notification = document.getElementById('contestData');
    notification.innerHTML = "";
    if (contestInfo.length == 0) {
        notification.innerHTML += 'Please click again and Check your network connection';
        // setTimeout(function(){showNoti(platform)},1000);
        return;
    };    
    var output = '';
    for (var i = 0; i < contestInfo.length; i++) {                    
        if(contestInfo[i][3]==`${platform}`)
            output += `<div style = "display:flex;">
                <div class="td"><a style="text-decoration:none; color: blue; " target=__blank href="${contestInfo[i][1]}">${contestInfo[i][0]}</a></div>
                <div class="td">${contestInfo[i][2].slice(1,contestInfo[i][2].length)}</div>
                <div class="td">${contestInfo[i][3]}</div>
            </div>`
    }
    document.getElementById('contestData').innerHTML += output;
}

// fetching notification content

const getContentOfNoti = async () => {
    const url = "https://script.google.com/macros/s/AKfycbyf8sSaQeR-JFO2In80eFaalnz5oxk5Q7fT01k9NHwBQO65SmDMMQiJHOnthWcye54L8w/exec"
    document.querySelector('body').style.cursor = "progress";
    fetch(url)
    .then(d => d.json())
    .then(d => {
        const data = d.data;  
        contestInfo = data; 
        document.querySelector('body').style.cursor = "default";
        document.getElementById('contestDiv').style.cursor = "pointer";

    })
    .catch(err => { console.log(err) })
}
// Handling click on notification bell to show notification

function buttonClick() {
    const notiBox = document.getElementById('notiBox');
    if (notiBox.style.display == "block") {
        notiBox.style.display = "none"
    }
    else {
        notiBox.style.display = "block"
        getContentOfNoti();
    }
}
const notiBox = document.getElementById('notiBox').style.display = "none";
const imgg = document.getElementById('imgg');
imgg.addEventListener('click', function () {
    buttonClick();
})
const contestDiv = document.getElementsByClassName('contestBox');
for(let i = 0 ; i<contestDiv.length ; i++){
    contestDiv[i].addEventListener('click',function(e){
        const platform = this.innerText.toLowerCase();        
           showNoti(platform); 
    })
}


/**************************************************************************/
/****************Priority Set/delete related function******************** */
let priority = 1;
let setButtonEnable = true;
function setPriority(index){
    if(setButtonEnable==false)return;    
    var itemsStorage = localStorage.getItem(`${category}`);
    var itemsArr = JSON.parse(itemsStorage);
    if(itemsArr[index].priority!=(100000))return;    
    itemsArr[index].priority = priority;

    const setPriorityLi = document.getElementById(`noti${index}`);
    setPriorityLi.innerText = `${priority}`;
    setPriorityLi.style.display = "flex";

    saveItems(itemsArr);
    priority++; 
}

function clearPriority(){
    priority = 1;   
    var itemsStorage = localStorage.getItem(`${category}`);
    var itemsArr = JSON.parse(itemsStorage);
    for(let i = 0 ; i<itemsArr.length ; i++){
        itemsArr[i].priority = "100000";
    }
    saveItems(itemsArr);
}

const priorityBtn = document.getElementById('priority');
priorityBtn.addEventListener('click',function(e){
    if(this.innerText.toLowerCase().trim()=="done"){
        setButtonEnable = false;
        const itemsList = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsList.length; i++) {                    
            itemsList[i].getElementsByTagName('span')[0].style.cursor = "inherit";
        }
        this.innerText = "Sort Task";
        var itemsStorage = localStorage.getItem(`${category}`);
        var itemsArr = JSON.parse(itemsStorage);        
        itemsArr.sort((a, b) => {return b.priority - a.priority;});        
        saveItems(itemsArr);
        fetchItems();
    }
    else{
        setButtonEnable = true;
        clearPriority();
        const itemsList = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsList.length; i++) {               
            itemsList[i].getElementsByTagName('span')[0].style.cursor = "pointer";
        }
        this.innerHTML = "&nbsp; Done &nbsp;&nbsp;";
    }
})
// *****************************************************************************

focuss();
fetchItems();


