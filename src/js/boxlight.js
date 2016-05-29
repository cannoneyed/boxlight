module.exports = (imageUrls) => {
  // Declare closure-scoped variables
  const state = {
    isLoading: true,
    // Set the currentIndex to a random position in the images array
    currentIndex: Math.floor(Math.random() * imageUrls.length),
  }

  // Map the imageUrls to image objects, with Image data holders
  let images = imageUrls.map(url => ({
    url,
    data: new Image(),
    loaded: 0,
  }))

  // Define the DOM Element targets
  const target = document.getElementById('boxlight')
  const loader = document.getElementById('loader')

  loadInitialImage()

  // Return an object with exposed methods
  return {
    prev,
    next,
  }

  // Internal methods
  function setLoadingState(isLoading) {
    state.isLoading = isLoading
    loader.style.opacity = isLoading ? 1 : 0
  }

  function setDisplayImageSource(src) {
    target.style.backgroundImage = `url(${src})`
    target.style.opacity = 1
  }

  function prev() {
    const prevIndex = getPrevIndex(state.currentIndex)
    goToImage(prevIndex)
  }

  function next() {
    const nextIndex = getNextIndex(state.currentIndex)
    goToImage(nextIndex)
  }

  function goToImage(index) {
    // Disable skipping ahead past a loading image, for simplicity's sake
    if (state.isLoading) {
      return
    }

    const image = images[index]
    // In case the image data is already loaded, simply set the imageSource
    if (image.loaded) {
      state.currentIndex = index
      return setDisplayImageSource(image.data.src)
    }

    setLoadingState(true)
    loadImageData(index).then(src => {
      state.currentIndex = index
      setLoadingState(false)
      setDisplayImageSource(src)
    })
  }

  function loadImageData(index, shouldLoadNeighbors = true) {
    return new Promise(resolve => {
      const image = images[index]
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
        loadNeighbors(index)
      }
    })
  }

  function loadNeighbors(index) {
    const prevIndex = getPrevIndex(index)
    const nextIndex = getNextIndex(index)

    loadImageData(prevIndex, false)
    loadImageData(nextIndex, false)
  }

  function loadInitialImage() {
    loadImageData(state.currentIndex).then(src => {
      setLoadingState(false)
      setDisplayImageSource(src)
    })
  }

  // Helper methods
  function getPrevIndex(index) {
    return index === 0 ? images.length - 1 : index - 1
  }

  function getNextIndex(index) {
    return index === images.length - 1 ? 0 : index + 1
  }
}
