const roomPopup = document.querySelector(".room-popup")
const namePopup = document.querySelector(".name-popup")
const joinRoomButton = document.querySelector("#join-room-button")
let participantsCountTracker;




const container = document.querySelector(".container")

const socket = io()

const createARoom = ()=>{
    roomPopup.style.display = 'none'
    namePopup.style.display = 'flex'
    joinRoomButton.textContent = "Create 👍"
}
const joinARoom = ()=>{
    roomPopup.style.display = 'none'
    namePopup.style.display = 'flex'
    joinRoomButton.textContent = "Join 👍"
}
const goToStart = ()=>{
    roomPopup.style.display = 'flex'
    namePopup.style.display = 'none'   
}

const joinRoom = ()=>{

    const name = document.querySelector("input[name='name']").value
    localStorage.setItem("name", name)
    const id = document.querySelector("input[name='id']").value
    localStorage.setItem("room" , id)

    socket.emit('join-room' , id , name , async(res)=>{
        if(res.status){
            console.log(res)
            namePopup.style.display = 'none'  
            participantsCountTracker = res.participants
            container.innerHTML =  `<div class="header">
            <span><i class="bi bi-people-fill"></i></span>
            <div class="group-details">
            <h2>${res.room}</h2>
            <h3 class="participants-count">${res.participants}${res.participants > 1 ? " Participants" : " Participant"}</h3>
            </div>
        </div>
        <div class="chat-container">
            <span class="notification"><i class="bi bi-dot"></i>You Joined</span>
        </div>
        <div class="footer">
            <input type="text" name="message" class="message-input" placeholder="Type your message..." onkeyup="typing()">
            <button class="send-message" onclick="sendMessage()"><i class="bi bi-send-fill"></i></button>
        </div>
    </div>`
             
        }
    })
}

socket.on("received-message", (name,message)=>{
    const chatContainer = document.querySelector(".chat-container")
    var nodes = Array.prototype.slice.call( chatContainer.children );
    
    if(nodes[0].classList.contains('group-chat')){
        chatContainer.insertAdjacentHTML("afterbegin", `<div class="group-chat" style="margin-top: 0.2rem">
        <span class="message">${message}</span>
    </div>`)
    }else{
        chatContainer.insertAdjacentHTML("afterbegin", `<div class="group-chat">
    <span class="sender-name">${name}</span>
    <span class="message">${message}</span>
</div>`)
    }

    nodes[0].scrollIntoView();
    
})

socket.on("received-notification" , (notification,participants)=>{
    console.log("Hi")
    const chatContainer = document.querySelector(".chat-container")
    const participantsCount = document.querySelector(".participants-count")
    participantsCountTracker = participants
    chatContainer.insertAdjacentHTML("afterbegin", `<span class="notification"><i class="bi bi-dot"></i>${notification}</span>`)
    var nodes = Array.prototype.slice.call( chatContainer.children );
    nodes[0].scrollIntoView();

    participantsCount.innerHTML = `${participants}${participants > 1 ? " Participants" : " Participant"}`
})

socket.on("typing-notificaiton",(name)=>{
    if(name !== localStorage.getItem(name)){
    const participantsCount = document.querySelector(".participants-count")
        participantsCount.textContent = `${name} is Typing...`
        setTimeout(()=>{
            participantsCount.innerHTML = `${participantsCountTracker}${participantsCountTracker > 1 ? " Participants" : " Participant"}`
        },1000)
    }
    
})
const sendMessage = ()=>{
    const chatContainer = document.querySelector(".chat-container")
    const message = document.querySelector("input[name='message']").value
    socket.emit("send-message", localStorage.getItem("room"), localStorage.getItem("name"), message , async (res)=>{

    })
    chatContainer.insertAdjacentHTML("afterbegin", ` <span class="user-chat">${message}</span>`)
    var nodes = Array.prototype.slice.call( chatContainer.children );
    nodes[0].scrollIntoView();
    document.querySelector("input[name='message']").value = ''

}

const typing = ()=>{
    console.log("hi");
    socket.emit("typing" ,localStorage.getItem("room"), localStorage.getItem("name") , async(res)=>{

    })
}
