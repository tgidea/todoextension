document.querySelector('#textBox').addEventListener('keypress', checkUpdate2);
document.querySelector('#btn').addEventListener('click', checkUpdate);
function checkUpdate2(e){
    if(e.key=='Enter'){
        checkUpdate();
    }
}
function checkUpdate() {
    var itemName = document.querySelector('.new-item input').value;
    console.log(itemName);
    if (itemName != '') {

        var itemsStorage = localStorage.getItem('todo-items');
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
        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr
        if (itemsStorage == undefined || itemsStorage.length < 1) {
            itemsArr = [];
        }
        else {
            itemsArr = JSON.parse(itemsStorage);
        }
        var color1 = ['rgb(91, 121, 230)',' rgb(230, 91, 207)',' rgb(203, 186, 40)', 'rgb(213, 140, 58)'];
        let x = Math.floor(Math.random()*10);
        let idx = x%4;
        for (var i = 0; i < itemsArr.length; i++) {
            console.log(idx);
            var status = '';
            if (itemsArr[i].status == 1) {
                status = 'class="done"';
            }
            newItemHTML += `<li style="background-color : ${color1[idx]};" data-itemindex="${i}" ${status}>
        <span class="item">${itemsArr[i].item}</span>
        <div class="option"><button class="itemComplete">Done</button><button class="itemDelete">Delete</button></div>
        </li>`;
        idx = idx +1;
        idx = idx%4;
        }

        itemsList.innerHTML = newItemHTML;

        var itemsListUL = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
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

    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);
    itemsArr[index].status = 1;
    saveItems(itemsArr);
    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = 'done';

}
function itemDelete(index) {

    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);
    itemsArr.splice(index, 1);
    saveItems(itemsArr);
    fetchItems()
    //   document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').remove();
}

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem('todo-items', string);
}
fetchItems();
