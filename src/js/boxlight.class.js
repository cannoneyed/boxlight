module.exports = class Boxlight {

  constructor(imageUrls) {
    this.isLoading = true
    this.images = imageUrls.map((url, index) => ({
      url: url,
      data: new Image(),
      index,
      loaded: 0,
    }))
    this.index = Math.floor(Math.random() * this.images.length)
    this.target = document.getElementById('boxlight')
    this.loader = document.getElementById('loader')

    this.loadInitialImage()
  }

  setLoadingState(isLoading) {
    this.loading = isLoading
    this.loader.style.opacity = isLoading ? 1 : 0
  }

  setDisplayImageSource(src) {
    this.target.style.backgroundImage = `url(${src})`
    this.target.style.opacity = 1
  }

  prev() {
    const prevIndex = this.getPrevIndex(this.index)
    this.goToImage(prevIndex)
  }

  getPrevIndex(index) {
    return index === 0 ? this.images.length - 1 : index - 1
  }

  next() {
    const nextIndex = this.getNextIndex(this.index)
    this.goToImage(nextIndex)
  }

  getNextIndex(index) {
    return index === this.images.length - 1 ? 0 : index + 1
  }

  goToImage(goToIndex) {
    // Disable skipping ahead past a loading image, for simplicity's sake
    if (this.loading) {
      return
    }

    const image = this.images[goToIndex]
    if (image.loaded) {
      this.index = goToIndex
      return this.setDisplayImageSource(image.data.src)
    }

    this.setLoadingState(true)
    this.loadImage(goToIndex).then(src => {
      this.loading = false
      this.index = goToIndex
      this.setLoadingState(false)
      this.setDisplayImageSource(src)
    })
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
    const initialIndex = this.index
    this.loadImage(initialIndex).then(src => {
      this.setLoadingState(false)
      this.setDisplayImageSource(src)
    })
  }
}
