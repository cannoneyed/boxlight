module.exports = (imageData) => {

  // Declare closure-scoped variables
  const state = {
    isLoading: true,
    // Set the currentIndex to a random position in the images array
    currentIndex: Math.floor(Math.random() * imageData.length),
  }

  // Map the imageUrls to image objects, with Image data holders
  let images = imageData.map(({ url, title }) => ({
    url,
    title,
    data: new Image(),
    loaded: 0,
  }))

  // Define the DOM Element targets
  const target = document.getElementById('boxlight')
  const title = document.getElementById('title')
  const loader = document.getElementById('loader')

  loadInitialImage()

  // Return an object with exposed methods
  return {
    prev,
    next,
  }

  // ------------------------------------- Internal methods

  // Set loading state and hide the loader element
  function setLoadingState(isLoading) {
    state.isLoading = isLoading
    loader.style.opacity = isLoading ? 1 : 0
  }

  // Display an image by setting it as the target's background
  function showImage(image) {
    target.style.backgroundImage = `url(${image.src})`
    target.style.opacity = 1
    title.innerHTML = image.title
  }

  // Controls
  function prev() {
    const prevIndex = getPrevIndex(state.currentIndex)
    goToImage(prevIndex)
  }

  function next() {
    const nextIndex = getNextIndex(state.currentIndex)
    goToImage(nextIndex)
  }

  // Navigate to a specific image
  function goToImage(index) {
    // Disable skipping ahead past a loading image, for simplicity's sake
    if (state.isLoading) {
      return
    }

    const image = images[index]
    // In case the image data is already loaded, simply set the imageSource
    if (image.loaded) {
      state.currentIndex = index
      return showImage(image)
    }

    setLoadingState(true)
    loadImageData(index).then(image => {
      state.currentIndex = index
      setLoadingState(false)
      showImage(image)
    })
  }

  // Load image data
  function loadImageData(index, shouldLoadNeighbors = true) {
    return new Promise(resolve => {
      const image = images[index]
      if (image.loaded) {
        return resolve(image)
      }

      // Set the source to the url, beginning the load
      image.data.src = image.url
      image.data.onload = function() {
        image.loaded = true
        image.src = this.src
        resolve(image)
      }

      // Optimistically load the next and previous images in the set
      if (shouldLoadNeighbors) {
        loadNeighbors(index)
      }
    })
  }

  // Optimistically load the previous and next image
  function loadNeighbors(index) {
    const prevIndex = getPrevIndex(index)
    const nextIndex = getNextIndex(index)

    loadImageData(prevIndex, false)
    loadImageData(nextIndex, false)
  }

  function loadInitialImage() {
    loadImageData(state.currentIndex).then(image => {
      setLoadingState(false)
      showImage(image)
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
