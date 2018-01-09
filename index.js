const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();
const fileInputEl = document.querySelector('.file-form__input');
const imageListEl = document.querySelector('.image-list');

auth.onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    document.body.classList.add('authed');
  } else {
    document.body.classList.remove('authed');
  }
});

document.querySelector('.login-form__google-btn').addEventListener('click', e => {
  auth.signInWithPopup(provider);
});

document.querySelector('.logout-form__btn').addEventListener('click', e => {
  auth.signOut();
})

document.querySelector('.file-form__submit').addEventListener('click', async e => {
  const file = fileInputEl.files[0];
  if (file) {
    const uid = auth.currentUser.uid;
    const time = new Date().getTime();
    const snapshot = await storage.ref(`/images/${uid}:${time}`).put(file);
    const downloadURL = snapshot.downloadURL;
    await database.ref('/images').push({
      downloadURL
    })
    fileInputEl.value = '';
  } else {
    alert('파일을 선택해주세요.');
  }
})

database.ref('/images').on('value', snapshot => {
  const data = snapshot.val();
  if (data) {
    imageListEl.innerHTML = '';
    for (let [key, {downloadURL}] of Object.entries(data)) {
      const imageEl = document.createElement('img');
      imageEl.classList.add('image-list__item');
      imageEl.src = downloadURL;
      imageListEl.appendChild(imageEl);
    }
  }
})
