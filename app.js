define(["require",
        "exports",
        "src/geom/Vector4",
        "src/geom/Matrix4",
        "src/render/View",
        "src/render/Mesh",
        "src/assets/Mesh2",
        "src/utils/GeomUtils"],
        function(require,
                 exports,
                 Vector4,
                 Matrix4,
                 View,
                 Mesh,
                 Mesh2,
                 GeomUtils) {

    // class definition
    var Main = (function () {

        // public static items
        Main._mousePressed = false;
        Main._mousePos2d = new Vector4(0, 0);
        Main._cameraRotation = new Vector4(0, 0, 0);
        Main._cameraRadius = 15;
        Main._iem = false;

        // public items
        this.view = null;
        this.glcanvas = null;

        // private items
        // make sure "this" is always the "Main"
        var _this; // = this; see a "self" variable in http://javascript.ru/settimeout
        var _mesh;

        // constructor
        function Main() {
            _this = this; // !
        }

        Main.prototype.start = function () {
            _this.glcanvas = document.getElementById("glcanvas");

            _this.view = new View(_this.glcanvas);
            _this.view.init();

            _this.view.renderer.clear();

            //alert("GL is ready!");

            // add mesh
            var mesh1 = new Mesh2();
            _mesh = new Mesh();
            _mesh.indices = mesh1.data.ind;
            _mesh.vertices = mesh1.data.xyz;
            _mesh.colors = mesh1.data.rgb;
            _mesh.uvs = mesh1.data.uv;
            _mesh.normals = mesh1.data.nrm;

            //document.getElementById("img").src = "data:image/png;base64," + mesh1.data.dif.tex + "";
            _mesh.material.diffuse.uploadToGPU(
                _this.view.renderer.gl,
                "data:image/png;base64," + mesh1.data.dif.tex + "",
                _this.onTextureReady
            );
        };

        Main.prototype.onTextureReady = function(textureBase) {
            var view = _this.view;
            var glcanvas = _this.glcanvas;

            _mesh.material.diffuse = textureBase;
            _mesh.material.doubleSided = true;
            _mesh.createGPUBuffers(view.renderer.gl);
            _mesh.transform.appendScale(5, 5, 5);

            view.renderer.meshes.push(_mesh);
            view.renderer.meshes = _this.cloneModels(20, 10, 5, view.renderer.meshes);

            // mouse handlers
            glcanvas.addEventListener("mousedown", _this.onMouseDown, false);
            glcanvas.addEventListener("mouseup", _this.onMouseUp, false);
            glcanvas.addEventListener("mousemove", _this.onMouseMove, false);

            // touch
            glcanvas.addEventListener("touchstart", _this.onTouchStart, false);
            glcanvas.addEventListener("touchend", _this.onTouchEnd, false);
            glcanvas.addEventListener("touchmove", _this.onTouchMove, false);
        };

        Main.prototype.onMouseDown = function (e) {
            if (!Main._iem) {
                e.preventDefault();
            }
            Main._mousePos2d = new Vector4(e.clientX, e.clientY);
            Main._mousePressed = true;
        };
        Main.prototype.onMouseUp = function (e) {
            if (!Main._iem) {
                e.preventDefault();
            }
            Main._mousePos2d = new Vector4();
            Main._mousePressed = false;
        };
        Main.prototype.onMouseMove = function (e) {
            if (!Main._iem) {
                e.preventDefault();
            }
            if (Main._mousePressed == false)
                return;
            Main._cameraRotation.x += (e.clientY - Main._mousePos2d.y) * 0.5;
            Main._cameraRotation.y += (e.clientX - Main._mousePos2d.x) * 0.5;
            Main._mousePos2d = new Vector4(e.clientX, e.clientY);
        };
        Main.prototype.onTouchStart = function (e) {
            if (!Main._iem) {
                e.preventDefault();
            }
            Main._mousePos2d = new Vector4(e.touches[0].clientX, e.touches[0].clientY);
            Main._mousePressed = true;
        };
        Main.prototype.onTouchEnd = function (e) {
            if (!Main._iem) {
                e.preventDefault();
            }
            Main._mousePos2d = new Vector4();
            Main._mousePressed = false;
        };
        Main.prototype.onTouchMove = function (e) {
            if (!Main._iem) {
                e.preventDefault();
            }
            if (Main._mousePressed == false)
                return;
            Main._cameraRotation.x += (e.touches[0].clientY - Main._mousePos2d.y) * 0.5;
            Main._cameraRotation.y += (e.touches[0].clientX - Main._mousePos2d.x) * 0.5;
            Main._mousePos2d = new Vector4(e.touches[0].clientX, e.touches[0].clientY);
        };

        Main.prototype.updateCamera = function () {
            _this.view.renderer._viewMx = this.viewMatrix(Main._cameraRotation, Main._cameraRadius, new Vector4(0, 0, 0));
        };

        Main.prototype.viewMatrix = function (rotXYZ, dist, lookAtXYZ) {
            var m = new Matrix4();
            m.appendTranslation(-lookAtXYZ.x, -lookAtXYZ.y, -lookAtXYZ.z);
            m.appendRotation(rotXYZ.z, new Vector4(0, 0, 1));
            m.appendRotation(rotXYZ.y, new Vector4(0, 1, 0));
            m.appendRotation(rotXYZ.x, new Vector4(1, 0, 0));
            m.appendTranslation(0, 0, -dist);
            return m;
        };

        Main.prototype.cloneModels = function (total, space, excludeR, meshes) {
            var i, j;
            var m;
            var randomRotation = new Vector4();
            var randomPosition = new Vector4();
            var clones = [];

            for (i = 0; i < total; i++) {
                randomRotation = GeomUtils.randomVector({min: 0, max: 180});
                randomPosition = GeomUtils.randomVector({min: -space, max: space});
                
                while (randomPosition.length < excludeR) {
                    randomPosition = GeomUtils.randomVector({min: -space, max: space});
                }

                for (j = 0; j < meshes.length; j++) {
                    m = meshes[j].createInstance();

                    // update rotation
                    m.rotations.identity();
                    m.rotations.appendRotation(randomRotation.x, new Vector4(1, 0, 0));
                    m.rotations.appendRotation(randomRotation.y, new Vector4(0, 1, 0));
                    m.rotations.appendRotation(randomRotation.z, new Vector4(0, 0, 1));

                    // update translation
                    m.translations.identity();
                    m.translations.appendTranslation(randomPosition.x, randomPosition.y, randomPosition.z);

                    // update whole transform
                    //m.transform.identity();
                    m.transform.append(m.rotations);
                    m.transform.append(m.translations);

                    // add to the stack
                    clones.push(m);
                }
            }

            // merge vectors
            meshes = meshes.concat(clones);

            return meshes;
        };

        Main.prototype.updateAll = function () {
            _this.view.renderer.render();
            _this.updateCamera();
        };

        return Main;
    })();

    // entry point
    $(document).ready(function() {
        var app = new Main();
        app.start();

        onEnterFrame(app);
    });

    function onEnterFrame(application) {
        requestAnimationFrame(function () {
            onEnterFrame(application);
        });

        application.updateAll();
    }
});
