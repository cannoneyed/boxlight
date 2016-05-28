const _ = require('lodash')
const querystring = require('querystring')

const apiKey = 'bc01c649f92a965db1fb2df48fbd4225'

document.addEventListener('DOMContentLoaded', function() {
  loadImages()
})

function loadImages() {
  const baseUrl = 'https://api.flickr.com/services/rest'
  const queryParams = {
    method: 'flickr.galleries.getPhotos',
    gallery_id: '72157657748553665',
    apiKey: apiKey,
    format: 'json'
  }

  const url = `${baseUrl}/${querystring.stringify(queryParams)}`

  console.log(url)
}
