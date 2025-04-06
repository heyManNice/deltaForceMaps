import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


function geojsonTojson(){
    return {
        name: "geojsonTojson",
        transform(code:string,id:string){
            if(!id.endsWith(".geojson")){
                return;
            }
            const json = JSON.stringify(JSON.parse(code));
            return `export default ${json}`;
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [geojsonTojson(),react()],
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
        }
    }
});
