define(["require", "exports", "src/render/Renderer"], function(require, exports, Renderer) {
    var View = (function () {
        function View(canvas) {
            // public vars
            this.canvas = canvas;
            this.renderer = null;
        }

        View.prototype.init = function() {
            this.renderer = new Renderer(this);
            this.renderer.createContext();
            this.renderer.setViewport();
            this.renderer.compileShaders();
        };
        return View;
    })();

    
    return View;
});
