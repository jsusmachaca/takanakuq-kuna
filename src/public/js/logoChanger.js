document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('logo')
  const images = ['/images/logo.1.png', '/images/logo.2.png']
  let index = 0
  setInterval(() => {
    index = (index + 1) % images.length
    logo.style.opacity = 0
    setTimeout(() => {
      logo.src = images[index]
      logo.style.opacity = 1
    }, 2000)
  }, 10000)
})