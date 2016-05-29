module.exports = class Boxlight {

  constructor(imageUrls) {
    this.initialized = false
    this.isLoading = true
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

  endLoading() {
    this.loading = false
    this.loader.style.opacity = 0
  }

  setLoading() {
    this.loading = true
    this.loader.style.opacity = 1
  }

  displayImage(src) {
    this.target.style.backgroundImage = `url(${src})`
    this.target.style.opacity = 1
  }

  prev() {
    if (this.loading) {
      return
    }
    const prevIndex = this.getPrevIndex(this.index)
    this.goToImage(prevIndex)
  }

  getPrevIndex(index) {
    return index === 0 ? this.images.length - 1 : index - 1
  }

  next() {
    if (this.loading) {
      return
    }
    const nextIndex = this.getNextIndex(this.index)
    this.goToImage(nextIndex)
  }

  getNextIndex(index) {
    return index === this.images.length - 1 ? 0 : index + 1
  }

  goToImage(goToIndex) {
    const image = this.getImage(goToIndex)
    if (image.loaded) {
      this.index = goToIndex
      return this.displayImage(image.data.src)
    } else {
      this.setLoading()
      this.loadImage(goToIndex).then(src => {
        this.loading = false
        this.index = goToIndex
        this.endLoading()
        this.displayImage(src)
      })
    }
  }

  loadImage(index, shouldLoadNeighbors = true) {
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

      // Optimistically load the next and previous images in the set
      if (shouldLoadNeighbors) {
        this.loadNeighbors(index)
      }
    })
  }

  loadNeighbors(index) {
    const prevIndex = this.getPrevIndex(index)
    const nextIndex = this.getNextIndex(index)

    this.loadImage(prevIndex, false)
    this.loadImage(nextIndex, false)
  }

  loadInitialImage() {
    this.loadImage(0).then(src => {
      this.initialized = true
      this.endLoading()
      this.displayImage(src)
    })
  }

}
