let data = getRecepies()
const navBar = document.querySelector("nav")
const navBarLis = document.querySelectorAll("nav li")
const toggleBtn = document.querySelector(".toggle_btn")


let ind = 0


let toggled = false

toggleBtn.addEventListener("click", () => {
    toggled = !toggled

    toggleBtn.classList.toggle('active', toggled)
    navBar.classList.toggle('active', toggled)
})

const locArr = location.pathname.split("/")
const loc = locArr[locArr.length -  1]

console.log(locArr)
console.log(loc)

navBarLis.forEach(li => {
    const anchor = li.querySelector("a")
    const anchorHrefSplit = anchor.href.split("/")
    const pageDir = anchorHrefSplit[anchorHrefSplit.length - 1]
    
    console.log(pageDir)
    
    if (loc == pageDir) {
        anchor.classList.add("active")
    } else if (loc != anchor && anchor.classList.contains("active")) {
        anchor.classList.remove("active")
    }

    if (loc == "") {
        anchor.classList.add("active")
    }
})



if (loc == "index.html") {
    
    const banner = document.querySelector(".banner")
    const slides = banner.querySelectorAll(".slide")
    const dishContainers = document.querySelectorAll(".dish_container")
    let toggleSlides = setInterval(moveSlides, 4000)
    
    const favoriteDishes = [4, 9, 15]
    
    // console.log(dishContainers.length)
    
    fillRecepies(data, favoriteDishes)
    
    // slides[ind].classList.add('active')
    
    function moveSlides() {
        
        ind++
    
        if (ind > slides.length - 1) {
            ind = 0
        }
    
        const currentActiveIndex= [...slides].findIndex(slide => slide.classList.contains('active'))
    
    
        slides.forEach((slide, i) => {
            if (i != currentActiveIndex) {
                slide.style.zIndex = 1
            } else {
                slide.style.zIndex = 999
            }
        })
    
    
    
        slides[ind].classList.add("active")
        slides[currentActiveIndex].classList.remove("active")
        slides[currentActiveIndex].classList.add("inactive")
    
        slides[currentActiveIndex].addEventListener('transitionend', ()  => {
                slides[currentActiveIndex].classList.remove('inactive')
        })
        
    }
    
    
    
    async function fillRecepies(data, dataFilterArr) {
        
        const res = await data
        const recipes = res.recipes
        
        const filteredRecipies = recipes.filter(obj => {
            return dataFilterArr.includes(obj.id)
        })
        
        dishContainers.forEach((dish, i) => {
    
            const top = dish.querySelector(".top")
            const imgEl = top.querySelector(".img")
            const descEl = top.querySelector(".desc")
            const details = dish.querySelector(".details")
            
            const detailsEl = dish.querySelector(".details")
            imgEl.style.backgroundImage = `url(${filteredRecipies[i].image})`
            
            
            
            insertEl(descEl, filteredRecipies[i].tags, 'tags')
            insertEl(descEl, filteredRecipies[i].mealType, 'mealType')
            insertEl(descEl, filteredRecipies[i].difficulty, 'difficulty')
            insertEl(descEl, filteredRecipies[i].cuisine, 'cuisine')
            insertEl(descEl, filteredRecipies[i].name, 'name')
            
            insertEl(details, filteredRecipies[i].rating, 'rating')
            insertEl(details, filteredRecipies[i].servings, 'servings')
            insertEl(details, filteredRecipies[i].prepTimeMinutes, 'prep time')
            insertEl(details, filteredRecipies[i].cookTimeMinutes, 'cook time')
            insertEl(details, filteredRecipies[i].caloriesPerServing, 'cal')       
            
        })
    } 
    
    function insertEl(parent, data, string) {
        
        
        if (parent.className == "desc") {
            
            let newEl
            
            if (typeof data == 'string') {
                newEl = document.createElement("p")
                newEl.textContent = data
                newEl.className = string
                parent.insertAdjacentElement('afterbegin', newEl)
                
            }
            
            if (typeof data == 'object') {
                const listContainer = document.createElement("div")
                listContainer.className = `${string}_list`
                const title = document.createElement("p")
                
                title.className = 'title'
                title.textContent = string
                
                
                newEl = document.createElement("ul")
                newEl.className = string
                
                data.forEach(c => {
                    newEl.innerHTML += `<li>${c}</li>`
                })
                
                
                listContainer.appendChild(title)
                listContainer.appendChild(newEl)
                
                parent.insertAdjacentElement('afterbegin', listContainer)
                
            }
            
        }
        
        if (parent.className == "details") {
            
            let newEl
            
            newEl = document.createElement("span")
            newEl.className = string
            newEl.innerHTML = `<strong><i>${string}:</strong> ${data}</i>`
            parent.insertAdjacentElement('afterbegin', newEl)
            
            
        }
        
    }
    
    
    /* CALCULATE CAROUSEL BTNS */
    
    const specialContainer = document.querySelector(".specials")
    const items = specialContainer.querySelectorAll(".item")
    const carousel = document.querySelector(".carousel")
    const itemColumn = getComputedStyle(items[0]).flexBasis
    const itemWidth = itemColumn.substring(itemColumn.indexOf("(") + 1, itemColumn.indexOf("%"))
    const itemsShown = 100 / itemWidth
    const carouselNum = Math.ceil(items.length / itemsShown)
    const itemGap = getComputedStyle(specialContainer).gap
    console.log(itemGap)
    
    for (i = 1; i <= carouselNum; i++) {
        createCarousel(carousel, carouselNum)
    }
    
    const ticks = document.querySelectorAll(".tick")
    
    ticks[0].classList.add("active")
    
    ticks.forEach((tick, i) => {
        tick.addEventListener('click', () => {
            moveSlide(specialContainer, i, tick, itemGap)
        })
    })
    
    
    function moveSlide(container, ind, tick, gap) {
        
        
        let activeTickIndex = [...ticks].findIndex(tick => tick.classList.contains("active"))
        
        ticks[activeTickIndex].classList.remove("active")
        
        tick.classList.add("active")
        
        container.style.transform = `translateX(calc((-100% * ${ind}) - (${gap} * ${ind}))`
        
        
        
        
    }
    
    function createCarousel(carousel, carouselNum) {
        
        const tick = document.createElement("span")
        tick.className = "tick"
        tick.style.flex = `0 0 calc(${100 / carouselNum}% - (3px / 1.2))`
        
        carousel.appendChild(tick)
        
    }
    
    /* GET RANDOM RECEPIES [HOLIDAY SPECIALS SECTION] */
    
    const randomNums = []
    
    for (i = 0; i <= 8; i++) {
        getRandomIntInclusive(8, 17, randomNums)
    }
    
    console.log(randomNums)
    
    fillHolidaySpecials(data, randomNums)
    
    async function fillHolidaySpecials(data, filterArr) {
        
        const res = await data
        
        const recipes = res.recipes
        
        const filteredRecipes = recipes.filter(obj => {
            return filterArr.includes(obj.id)
        })
        
        
        items.forEach((item, i) => {
            const top = document.createElement("div")
            top.className = "top"
            
            const bottom = document.createElement("div")
            bottom.className = "bottom"
            
            item.appendChild(top)
            item.appendChild(bottom)
            
            createContent(top, bottom, filteredRecipes[i].image, 'img')
            createContent(top, bottom, filteredRecipes[i].name, 'name')
            createContent(top, bottom, filteredRecipes[i].reviewCount, 'reviewCount')
            createContent(top, bottom, filteredRecipes[i].rating, 'rating')
        })  
        
    }
    
    
}

if (loc == "recepies.html") {
    
    const searchContainer = document.querySelector(".search_container")
    const toggleBtns = document.querySelectorAll(".choose_btns span:where(.name, .keywords)")
    const searchOptions = document.querySelectorAll(".display_criteria > *")
    const tags = document.querySelector("select[name='tags']")
    const searchBox = document.querySelector(".search")
    const searchInp = document.querySelector(".search input.search-inp")
    const searchBtn = document.querySelector(".search span.btn")
    const displayCriteria = document.querySelector(".display_criteria")
    const selectMeal = document.querySelector(".display_criteria select[name='tags']")

    const tagsArr = getRecepies("/tags")
    const dataFill = getRecepies("?limit=8&skip=0")

    fillTags(tags, tagsArr)
    fillData(dataFill)

    window.onload = () => {
        searchInp.value = ""
    }

    async function fillTags(parent, arr) {

        const res = await arr


        res.forEach(out => {

            const option = document.createElement("option")
            option.value = out
            option.textContent = out

            parent.appendChild(option)
        })



    }

    async function fillData(data) {


        if (searchContainer.childElementCount > 0) {
            searchContainer.innerHTML = ""
        }


        const res = await data
        const recepies = res.recipes

        recepies.forEach(rec => {

            const searchResult = document.createElement("div")
            searchResult.className = "search_result"

            const top = document.createElement("div")
            top.className = "top"

            const bottom = document.createElement("div")
            bottom.className = "bottom"


            fillChild(rec.image, top, 'div', 'img')
            fillChild(rec.name, bottom, 'h3', 'title')
            fillChild(rec, bottom, 'ul', 'list_desc')
            fillChild(rec, bottom, 'div', 'list_footer')

            searchResult.appendChild(top)
            searchResult.appendChild(bottom)

            searchContainer.appendChild(searchResult)
            

        })

    }

    toggleBtns[0].classList.add("active")
    searchOptions[0].classList.add("active")

    toggleBtns.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            toggleBtns.forEach((el, ind) => {

                if (i != ind && el.classList.contains("active")) {
                    el.classList.remove("active")
                    searchOptions[ind].classList.remove("active")
                } else if (i == ind && !el.classList.contains("active")) {
                    el.classList.add("active")
                    searchOptions[ind].classList.add("active")
                }

            })
        })
    })


    selectMeal.addEventListener("change", (e) => {
        const data = getRecepies(`/tag/${e.target.value}?limit=8&skip=0`)

        fillData(data)

    })

    suggestionList(searchBox, searchInp)

    searchBtn.addEventListener("click", () => {

        const ulEl = searchBox.querySelector("ul.suggestions")


        if (searchInp.value == "") {

            if (document.querySelector(".errMsg") == null) {
                const errMsg = document.createElement("span")
                errMsg.className = "errMsg"
                errMsg.textContent = "Please enter a search criteria so I can search database for you."
    
                displayCriteria.appendChild(errMsg)
            }

            return
        } else {

            if (document.querySelector(".errMsg")) {
                document.querySelector(".errMsg").remove()
            }

            const data = getRecepies(`/search?q=${searchInp.value}`)
            
            if (searchBox.querySelector("ul.suggestions")) {
                searchBox.querySelector("ul.suggestions").remove()
            }

            fillData(data)

        }


    })


}


if (loc == "origin.html") {

    const feedbackContainer = document.querySelector(".feedback_container")
    const feedbackText = document.querySelector(".feedback_container textarea.statement")
    const feedbackBtn = document.querySelector(".feedback_container button")

    window.onload = () => {
        if (document.querySelector(".success")) {
            document.querySelector(".success").remove()
        }
    }

    let disabledBtn = true
    feedbackBtn.disabled = disabledBtn

    feedbackText.addEventListener("input", () => {

        if (feedbackText.value != "") {
            disabledBtn = false
        } else {
            disabledBtn = true
        }

        feedbackBtn.disabled = disabledBtn


    })

    feedbackBtn.addEventListener("click", (e) => {
        if (feedbackText.value == "") return

        e.preventDefault()


        const success = document.createElement("span")
        success.className = "success"
        success.textContent = "Thank you for your feedback, feel free to write another response."

        feedbackText.value = ""
        feedbackContainer.insertAdjacentElement("afterbegin", success)
    })



}

function fillChild(data, parentEl, createEl, classString) {

    let newEl = document.createElement(createEl)
    newEl.className = classString

    if (classString == 'img') {
        newEl.style.backgroundImage = `url(${data})`
    }

    if (classString == "title") {
        newEl.textContent = data
    }

    if (classString == "list_desc") {
        newEl.innerHTML = `
            <li><strong>Cuisine:</strong>${data.cuisine}</li>
            <li><strong>Difficulty:</strong> ${data.difficulty}</li>
            <li><strong>Cook:</strong> ${data.cookTimeMinutes} Min</li>
            <li><strong>Prep:</strong> ${data.prepTimeMinutes} Min</li>
            <li><strong>Servs:</strong> ${data.servings}</li>
        `
    }

    if (classString == 'list_footer') {
        const reveiwCount = document.createElement('span')
        reveiwCount.className = "review_count"
        reveiwCount.textContent = data.reviewCount

        const stars = document.createElement('div')
        stars.className = "stars"

        fillStars(stars, data)

        const cookBtn = document.createElement('a')
        cookBtn.className = "start_cooking"
        cookBtn.textContent = "Start Cooking"

        newEl.appendChild(reveiwCount)
        newEl.appendChild(stars)
        newEl.appendChild(cookBtn)


    }

    parentEl.appendChild(newEl)

}


function fillStars(stars, currentRecepie) {
    
    const ratingNum = currentRecepie.rating
    const remainder = currentRecepie.rating % 1
    const numArr = []
    

    for (i = 1; i <= ratingNum; i++) {
        numArr.push(1)
    }

    if (remainder != 0) {
        const remainderText = parseFloat(remainder.toString().substring(remainder.toString().indexOf("."), 3))
        numArr.push(remainderText)
    }


    for (i = 0; i <= numArr.length - 1; i++) {
        const div = document.createElement("div")
        div.className = "star"
        div.innerHTML = `
            <span class="star_bg" style="width: ${numArr[i] * 100}%">
            </span>
        `

        stars.appendChild(div)
    }


}

async function suggestionList(searchBox, searchInp) {

    const res = await getRecepies()
    const namesArr = []

    res.recipes.forEach(rec => {

        namesArr.push(rec.name)

    })

    console.log(namesArr)

    searchInp.addEventListener("input", (e) => {

        const val = e.target.value
        
        console.log(typeof val)
        
        if (searchBox.querySelector("ul.suggestions") == null) {
            const ul = document.createElement("ul")
            ul.className = "suggestions"
            searchBox.appendChild(ul)
        }
        
        const ulEl = searchBox.querySelector("ul.suggestions")
        ulEl.innerHTML = ""

        
        const filteredArr = namesArr.filter(el => {return el.includes(val)})
        
        if (ulEl && (val == "" || filteredArr.length == 0)) {
            ulEl.remove()
        }
        console.log(filteredArr)

        filteredArr.forEach(el => {
            const li = document.createElement("li")
            li.className = "option"
            li.textContent = el

            ulEl.appendChild(li)

            li.addEventListener("click", () => {
                searchInp.value = li.textContent
            })
        })


    })


}

function getRandomIntInclusive(min, max, randomNums) {
    min = Math.ceil(min);
    max = Math.floor(max);
    
    
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    
    while (randomNums.includes(random)) {
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    randomNums.push(random)
}

function createContent(top, bottom, data, string) {
    
    
    let el
    
    if (string == 'img') {
        el = document.createElement("div")
        el.className = string
        el.style.backgroundImage = `url(${data})`
        
        top.appendChild(el)
    } else {
        
        if (string == 'rating') {
            el = document.createElement("div")
            el.className = string
            
/*             const rating = Math.round(data) 
            
            
            for (i = 1; i <= rating; i++) {
                el.innerHTML += `
                <span class="material-symbols-outlined">
                    kid_star
                </span>
                `
            } */
            
            const ratingNum = data
            const remainder = data % 1
            const numArr = []

            console.log(data)
            
            
            for (i = 1; i <= ratingNum; i++) {
                numArr.push(1)
            }
            
            if (remainder != 0) {
                const remainderText = parseFloat(remainder.toString().substring(remainder.toString().indexOf("."), 3))
                numArr.push(remainderText)
            }
            
            console.log(numArr)

            for (i = 0; i <= numArr.length - 1; i++) {
                const div = document.createElement("div")
                div.className = "star"
                div.innerHTML = `
                    <span class="star_bg" style="width: ${numArr[i] * 100}%">
                    </span>
                `

                el.appendChild(div)
            }
            
        } else if (string == 'name') {
            el = document.createElement("h3")
            el.className = string
            el.textContent = data
            
        } else if (string == 'reviewCount') {
            el = document.createElement("span")
            el.className = string
            el.textContent = data
            
        }
        
        bottom.appendChild(el)
    }
}
    
async function getRecepies(searchParam = "") {

    const res = await fetch(`https://dummyjson.com/recipes/${searchParam}`)
    const data = await res.json()
    
    console.log(data)
    return data

} 
    