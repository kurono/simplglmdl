define(["require", "exports", "src/render/TextureBase"], function(require, exports, TextureBase) {
    var TextureMaterial = (function () {
        function TextureMaterial() {
            this.doubleSided = false;
            this.diffuse = new TextureBase();
        }
        return TextureMaterial;
    })();

    
    return TextureMaterial;
});
