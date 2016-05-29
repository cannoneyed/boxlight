const querystring = require('querystring')
const initializeBoxlight = require('./boxlight')

const apiKey = 'bc01c649f92a965db1fb2df48fbd4225'
const galleryId = '72157669024463295'

document.addEventListener('DOMContentLoaded', function() {
  loadGallery(galleryId)
    .then(imageUrls => {
      const boxlight = initializeBoxlight(imageUrls)

      // Set up our navigation links
      document.getElementById('prev').addEventListener('click', boxlight.prev)
      document.getElementById('next').addEventListener('click', boxlight.next)
    })
})

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
