const _ = require('lodash')
const querystring = require('querystring')

const apiKey = 'bc01c649f92a965db1fb2df48fbd4225'
const galleryId = '72157669024463295'

document.addEventListener('DOMContentLoaded', function() {
  // Set up our navigation links
  document.getElementById('prev').addEventListener('click', goToNext)
  document.getElementById('next').addEventListener('click', goToPrev)


  loadGallery(galleryId)
    .then(imageUrls => {
      const initialImageUrl = imageUrls[0]

      const loadingImage = new Image()
      loadingImage.src = initialImageUrl

      loadingImage.onload = function() {
        hideLoader()
        setFullscreenImage(this.src)

        // fullscreen.style.backgroundColor = 'red'
        console.log(fullscreen)
        console.log('HEY!')
      }
    })
})

function goToNext() {
  console.log('🐸')
}

function goToPrev() {
  console.log('🐷')
}

function hideLoader() {
  const loader = document.getElementById('loader')
  loader.style.opacity = 0
}

function setFullscreenImage(url) {
  const fullscreen = document.getElementById('fullscreen')
  fullscreen.style.backgroundImage = `url(${url})`
  fullscreen.style.opacity = 1
}

function loadGallery(galleryId) {
  const baseUrl = 'https://api.flickr.com/services/rest'
  const queryParams = {
    method: 'flickr.galleries.getPhotos',
    gallery_id: galleryId,
    api_key: apiKey,
    format: 'json',
    nojsoncallback: 1,
    extras: 'original_format',
  }

  const url = `${baseUrl}/?${querystring.stringify(queryParams)}`

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const photos = data.photos
      const imageUrls = photos.photo.map(constructImageUrl)
      return imageUrls
    })
}

function constructImageUrl(imageObj) {
  const { farm, server, id, originalsecret } = imageObj
  const imageUrl = `https://farm${farm}.staticflickr.com/${server}/${id}_${originalsecret}_o.jpg`
  return imageUrl
}
