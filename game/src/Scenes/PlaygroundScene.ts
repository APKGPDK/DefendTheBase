import Scene from "../Engine/Scene";

export default class PlaygroundScene extends Scene {
    private camera: BABYLON.FreeCamera

    onCreate() {
        console.log('Jestem w drugiej scenie!')
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero())
        this.camera.attachControl(this.game.getCanvas(), false)
        
        //const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(10, -5, 0), this.scene);
        //const light2 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-10, 5, 0), this.scene);
        const light3 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        light3.specular = BABYLON.Color3.Black()
        //light.intensity = 1
        //light.specular = BABYLON.Color3.Black()

        /*const assetsManager = new BABYLON.AssetsManager(this.scene);
        assetsManager.useDefaultLoadingScreen = false;
        const meshTask = assetsManager.addMeshTask("bush task", "", "assets/", "Bush1.babylon");
        meshTask.onSuccess = function (task: BABYLON.MeshAssetTask) {
            task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
            console.log(task.loadedMeshes)
            let x = (task.loadedMeshes[0] as BABYLON.Mesh).clone("nowy", this.scene, false)
            x = x.convertToFlatShadedMesh()
            x.position = new BABYLON.Vector3(5, 5,5)
        }
        meshTask.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        assetsManager.load();*/

        BABYLON.SceneLoader.ImportMesh(null, "assets/", "Bush1.babylon", this.scene, (meshes: BABYLON.Mesh[]) => {
            console.log(meshes)
            meshes.forEach(mesh => mesh.convertToFlatShadedMesh())
            const newMesh = meshes[0].createInstance("xd")
            newMesh.position = new BABYLON.Vector3(2, 2, 2)
        })
    }

    onUpdate() {

    }

    onDestroy() {

    }
}