import Module from "./module.js"
import Component from "./component.js"
import Page from "./page.js"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
const __dirname = resolve(dirname(fileURLToPath(import.meta.url)) + "/../")
import fs from "fs"

export default async function auto(path, root){
    if(!fs.existsSync(path))fs.mkdir(path)
    for(const folder of fs.readdirSync(path)){
        if(!fs.lstatSync(path + "/" + folder).isDirectory())continue
        if(!fs.existsSync(path + "/" + folder + "/components")){
            fs.mkdirSync(path + "/" + folder + "/components")
        }
        if(!fs.existsSync(path + "/" + folder + "/path")){
            fs.mkdirSync(path + "/" + folder + "/path")
        }
        if(!fs.existsSync(path + "/" + folder + "/" + folder + ".html")){
            fs.writeFileSync(path + "/" + folder + "/" + folder + ".html", fs.readFileSync(__dirname + "/models/index.html"))
        }
        if(!fs.existsSync(path + "/" + folder + "/" + folder + ".mjs")){
            fs.writeFileSync(path + "/" + folder + "/" + folder + ".mjs", fs.readFileSync(__dirname + "/models/index.js"))
        }
        let js = await import(path + "/" + folder + "/" + folder + ".mjs")
        let module = root.addModule(new Module(folder))
        console.log("Module " + folder + ":");
        js.default.before(root, module)

        for(const component of fs.readdirSync(path + "/" + folder + "/components")){
            if(!component.endsWith(".html"))continue
            module.addComponent(new Component(component.replace(".html", ""), path + "/" + folder + "/components/" + component))
        }

        if(fs.readFileSync(path + "/" + folder + "/" + folder + ".html") != ""){
            console.log("|-->" + folder);
            module.addPage(new Page(folder, path + "/" + folder + "/" + folder + ".html"))
            module.get("", (req, res, short) => {
                short.sp(folder)
            })
        }
        
        function pathFinding(dir){
            for(const file of fs.readdirSync(dir)){
                if(fs.lstatSync(dir + "/" + file).isDirectory())pathFinding(dir + "/" + file)
                else if(file.endsWith(".html")){
                    if(fs.readFileSync(dir + "/" + file) == "")fs.writeFileSync(dir + "/" + file, fs.readFileSync(__dirname + "/models/index.html"))
                    let name = dir.replace(path + "/" + folder + "/path", "") + "/" + file.replace(".html", "")
                    module.addPage(new Page(name, dir + "/" + file))
                    if(!file.startsWith(":")){
                        console.log("|-->" + folder + name);
                        module.get(name, (req, res, short) => {
                            short.sp(name)
                        })
                    }
                }
            }
        }
        pathFinding(path + "/" + folder + "/path")
        js.default.after(root, module)

    }
}