module.exports = class Boxlight {

  constructor(imageUrls) {
    this.initialized = false
    this.images = imageUrls.map(url => ({
      url: url,
      data: new Image(),
      index: 0,
      loaded: 0,
    }))
    this.index = 0
    this.target = document.getElementById('boxlight')
    this.loader = document.getElementById('loader')

    this.loadInitialImage()
  }

  getImage(index) {
    return this.images[index]
  }

  hideLoader() {
    this.loader.style.opacity = 0
  }

  setImage(src) {
    this.target.style.backgroundImage = `url(${src})`
    this.target.style.opacity = 1
  }

  loadImage(index) {
    return new Promise((resolve) => {
      const image = this.images[index]
      if (image.loaded) {
        return resolve(image.data.src)
      }

      // Set the source to the url, beginning the load
      image.data.src = image.url
      image.data.onload = function() {
        image.loaded = true
        resolve(this.src)
      }
    })
  }

  loadInitialImage() {
    this.loadImage(0).then(src => {
      this.initialized = true
      this.hideLoader()
      this.setImage(src)
      console.log('LOADED', src)
    })
  }

}
