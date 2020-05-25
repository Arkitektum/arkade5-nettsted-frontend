const md = window.markdownit();

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

  modalElement.classList.add("active");
  applicationTypeInput.value = applicationType;
}

const hideDownloadDialog = () => {
  const modalElement = document.getElementById("downloadDialog");
  modalElement.classList.remove("active");
}

const toggleExpand = (elementId, target) => {
  console.log(target);
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

validateForm = () => {
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
