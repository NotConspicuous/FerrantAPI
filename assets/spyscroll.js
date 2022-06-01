// get navlinks from div[nav]
let nav_items = document.querySelector('div[nav]').querySelectorAll('div[nav_link]')
let stat = {
    obj: null,
    dist: 0,
}
console.log(nav_items)

let spytrack = (item) => {
    // if item already has active attribute, skip
    if (item.hasAttribute('active')) {
        return
    }
    // get attribute goto
    let goto = item.getAttribute('goto')
    // get element matching goto
    let element = document.getElementById(goto)
    // get element's position
    let element_position = element.getBoundingClientRect()
    // get element's height
    let element_height = element.getBoundingClientRect().height
    // get element's correct position from top of the page
    let element_top = element_position.top + window.pageYOffset
    // get element's position from bottom
    let element_bottom = element_top + element_height
    // get viewport top
    let viewport_top = window.scrollY
    // get viewport height
    let viewport_height = window.innerHeight
    // get viewport bottom
    let viewport_bottom = viewport_top + viewport_height
    // if element is closest to the middle height of the viewport
    if (element_top < viewport_top + (viewport_height / 2) && element_bottom > viewport_top + (viewport_height / 2)) {
        
        // prevent an item being triggered too early causing insccuracies
        if (stat.obj === null) {
            stat.obj = item
            stat.dist = element_top
            return
        }
        // if element is closer to top of viewport
        if (element_top < stat.dist) {
            // set stat.obj to item
            stat.obj = item
            // set stat.dist to element_top
            stat.dist = element_top
        }
        
        item.setAttribute('active', '')
        // remove active attribute from other items


        for (let other_item of nav_items) {
            if (other_item !== item) {
                other_item.removeAttribute('active')
            }
        }
    } 
}

// for item in nav_items
for (let item of nav_items) {
    item.addEventListener('click', function () {
        // add active attribute to item
        // item.setAttribute('active', '')
        // remove active attribute from other items

        // smooth scroll to section
        let goto = item.getAttribute('goto')
        let pair = document.getElementById(goto)
        console.log(pair)
        window.scrollTo({
            top: pair.offsetTop,
            behavior: 'smooth'
        })
    })

    // on enter pressed
    item.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            item.click()
        }
    })

    // on scroll, if item's matching pair in middle of visible viewport, set item as active
    document.addEventListener('scroll', function () {
        spytrack(item)
    })
    spytrack(item)
    
    // automatically set item to on if goto = dev_only
    if (item.getAttribute('goto') === 'dev_only') {
        item.setAttribute('active', '')
    }
}
