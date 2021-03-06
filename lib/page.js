import { JSDOM } from "jsdom"
import Component from "./component.js"
import fs from "fs"

export default class Page{
    /**
     * 
     * @param {String} name 
     * @param {HTML | Dir} html
     */
    constructor(name, html){
        if(!name) throw "Page need a name."
        this.html = fs.existsSync(html)? fs.readFileSync(html) : html
        this.name = name
    }

    /**
     * @private
     */
    async render(obj={}){
        obj = {...obj, ...this.json}
        this.html = this.customRender(this.html)
        let window = (new JSDOM(this.html)).window
        while(window.document.querySelector("div[data-sc]") || window.document.querySelector("div[data-mc]")){
            for(const component of window.document.querySelectorAll("div[data-sc]")){
                let div = window.document.createElement("div")
                if(this.component[component.dataset.sc])div.innerHTML = this.component[component.dataset.sc].html
                else if(Component.component[component.dataset.sc])div.innerHTML = Component.component[component.dataset.sc].html
                else throw "'" + component.dataset.sc + "' is not component."
                div.children[0].dataset.name = component.dataset.sc
                component.outerHTML = div.innerHTML
            }
            for(const component of window.document.querySelectorAll("div[data-mc]")){
                let div = window.document.createElement("div")
                if(this.component[component.dataset.mc])div.innerHTML = this.component[component.dataset.mc].html
                else if(Component.component[component.dataset.mc])div.innerHTML = Component.component[component.dataset.mc].html
                else throw "'" + component.dataset.mc + "' is not component."
                div.children[0].dataset.tmc = component.dataset.mc
                component.outerHTML = div.innerHTML
            }
        }
        let html = window.document.documentElement.innerHTML
        const findVar = (obj, path) => {
            path = path == ""? "" : path + "."
            for(const v in obj){
                if(typeof obj[v] != "object"){
                    while(html.indexOf("{" + path + v + "}") >= 0){
                        html = html.replace("{" + path + v + "}", function(item){
                            if(item != "{" + path + v + "}")return false
                            return obj[v]
                        })
                    }
                }
                else if(typeof obj[v] == "object" && !Array.isArray(obj[v])){
                    findVar(obj[v], path + v)
                }
            }
        }
        findVar(obj, "")
        window.close()
        this.isRender++
        this.result = html
    }

    /**
     * 
     * @param {HTML} html 
     * @returns {HTML}
     */
    customRender = (html) => {return html}

    /**
     * @private
     */
    json = {}

    /**
     * @private
     */
    component = {}

    /**
     * @type {String}
     */
    name = ""

    /**
     * @type {HTML}
     */
    html = ""
    
    /**
     * @type {HTML}
     */
    result = ""

    /**
     * @type {Number}
     */
    isRender = 0
    
}