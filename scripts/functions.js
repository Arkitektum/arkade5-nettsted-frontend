const md = window.markdownit();

const validateForm = () => {
  const userEmailField = document.getElementById("userEmail");
  const userEmailValue = userEmailField.value;
  const userEmailIsValid = validateEmailField(userEmailValue);

  const fieldValidationStatuses = [userEmailIsValid];

  const allFieldsAreValid = fieldValidationStatuses.every(valuesIsTrue);

  const downloadDialogSubmitButton = document.getElementById("downloadDialogSubmit");

  if (allFieldsAreValid) {
    downloadDialogSubmitButton.disabled = false;
  } else {
    downloadDialogSubmitButton.disabled = true;
  }
}

const toggleActiveClass = elementId => {
  const element = document.getElementById(elementId);
  element.classList.toggle("active");
}

const createReleaseElement = (release, defaultExpanded) => {
  let releaseElement = document.createElement("DIV");
  releaseElement.setAttribute("id", release.id);
  releaseElement.setAttribute("class", 'accordionElement');

  let releaseTitle = document.createElement("H4");
  releaseTitle.setAttribute("class", "accordionElementTitle");
  releaseTitle.innerHTML = release.name;

  let releaseBody = document.createElement("DIV");
  releaseBody.setAttribute("class", "accordionElementBody");
  releaseBody.innerHTML = md.render(release.body);

  releaseElement.appendChild(releaseTitle);
  releaseElement.appendChild(releaseBody);

  return releaseElement;
}

const getDownloadLink = applicationType => {
  getLatestRelease("arkivverket", "arkade5").then(latestRelease => {
    console.log(latestRelease);
  });
}

const showDownloadDialog = applicationType => {
  const modalElement = document.getElementById("downloadDialog");
  const applicationTypeInput = document.getElementById("downloadDialogApplicationType");
  const downloadDialogSubmitButton = document.getElementById('downloadDialogSubmit');
  const downloadDialogCancelButton = document.getElementById('downloadDialogCancel');

  modalElement.classList.add("active");
  applicationTypeInput.value = applicationType;

  downloadDialogSubmitButton.style.display = "inline-block";
  downloadDialogSubmitButton.innerHTML = "<span>LAST NED</span>";

  downloadDialogCancelButton.style.innerHTML = "<span>AVBRYT</span>";

  validateForm();
}

const hideDownloadDialog = () => {
  const modalElement = document.getElementById("downloadDialog");
  modalElement.classList.remove("active");
}

const toggleExpand = (elementId, target) => {
  const element = document.getElementById(elementId);

  if (target.classList.contains('active')){
    target.classList.remove('active');
    element.classList.add('collapsed');
  }else {
    target.classList.add('active');
    element.classList.remove('collapsed');
  }
}

const valuesIsTrue = (value) => value === true;

const validateEmailField = email => {
  const regex = /(?:[æøåa-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[æøåa-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[æøåa-z0-9](?:[æøåa-z0-9-]*[æøåa-z0-9])?\.)+[æøåa-z0-9](?:[æøåa-z0-9-]*[æøåa-z0-9])?)/gm;
  return regex.exec(email) !== null;
}

const handleDownloadStart = () => {
  const downloadDialogSubmitButton = document.getElementById('downloadDialogSubmit');
  downloadDialogSubmitButton.disabled = true;
  downloadDialogSubmitButton.innerHTML = "<span>LASTER NED</span>";
}

const handleDownloadSuccess = () => {
  const downloadDialogSubmitButton = document.getElementById('downloadDialogSubmit');
  const downloadDialogCancelButton = document.getElementById('downloadDialogCancel');

  downloadDialogSubmitButton.style.display = "none";
  downloadDialogCancelButton.innerHTML = "<span>LUKK</span>";

}

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
      handleDownloadStart();
      const filename = response.headers.get('Filename');
      response.blob().then(blob => {
        handleDownloadSuccess();
        download(blob, filename);
      });
    })
  } catch (error) {
    console.error('Error:', error);
  }
};



const handleDownloadDialogSubmit = () => {
  const arkadeUI = document.getElementById("downloadDialogApplicationType").value;
  const downloaderEmail = document.getElementById("userEmail").value;
  const downloaderA1Xp = document.getElementById("userA1Xp").checked;
  const downloaderNews = document.getElementById("userNews").checked;
  const orgName = document.getElementById("organizationName").value;
  const orgNumber = document.getElementById("organizationNumber").value;
  const orgForm = document.getElementById("organizationType").value;
  const orgAddress = document.getElementById("organizationAddress").value;

  const postData = {
  	"arkadeUI": arkadeUI === "cli" ? "CLI" : "GUI",
  	downloaderEmail,
  	"downloaderA1Xp": downloaderA1Xp ? "1" : "0",
  	"downloaderNews": downloaderNews ? "1" : "0",
    orgName,
  	orgNumber,
  	orgForm,
  	orgAddress
  };
  postUserInfo(postData)
}
