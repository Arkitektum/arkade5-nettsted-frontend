const postUserInfo = userInfo => {
  const apiUrl = 'https://backend.arkade.arkitektum.no/api/arkade-downloads';
  try {
    return fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      const filename = response.headers.get('Filename');
      response.blob().then(blob => {
        download(blob, filename);
      });
    })
  } catch (error) {
    console.error('Error:', error);
  }
};
