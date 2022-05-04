var divInfo = false

var seeInfo = function(info){
    if(divInfo){
        divInfo.innerText = info
    }
    else{
        divInfo = document.createElement("div")
        divInfo.className = "divInfo"
        divInfo.style.position = "absolute"
        divInfo.style.top = "0px"
        divInfo.style.left = "0px"
        divInfo.style.width = "100%"
        divInfo.style.height = "100vh"
        divInfo.style.display = "flex"
        divInfo.style.alignItems = "center"
        divInfo.style.justifyContent = "center"
        divInfo.style.backgroundColor = "rgba(0, 0, 0, 0.50)"
        divInfo.style.color = "white"
        divInfo.style.fontSize = "40px"
        divInfo.innerText = info
        document.body.appendChild(divInfo)
    }
    
}

var deleteInfo = function(){
    if(divInfo){
        divInfo.remove()
        divInfo = false
    }
}

tp.on("unload", document.currentScript.dataset.src, function(e){
    delete divInfo
    delete seeInfo
    delete deleteInfo
})