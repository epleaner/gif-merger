function getFile(id) {
  return document.getElementById(id).files[0];
}

function toggleSubmit() {
  const backgroundFile = getFile('background');
  const foregroundFile = getFile('foreground');

  document.getElementById('merge-button').disabled = !(backgroundFile && foregroundFile);
}

window.onload = () => {
  document.getElementById('background').onchange = toggleSubmit;
  document.getElementById('foreground').onchange = toggleSubmit;

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
        const response = xhr.responseText;
        debugger;

        // convert to Base64
        var b64Response = btoa(response);

// create an image
        var outputImg = document.createElement('img');
        outputImg.src = 'data:image/png;base64,'+b64Response;

// append it to your page
        document.body.appendChild(outputImg);
      }
    };

    xhr.open('POST', 'http://localhost:3000/api/v1/merge_gifs/', true);
    xhr.withCredentials = true;
    xhr.send(formData);


  });
};