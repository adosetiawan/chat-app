let _url = "https://my-json-server.typicode.com/adosetiawan/belajar-pwa/product";
let listUser = document.querySelector('#list-user');
let media = document.querySelectorAll('.media');
let chtText = document.querySelector('#cht-text');
let chtDisplay = document.querySelector('.conversation-list');
let chtSubmit = document.querySelector('#cht-submit');
let btnCache = document.querySelector('#btn-add-cache');

let database = firebase.database();
let rootRef = database.ref('users');
let chtRef = database.ref('chat');
let configmsg = {
        to:'',
        me:'',
        url_img:''
    };

rootRef.orderByKey().on('value', snapshot => {
    let user = '';
    //console.log(snapshot.val());
    snapshot.forEach(nama => {
        user += `<a href="javascript:void(0);" class="text-body">
                        <div class="media p-2" >
                            <img src="${nama.val().img_url}" id="user-img" class="mr-2 rounded-circle" height="48" alt="Shreyu N" />
                            <div class="media-body">
                                <h5 class="mt-0 mb-0 font-14">
                                    <span class="float-right text-muted font-12">5:30am</span>
                                    <p id="user-nama">${nama.val().nama}</p>
                                </h5>
                                <p class="mt-1 mb-0 text-muted font-14">
                                    <span class="w-75">Hey! a reminder for tomorrow's meeting...</span>
                                </p>
                            </div>
                        </div>
                    </a>`;
    });
    listUser.innerHTML = user;

    let active = listUser.querySelectorAll('.media');
    active.forEach(function (item) {
        item.addEventListener('click', function () {
            active.forEach(function(e){
                e.classList.remove('bg-light');
            });
            this.classList.add('bg-light');
            configmsg.to = this.querySelector('#user-nama').innerHTML;
            configmsg.url_img = this.querySelector('#user-img').getAttribute('src');
        });

    });
});

function addUser() {
    rootRef.child('mamat').set({
        nama: 'mamat',
        nohp: '085320059831',
        alamat: 'tasikmalaya'
    });
}

chtSubmit.addEventListener('click', (e) => {
    e.preventDefault();
  if(chtText.value != '' && configmsg.to != ''){
    let idchat = chtRef.push().key;
    //chtRef.child(idchat).set({
    chtRef.child(idchat).set({
        name: configmsg.to,
        chat: chtText.value,
        user_img:configmsg.url_img
    }, (error) => {
        if (error) {
            //console.log('erroe');
        } else {
            //console.log('succeess');
        }
    });
  }
});

chtRef.on('child_added', snapshot => {
   let text = snapshot;
     renderChat(text,(calback) => {
     chtDisplay.innerHTML += calback;
     updateScroll();
   });
}, (error) => {
    if (error) {
        console.log('pesan gagal disimpan');
    } else {
        console.log('pesan berhaisl disimpan')
    }
});

function renderChat(chat,calback){
    //console.log(chat);
    chtText.value = '';
    let msg = '';
        msg += `<li class="clearfix">
                    <div class="chat-avatar">
                        <img src="${chat.val().user_img || 'https://jenepontokab.go.id/images/user.png'}" class="rounded" alt="${chat.val().name}" />
                        <i>10:00</i>
                    </div>
                    <div class="conversation-text">
                        <div class="ctext-wrap" id="text${chat.key}">
                            <p>
                                ${chat.val().chat || 'pesan gagal dimuat'}
                            </p>
                        </div>
                    </div>
                    <div class="conversation-actions dropdown">
                        <button class="btn btn-sm btn-link" data-toggle="dropdown"
                            aria-expanded="false"><i class='uil uil-ellipsis-v'></i></button>

                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#">Copy Message</a>
                            <a class="dropdown-item" href="#">Edit</a>
                            <button class="dropdown-item" data-key="${chat.key}" onclick="delMSG(this)">Delete</button>
                        </div>
                    </div>
                </li>`;
    calback(msg);
}
function delMSG(key){
    let chatId = key.getAttribute('data-key')
    //e.preventDefault();
    chtRef.child(chatId).remove()
    .then((success)=>{
        
    }).catch((error)=>{
        console.error(error)
    });
    chtRef.on('child_removed',snapshoot => {
        console.log(snapshoot);
        chtDisplay.querySelector(`#text${snapshoot.key}`).innerHTML = 'pesan telash dihapus';
    });
}
function updateScroll(){
    chtDisplay.scrollTop = chtDisplay.scrollHeight;
}


//ambil cache online 

let networkDataRecived = false;

let networkUpdate = fetch(_url).then(function(response){
    return response.json();
}).then(function (data) {
    networkDataRecived = true;
    console.log('dari online');
    console.log(data);
});


caches.match(_url).then(function (respon) {
    if(!respon)throw Error('tidak ada data di cache');
    return respon.json();
}).then(function (data) {
    if(!networkDataRecived){
        console.log('dari cache');
        console.log(data);
    }
}).catch(function () {
    return networkUpdate;
});

btnCache.addEventListener('click',(e)=>{
    fetch(_url).then(function(response){
        return response.json();
    }).then(function (data) {
        networkDataRecived = true;
        console.log(data);
    });
})
// self.addEventListener('fetch',function(event){
//     console.log(event.request)
//     event.respondWith(
//         caches.open('my-dynamic-cache').then(function (cache) {
//             return cache.match(event.request).then(function(response){
//                 return response || fetch(event.request).then(function (response) {
//                     cache.put(event.request,response.clone());
//                     return response;
//                 })
//             });
//         })
//     )
// });

// simpan.addEventListener('click',(e)=>{
//     e.preventDefault();
//     let autoId = rootRef.push().key;
//     rootRef.child(userid.value).set({
//         username:username.value,
//         password:password.value
//     });
// });

//update data
//  update.addEventListener('click',(e)=>{
//     e.preventDefault();
//     let newData = {
//         username:username.value,
//         password:password.value
//     }
//     const update = {};
//     update['/users/'+userid.value] = newData;
//     database.ref().update(update);
//  });

 //hapus data
//  hapus.addEventListener('click',(e)=>{
//     e.preventDefault();
//     rootRef.child(userid.value).remove()
//     .then((success)=>{
//         alert('success');
//         console.log(success)
//     }).catch((error)=>{
//         console.error(error)
//         alert('error');
//     });
// });

//hapus respon
// rootRef.on('child_removed',snapshot=>{
//     console.log('remove');
// });

//respon tambah
// rootRef.on('child_added',snapshot=>{
//     console.log('added');
// });

//respon perubahan
// rootRef.on('child_changed',snapshot=>{
//     console.log('changed');
// });

//respon setiap aksi perubahan di database
// rootRef.on('value',snapshot=>{
//     console.log('peruabahna');
// });

//get data
// rootRef.orderByKey().on('value',snapshot=>{
//     console.log(snapshot.val());

// });

//mengambil data pertama 
// rootRef.orderByChild('username').limitToFirst(1).on('value',snapshot=>{
//     console.log(snapshot.val());

// });

//mengambil data akhir
// rootRef.orderByChild('username').limitToLast(1).on('value',snapshot=>{
//     console.log(snapshot.val());

// });

//mengambil data dengan key dari value
// rootRef.orderByChild('username').equalTo('tes').on('value',snapshot=>{
//     console.log(snapshot.val());

// });