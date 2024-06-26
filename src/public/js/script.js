document.addEventListener('DOMContentLoaded', () => {
  if (window.location.href === `${window.location.protocol}//${window.location.host}/`) {
    const page = document.getElementById('about')
    page.classList.add('cur-page')
  } else if (window.location.href === `${window.location.protocol}//${window.location.host}/docs`) {
    const page = document.getElementById('docs')
    page.classList.add('cur-page')
  }
  const $cli = document.querySelectorAll('.cli')
  $cli.forEach(cli => {
    cli.addEventListener('click', () => {
      navigator.clipboard.writeText(cli.textContent)
        .then(() => window.alert('Text copied to clipboard'))
        .catch(err => console.error('Failed to copy text: ', err))
    })
  })
})
