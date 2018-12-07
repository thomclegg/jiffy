const API_KEY = "3eGykxyv7UujNgzzLADhfC0VQphaPBG8"

// here we grab our search input
const searchEl = document.querySelector('.search-input')
// here we grab our search hint
const hintEl = document.querySelector('.search-hint')
// here we grab our videos element and append a newly created video into it
const videosEl = document.querySelector('.videos')
// clear search button
const clearEl = document.querySelector('.search-clear')



const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}


function createVideo(src) {
  // createElement lets us create html elements within js
  const video = document.createElement('video')

  // here we can set attributes onto our created element usin dot notation
  video.src = src
  video.muted = true
  video.autoplay = true
  video.loop = true
  video.className = 'video'
  console.log(video);

  return video

}


// show loading spinner when search is in progress
const toggleLoading = state => {
  console.log('we are loading', state);
  // toggle the page loading state between on and off
  if (state) {
    document.body.classList.add('loading')
    searchEl.disabled = true
  } else {
    document.body.classList.remove('loading')
    searchEl.disabled = false
    searchEl.focus()
  }
}


// here we wrap up all of our fetch functionality into its own function
const searchGiphy = searchTerm => {
  toggleLoading(true)
  console.log('search for', searchEl.value)

  // we use backticks for our string so we can embed api key and searchTerm (call different functions)
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`)

    // we use .then to handle the response
    .then(response => {
      // convert response to json
      return response.json()
    })
    // we use .then() again to handle the json data
    .then(json => {
      // 'json' is then a big piece of json daya we can work with

      // here we call randomChoice function to give us back a random result from the array of images
      const gif = randomChoice(json.data)

      const src = gif.images.original.mp4
      console.log(src)

      const video = createVideo(src)

      videosEl.appendChild(video)

      video.addEventListener('loadeddata', event => {
        // adds transition class to a loaded video
        video.classList.add('visible')

        toggleLoading(false)

        document.body.classList.add('has-results')

      })
    })

    .catch(error => {
      // use .catch() to do something if there's an error
      // toggle loading state so its disabled
      toggleLoading(false)

      hintEl.innerHTML = `Nothing found for ${searchTerm}`
    })
}


// here we seperate out our keyup function and we can call to it in various places in our code

const doSearch = event => {
  // here we grab the search inputs value
  const searchTerm = searchEl.value
  // only run our search when the search term is longer than 2 characters - and when they press enter
  // here we set our search hint to show if more than 2 characters are entered
  if (searchTerm.length > 2) {
    // replaces html to include whatever search term the user has entered
    hintEl.innerHTML = `Hit enter to search ${searchTerm}`
    // adds show-hint class to element and removes if statement above isn't true
    document.body.classList.add('show-hint')
  } else {
    document.body.classList.remove('show-hint')
  }

  // will only run the search when we have more than 2 characters and the enter key is pressed
  if (event.key === 'Enter' && searchTerm.length > 2) {
    searchGiphy(searchTerm)
  }
}

const clearSearch = event => {
  // toggles result state off again
  document.body.classList.remove('has-results')
  // here we reset all the content from search elements
  videosEl.innerHTML = ""
  hintEl.innerHTML = ""
  searchEl.value = ""
  // input cursor
  searchEl.focus()
}

// listen out for keyup events across the whole page and clear search when esc key is pressed
document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    clearSearch()
  }
})


// listen out for the keyup event on our search input
searchEl.addEventListener('keyup', doSearch)
clearEl.addEventListener('click', clearSearch)
