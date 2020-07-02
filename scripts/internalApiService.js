const postUserInfo = userInfo => {
  const apiSubdomain = 'backend';
  const apiHost = `${window.location.protocol}//${apiSubdomain}.${window.location.hostname}`;
  const apiUrl = `${apiHost}/api/arkade-downloads`;
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
