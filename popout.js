var category = 'todo-items';
const first = document.getElementById('1st');
const second = document.getElementById('2nd');
const third = document.getElementById('3rd');
first.style.background =  'white';
second.style.background =  'rgba(24, 151, 143, .7)';
third.style.background =  'rgba(24, 151, 143, .7)';
first.addEventListener('click',()=>{
    category = 'todo-items';
    first.style.background =  'white';
    second.style.background =  'rgba(24, 151, 143, .7)';
    third.style.background =  'rgba(24, 151, 143, .7)';
    fetchItems();
})
second.addEventListener('click',()=>{
    category = 'moderate';
    second.style.background =  'white';
    first.style.background =  'rgba(24, 151, 143, .7)';
    third.style.background =  'rgba(24, 151, 143, .7)';
    fetchItems();
})
third.addEventListener('click',()=>{
    category = 'long';
    third.style.background =  'white';
    first.style.background =  'rgba(24, 151, 143, .7)';
    second.style.background =  'rgba(24, 151, 143, .7)';
    fetchItems();
})
document.querySelector('#textBox').addEventListener('keypress', checkUpdate2);
document.querySelector('#btn').addEventListener('click', checkUpdate);
function checkUpdate2(e){
    if(e.key=='Enter'){
        checkUpdate();
    }
}

function checkUpdate() {
    // todo-items
    var itemName = document.querySelector('.new-item input').value;
    console.log(itemName);
    if (itemName != '') {

        var itemsStorage = localStorage.getItem(`${category}`);
        if (itemsStorage == undefined || itemsStorage.length < 1) {
            itemsArr = [];
        }
        else {
            var itemsArr = JSON.parse(itemsStorage);
        }
        itemsArr.push({ "item": itemName, "status": 0 });
        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-item input').value = '';
    }
}

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
        var color1 = ['#DEEDF0','#F4C7AB',' #D8F8B7', '#29BB89'];
        var color2 = 'white';
        let x = Math.floor(Math.random()*10);
        // let idx = x%4;
        let idx = 0;
        for (var i = 0; i < itemsArr.length; i++) {
            console.log(idx);
            var status = '' , color = `${color1[idx]};` , text = 'Done' , clor = '#212121' , opq = 1;
            if (itemsArr[i].status == 1) {
                status = 'class="done"';
                color = `${color2}`;
                text = 'Undo';
                clor = '#958e8e;';
                opq = 1;
            }

            newItemHTML += `<li style="background-color: ${color}; opacity:${opq}; animation: animate .5s forwards " data-itemindex="${i}" ${status}>
        <span style="color:${clor}" class="item">${itemsArr[i].item}</span>
        <div class="option"><button id="complete${i}" class="itemComplete">${text}</button><button class="itemDelete">Delete</button></div>

        </li>`;
        idx = idx +1;
        idx = idx%4;
        }

        itemsList.innerHTML = newItemHTML;

        var itemsListUL = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.complete').addEventListener('click', function () {
                var index = this.parentNode.dataset.itemindex;
                itemComplete(index);
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });
        }
    } catch (e) {
    }

}

function itemComplete(index) {
    var itemsStorage = localStorage.getItem(`${category}`);
    var itemsArr = JSON.parse(itemsStorage);
    console.log(itemsArr[index]);
    if(itemsArr[index].status==1){
        itemsArr[index].status = 0;
        document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = '';
        // document.getElementById(`complete${index}`).innerText = "Done";
    }
    else{
        itemsArr[index].status = 1;
        document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = 'done';
        // document.getElementById(`complete${index}`).innerText = "Undo";
    }
    saveItems(itemsArr);
    fetchItems();
}
function itemDelete(index) {

    var itemsStorage = localStorage.getItem(`${category}`);
    var itemsArr = JSON.parse(itemsStorage);
    itemsArr.splice(index, 1);
    saveItems(itemsArr);
    fetchItems();
    //   document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').remove();
}

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem(`${category}`, string);
}
fetchItems();
