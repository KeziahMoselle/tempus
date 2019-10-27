fetch('https://api.github.com/repos/KeziahMoselle/tempus/releases/latest')
  .then(response => response.json())
  .then(({ name, assets, body }) => {
    checkFromVersion(name, body)
    updateDownloadLinks(assets)
  })


  function updateDownloadLinks (assets) {
    let windowsLink
    let macosLink
    let linuxLink

    assets.forEach(asset => {
      if (asset.browser_download_url.endsWith('dmg')) {
        macosLink = asset.browser_download_url
      } else if (asset.browser_download_url.endsWith('exe')) {
        windowsLink = asset.browser_download_url
      } else if (asset.browser_download_url.endsWith('deb')) {
        linuxLink = asset.browser_download_url
      } 
    })

    const windowsAnchors = document.getElementsByClassName('win-link')
    const macosAnchors = document.getElementsByClassName('mac-link')
    const linuxAnchors = document.getElementsByClassName('linux-link')

    for (const anchor of windowsAnchors) {
      anchor.href = windowsLink
    }

    for (const anchor of macosAnchors) {
      anchor.href = macosLink
    }

    for (const anchor of linuxAnchors) {
      anchor.href = linuxLink
    }
  }

  function checkFromVersion (name, body) {
    if (window.location.search.startsWith('?from=')) {
      const [, version] = window.location.search.split('=')
      document.querySelector('h1').innerHTML = `Tempus <code class="old">${name}</code>`
      document.querySelector('.hero h2').insertAdjacentHTML('afterend', `
        <h3>Your version : ${version}</h3>
      `)
      document.querySelector('.hero .flex.center').insertAdjacentHTML('afterend', `
        <div class="flex center">
          <div class="changelog">
            ${markdown.toHTML(body)}
          </div>
        </div>
      `)
    } else {
      document.querySelector('h1').innerHTML = `Tempus <code>${name}</code>`
    }
  }