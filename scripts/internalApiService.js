const postUserInfo = userInfo => {
  const apiUrl = 'https://arkade.arkitektum.no/api/arkade-downloads';
  let filename = '';
  try {
    return fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
       'Content-Type': 'application/json'
     }
   }).then(response => {
    filename = response.headers.get('Filename');
     response.blob()
   }).then(blob => {
      download(blob, filename);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
