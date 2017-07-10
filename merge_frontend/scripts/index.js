function getFile(id) {
  return document.getElementById(id).files[0];
}

function onFileInputChange(changeEvent) {
  toggleSubmit();

  const reader = new FileReader();

  reader.onload = function (e) {
    const gif = document.createElement('img');
    gif.classList.add('gif-preview');
    gif.src = e.target.result;

    changeEvent.target.parentNode.append(gif);
  };

  reader.readAsDataURL(changeEvent.target.files[0]);
}

function toggleSubmit() {
  const backgroundFile = getFile('background');
  const foregroundFile = getFile('foreground');

  document.getElementById('merge-button').disabled = !(backgroundFile && foregroundFile);
}

window.onload = () => {
  document.getElementById('background').onchange = onFileInputChange;
  document.getElementById('foreground').onchange = onFileInputChange;

  document.getElementById('merge-button').addEventListener('click', () => {
    const backgroundFile = getFile('background');
    const foregroundFile = getFile('foreground');
    const replaceColor = document.getElementById('replace-color').value;

    const formData = new FormData();
    formData.append("background", backgroundFile);
    formData.append("foreground", foregroundFile);
    formData.append("color", replaceColor);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const blob = xhr.response;

        const bytes = new Uint8Array(blob);
        let binaryText = '';

        for (let index = 0; index < bytes.byteLength; index++) {
          binaryText += String.fromCharCode(bytes[index]);
        }

        const b64Response = btoa(binaryText);

        const gif = document.createElement('img');
        gif.src = 'data:image/gif;base64,'+ b64Response;
        document.body.appendChild(gif);
      }
    };

    xhr.open('POST', 'http://localhost:3000/api/v1/merge_gifs/', true);
    xhr.withCredentials = true;
    xhr.responseType = 'arraybuffer';
    xhr.send(formData);
  });
};