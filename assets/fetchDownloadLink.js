fetch('https://api.github.com/repos/KeziahMoselle/tempus/releases/latest')
  .then(response => response.json())
  .then(({ assets }) => {
    let windowsLink
    let macosLink

    assets.forEach(asset => {
      if (asset.browser_download_url.endsWith('dmg')) {
        macosLink = asset.browser_download_url
      } else if (asset.browser_download_url.endsWith('exe')) {
        windowsLink = asset.browser_download_url
      }
    })

    const windowsAnchor = document.getElementsByClassName('win-link')
    const macosAnchor = document.getElementsByClassName('mac-link')

    for (let i = 0; i < windowsAnchor.length; i++) {
      const element = windowsAnchor[i]
      element.href = windowsLink
    }

    for (let i = 0; i < macosAnchor.length; i++) {
      const element = macosAnchor[i]
      element.href = macosLink
    }
  })