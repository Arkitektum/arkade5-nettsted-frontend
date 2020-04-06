const md = window.markdownit();

const toggleActiveClass = elementId => {
  const element = document.getElementById(elementId);
  element.classList.toggle("active");
}

const createReleaseElement = (release, defaultExpanded) => {
  let releaseElement = document.createElement("DIV");
  releaseElement.setAttribute("id", release.id);
  releaseElement.setAttribute("class", 'accordionElement');
  if (defaultExpanded) {
    releaseElement.classList.toggle("active")
  };

  let releaseTitle = document.createElement("H3");
  releaseTitle.setAttribute("class", "accordionElementTitle");
  releaseTitle.innerHTML = release.name;
  releaseTitle.setAttribute("onclick", `toggleActiveClass(${release.id})`);

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

const showPreviousReleases = () => {
  const previousReleasesElement = document.getElementById("previousReleasesListContainer");
  const showPreviousReleasesButtonElement = document.getElementById("showPreviousReleasesButton");
  const hidePreviousReleasesButtonElement = document.getElementById("hidePreviousReleasesButton");

  previousReleasesElement.classList.remove("collapsed")
  showPreviousReleasesButtonElement.classList.add("hidden")
  hidePreviousReleasesButtonElement.classList.remove("hidden")
}

const hidePreviousReleases = () => {
  const previousReleasesElement = document.getElementById("previousReleasesListContainer");
  const showPreviousReleasesButtonElement = document.getElementById("showPreviousReleasesButton");
  const hidePreviousReleasesButtonElement = document.getElementById("hidePreviousReleasesButton");

  previousReleasesElement.classList.add("collapsed")
  showPreviousReleasesButtonElement.classList.remove("hidden")
  hidePreviousReleasesButtonElement.classList.add("hidden")
}
