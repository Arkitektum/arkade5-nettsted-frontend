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
  downloadDialogSubmitButton.innerHTML = "<span>LAST NED SISTE VERSJON</span>";

  downloadDialogCancelButton.style.innerHTML = "<span>AVBRYT</span>";

  warnIfOldArkadeVersionIsSelected();

  validateForm();
}

const hideDownloadDialog = () => {
  const modalElement = document.getElementById("downloadDialog");
  modalElement.classList.remove("active");
}

const showMapModal = () => {
  const modalElement = document.getElementById("map-modal");
  modalElement.classList.add("active");
}

const hideMapModal = () => {
  const modalElement = document.getElementById("map-modal");
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
  const regex = /^(?:[æøåa-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[æøåa-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[æøåa-z0-9](?:[æøåa-z0-9-]*[æøåa-z0-9])?\.)+[æøåa-z0-9](?:[æøåa-z0-9-]*[æøåa-z0-9])?)$/igm;
  return regex.exec(email) !== null;
}

const handleDownloadStart = () => {
  const downloadDialogSubmitButton = document.getElementById('downloadDialogSubmit');
  downloadDialogSubmitButton.disabled = true;
  downloadDialogSubmitButton.innerHTML = "<span>LASTER NED</span>";
}

const handleDownloadFinished = () => {
  const downloadDialogSubmitButton = document.getElementById('downloadDialogSubmit');
  const downloadDialogCancelButton = document.getElementById('downloadDialogCancel');

  downloadDialogSubmitButton.style.display = "none";
  downloadDialogCancelButton.innerHTML = "<span>LUKK</span>";

}

const postUserInfo = userInfo => {
  const apiSubdomain = 'backend';
  const apiHost = `${window.location.protocol}//${apiSubdomain}.${window.location.hostname}`;
  const apiUrl = `${apiHost}/api/arkade-downloads`;
  return fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      const filename = response.headers.get('Filename');
      response.blob().then(blob => {
        download(blob, filename);
        handleDownloadFinished();
      });
    } else {
      handleDownloadFinished();
      console.error('Download error');
      let downloadInfoElement = document.getElementById('download-info');
      downloadInfoElement.innerText = 'Nedlasting mislyktes (' + response.statusText + ')';
    }
  }).catch(error => {
    handleDownloadFinished();
    console.error('Download error');
    let downloadInfoElement = document.getElementById('download-info');
    downloadInfoElement.innerText = 'Nedlasting mislyktes (' + error.message + ')';
  })
};



const handleDownloadDialogSubmit = () => {

  handleDownloadStart();

  const arkadeUI = document.getElementById("downloadDialogApplicationType").value;
  const arkadeVersion = document.getElementById("arkadeVersion").value;
  const downloaderEmail = document.getElementById("userEmail").value;
  const downloaderNews = document.getElementById("userNews").checked;
  const orgNumber = document.getElementById("organizationNumber").value;
  const isAutomated = false;

  const postData = {
  	"arkadeUI": arkadeUI === "cli" ? "CLI" : "GUI",
    arkadeVersion,
  	downloaderEmail,
  	"downloaderNews": downloaderNews ? "1" : "0",
  	orgNumber,
    isAutomated
  };
  postUserInfo(postData)
}

const getArkadeVersionNumbers = () => {
    const apiSubdomain = 'backend';
    const apiHost = `${window.location.protocol}//${apiSubdomain}.${window.location.hostname}`;
    const apiUrl = `${apiHost}/api/arkade-versions`;

    return fetch(apiUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
}

getArkadeVersionNumbers().then(versionNumbers => {
  const selectBox = document.getElementById('arkadeVersion');
  versionNumbers.forEach(versionNumber => {
    const option = document.createElement('option');
    option.setAttribute('value', versionNumber);
    option.innerText = versionNumber;
    selectBox.append(option);
  });
});

function warnIfOldArkadeVersionIsSelected() {
  const selectBox = document.getElementById('arkadeVersion');
  let downloadInfoElement = document.getElementById('download-info');
  const downloadDialogSubmitButton = document.getElementById('downloadDialogSubmit');
  if (selectBox.value !== selectBox.options[0].value) {
    downloadInfoElement.innerText = "NB! En eldre Arkade-versjon er valgt.";
    downloadDialogSubmitButton.innerHTML = "<span>Last ned</span>";
  } else {
    downloadInfoElement.innerText = '';
    downloadDialogSubmitButton.innerHTML = "<span>Last ned siste versjon</span>";
  }
}
