async function tem(action, body={}, label){
    if(label === undefined){
        label = "labelInfo"
    }
    return await new Promise((resolve, reject) => {
        if(document.getElementById(label)){
            document.getElementById(label).innerText = ""
        }
        fetch(window.location.origin + "/jside/extPost/" + action + loc.urlArgs, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then( response => response.json() )
        .then( response => {
            switch(response.status){
                case "e":
                    if(document.getElementById(label) && response?.data?.info){
                        document.getElementById(label).style.color = "red"
                        document.getElementById(label).innerText = response.data.info
                    }
                    reject(response.data)
                    break;

                case "s":
                    if(document.getElementById(label) && response?.data?.info){
                        document.getElementById(label).style.color = "green"
                        document.getElementById(label).innerText = response.data.info
                    }
                    resolve(response.data)
                    break;

                case "r":
                    window.location.href = response.url
                    resolve(response)
                    break; 
                
                default:
                    resolve(response)
                    break;
                    
            }
        })
        .catch((error) => {
            console.error(error);
        })
    })
}