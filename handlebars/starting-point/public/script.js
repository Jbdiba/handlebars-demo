let menuBtn = document.getElementById('menu-btn')
let list = document.getElementById('list')
let menuList = document.getElementById('menu')
const deleteBtn = document.querySelector('#delete-btn')
const likeBtn = document.querySelector('#like-btn')
const likeCounter = document.querySelector('#like-counter')
const id = window.location.pathname.split('/restaurants/')[1]


menuBtn.addEventListener('click', async () => {
    
    //fetch the menu route from express
    let res = await fetch(`/menu/${id}`)

    //fetch the menu route from express
    // let res = await fetch('/menu/3')
    //parse as json
    let restaurant = await res.json()
    //access Menus in respone
    let menus = restaurant.Menus
    console.log(menus)
    //for each menu in the list, create a sublist
    menuList.innerText = ""
    for(m of menus){
        //add a size 3 header for each menu
        let menuLabel = document.createElement('h3')
        menuLabel.innerText = m.title
        menuList.append(menuLabel)
        let menu = document.createElement('ul')
        //for each menu item in that menu, create a list item
        for(i of m.MenuItems){
            let item = document.createElement('li')
            item.innerText = `${i.name}: ${i.price}`
            menu.append(item)
        }
        menuList.append(menu)
    }
   
});

// Delete from the restaurant-list

async function deleteRestaurant(id){
    //delete a sauce matching parameter id
    let res = await fetch(`/restaurants/${id}` ,{
        method: 'DELETE'
    })
    console.log(res)
    //send user back to the sauces path
    window.location.assign('/restaurants')
}



// Delete: 

  //add event to delete this 
    deleteBtn.addEventListener('click', async () => {

  //fetch the menu route from express for this id
    
    let res = await fetch(`/restaurants/${id}`, {
          method: 'DELETE',
      })
      console.log(res)
    window.location.assign('/restaurants')
    });


// Likes:

//add an event to Like this restaurant
likeBtn.addEventListener('click', async () =>{
    //get current likes from counter
    let currentLikes = parseInt(likeCounter.innerHTML)
    console.log(currentLikes)
    //Increment current likes
    currentLikes += 1
    //update the likes counter
    likeCounter.innerHTML = currentLikes
    //fetch the route for this id with the PUT method
    let res = await fetch(`/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            likes: currentLikes
        })
    })
})